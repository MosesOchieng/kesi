import axios from 'axios';

// Function to fetch cases from the Hugging Face dataset
export const fetchHuggingFaceCases = async () => {
  try {
    // In a real implementation, this would be your backend API endpoint
    // that loads the dataset from Hugging Face
    const response = await axios.get('/api/dataset/cases');
    return response.data;
  } catch (error) {
    console.error('Error fetching Hugging Face cases:', error);
    return [];
  }
};

// Function to process raw case data from the dataset
export const processDatasetCase = (rawCase) => {
  return {
    id: rawCase.case_name || Math.random().toString(36).substr(2, 9),
    name: rawCase.case_name,
    type: 'Historical',
    area: 'Legal',
    location: 'Kenya',
    role: 'Unassigned',
    deadline: 'TBD',
    status: 'Ongoing',
    caseNumber: rawCase.case_name,
    court: rawCase.court,
    dateDecided: rawCase.date,
    summary: rawCase.text.substring(0, 200) + '...', // First 200 characters as summary
    storyline: rawCase.text.substring(0, 200) + '...',
    agents: [
      { role: 'Judge', name: 'AI Judge', avatar: '⚖️' },
      { role: 'Prosecutor', name: 'AI Prosecutor', avatar: '🧑‍⚖️' },
      { role: 'Defense Attorney', name: 'AI Defense', avatar: '🧑‍💼' },
      { role: 'Clerk', name: 'AI Clerk', avatar: '🗃️' },
      { role: 'Defendant', name: 'AI Defendant', avatar: '🧑‍🦱' },
      { role: 'Witness', name: 'AI Witness', avatar: '🗣️' },
    ],
    timeline: [
      {
        date: rawCase.date,
        title: 'Case Filed',
        description: `Case was filed in ${rawCase.court}`,
        icon: '📝'
      },
      {
        date: rawCase.date,
        title: 'Case Decided',
        description: `Case was decided in ${rawCase.court}`,
        icon: '⚖️'
      }
    ],
    documents: [
      {
        name: 'Case Text',
        description: rawCase.text.substring(0, 100) + '...',
        icon: '📄'
      }
    ]
  };
};

// Function to combine and deduplicate cases from different sources
export const combineCases = (sheriaHubCases, huggingFaceCases) => {
  const allCases = [...sheriaHubCases, ...huggingFaceCases];
  const uniqueCases = new Map();
  
  allCases.forEach(caseItem => {
    if (!uniqueCases.has(caseItem.name)) {
      uniqueCases.set(caseItem.name, caseItem);
    }
  });
  
  return Array.from(uniqueCases.values());
}; 