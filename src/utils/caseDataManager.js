import axios from 'axios';

export const fetchSheriaHubCases = async () => {
  try {
    const response = await axios.get('/api/sheriahub/cases');
    return response.data;
  } catch (error) {
    console.error('Error fetching SheriaHub cases:', error);
    return [];
  }
};

export const processCaseData = (rawCase) => {
  return {
    id: rawCase.case_number || Math.random().toString(36).substr(2, 9),
    name: rawCase.title,
    type: 'Historical',
    area: 'Legal',
    location: 'Kenya',
    role: 'Unassigned',
    deadline: 'TBD',
    status: 'Ongoing',
    caseNumber: rawCase.case_number,
    judges: rawCase.judges,
    advocates: rawCase.advocates,
    summary: rawCase.summary,
    decision: rawCase.decision,
    citations: rawCase.citations,
    dateDecided: rawCase.date_decided,
    court: rawCase.court,
    url: rawCase.url,
    storyline: rawCase.summary,
    agents: [
      { role: 'Judge', name: rawCase.judges[0] || 'AI Judge', avatar: '⚖️' },
      { role: 'Prosecutor', name: 'AI Prosecutor', avatar: '🧑‍⚖️' },
      { role: 'Defense Attorney', name: 'AI Defense', avatar: '🧑‍💼' },
      { role: 'Clerk', name: 'AI Clerk', avatar: '🗃️' },
      { role: 'Defendant', name: 'AI Defendant', avatar: '🧑‍🦱' },
      { role: 'Witness', name: 'AI Witness', avatar: '🗣️' },
    ],
    timeline: [
      {
        date: rawCase.date_decided,
        title: 'Case Decided',
        description: `Case was decided in ${rawCase.court}`,
        icon: '⚖️'
      },
      {
        date: rawCase.date_decided,
        title: 'Judgment Delivered',
        description: rawCase.decision,
        icon: '📜'
      }
    ],
    documents: [
      {
        name: 'Case Summary',
        description: rawCase.summary,
        icon: '📝'
      },
      {
        name: 'Citations',
        description: rawCase.citations.join(', '),
        icon: '📚'
      }
    ]
  };
}; 