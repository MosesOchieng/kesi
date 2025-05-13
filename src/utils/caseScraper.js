import axios from 'axios';
import * as cheerio from 'cheerio';

// Use a different CORS proxy
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
const BASE_URL = 'http://kenyalaw.org/caselaw/cases/advanced_search/';
const RATE_LIMIT_DELAY = 2000; // 2 seconds between requests
let lastRequestTime = 0;

/**
 * Ensure we respect rate limiting
 */
const rateLimit = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest));
  }
  lastRequestTime = Date.now();
};

/**
 * Make a request with error handling and rate limiting
 */
const makeRequest = async (url, options = {}) => {
  try {
    await rateLimit();
    const response = await axios({
      url: `${CORS_PROXY}${encodeURIComponent(url)}`,
      ...options,
      headers: {
        'User-Agent': 'Kesi-PWA Legal Research Tool',
        'Origin': window.location.origin,
        'X-Requested-With': 'XMLHttpRequest',
        ...options.headers
      }
    });
    return response;
  } catch (error) {
    console.error(`Request failed for ${url}:`, error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    // If CORS proxy fails, try direct request as fallback
    try {
      const directResponse = await axios({
        url,
        ...options,
        headers: {
          'User-Agent': 'Kesi-PWA Legal Research Tool',
          ...options.headers
        }
      });
      return directResponse;
    } catch (directError) {
      // If both attempts fail, throw a more descriptive error
      throw new Error(`Failed to fetch data: ${error.message}. Direct request also failed: ${directError.message}. Please try again later or contact support if the issue persists.`);
    }
  }
};

/**
 * Scrape case data from Kenya Law Reports
 * @param {Object} params - Search parameters
 * @returns {Promise<Array>} - Array of case objects
 */
export const scrapeCases = async (params = {}) => {
  try {
    const defaultParams = {
      title: '',
      content: '',
      courtname: '',
      judgment_author: '',
      case_number: '',
      date_from: '01/01/2023',
      date_to: '01/01/2024',
      submit: 'Search'
    };

    const searchParams = { ...defaultParams, ...params };
    
    const response = await makeRequest(BASE_URL, {
      method: 'POST',
      data: searchParams
    });

    const $ = cheerio.load(response.data);
    const cases = [];
    
    $('.result_title').each((_, element) => {
      const title = $(element).text().trim();
      const url = $(element).find('a').attr('href');
      const caseNumber = $(element).next('.result_case_number').text().trim();
      const date = $(element).next('.result_date').text().trim();
      
      if (title && url) {
        cases.push({
          title,
          url: `http://kenyalaw.org${url}`,
          caseNumber,
          date,
          court: searchParams.courtname || 'Not specified'
        });
      }
    });

    return cases;
  } catch (error) {
    console.error('Error scraping cases:', error);
    throw new Error('Failed to scrape cases. Please try again later or contact support if the issue persists.');
  }
};

/**
 * Scrape full judgment text for a case
 * @param {string} url - Case URL
 * @returns {Promise<Object>} - Case object with judgment text
 */
export const scrapeJudgment = async (url) => {
  try {
    const response = await makeRequest(url);
    const $ = cheerio.load(response.data);
    
    const judgmentText = $('#judgment').text().trim();
    if (!judgmentText) {
      throw new Error('No judgment text found');
    }

    const judges = [];
    $('.judge_name').each((_, element) => {
      const judgeName = $(element).text().trim();
      if (judgeName) {
        judges.push(judgeName);
      }
    });

    return {
      judgmentText,
      judges,
      url,
      scrapedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error scraping judgment:', error);
    throw new Error('Failed to scrape judgment. Please try again later.');
  }
};

/**
 * Process judgment text to extract key information
 * @param {string} judgmentText - Full judgment text
 * @returns {Object} - Processed judgment data
 */
export const processJudgment = (judgmentText) => {
  if (!judgmentText) {
    throw new Error('No judgment text provided');
  }

  // Extract key sections using regex patterns
  const patterns = {
    holding: /holding:?\s*([^.]*)/i,
    ratio: /ratio\s*decidendi:?\s*([^.]*)/i,
    obiter: /obiter\s*dicta:?\s*([^.]*)/i
  };

  const extracted = {};
  
  for (const [key, pattern] of Object.entries(patterns)) {
    const match = judgmentText.match(pattern);
    if (match) {
      extracted[key] = match[1].trim();
    }
  }

  // Extract cited cases with better pattern matching
  const citedCases = judgmentText.match(/[A-Z][a-z]+ v\. [A-Z][a-z]+/g) || [];
  const uniqueCitedCases = [...new Set(citedCases)];

  // Calculate complexity metrics
  const wordCount = judgmentText.split(/\s+/).length;
  const sentenceCount = judgmentText.split(/[.!?]+/).length;
  const avgWordsPerSentence = wordCount / sentenceCount;
  
  return {
    ...extracted,
    citedCases: uniqueCitedCases,
    metrics: {
      wordCount,
      sentenceCount,
      avgWordsPerSentence,
      complexity: calculateComplexity(wordCount, avgWordsPerSentence)
    }
  };
};

/**
 * Calculate judgment complexity based on text analysis
 * @param {number} wordCount - Number of words
 * @param {number} avgWordsPerSentence - Average words per sentence
 * @returns {string} - Complexity level
 */
const calculateComplexity = (wordCount, avgWordsPerSentence) => {
  if (wordCount > 10000 || avgWordsPerSentence > 30) {
    return 'High';
  } else if (wordCount > 5000 || avgWordsPerSentence > 20) {
    return 'Medium';
  }
  return 'Low';
};

/**
 * Search for cases by judge name
 * @param {string} judgeName - Name of the judge
 * @returns {Promise<Array>} - Array of cases
 */
export const searchCasesByJudge = async (judgeName) => {
  if (!judgeName) {
    throw new Error('Judge name is required');
  }

  return scrapeCases({
    judgment_author: judgeName,
    date_from: '01/01/2010', // Last 13 years
    date_to: new Date().toLocaleDateString('en-US')
  });
};

/**
 * Get recent cases for a specific court
 * @param {string} court - Court name
 * @param {number} limit - Maximum number of cases to return
 * @returns {Promise<Array>} - Array of recent cases
 */
export const getRecentCases = async (court, limit = 10) => {
  if (!court) {
    throw new Error('Court name is required');
  }

  const cases = await scrapeCases({
    courtname: court,
    date_from: '01/01/2023',
    date_to: new Date().toLocaleDateString('en-US')
  });
  
  return cases.slice(0, limit);
}; 