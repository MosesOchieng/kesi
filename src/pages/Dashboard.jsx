import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import JudgeMatchingSystem from '../components/JudgeMatchingSystem';
import OverviewSection from '../components/sections/OverviewSection';
import CasesSection from '../components/sections/CasesSection';
import FeedbackSection from '../components/sections/FeedbackSection';
import EvidenceSection from '../components/sections/EvidenceSection';
import SimulationSection from '../components/sections/SimulationSection';
import LearningSection from '../components/sections/LearningSection';
import CommunitySection from '../components/sections/CommunitySection';
import NotificationsSection from '../components/sections/NotificationsSection';
import SyntheticEvidenceGenerator from '../components/SyntheticEvidenceGenerator';
import { fetchSheriaHubCases, processCaseData } from '../utils/caseDataManager';
import { fetchHuggingFaceCases, processDatasetCase, combineCases } from '../utils/datasetManager';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

function Modal({ open, onClose, title, children, type = 'info', wide }) {
  if (!open) return null;
  const accent = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className={`relative ${wide ? 'max-w-5xl' : 'max-w-md'} w-full rounded-2xl shadow-2xl bg-white animate-fadeIn`}>
        <div className={`flex items-center justify-between px-6 py-3 rounded-t-2xl ${accent} text-white`}>
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="text-white text-2xl hover:text-gray-200">&times;</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

const sections = [
  { id: 'overview', name: 'Overview', icon: '📊' },
  { id: 'cases', name: 'Cases', icon: '📁' },
  { id: 'ai', name: 'AI Roleplay', icon: '🤖' },
  { id: 'evidence', name: 'Evidence & Generation', icon: '🔍' },
  { id: 'feedback', name: 'Feedback', icon: '💬' },
  { id: 'learning', name: 'Learning', icon: '📚' },
  { id: 'community', name: 'Community', icon: '👥' }
];

const demoBadges = [
  { name: 'Case Starter', icon: '🏅' },
  { name: 'Objection Master', icon: '⚡' },
  { name: 'Evidence Pro', icon: '📑' },
];

const demoSkills = [
  { name: 'Legal Arguments', value: 80 },
  { name: 'Objection Handling', value: 65 },
  { name: 'Cross-Examination', value: 72 },
];

const demoActiveCases = [
  { id: 1, name: 'State vs. Smith', type: 'AI', role: 'Prosecutor', deadline: '2024-07-20', status: 'Ongoing' },
  { id: 2, name: 'Johnson Estate', type: 'Manual', role: 'Defense', deadline: '2024-07-25', status: 'Ongoing' },
  { id: 3, name: 'People vs. Doe', type: 'Historical', role: 'Judge', deadline: '2024-07-30', status: 'Ongoing' },
  { id: 4, name: 'AI v. Human', type: 'AI', role: 'Defense', deadline: '2024-08-01', status: 'Ongoing' },
  { id: 5, name: 'Legacy Case', type: 'Historical', role: 'Prosecutor', deadline: '2024-08-05', status: 'Ongoing' },
];

const demoUploadedCases = [
  { id: 1, name: 'My Uploaded Case', type: 'Manual', evidence: 3 },
  { id: 2, name: 'Historic Land Dispute', type: 'Historical', evidence: 2 },
  { id: 3, name: 'AI Arbitration', type: 'AI', evidence: 1 },
  { id: 4, name: 'Estate Challenge', type: 'Manual', evidence: 4 },
  { id: 5, name: 'Old Court Records', type: 'Historical', evidence: 2 },
];

const agentIcons = {
  Judge: '⚖️',
  Police: '👮',
  Prosecutor: '🧑‍⚖️',
  Defense: '🧑‍💼',
  Clerk: '🗃️',
  Defendant: '🧑‍🦱',
  Witness: '🗣️',
};

const demoAgents = [
  { role: 'Judge', name: 'AI Judge', icon: agentIcons['Judge'] },
  { role: 'Police', name: 'AI Police', icon: agentIcons['Police'] },
  { role: 'Prosecutor', name: 'AI Prosecutor', icon: agentIcons['Prosecutor'] },
  { role: 'Defense', name: 'AI Defense', icon: agentIcons['Defense'] },
  { role: 'Clerk', name: 'AI Clerk', icon: agentIcons['Clerk'] },
  { role: 'Defendant', name: 'AI Defendant', icon: agentIcons['Defendant'] },
  { role: 'Witness', name: 'AI Witness', icon: agentIcons['Witness'] },
];

const demoEvidence = [
  { id: 1, name: 'Photo', type: 'image', url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80', tags: ['photo', 'scene'], relevance: 'high', chainOfCustody: [{ action: 'uploaded', user: 'System', timestamp: new Date().toLocaleString() }] },
  { id: 2, name: 'Contract', type: 'document', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80', tags: ['contract'], relevance: 'medium', chainOfCustody: [{ action: 'uploaded', user: 'System', timestamp: new Date().toLocaleString() }] },
  { id: 3, name: 'Video', type: 'video', url: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4', tags: ['video'], relevance: 'low', chainOfCustody: [{ action: 'uploaded', user: 'System', timestamp: new Date().toLocaleString() }] },
];

const demoNotifications = [
  { id: 1, type: 'case', message: 'Upcoming deadline for State vs. Smith', date: '2024-07-19' },
  { id: 2, type: 'system', message: 'New feature: Case Twist Generator!', date: '2024-07-18' },
];

const demoForumLinks = [
  { label: 'KESI Forum', href: 'https://forum.kesi.com' },
  { label: 'Q&A', href: 'https://forum.kesi.com/qna' },
];

const demoMentorship = [
  { name: 'Jane Mentor', role: 'Senior Lawyer', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
];

// Add historical cases data
const historicalCases = [
  { name: 'Roe v. Wade', area: 'Civil', location: 'USA', storyline: 'Landmark decision on abortion rights in the United States.' },
  { name: 'Brown v. Board of Education', area: 'Civil', location: 'USA', storyline: 'Historic case ending racial segregation in public schools.' },
  { name: 'Nuremberg Trials', area: 'Criminal', location: 'Germany', storyline: 'Prosecution of major Nazi war criminals after World War II.' },
  { name: 'Miranda v. Arizona', area: 'Criminal', location: 'USA', storyline: 'Established Miranda rights for detained suspects.' },
  { name: 'Marbury v. Madison', area: 'Civil', location: 'USA', storyline: 'Established the principle of judicial review.' },
];

// Add CaseIntroMessage component before Dashboard export
function CaseIntroMessage({ caseObj, agents, calendarEvents, onClose }) {
  const [visible, setVisible] = useState(true);
  const timerRef = useRef();
  useEffect(() => {
    timerRef.current = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timerRef.current);
  }, []);
  if (!visible) return null;
  // Find next event
  const now = new Date();
  const events = calendarEvents
    .filter(ev => ev.caseId === caseObj.id)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const nextEvent = events.find(ev => new Date(ev.date) >= now) || events[0];
  // Guess session type from event title
  let sessionType = 'Session';
  if (nextEvent && nextEvent.title) {
    if (/hearing/i.test(nextEvent.title)) sessionType = 'Hearing';
    else if (/mention/i.test(nextEvent.title)) sessionType = 'Mention';
    else if (/testimony/i.test(nextEvent.title)) sessionType = 'Testimony';
    else if (/statement/i.test(nextEvent.title)) sessionType = 'Opening Statement';
    else sessionType = nextEvent.title;
  }
  return (
    <div
      className="animate-fadeInOut bg-blue-600 text-white rounded-lg shadow-lg px-6 py-4 mb-4 flex items-start gap-4 relative"
      style={{ animation: 'fadeInOut 5s linear' }}
    >
      <div className="flex-1">
        <div className="font-bold text-lg mb-1">Case Brief: {caseObj.name}</div>
        <div className="mb-1 text-sm">{caseObj.type} • {caseObj.area} • {caseObj.location}</div>
        {caseObj.storyline && <div className="italic mb-2 text-sm">{caseObj.storyline}</div>}
        <div className="mb-1 text-sm">Parties: {agents.map(a => a.role).join(', ')}</div>
        {nextEvent && (
          <div className="mb-1 text-sm">Next Event: <span className="font-semibold">{nextEvent.title}</span> on <span className="font-semibold">{nextEvent.date}</span> ({sessionType})</div>
        )}
      </div>
      <button
        className="absolute top-2 right-2 text-white text-xl hover:text-gray-200"
        onClick={() => { setVisible(false); if (onClose) onClose(); }}
        aria-label="Close"
      >&times;</button>
      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}

// Add ErrorBoundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error in SectionPanel:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}

// Add case status progression
const caseStatuses = {
  DRAFT: 'Draft',
  FILED: 'Filed',
  PREPARATION: 'In Preparation',
  SCHEDULED: 'Scheduled',
  IN_PROGRESS: 'In Progress',
  SETTLEMENT: 'Settlement Phase',
  CLOSED: 'Closed'
};

// Add case progression steps
const caseProgressionSteps = [
  { id: 'draft', name: 'Draft', status: caseStatuses.DRAFT },
  { id: 'filing', name: 'Filing', status: caseStatuses.FILED },
  { id: 'preparation', name: 'Preparation', status: caseStatuses.PREPARATION },
  { id: 'scheduling', name: 'Scheduling', status: caseStatuses.SCHEDULED },
  { id: 'proceedings', name: 'Proceedings', status: caseStatuses.IN_PROGRESS },
  { id: 'settlement', name: 'Settlement', status: caseStatuses.SETTLEMENT },
  { id: 'closing', name: 'Closing', status: caseStatuses.CLOSED }
];

export default function Dashboard() {
  const { user } = useAuth();
  const [section, setSection] = useState('overview');
  const [modal, setModal] = useState({ open: false, title: '', content: null, type: 'info', wide: false });
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [currentCaseId, setCurrentCaseId] = useState(null);
  const [chat, setChat] = useState({});
  const [evidenceModal, setEvidenceModal] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [activeCases, setActiveCases] = useState([]);
  const [uploadedCases, setUploadedCases] = useState([]);
  const [badges, setBadges] = useState([]);
  const [skills, setSkills] = useState([]);
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [lastUserEmail, setLastUserEmail] = useState(null);
  const [caseDetails, setCaseDetails] = useState(null);
  const [joinedCases, setJoinedCases] = useState([]);
  const [userRoles, setUserRoles] = useState({});
  const [historicalCases, setHistoricalCases] = useState([]);
  const navigate = useNavigate();

  // Update default data for new users to be empty
  const defaultActiveCases = [];
  const defaultUploadedCases = [];
  const defaultBadges = [];
  const defaultSkills = [
    { name: 'Legal Research', value: 0 },
    { name: 'Case Analysis', value: 0 },
    { name: 'Document Preparation', value: 0 },
    { name: 'Client Communication', value: 0 }
  ];

  // Update the loadCases function
  const loadCases = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('No auth token found, using empty data');
        setActiveCases(defaultActiveCases);
        setUploadedCases(defaultUploadedCases);
        setBadges(defaultBadges);
        setSkills(defaultSkills);
        return;
      }

      // First try to get cases from our backend server
      const response = await fetch('http://localhost:3001/api/cases', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 401) {
        console.log('Token expired or invalid, using empty data');
        setActiveCases(defaultActiveCases);
        setUploadedCases(defaultUploadedCases);
        setBadges(defaultBadges);
        setSkills(defaultSkills);
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch cases from server');
      }
      
      const serverCases = await response.json();
      
      // Then try to get cases from web scraping (Python backend)
      const scrapingResponse = await fetch('http://localhost:3001/api/scraped-cases', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      let scrapedCases = [];
      if (scrapingResponse.ok) {
        scrapedCases = await scrapingResponse.json();
      }

      // Get user progress (badges and skills)
      const progressResponse = await fetch('http://localhost:3001/api/user-progress', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (progressResponse.ok) {
        const userProgress = await progressResponse.json();
        setBadges(userProgress.badges || defaultBadges);
        setSkills(userProgress.skills || defaultSkills);
      } else {
        setBadges(defaultBadges);
        setSkills(defaultSkills);
      }

      // Generate AI cases similar to scraped cases
      const aiGeneratedCases = scrapedCases.map(case_ => ({
        ...case_,
        id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: `AI ${case_.name}`,
        source: 'ai',
        type: case_.type,
        area: case_.area,
        location: case_.location,
        description: `AI-generated case based on ${case_.name}`,
        status: 'Ongoing',
        role: 'Unassigned'
      }));

      // Combine and process all cases
      const allCases = [...serverCases, ...scrapedCases, ...aiGeneratedCases].map(case_ => ({
        ...case_,
        type: case_.source === 'scraped' ? 'Historical' : case_.type || 'Manual',
        status: case_.status || 'Ongoing',
        role: case_.role || 'Unassigned'
      }));

      setActiveCases(allCases);
      setUploadedCases(allCases.filter(c => c.type === 'Manual'));
      
    } catch (error) {
      console.error('Error loading cases:', error);
      // Fallback to empty data if there's an error
      setActiveCases(defaultActiveCases);
      setUploadedCases(defaultUploadedCases);
      setBadges(defaultBadges);
      setSkills(defaultSkills);
    }
  };

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      console.log('No user found, redirecting to login');
      navigate('/login');
      return;
    }

    // Load initial data
    loadCases();
  }, [user, navigate]);

  // Get user from localStorage if available
  const defaultProfile = user
    ? {
        name: user.email.split('@')[0] || 'New User',
        role: user.rolePreference || 'Lawyer',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      }
    : { name: 'John Doe', role: 'Lawyer', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' };

  const [profile, setProfile] = useState(defaultProfile);

  // Reset dashboard state for new user
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('kesi-user'));
    if (user && user.email !== lastUserEmail) {
      setActiveCases([]);
      setUploadedCases([]);
      setBadges([]);
      setSkills([
        { name: 'Legal Research', value: 0 },
        { name: 'Case Analysis', value: 0 },
        { name: 'Document Preparation', value: 0 },
        { name: 'Client Communication', value: 0 }
      ]);
      setProfile({
        name: user.email.split('@')[0] || 'New User',
        role: user.rolePreference || 'Lawyer',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      });
      setChat({});
      setLastUserEmail(user.email);
    }
  }, []);

  // Onboarding logic: show after registration/first login if not completed
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('kesi-user'));
    const onboarded = localStorage.getItem('kesi-onboarded');
    if (user && !onboarded) {
      setShowNewCaseModal(true);
    }
  }, []);

  // Modal helpers
  const openModal = (title, content, type = 'info', wide = false) => setModal({ open: true, title, content, type, wide });
  const closeModal = () => setModal({ ...modal, open: false });

  // AI Chat
  const handleSendChat = (msg) => {
    if (!msg.trim()) return;
    setChat(prev => {
      const prevCase = prev[currentCaseId] || {};
      const prevAgentChat = prevCase[selectedAgent.role] || [];
      return {
        ...prev,
        [currentCaseId]: {
          ...prevCase,
          [selectedAgent.role]: [
            ...prevAgentChat,
            { sender: 'You', text: msg }
          ]
        }
      };
    });
    setTimeout(() => {
      setChat(prev => {
        const prevCase = prev[currentCaseId] || {};
        const prevAgentChat = prevCase[selectedAgent.role] || [];
        return {
          ...prev,
          [currentCaseId]: {
            ...prevCase,
            [selectedAgent.role]: [
              ...prevAgentChat,
              { sender: selectedAgent.name, text: `AI response from ${selectedAgent.role}.` }
            ]
          }
        };
      });
    }, 700);
  };

  // Evidence Viewer
  const handleViewEvidence = (ev) => {
    openModal('Evidence Viewer', (
      <div>
        <div className="mb-2 font-semibold">{ev.name}</div>
        {ev.type === 'image' && <img src={ev.url} alt={ev.name} className="w-full rounded shadow mb-2" />}
        {ev.type === 'document' && <img src={ev.url} alt={ev.name} className="w-full rounded shadow mb-2" />}
        {ev.type === 'video' && <video src={ev.url} controls className="w-full rounded shadow mb-2" />}
        <div className="text-xs text-gray-500 mb-1">Type: {ev.type}</div>
        <div className="text-xs text-gray-500 mb-1">Tags: {ev.tags?.join(', ') || 'None'}</div>
        <div className="text-xs text-gray-500 mb-1">Relevance: {ev.relevance || 'N/A'}</div>
        <div className="text-xs text-gray-500 mb-1">Chain of Custody:</div>
        <ul className="text-xs text-gray-700 pl-4 list-disc mb-2">
          {ev.chainOfCustody?.map((log, idx) => (
            <li key={idx}>{log.action} by {log.user} at {log.timestamp}</li>
          ))}
        </ul>
      </div>
    ), 'info', true);
  };

  // Score Report
  const handleViewScore = () => {
    openModal('Score Report', (
      <div>
        <div className="mb-2 font-semibold">Performance Breakdown</div>
        <ul className="mb-2">
          {skills.map(skill => (
            <li key={skill.name} className="flex justify-between mb-1">
              <span>{skill.name}</span>
              <span>{skill.value}%</span>
            </li>
          ))}
        </ul>
        <div className="mb-2">Suggestions: <span className="text-blue-700">Practice objection handling and review cross-examination guides.</span></div>
      </div>
    ), 'info');
  };

  // Case Twist Generator
  const handleCaseTwist = () => {
    openModal('Case Twist', (
      <div>
        <div className="mb-2">A surprise witness has appeared! Adapt your strategy.</div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={closeModal}>OK</button>
      </div>
    ), 'info');
  };

  // Experience Case
  const handleExperienceCase = (caseId) => {
    openModal('Experience Case', (
      <div>
        <div className="mb-2">Launching simulation for case #{caseId}...</div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={closeModal}>OK</button>
      </div>
    ), 'info');
  };

  // New Case Modal Content
  function NewCaseModal({ onCreate, onClose }) {
    const [step, setStep] = useState(0); // 0: choose type, 1: enter/select details, 2: show storyline
    const [caseType, setCaseType] = useState('Manual');
    const [caseName, setCaseName] = useState('');
    const [area, setArea] = useState('Criminal');
    const [location, setLocation] = useState('');
    const [storyline, setStoryline] = useState('');
    const [difficulty, setDifficulty] = useState('Medium');
    const [success, setSuccess] = useState(false);
    const [manualFiles, setManualFiles] = useState([]);
    const [selectedHistorical, setSelectedHistorical] = useState(null);
    const typeOptions = [
      { label: 'Manual', value: 'Manual' },
      { label: 'AI Generated', value: 'AI' },
      { label: 'Historical', value: 'Historical' },
    ];
    const areaOptions = [
      { label: 'Criminal', value: 'Criminal' },
      { label: 'Civil', value: 'Civil' },
      { label: 'Family', value: 'Family' },
    ];
    const difficultyOptions = ['Easy', 'Medium', 'Hard'];
    // Simple AI case generator
    const randomNames = ['The Missing Brief', 'State vs. Quantum', 'AI v. Human', 'The Stolen Algorithm', 'People vs. Doe'];
    const randomLocations = ['Nairobi', 'London', 'New York', 'Berlin', 'Tokyo'];
    const generateAICase = (area, difficulty) => {
      const name = randomNames[Math.floor(Math.random() * randomNames.length)];
      const location = randomLocations[Math.floor(Math.random() * randomLocations.length)];
      const storyline = `In ${location}, a ${difficulty.toLowerCase()} ${area.toLowerCase()} case arises: "${name}". The AI will generate twists and legal challenges for you to solve.`;
      return { name, location, storyline };
    };
    return (
      <div className="p-2 md:p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg max-w-md mx-auto">
        {success ? (
          <div className="text-center p-6">
            <div className="text-3xl mb-2 text-green-600">✔️</div>
            <div className="font-semibold mb-2">Case Created!</div>
            <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={onClose}>Close</button>
          </div>
        ) : step === 0 ? (
          <div>
            <div className="mb-4 font-semibold text-lg">Choose Case Type</div>
            <div className="flex gap-4 mb-4">
              {typeOptions.map(opt => (
                <button
                  key={opt.value}
                  className={`px-4 py-2 rounded-lg border text-base font-medium shadow-sm transition-all duration-150 ${caseType === opt.value ? 'bg-blue-600 text-white border-blue-600 scale-105' : 'border-gray-300 bg-white hover:bg-blue-50'}`}
                  onClick={() => { setCaseType(opt.value); setStep(1); }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button className="mt-2 text-gray-500 underline" onClick={onClose}>Cancel</button>
          </div>
        ) : step === 1 && caseType === 'AI' ? (
          <form onSubmit={e => {
            e.preventDefault();
            const ai = generateAICase(area, difficulty);
            setCaseName(ai.name);
            setLocation(ai.location);
            setStoryline(ai.storyline);
            setStep(2);
          }}>
            <div className="mb-2 font-semibold text-lg">Select Category and Difficulty</div>
            <select
              className="border border-gray-300 rounded px-2 py-1 w-full mb-2"
              value={area}
              onChange={e => setArea(e.target.value)}
            >
              {areaOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <select
              className="border border-gray-300 rounded px-2 py-1 w-full mb-4"
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
            >
              {difficultyOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">Next</button>
          </form>
        ) : step === 1 && caseType === 'Manual' ? (
          <form onSubmit={e => {
            e.preventDefault();
            if (!manualFiles.length) return;
            setCaseName(manualFiles[0]?.name || 'Manual Case');
            setLocation('User Provided');
            setArea('Manual');
            setStoryline('User uploaded case files and evidence.');
            setStep(2);
          }}>
            <div className="mb-2 font-semibold text-lg">Upload Case Files & Evidence</div>
            <input
              type="file"
              multiple
              className="border border-gray-300 rounded px-2 py-1 w-full mb-4"
              accept=".pdf,.doc,.docx,.txt,image/*,video/*"
              onChange={e => setManualFiles(Array.from(e.target.files))}
            />
            <ul className="mb-2 text-xs text-gray-700">
              {manualFiles.map(f => <li key={f.name}>{f.name}</li>)}
            </ul>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">Next</button>
          </form>
        ) : step === 1 && caseType === 'Historical' ? (
          <form onSubmit={e => {
            e.preventDefault();
            if (!selectedHistorical) return;
            setCaseName(selectedHistorical.name);
            setArea(selectedHistorical.area);
            setLocation(selectedHistorical.location);
            setStoryline(selectedHistorical.storyline);
            setStep(2);
          }}>
            <div className="mb-2 font-semibold text-lg">Select a Historical Case</div>
            <select
              className="border border-gray-300 rounded px-2 py-1 w-full mb-4"
              value={selectedHistorical ? selectedHistorical.name : ''}
              onChange={e => setSelectedHistorical(historicalCases.find(h => h.name === e.target.value))}
            >
              <option value="">Choose a case...</option>
              {historicalCases.map(h => (
                <option key={h.name} value={h.name}>{h.name} ({h.area}, {h.location})</option>
              ))}
            </select>
            {selectedHistorical && <div className="bg-gray-100 rounded p-3 mb-2 text-xs text-gray-700">{selectedHistorical.storyline}</div>}
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">Next</button>
          </form>
        ) : step === 2 ? (
          <div>
            <div className="mb-2 font-semibold text-lg">Case Details</div>
            <div className="mb-2">Name: <span className="font-semibold">{caseName}</span></div>
            <div className="mb-2">Area: <span className="font-semibold">{area}</span></div>
            <div className="mb-2">Location: <span className="font-semibold">{location}</span></div>
            <div className="mb-2">Storyline: <span className="text-gray-700 italic">{storyline}</span></div>
            {caseType === 'Manual' && manualFiles.length > 0 && (
              <div className="mb-2">
                <div className="font-semibold">Uploaded Files:</div>
                <ul className="text-xs text-gray-700">
                  {manualFiles.map(f => <li key={f.name}>{f.name}</li>)}
                </ul>
              </div>
            )}
            <div className="flex gap-2 mt-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => {
                onCreate(caseName, caseType, area, location, storyline);
                setSuccess(true);
              }}>Create Case</button>
              <button className="text-gray-500 underline" onClick={onClose}>Cancel</button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  // Update handleCreateCase function
  const handleCreateCase = (name, type, area, location, storyline) => {
    const newId = Math.max(...activeCases.map(c => c.id), 0) + 1;
    const newCase = {
      id: newId,
      name,
      type,
      area,
      location,
      storyline,
      role: 'Unassigned',
      deadline: 'TBD',
      status: caseStatuses.DRAFT,
      currentStep: 'draft',
      progression: {
        steps: caseProgressionSteps,
        currentStepIndex: 0
      },
      timeline: [{
        date: new Date().toISOString(),
        action: 'Case Created',
        description: 'Initial case draft created',
        status: 'completed'
      }],
      evidence: [],
      interactions: [],
      participants: []
    };
    
    setActiveCases(prev => [...prev, newCase]);
    setShowNewCaseModal(false);
    closeModal();
    showToast('Case created successfully!');
  };

  // Add function to update case status
  const updateCaseStatus = (caseId, newStep) => {
    setActiveCases(prev => prev.map(case_ => {
      if (case_.id === caseId) {
        const stepIndex = caseProgressionSteps.findIndex(step => step.id === newStep);
        const newTimeline = [...case_.timeline, {
          date: new Date().toISOString(),
          action: `Status Updated to ${caseProgressionSteps[stepIndex].name}`,
          description: `Case moved to ${caseProgressionSteps[stepIndex].name} phase`,
          status: 'completed'
        }];
        
        return {
          ...case_,
          status: caseProgressionSteps[stepIndex].status,
          currentStep: newStep,
          progression: {
            ...case_.progression,
            currentStepIndex: stepIndex
          },
          timeline: newTimeline
        };
      }
      return case_;
    }));
  };

  // Add function to handle case progression
  const handleCaseProgression = (caseId, direction) => {
    setActiveCases(prev => prev.map(case_ => {
      if (case_.id === caseId) {
        const currentIndex = case_.progression.currentStepIndex;
        const newIndex = direction === 'next' 
          ? Math.min(currentIndex + 1, caseProgressionSteps.length - 1)
          : Math.max(currentIndex - 1, 0);
        
        const newStep = caseProgressionSteps[newIndex].id;
        const newTimeline = [...case_.timeline, {
          date: new Date().toISOString(),
          action: `Progressed to ${caseProgressionSteps[newIndex].name}`,
          description: `Case moved to ${caseProgressionSteps[newIndex].name} phase`,
          status: 'completed'
        }];
        
        return {
          ...case_,
          status: caseProgressionSteps[newIndex].status,
          currentStep: newStep,
          progression: {
            ...case_.progression,
            currentStepIndex: newIndex
          },
          timeline: newTimeline
        };
      }
      return case_;
    }));
  };

  // Edit Profile Modal
  function EditProfileModal({ profile, onSave, onClose }) {
    const [name, setName] = useState(profile.name);
    const [role, setRole] = useState(profile.role);
    const [avatar, setAvatar] = useState(profile.avatar);
    return (
      <form onSubmit={e => { e.preventDefault(); onSave({ name, role, avatar }); }}>
        <div className="mb-2 font-semibold">Edit Profile</div>
        <input
          className="border border-gray-300 rounded px-2 py-1 w-full mb-2"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
        />
        <select
          className="border border-gray-300 rounded px-2 py-1 w-full mb-2"
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          <option value="Lawyer">Lawyer</option>
          <option value="Prosecutor">Prosecutor</option>
          <option value="Defense">Defense</option>
          <option value="Judge">Judge</option>
          <option value="Clerk">Clerk</option>
          <option value="Observer">Observer</option>
        </select>
        <input
          className="border border-gray-300 rounded px-2 py-1 w-full mb-4"
          value={avatar}
          onChange={e => setAvatar(e.target.value)}
          placeholder="Avatar URL"
        />
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
          <button type="button" className="text-gray-500 underline" onClick={onClose}>Cancel</button>
        </div>
      </form>
    );
  }

  // Save profile changes and persist to localStorage
  const handleSaveProfile = (newProfile) => {
    setProfile(newProfile);
    // Update user in localStorage if exists
    const user = JSON.parse(localStorage.getItem('kesi-user'));
    if (user) {
      user.name = newProfile.name;
      user.rolePreference = newProfile.role;
      user.avatar = newProfile.avatar;
      localStorage.setItem('kesi-user', JSON.stringify(user));
    }
    setModal({ ...modal, open: false });
  };

  // Toast notification component
  function Toast({ message, onClose }) {
    if (!message) return null;
    return (
      <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fadeIn">
        <span className="text-xl">✔️</span>
        <span>{message}</span>
        <button className="ml-2 text-white text-lg" onClick={onClose}>&times;</button>
      </div>
    );
  }

  // Helper to show toast for 2.5s
  const showToast = (msg) => {
    setModal({ ...modal, content: msg });
    setTimeout(() => setModal({ ...modal, content: null }), 2500);
  };

  // Section panels
  function SectionPanel() {
    switch (section) {
      case 'overview':
        return <OverviewSection
          profile={profile}
          activeCases={activeCases}
          uploadedCases={uploadedCases}
          evidence={demoEvidence}
          skills={skills}
          badges={badges}
          showOnboarding={showNewCaseModal}
          setShowOnboarding={setShowNewCaseModal}
          handleCompleteOnboarding={handleCompleteOnboarding}
          handleSaveProfile={handleSaveProfile}
          handleUploadEvidence={handleUploadEvidence}
          setCaseDetails={setCaseDetails}
          setJoinedCases={setJoinedCases}
          showToast={showToast}
          setUserRoles={setUserRoles}
          addNotification={addNotification}
          setCaseInteractions={setCaseInteractions}
          userRoles={userRoles}
          getCaseAgents={getCaseAgents}
          roleNextSteps={roleNextSteps}
          calendarEvents={calendarEvents}
          handleAddEvent={handleAddEvent}
          handleCaseTwist={handleCaseTwist}
          setShowCourtroom={setShowCourtroom}
          courtroomTimeline={courtroomTimeline}
          courtroomChat={courtroomChat}
          handleCourtroomSend={handleCourtroomSend}
          currentSpeaker={currentSpeaker}
          setCurrentSpeaker={setCurrentSpeaker}
          preCourtChat={preCourtChat}
          preCourtRecipient={preCourtRecipient}
          setPreCourtRecipient={setPreCourtRecipient}
          handlePreCourtSend={handlePreCourtSend}
          caseInteractions={caseInteractions}
          joinedCases={joinedCases}
          handleJoinCase={handleJoinCase}
          onUpdateRole={handleUpdateRole}
          onAddInteraction={handleAddInteraction}
          onAddEvidence={handleAddEvidence}
        />;
      case 'cases':
        return <CasesSection
          activeCases={activeCases}
          uploadedCases={uploadedCases}
          setShowNewCaseModal={setShowNewCaseModal}
          showNewCaseModal={showNewCaseModal}
          handleCreateCase={handleCreateCase}
          historicalCases={[...historicalCases, ...activeCases]}
          updateCaseStatus={updateCaseStatus}
          handleCaseProgression={handleCaseProgression}
          caseProgressionSteps={caseProgressionSteps}
        />;
      case 'ai':
        return <JudgeMatchingSystem />;
      case 'evidence':
        return <EvidenceSection
          demoEvidence={demoEvidence}
          evidenceFilter={evidenceFilter}
          setEvidenceFilter={setEvidenceFilter}
          compareEvidence={compareEvidence}
          setCompareEvidence={setCompareEvidence}
          setShowCompareModal={setShowCompareModal}
          showCompareModal={showCompareModal}
          handleViewEvidence={handleViewEvidence}
          joinedCases={joinedCases}
        />;
      case 'feedback':
        return <FeedbackSection />;
      case 'learning':
        return <LearningSection />;
      case 'community':
        return <CommunitySection />;
      default:
        return <OverviewSection
          profile={profile}
          activeCases={activeCases}
          uploadedCases={uploadedCases}
          evidence={demoEvidence}
          skills={skills}
          badges={badges}
          showOnboarding={showNewCaseModal}
          setShowOnboarding={setShowNewCaseModal}
          handleCompleteOnboarding={handleCompleteOnboarding}
          handleSaveProfile={handleSaveProfile}
          handleUploadEvidence={handleUploadEvidence}
          setCaseDetails={setCaseDetails}
          setJoinedCases={setJoinedCases}
          showToast={showToast}
          setUserRoles={setUserRoles}
          addNotification={addNotification}
          setCaseInteractions={setCaseInteractions}
          userRoles={userRoles}
          getCaseAgents={getCaseAgents}
          roleNextSteps={roleNextSteps}
          calendarEvents={calendarEvents}
          handleAddEvent={handleAddEvent}
          handleCaseTwist={handleCaseTwist}
          setShowCourtroom={setShowCourtroom}
          courtroomTimeline={courtroomTimeline}
          courtroomChat={courtroomChat}
          handleCourtroomSend={handleCourtroomSend}
          currentSpeaker={currentSpeaker}
          setCurrentSpeaker={setCurrentSpeaker}
          preCourtChat={preCourtChat}
          preCourtRecipient={preCourtRecipient}
          setPreCourtRecipient={setPreCourtRecipient}
          handlePreCourtSend={handlePreCourtSend}
          caseInteractions={caseInteractions}
          joinedCases={joinedCases}
          handleJoinCase={handleJoinCase}
          onUpdateRole={handleUpdateRole}
          onAddInteraction={handleAddInteraction}
          onAddEvidence={handleAddEvidence}
        />;
    }
  }

  // Mock evidence data for uploaded cases
  const [evidence, setEvidence] = useState({
    1: [
      { id: 1, type: 'image', name: 'Photo', url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80' },
      { id: 2, type: 'text', name: 'Statement', text: 'Witness statement: The defendant was seen at the scene.' },
    ],
    2: [
      { id: 3, type: 'document', name: 'Contract', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80' },
    ],
    3: [
      { id: 4, type: 'video', name: 'CCTV', url: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4' },
    ],
    4: [],
    5: [],
  });
  // Handler for uploading evidence (mock)
  const handleUploadEvidence = (caseId, file, tags = [], relevance = 'medium') => {
    if (!file) return;
    const user = profile?.name || 'You';
    const newEv = {
      id: Date.now(),
      type: file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : 'document',
      name: file.name,
      url: URL.createObjectURL(file),
      tags,
      relevance,
      chainOfCustody: [{ action: 'uploaded', user, timestamp: new Date().toLocaleString() }],
    };
    setEvidence(prev => ({ ...prev, [caseId]: [...(prev[caseId] || []), newEv] }));
    showToast('Evidence uploaded!');
  };

  // Courtroom roles and next steps
  const allCourtRoles = ['Judge', 'Prosecutor', 'Defense Attorney', 'Clerk', 'Defendant', 'Witness', 'Observer'];
  const roleNextSteps = {
    Judge: 'Review evidence, schedule hearings, and oversee proceedings.',
    'Defense Attorney': 'Review evidence, prepare arguments, and question witnesses.',
    Prosecutor: 'Present evidence, question witnesses, and make opening statements.',
    Clerk: 'Manage court records and notify participants.',
    Witness: 'Prepare your statement and await questioning.',
    Defendant: 'Consult with your attorney and prepare your defense.',
    Observer: 'Observe the proceedings and take notes.'
  };
  // Court calendar events (mock)
  const [calendarEvents, setCalendarEvents] = useState([
    { caseId: 1, date: '2024-07-20', title: 'Hearing: Opening Statements' },
    { caseId: 1, date: '2024-07-25', title: 'Deadline: Submit Evidence' },
    { caseId: 2, date: '2024-07-22', title: 'Hearing: Witness Testimony' },
  ]);
  const [showCourtroom, setShowCourtroom] = useState(false);
  const [courtroomTimeline, setCourtroomTimeline] = useState([
    { time: '10:00', action: 'Judge enters the courtroom.' },
    { time: '10:05', action: 'Prosecutor makes opening statement.' },
    { time: '10:15', action: 'Defense Attorney objects.' },
    { time: '10:20', action: 'Witness called to stand.' },
  ]);
  // Add event to calendar
  const handleAddEvent = (caseId, date, title) => {
    setCalendarEvents(events => [...events, { caseId, date, title }]);
    showToast('Event added to calendar!');
  };

  // Helper to get available roles for assignment
  function getAvailableRoles(caseObj) {
    // Only allow roles not already taken by user or agents
    const takenRoles = [userRoles[caseObj.id], ...(getCaseAgents(caseObj).map(a => a.role))];
    return allCourtRoles.filter(r => !takenRoles.includes(r));
  }

  // Interactions and notifications
  const [caseInteractions, setCaseInteractions] = useState([]); // {caseId, type, agent, message, timestamp}
  // Advanced notifications
  const [notificationsList, setNotificationsList] = useState([]); // {message, timestamp}
  const addNotification = (msg) => {
    setNotificationsList(n => [{ message: msg, timestamp: new Date().toLocaleTimeString() }, ...n]);
    showToast(msg);
  };
  // Real-time chat for Live Courtroom
  const [courtroomChat, setCourtroomChat] = useState([]); // {sender, message, time}
  const handleCourtroomSend = (msg, sender) => {
    const time = new Date().toLocaleTimeString();
    const id = Date.now() + Math.random();
    setCourtroomChat(chat => [...chat, { id, sender, message: msg, time }]);
    setCaseInteractions(interactions => [...interactions, { caseId: caseDetails.id, type: 'chat', agent: sender, message: msg, timestamp: time }]);
    addNotification(`New message from ${sender}`);
    // Simulate AI agent response (pick a random agent except the sender)
    const agents = getCaseAgents(caseDetails).filter(a => a.role !== sender);
    if (agents.length > 0) {
      const ai = agents[Math.floor(Math.random() * agents.length)];
      setTimeout(() => simulateAIResponse(ai.role, caseDetails.id, 'courtroom'), 1200);
    }
  };

  // Pre-court chat state
  const [preCourtChat, setPreCourtChat] = useState([]); // {caseId, agent, sender, message, time}
  const [preCourtRecipient, setPreCourtRecipient] = useState('');
  const handlePreCourtSend = (msg, agent) => {
    const time = new Date().toLocaleTimeString();
    const id = Date.now() + Math.random();
    const senderRole = userRoles[caseDetails.id] || profile.name;
    setPreCourtChat(chat => [...chat, { id, caseId: caseDetails.id, agent, sender: senderRole, message: msg, time }]);
    setCaseInteractions(interactions => [...interactions, { caseId: caseDetails.id, type: 'pre-court-chat', agent, message: msg, timestamp: time }]);
    addNotification(`Pre-court message to ${agent}`);
    // Simulate AI agent response from the selected agent
    setTimeout(() => simulateAIResponse(agent, caseDetails.id, 'pre-court'), 1200);
  };
  // Live courtroom: track who is speaking
  const [currentSpeaker, setCurrentSpeaker] = useState('');

  // Utility: simulate AI agent response
  function simulateAIResponse(agentRole, caseId, chatType = 'courtroom') {
    const aiReplies = {
      Judge: 'The court has noted your message.',
      'Defense Attorney': 'I will review the evidence and respond.',
      Prosecutor: 'Objection noted. Please clarify your point.',
      Clerk: 'Court records have been updated.',
      Defendant: 'I maintain my innocence.',
      Witness: 'I am ready to testify.',
      Observer: 'I am observing the proceedings.',
      Police: 'Investigation details are available.',
      'AI Judge': 'The court has noted your message.',
      'AI Defense': 'I will review the evidence and respond.',
      'AI Prosecutor': 'Objection noted. Please clarify your point.',
      'AI Clerk': 'Court records have been updated.',
      'AI Defendant': 'I maintain my innocence.',
      'AI Witness': 'I am ready to testify.',
      'AI Observer': 'I am observing the proceedings.'
    };
    const reply = aiReplies[agentRole] || 'Thank you for your message.';
    const time = new Date().toLocaleTimeString();
    const id = Date.now() + Math.random();
    if (chatType === 'courtroom') {
      setCourtroomChat(chat => [...chat, { id, sender: agentRole, message: reply, time }]);
      setCaseInteractions(interactions => [...interactions, { caseId, type: 'chat', agent: agentRole, message: reply, timestamp: time }]);
      addNotification(`AI response from ${agentRole}`);
    } else if (chatType === 'pre-court') {
      setPreCourtChat(chat => [...chat, { id, caseId, agent: agentRole, sender: agentRole, message: reply, time }]);
      setCaseInteractions(interactions => [...interactions, { caseId, type: 'pre-court-chat', agent: agentRole, message: reply, timestamp: time }]);
      addNotification(`AI response from ${agentRole}`);
    }
  }

  // Add state for evidence filter and comparison
  const [evidenceFilter, setEvidenceFilter] = useState({ tag: '', relevance: '' });
  const [compareEvidence, setCompareEvidence] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Add state for evidence handling
  const [demoEvidence, setDemoEvidence] = useState([
    {
      id: 1,
      name: 'Document 1',
      type: 'document',
      url: 'https://example.com/doc1.pdf',
      tags: ['contract', 'agreement'],
      relevance: 'high'
    },
    {
      id: 2,
      name: 'Image 1',
      type: 'image',
      url: 'https://example.com/img1.jpg',
      tags: ['evidence', 'photo'],
      relevance: 'medium'
    }
  ]);

  // Add function to handle joining a case
  const handleJoinCase = (caseId) => {
    setJoinedCases(prev => [...prev, caseId]);
    showToast('You have joined the case.');
  };

  const handleUpdateRole = (caseId, newRole) => {
    setJoinedCases(prevCases => 
      prevCases.map(caseItem => 
        caseItem.id === caseId 
          ? { ...caseItem, userRole: newRole }
          : caseItem
      )
    );
  };

  const handleAddInteraction = (caseId, interaction) => {
    setJoinedCases(prevCases =>
      prevCases.map(caseItem =>
        caseItem.id === caseId
          ? {
              ...caseItem,
              interactions: [...(caseItem.interactions || []), interaction]
            }
          : caseItem
      )
    );
  };

  const handleAddEvidence = (caseId, evidence) => {
    setJoinedCases(prevCases =>
      prevCases.map(caseItem =>
        caseItem.id === caseId
          ? {
              ...caseItem,
              evidence: [...(caseItem.evidence || []), evidence]
            }
          : caseItem
      )
    );
  };

  // Handler to complete onboarding
  const handleCompleteOnboarding = (data) => {
    localStorage.setItem('kesi-onboarded', 'true');
    setShowNewCaseModal(false);
    // Optionally update user profile with onboarding data
    // if (data) { setProfile(prev => ({ ...prev, ...data })); }
  };

  // Add getCaseAgents function
  const getCaseAgents = (caseObj) => {
    // Mock implementation: return a list of agents for the given case
    return [
      { role: 'Judge', name: 'AI Judge', icon: agentIcons['Judge'] },
      { role: 'Prosecutor', name: 'AI Prosecutor', icon: agentIcons['Prosecutor'] },
      { role: 'Defense', name: 'AI Defense', icon: agentIcons['Defense'] },
      { role: 'Clerk', name: 'AI Clerk', icon: agentIcons['Clerk'] },
      { role: 'Defendant', name: 'AI Defendant', icon: agentIcons['Defendant'] },
      { role: 'Witness', name: 'AI Witness', icon: agentIcons['Witness'] },
    ];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800">KESI Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{user?.username || profile?.name}</span>
              <img
                src={profile?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'}
                alt="Profile"
                className="h-8 w-8 rounded-full"
              />
              </div>
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-4">
            {sections.map((s) => (
                  <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  section === s.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                  >
                <span className="mr-2">{s.icon}</span>
                {s.name}
                  </button>
                ))}
              </nav>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
                <ErrorBoundary>
                  <SectionPanel />
                </ErrorBoundary>
        </div>
      </div>

      {/* Modals */}
      {modal.open && (
        <Modal
          open={modal.open}
          onClose={closeModal}
          title={modal.title}
          type={modal.type}
          wide={modal.wide}
        >
          {modal.content}
        </Modal>
      )}

      {showNewCaseModal && (
        <Modal
          open={showNewCaseModal}
          onClose={() => setShowNewCaseModal(false)}
          title="Create New Case"
          wide={true}
        >
        <NewCaseModal
          onCreate={handleCreateCase}
          onClose={() => setShowNewCaseModal(false)}
        />
        </Modal>
      )}

      {/* Toast Notifications */}
      <Toast
        message={modal.content}
        onClose={() => setModal({ ...modal, content: null })}
      />
    </div>
  );
} 