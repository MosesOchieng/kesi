import requests
from bs4 import BeautifulSoup
import json
import time
import logging
from typing import List, Dict, Optional
from dataclasses import dataclass
from datetime import datetime

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('sheriahub_scraper.log'),
        logging.StreamHandler()
    ]
)

@dataclass
class Case:
    title: str
    case_number: str
    judges: List[str]
    advocates: List[str]
    summary: str
    decision: str
    citations: List[str]
    url: str
    date_decided: Optional[str]
    court: Optional[str]

class SheriaHubScraper:
    def __init__(self, base_url: str = "https://sheriahub.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })

    def get_case_links(self, country: str = "ke", max_pages: int = 10) -> List[str]:
        """Scrape case links from listing pages."""
        case_links = []
        base_url = f"{self.base_url}/countries/{country}/cases"

        for page in range(1, max_pages + 1):
            try:
                url = f"{base_url}?page={page}"
                logging.info(f"Scraping page {page}: {url}")
                
                response = self.session.get(url)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.text, 'html.parser')
                links = soup.select('a[href*="/cases/"]')
                
                if not links:
                    logging.info(f"No more cases found on page {page}")
                    break
                
                for link in links:
                    case_url = f"{self.base_url}{link['href']}"
                    if case_url not in case_links:
                        case_links.append(case_url)
                
                # Be nice to the server
                time.sleep(2)
                
            except Exception as e:
                logging.error(f"Error scraping page {page}: {str(e)}")
                continue

        logging.info(f"Collected {len(case_links)} case links")
        return case_links

    def scrape_case_details(self, url: str) -> Optional[Case]:
        """Scrape details from a single case page."""
        try:
            response = self.session.get(url)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extract case details
            title = soup.find('h1').text.strip() if soup.find('h1') else ""
            case_number = self._extract_case_number(soup)
            judges = self._extract_judges(soup)
            advocates = self._extract_advocates(soup)
            summary = self._extract_summary(soup)
            decision = self._extract_decision(soup)
            citations = self._extract_citations(soup)
            date_decided = self._extract_date_decided(soup)
            court = self._extract_court(soup)
            
            return Case(
                title=title,
                case_number=case_number,
                judges=judges,
                advocates=advocates,
                summary=summary,
                decision=decision,
                citations=citations,
                url=url,
                date_decided=date_decided,
                court=court
            )
            
        except Exception as e:
            logging.error(f"Error scraping case {url}: {str(e)}")
            return None

    def _extract_case_number(self, soup: BeautifulSoup) -> str:
        """Extract case number from the page."""
        case_number_elem = soup.find(text='Case Number:')
        if case_number_elem and case_number_elem.find_next():
            return case_number_elem.find_next().text.strip()
        return ""

    def _extract_judges(self, soup: BeautifulSoup) -> List[str]:
        """Extract judges from the page."""
        judges_elem = soup.find(text='Judges:')
        if judges_elem and judges_elem.find_next():
            judges_text = judges_elem.find_next().text.strip()
            return [j.strip() for j in judges_text.split(',')]
        return []

    def _extract_advocates(self, soup: BeautifulSoup) -> List[str]:
        """Extract advocates from the page."""
        advocates_elem = soup.find(text='Advocates:')
        if advocates_elem and advocates_elem.find_next():
            advocates_text = advocates_elem.find_next().text.strip()
            return [a.strip() for a in advocates_text.split(',')]
        return []

    def _extract_summary(self, soup: BeautifulSoup) -> str:
        """Extract case summary from the page."""
        summary_elem = soup.find('div', class_='case-summary')
        if summary_elem:
            return summary_elem.text.strip()
        return ""

    def _extract_decision(self, soup: BeautifulSoup) -> str:
        """Extract case decision from the page."""
        decision_elem = soup.find(text='Decision:')
        if decision_elem and decision_elem.find_next():
            return decision_elem.find_next().text.strip()
        return ""

    def _extract_citations(self, soup: BeautifulSoup) -> List[str]:
        """Extract case citations from the page."""
        citations_elem = soup.find(text='Citations:')
        if citations_elem and citations_elem.find_next():
            citations_text = citations_elem.find_next().text.strip()
            return [c.strip() for c in citations_text.split(',')]
        return []

    def _extract_date_decided(self, soup: BeautifulSoup) -> Optional[str]:
        """Extract date decided from the page."""
        date_elem = soup.find(text='Date Decided:')
        if date_elem and date_elem.find_next():
            return date_elem.find_next().text.strip()
        return None

    def _extract_court(self, soup: BeautifulSoup) -> Optional[str]:
        """Extract court name from the page."""
        court_elem = soup.find(text='Court:')
        if court_elem and court_elem.find_next():
            return court_elem.find_next().text.strip()
        return None

    def scrape_all_cases(self, country: str = "ke", max_pages: int = 10) -> List[Case]:
        """Scrape all cases from the website."""
        case_links = self.get_case_links(country, max_pages)
        cases = []
        
        for url in case_links:
            case = self.scrape_case_details(url)
            if case:
                cases.append(case)
                logging.info(f"Successfully scraped case: {case.title}")
            time.sleep(2)  # Be nice to the server
            
        return cases

    def save_cases_to_json(self, cases: List[Case], filename: str = "sheriahub_cases.json"):
        """Save scraped cases to a JSON file."""
        cases_dict = [vars(case) for case in cases]
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(cases_dict, f, indent=2, ensure_ascii=False)
        logging.info(f"Saved {len(cases)} cases to {filename}")

def main():
    scraper = SheriaHubScraper()
    cases = scraper.scrape_all_cases(country="ke", max_pages=5)
    scraper.save_cases_to_json(cases)

if __name__ == "__main__":
    main() 