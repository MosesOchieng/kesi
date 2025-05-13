import { judges } from './judgesData.js';
import { legalScenarios } from './judgesData.js';

/**
 * Calculate similarity score between a judge's expertise and a legal scenario
 * @param {Object} judge - Judge object
 * @param {Object} scenario - Legal scenario object
 * @returns {number} - Similarity score between 0 and 1
 */
const calculateExpertiseSimilarity = (judge, scenario) => {
  // Create sets of keywords from both expertise and specializations
  const judgeKeywords = new Set([
    ...judge.expertise.map(e => e.toLowerCase()),
    ...judge.specializations.primary.map(s => s.toLowerCase()),
    ...judge.specializations.secondary.map(s => s.toLowerCase()),
    ...judge.specializations.emerging.map(s => s.toLowerCase())
  ]);
  
  const scenarioKeywords = new Set(scenario.keywords.map(k => k.toLowerCase()));
  
  // Calculate intersection and union
  const intersection = new Set([...judgeKeywords].filter(x => scenarioKeywords.has(x)));
  const union = new Set([...judgeKeywords, ...scenarioKeywords]);
  
  // Weight primary specializations higher
  const primaryMatches = judge.specializations.primary.filter(s => 
    scenarioKeywords.has(s.toLowerCase())
  ).length;
  
  const baseScore = intersection.size / union.size;
  const specializationBonus = primaryMatches * 0.1; // 10% bonus per primary specialization match
  
  return Math.min(baseScore + specializationBonus, 1);
};

/**
 * Calculate relevance score based on past rulings
 * @param {Object} judge - Judge object
 * @param {Object} scenario - Legal scenario object
 * @returns {number} - Relevance score between 0 and 1
 */
const calculateRulingRelevance = (judge, scenario) => {
  const scenarioKeywords = scenario.keywords.map(k => k.toLowerCase());
  const scenarioFactors = scenario.relevantFactors.map(f => f.toLowerCase());
  
  const relevantRulings = judge.notableRulings.filter(ruling => {
    const rulingText = ruling.description.toLowerCase();
    return scenarioKeywords.some(keyword => rulingText.includes(keyword)) ||
           scenarioFactors.some(factor => rulingText.includes(factor));
  });
  
  // Weight recent rulings more heavily
  const currentYear = new Date().getFullYear();
  const weightedRulings = relevantRulings.map(ruling => {
    const rulingYear = parseInt(ruling.case.match(/\d{4}/)?.[0] || currentYear);
    const yearsAgo = currentYear - rulingYear;
    return Math.max(1 - (yearsAgo * 0.1), 0.5); // 10% reduction per year, minimum 50% weight
  });
  
  const totalWeight = weightedRulings.reduce((sum, weight) => sum + weight, 0);
  return totalWeight / Math.max(judge.notableRulings.length, 1);
};

/**
 * Calculate stance similarity between judge's stances and scenario factors
 * @param {Object} judge - Judge object
 * @param {Object} scenario - Legal scenario object
 * @returns {number} - Stance similarity score between 0 and 1
 */
const calculateStanceSimilarity = (judge, scenario) => {
  const judgeStances = new Set(judge.stances.map(s => s.toLowerCase()));
  const scenarioFactors = new Set(scenario.relevantFactors.map(f => f.toLowerCase()));
  
  const intersection = new Set([...judgeStances].filter(x => scenarioFactors.has(x)));
  const union = new Set([...judgeStances, ...scenarioFactors]);
  
  // Consider publications as additional stance indicators
  const publicationMatches = judge.publications.filter(pub =>
    scenarioFactors.has(pub.toLowerCase())
  ).length;
  
  const baseScore = intersection.size / union.size;
  const publicationBonus = publicationMatches * 0.05; // 5% bonus per relevant publication
  
  return Math.min(baseScore + publicationBonus, 1);
};

/**
 * Calculate experience score based on years of service and complexity
 * @param {Object} judge - Judge object
 * @param {Object} scenario - Legal scenario object
 * @returns {number} - Experience score between 0 and 1
 */
const calculateExperienceScore = (judge, scenario) => {
  const currentYear = new Date().getFullYear();
  const appointedYear = parseInt(judge.appointed);
  const yearsOfService = currentYear - appointedYear;
  
  // Base experience score
  const baseScore = Math.min(yearsOfService / 20, 1);
  
  // Complexity adjustment
  const complexityMultiplier = scenario.complexity === 'High' ? 1.2 :
                              scenario.complexity === 'Medium' ? 1.0 : 0.8;
  
  return Math.min(baseScore * complexityMultiplier, 1);
};

/**
 * Find the most suitable judges for a given legal scenario
 * @param {Object} scenario - Legal scenario object
 * @param {number} limit - Maximum number of judges to return
 * @returns {Array} - Array of judge objects with their match scores
 */
export const findMatchingJudges = (scenario, limit = 3) => {
  const judgeScores = judges.map(judge => {
    const expertiseScore = calculateExpertiseSimilarity(judge, scenario);
    const rulingScore = calculateRulingRelevance(judge, scenario);
    const stanceScore = calculateStanceSimilarity(judge, scenario);
    const experienceScore = calculateExperienceScore(judge, scenario);
    
    // Dynamic weighting based on scenario complexity
    const weights = scenario.complexity === 'High' ? {
      expertise: 0.35,
      rulings: 0.25,
      stances: 0.25,
      experience: 0.15
    } : {
      expertise: 0.40,
      rulings: 0.30,
      stances: 0.20,
      experience: 0.10
    };
    
    const totalScore = (
      expertiseScore * weights.expertise +
      rulingScore * weights.rulings +
      stanceScore * weights.stances +
      experienceScore * weights.experience
    );
    
    return {
      ...judge,
      matchScore: totalScore,
      scoreBreakdown: {
        expertise: expertiseScore,
        rulings: rulingScore,
        stances: stanceScore,
        experience: experienceScore
      }
    };
  });

  return judgeScores
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
};

/**
 * Get recommended scenarios for a specific judge
 * @param {number} judgeId - ID of the judge
 * @returns {Array} - Array of legal scenarios with match scores
 */
export const getRecommendedScenarios = (judgeId) => {
  const judge = judges.find(j => j.id === judgeId);
  if (!judge) return [];

  return legalScenarios.map(scenario => {
    const expertiseScore = calculateExpertiseSimilarity(judge, scenario);
    const rulingScore = calculateRulingRelevance(judge, scenario);
    const stanceScore = calculateStanceSimilarity(judge, scenario);
    const experienceScore = calculateExperienceScore(judge, scenario);
    
    const weights = scenario.complexity === 'High' ? {
      expertise: 0.35,
      rulings: 0.25,
      stances: 0.25,
      experience: 0.15
    } : {
      expertise: 0.40,
      rulings: 0.30,
      stances: 0.20,
      experience: 0.10
    };
    
    const totalScore = (
      expertiseScore * weights.expertise +
      rulingScore * weights.rulings +
      stanceScore * weights.stances +
      experienceScore * weights.experience
    );

    return {
      ...scenario,
      matchScore: totalScore,
      scoreBreakdown: {
        expertise: expertiseScore,
        rulings: rulingScore,
        stances: stanceScore,
        experience: experienceScore
      }
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}; 