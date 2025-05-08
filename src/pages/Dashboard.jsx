import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

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

const sidebarSections = [
  { id: 'overview', label: 'Overview', icon: '🏠' },
  { id: 'cases', label: 'Cases', icon: '📂' },
  { id: 'ai', label: 'AI Roleplay', icon: '🤖' },
  { id: 'feedback', label: 'Feedback', icon: '📊' },
  { id: 'evidence', label: 'Evidence', icon: '🧾' },
  { id: 'simulation', label: 'Simulation', icon: '🎬' },
  { id: 'learning', label: 'Learning', icon: '📚' },
  { id: 'community', label: 'Community', icon: '👥' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
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

export default function Dashboard() {
  const [section, setSection] = useState('overview');
  const [modal, setModal] = useState({ open: false, title: '', content: null, type: 'info', wide: false });
  const [selectedAgent, setSelectedAgent] = useState(demoAgents[0]);
  const [currentCaseId, setCurrentCaseId] = useState(demoActiveCases[0].id);
  const [chat, setChat] = useState({
    [demoActiveCases[0].id]: {
      Judge: [{ sender: 'AI Judge', text: 'Welcome to the courtroom. How can I help?' }],
      Prosecutor: [{ sender: 'AI Prosecutor', text: 'Ready to present the case.' }],
      Defense: [{ sender: 'AI Defense', text: 'Here to defend the client.' }],
      Police: [{ sender: 'AI Police', text: 'Investigation details available.' }],
      Clerk: [{ sender: 'AI Clerk', text: 'Court records are up to date.' }],
      Defendant: [{ sender: 'AI Defendant', text: 'I am innocent.' }],
      Witness: [{ sender: 'AI Witness', text: 'Ready to testify.' }],
    }
  });
  const [evidenceModal, setEvidenceModal] = useState(null);
  const [notifications, setNotifications] = useState(demoNotifications);
  const [activeCases, setActiveCases] = useState(demoActiveCases);
  const [uploadedCases, setUploadedCases] = useState(demoUploadedCases);
  const [badges, setBadges] = useState(demoBadges);
  const [skills, setSkills] = useState(demoSkills);
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [lastUserEmail, setLastUserEmail] = useState(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [toast, setToast] = useState('');
  const [caseDetails, setCaseDetails] = useState(null);
  const [joinedCases, setJoinedCases] = useState([]);
  const [userRoles, setUserRoles] = useState({}); // { [caseId]: role }
  const [showCaseIntro, setShowCaseIntro] = useState(true);

  // Get user from localStorage if available
  const user = JSON.parse(localStorage.getItem('kesi-user'));
  const defaultProfile = user
    ? {
        name: user.email.split('@')[0] || 'New User',
        role: user.rolePreference || 'Lawyer',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      }
    : { name: 'John Doe', role: 'Lawyer', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' };

  const [profile, setProfile] = useState(defaultProfile);

  // Initial values for resetting
  const initialActiveCases = [
    { id: 1, name: 'State vs. Smith', type: 'AI', role: 'Prosecutor', deadline: '2024-07-20', status: 'Ongoing' },
    { id: 2, name: 'Johnson Estate', type: 'Manual', role: 'Defense', deadline: '2024-07-25', status: 'Ongoing' },
    { id: 3, name: 'People vs. Doe', type: 'Historical', role: 'Judge', deadline: '2024-07-30', status: 'Ongoing' },
    { id: 4, name: 'AI v. Human', type: 'AI', role: 'Defense', deadline: '2024-08-01', status: 'Ongoing' },
    { id: 5, name: 'Legacy Case', type: 'Historical', role: 'Prosecutor', deadline: '2024-08-05', status: 'Ongoing' },
  ];
  const initialUploadedCases = [
    { id: 1, name: 'My Uploaded Case', type: 'Manual', evidence: 3 },
    { id: 2, name: 'Historic Land Dispute', type: 'Historical', evidence: 2 },
    { id: 3, name: 'AI Arbitration', type: 'AI', evidence: 1 },
    { id: 4, name: 'Estate Challenge', type: 'Manual', evidence: 4 },
    { id: 5, name: 'Old Court Records', type: 'Historical', evidence: 2 },
  ];
  const initialBadges = [
    { name: 'Case Starter', icon: '🏅' },
    { name: 'Objection Master', icon: '⚡' },
    { name: 'Evidence Pro', icon: '📑' },
  ];
  const initialSkills = [
    { name: 'Legal Arguments', value: 80 },
    { name: 'Objection Handling', value: 65 },
    { name: 'Cross-Examination', value: 72 },
  ];
  const initialChat = {
    1: {
      Judge: [{ sender: 'AI Judge', text: 'Welcome to the courtroom. How can I help?' }],
      Prosecutor: [{ sender: 'AI Prosecutor', text: 'Ready to present the case.' }],
      Defense: [{ sender: 'AI Defense', text: 'Here to defend the client.' }],
      Police: [{ sender: 'AI Police', text: 'Investigation details available.' }],
      Clerk: [{ sender: 'AI Clerk', text: 'Court records are up to date.' }],
      Defendant: [{ sender: 'AI Defendant', text: 'I am innocent.' }],
      Witness: [{ sender: 'AI Witness', text: 'Ready to testify.' }],
    }
  };

  // Reset dashboard state for new user
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('kesi-user'));
    if (user && user.email !== lastUserEmail) {
      setActiveCases([]);
      setUploadedCases([]);
      setBadges([]);
      setSkills([]);
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
      setShowOnboarding(true);
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

  // Add handler to create a new case
  const handleCreateCase = (name, type, area, location, storyline) => {
    const newId = Math.max(...activeCases.map(c => c.id), 0) + 1;
    setActiveCases(prev => [
      ...prev,
      {
        id: newId,
        name,
        type,
        area,
        location,
        storyline,
        role: 'Unassigned',
        deadline: 'TBD',
        status: 'Ongoing',
      },
    ]);
    setShowNewCaseModal(false);
    closeModal();
    showToast('Case created successfully!');
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
    setShowEditProfileModal(false);
  };

  // Onboarding Modal with avatar selection
  function OnboardingModal({ onComplete }) {
    const [step, setStep] = useState(0); // 0: avatar, 1: info
    const [avatar, setAvatar] = useState('https://randomuser.me/api/portraits/men/32.jpg');
    const [customAvatar, setCustomAvatar] = useState('');
    const [interests, setInterests] = useState('');
    const [goals, setGoals] = useState('');
    const avatarOptions = [
      'https://randomuser.me/api/portraits/men/32.jpg',
      'https://randomuser.me/api/portraits/women/44.jpg',
      'https://randomuser.me/api/portraits/men/45.jpg',
      'https://randomuser.me/api/portraits/women/46.jpg',
      'https://randomuser.me/api/portraits/men/47.jpg',
      'https://randomuser.me/api/portraits/women/48.jpg',
    ];
    return (
      <form onSubmit={e => { e.preventDefault(); if (step === 0) { setStep(1); } else { onComplete({ interests, goals, avatar }); } }}>
        {step === 0 && (
          <div>
            <div className="mb-2 font-semibold text-lg">Choose Your Avatar</div>
            <div className="flex gap-3 flex-wrap mb-4 justify-center">
              {avatarOptions.map(url => (
                <button
                  type="button"
                  key={url}
                  className={`rounded-full border-2 ${avatar === url ? 'border-blue-600' : 'border-transparent'} focus:outline-none`}
                  onClick={() => setAvatar(url)}
                >
                  <img src={url} alt="avatar" className="w-16 h-16 rounded-full" />
                </button>
              ))}
            </div>
            <div className="mb-2 text-sm text-gray-700">Or enter a custom avatar URL:</div>
            <input
              className="border border-gray-300 rounded px-2 py-1 w-full mb-4"
              value={customAvatar}
              onChange={e => setCustomAvatar(e.target.value)}
              placeholder="Custom avatar URL"
              onBlur={() => { if (customAvatar) setAvatar(customAvatar); }}
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">Next</button>
          </div>
        )}
        {step === 1 && (
          <div>
            <div className="mb-2 font-semibold text-lg">Welcome to KESI!</div>
            <div className="mb-2 text-sm text-gray-700">Tell us a bit about your interests and goals to personalize your experience.</div>
            <input
              className="border border-gray-300 rounded px-2 py-1 w-full mb-2"
              value={interests}
              onChange={e => setInterests(e.target.value)}
              placeholder="Your interests (e.g., criminal law, advocacy, AI)"
            />
            <input
              className="border border-gray-300 rounded px-2 py-1 w-full mb-4"
              value={goals}
              onChange={e => setGoals(e.target.value)}
              placeholder="Your goals (e.g., become a top litigator, learn AI law)"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">Get Started</button>
          </div>
        )}
      </form>
    );
  }

  const handleCompleteOnboarding = (data) => {
    // Save onboarding data to localStorage (or backend)
    const user = JSON.parse(localStorage.getItem('kesi-user'));
    if (user) {
      user.interests = data.interests;
      user.goals = data.goals;
      user.avatar = data.avatar;
      localStorage.setItem('kesi-user', JSON.stringify(user));
    }
    setProfile(prev => ({ ...prev, avatar: data.avatar }));
    localStorage.setItem('kesi-onboarded', 'true');
    setShowOnboarding(false);
    showToast('Onboarding completed!');
  };

  // Sidebar navigation
  function Sidebar() {
    return (
      <aside className="bg-white shadow h-full w-20 md:w-56 flex flex-col py-4 px-2 md:px-4">
        <div className="mb-8 flex flex-col items-center md:items-start">
          <img src={profile.avatar} alt="avatar" className="w-12 h-12 rounded-full mb-2" />
          <div className="font-bold text-gray-800 text-center md:text-left">{profile.name}</div>
          <div className="text-xs text-gray-500 text-center md:text-left">{profile.role}</div>
        </div>
        <nav className="flex-1 flex flex-col gap-2">
          {sidebarSections.map(sec => (
                <button
              key={sec.id}
              className={`flex items-center gap-2 px-2 py-2 rounded hover:bg-blue-50 transition text-left ${section === sec.id ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700'}`}
              onClick={() => setSection(sec.id)}
            >
              <span className="text-xl">{sec.icon}</span>
              <span className="hidden md:inline">{sec.label}</span>
                </button>
              ))}
            </nav>
      </aside>
    );
  }

  // Topbar with notifications
  function Topbar() {
    return (
      <header className="bg-white shadow flex items-center justify-between px-4 py-2">
        <div className="font-bold text-blue-700 text-xl">KESI Dashboard</div>
        <div className="flex items-center gap-4">
          <button onClick={() => setSection('notifications')} className="relative">
            <span className="text-2xl">🔔</span>
            {notifications.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">{notifications.length}</span>}
          </button>
          </div>
      </header>
    );
  }

  // Section panels
  function SectionPanel() {
    switch (section) {
      case 'overview':
        return (
          <div className="p-4 space-y-6">
            {showOnboarding && (
              <Modal open={true} onClose={() => setShowOnboarding(false)} title="Welcome to KESI" type="info" wide={false}>
                <OnboardingModal onComplete={handleCompleteOnboarding} />
              </Modal>
            )}
            {caseDetails && (
              <Modal open={true} onClose={() => setCaseDetails(null)} title={caseDetails.name} type="info" wide={true}>
                <div className="max-w-5xl w-full mx-auto p-2 md:p-0">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Left column: agents, evidence, pre-court chat */}
                    <div className="flex-1 min-w-[320px] max-w-[400px]">
                      <div className="mb-4">
                        <div className="font-semibold mb-1">Agents Involved:</div>
                        <div className="flex gap-3 flex-wrap items-center">
                          {getCaseAgents(caseDetails).map((agent, idx) => (
                            <div key={idx} className="flex flex-col items-center text-xs">
                              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 mb-1">
                                {typeof agent.avatar === 'string' ? <span className="text-2xl">{agent.avatar}</span> : agent.avatar}
                              </div>
                              <div className="font-semibold text-blue-700">{agent.role}</div>
                              <div className="text-gray-500">{agent.name}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="font-semibold mb-1">Evidence:</div>
                        <div className="flex flex-wrap gap-3">
                          {(evidence[caseDetails.id] || []).map(ev => (
                            <div key={ev.id} className="bg-white border rounded p-2 flex flex-col items-center w-32 shadow-sm">
                              <div className="font-medium text-gray-800 text-xs mb-1">{ev.name}</div>
                              {ev.type === 'image' && <img src={ev.url} alt={ev.name} className="w-20 h-14 object-cover rounded mb-1" />}
                              {ev.type === 'video' && <video src={ev.url} controls className="w-20 h-14 rounded mb-1" />}
                              {ev.type === 'document' && <img src={ev.url} alt={ev.name} className="w-20 h-14 object-cover rounded mb-1" />}
                              {ev.type === 'text' && <div className="text-xs text-gray-600 italic">{ev.text}</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Pre-court chat */}
                      <div className="mb-4">
                        <div className="font-semibold mb-1">Pre-Court Chat</div>
                        <div className="flex gap-2 mb-2">
                          <select className="border border-gray-300 rounded px-2 py-1 text-xs" value={preCourtRecipient} onChange={e => setPreCourtRecipient(e.target.value)}>
                            <option value="">Select Agent</option>
                            {getCaseAgents(caseDetails).map(a => (
                              <option key={a.role} value={a.role}>{a.role}</option>
                            ))}
                          </select>
                          <form className="flex-1 flex gap-2" onSubmit={e => { e.preventDefault(); const val = e.target.elements.msg.value; if (val && preCourtRecipient) { handlePreCourtSend(val, preCourtRecipient); e.target.reset(); } }}>
                            <input name="msg" className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs" placeholder="Message..." />
                            <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs">Send</button>
                          </form>
                        </div>
                        <div className="bg-gray-50 rounded p-2 h-24 overflow-y-auto text-xs text-gray-700" style={{ maxHeight: 96 }}>
                          {preCourtChat.filter(m => m.caseId === caseDetails.id).map((msg, idx) => (
                            <div key={idx}><span className="font-semibold text-blue-700">To {msg.agent}</span>: {msg.message} <span className="text-gray-400">({msg.time})</span></div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* Right column: details, calendar, twists, etc. */}
                    <div className="flex-1 min-w-[320px]">
                      <div className="mb-2 text-sm text-gray-500">{caseDetails.type} • {caseDetails.area} • {caseDetails.location} • Deadline: {caseDetails.deadline}</div>
                      <div className="mb-2 text-xs text-gray-700 flex gap-4">
                        <span>Status: <span className="font-semibold text-blue-700">{caseDetails.status || 'Ongoing'}</span></span>
                        <span>Participants: <span className="font-semibold text-blue-700">{getCaseAgents(caseDetails).length}</span></span>
                        <span>Last Activity: <span className="font-semibold text-blue-700">{caseInteractions.filter(i => i.caseId === caseDetails.id).slice(-1)[0]?.timestamp || 'N/A'}</span></span>
                      </div>
                      {caseDetails.storyline && <div className="mb-4 bg-blue-50 rounded p-3 text-gray-700 italic">{caseDetails.storyline}</div>}
                      {joinedCases.includes(caseDetails.id) ? (
                        <>
                          <div className="mb-4">
                            <div className="font-semibold mb-1">Your Role:</div>
                            <div className="flex gap-2 items-center">
                              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">{userRoles[caseDetails.id] || 'Participant'}</span>
                              <select
                                className="border border-gray-300 rounded px-2 py-1 text-xs"
                                value={userRoles[caseDetails.id] || ''}
                                onChange={e => { setUserRoles(r => ({ ...r, [caseDetails.id]: e.target.value })); addNotification(`Role changed to ${e.target.value}`); setCaseInteractions(interactions => [...interactions, { caseId: caseDetails.id, type: 'role', agent: profile.name, message: `Role changed to ${e.target.value}`, timestamp: new Date().toLocaleTimeString() }]); }}
                              >
                                <option value="">Select Role</option>
                                {getAvailableRoles(caseDetails).map(role => (
                                  <option key={role} value={role}>{role}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          {userRoles[caseDetails.id] && (
                            <div className="mb-4 bg-green-50 border border-green-200 rounded p-3 text-green-800 flex items-center gap-2">
                              <span className="text-xl">➡️</span>
                              <span>{roleNextSteps[userRoles[caseDetails.id]] || 'You can now chat with AI agents, upload evidence, or participate in the case.'}</span>
                            </div>
                          )}
                          {/* Calendar */}
                          <div className="mb-4">
                            <div className="font-semibold mb-1">Court Calendar:</div>
                            <div className="bg-gray-50 rounded p-3 mb-2">
                              <ul className="text-xs text-gray-700">
                                {calendarEvents.filter(ev => ev.caseId === caseDetails.id).map((ev, idx) => (
                                  <li key={idx}><span className="font-semibold text-blue-700">{ev.date}:</span> {ev.title}</li>
                                ))}
                              </ul>
                              <form className="flex gap-2 mt-2" onSubmit={e => { e.preventDefault(); const date = e.target.elements.date.value; const title = e.target.elements.title.value; if (date && title) { handleAddEvent(caseDetails.id, date, title); e.target.reset(); } }}>
                                <input type="date" name="date" className="border border-gray-300 rounded px-2 py-1 text-xs" />
                                <input type="text" name="title" className="border border-gray-300 rounded px-2 py-1 text-xs" placeholder="Event Title" />
                                <button type="submit" className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700">Add</button>
                              </form>
                            </div>
                          </div>
                          {/* Twist */}
                          <div className="mb-4">
                            <button className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 mr-2" onClick={handleCaseTwist}>Add Twist</button>
                            <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700" onClick={() => setShowCourtroom(true)}>Live Courtroom</button>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700" onClick={() => { setJoinedCases(jc => jc.filter(id => id !== caseDetails.id)); showToast('You left the case.'); }}>Leave Case</button>
                            <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400" onClick={() => setCaseDetails(null)}>Close</button>
                          </div>
                          {/* Live Courtroom Modal */}
                          {showCourtroom && (
                            <Modal open={true} onClose={() => setShowCourtroom(false)} title="Live Courtroom" type="info" wide={true}>
                              <div className="flex flex-col md:flex-row gap-8">
                                {/* Left: participants and timeline */}
                                <div className="flex-1 min-w-[320px] max-w-[400px]">
                                  <div className="mb-4 font-semibold">Courtroom Participants</div>
                                  <div className="flex gap-4 flex-wrap mb-4">
                                    {getCaseAgents(caseDetails).map((agent, idx) => (
                                      <div key={idx} className="flex flex-col items-center text-xs">
                                        <div className={`w-12 h-12 flex items-center justify-center rounded-full mb-1 ${currentSpeaker === agent.role ? 'bg-green-200 border-2 border-green-600' : 'bg-blue-100'}`}
                                          style={{ transition: 'all 0.2s' }}>
                                          {typeof agent.avatar === 'string' ? <span className="text-2xl">{agent.avatar}</span> : agent.avatar}
                                        </div>
                                        <div className="font-semibold text-blue-700">{agent.role}</div>
                                        <div className="text-gray-500">{agent.name}</div>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="mb-4 font-semibold">Proceedings Timeline</div>
                                  <ul className="mb-4 text-xs text-gray-700">
                                    {courtroomTimeline.map((item, idx) => (
                                      <li key={idx}><span className="font-semibold text-blue-700">{item.time}:</span> {item.action}</li>
                                    ))}
                                  </ul>
                                </div>
                                {/* Right: chat */}
                                <div className="flex-1 min-w-[320px]">
                                  <div className="mb-4 font-semibold">Courtroom Chat</div>
                                  <div className="bg-gray-50 rounded p-3 mb-2 h-40 overflow-y-auto text-xs text-gray-700" style={{ maxHeight: 160 }}>
                                    {courtroomChat.map((msg, idx) => (
                                      <div key={idx}><span className="font-semibold text-blue-700">{msg.sender}</span>: {msg.message} <span className="text-gray-400">({msg.time})</span></div>
                                    ))}
                                  </div>
                                  <form className="flex gap-2 mb-2" onSubmit={e => { e.preventDefault(); const val = e.target.elements.msg.value; const recipient = e.target.elements.recipient.value; if (val) { handleCourtroomSend(val + (recipient ? ` (private to ${recipient})` : ''), userRoles[caseDetails.id] || profile.name); setCurrentSpeaker(userRoles[caseDetails.id] || profile.name); e.target.reset(); } }}>
                                    <input name="msg" className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs" placeholder="Type a message..." />
                                    <select name="recipient" className="border border-gray-300 rounded px-2 py-1 text-xs">
                                      <option value="">To All</option>
                                      {getCaseAgents(caseDetails).map(a => (
                                        <option key={a.role} value={a.role}>{a.role}</option>
                                      ))}
                                    </select>
                                    <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs">Send</button>
                                  </form>
                                  <div className="mb-2 text-xs text-gray-500">Select a recipient for private messages, or leave as 'To All'.</div>
                                  <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 mt-4" onClick={() => setShowCourtroom(false)}>Close</button>
                                </div>
                              </div>
                            </Modal>
                          )}
                        </>
                      ) : (
                        <div className="flex gap-2 mt-4">
                          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => { setJoinedCases(jc => [...jc, caseDetails.id]); showToast('You joined the case!'); }}>Join Case</button>
                          <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400" onClick={() => setCaseDetails(null)}>Close</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Modal>
            )}
            {/* Profile & Progress */}
            <div className="bg-white rounded shadow p-4 flex flex-col md:flex-row gap-6 items-center">
              <div className="relative">
              <img src={profile.avatar} alt="avatar" className="w-20 h-20 rounded-full border-4 border-blue-100" />
                <button
                  className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 shadow hover:bg-blue-700"
                  title="Edit Profile"
                  onClick={() => setShowEditProfileModal(true)}
                  style={{ fontSize: 16 }}
                >
                  ✏️
                </button>
              </div>
              <div className="flex-1">
                <div className="text-xl font-bold text-gray-800">{profile.name}</div>
                <div className="text-sm text-gray-500 mb-2">Role: {profile.role}</div>
                <div className="flex gap-4 mb-2 items-center">
                  <div>Ongoing Cases: <span className="inline-block bg-blue-600 text-white rounded-full px-3 py-1 text-xs font-semibold ml-1">{activeCases.length}</span></div>
                  <div>Completed: <span className="inline-block bg-green-600 text-white rounded-full px-3 py-1 text-xs font-semibold ml-1">3</span></div>
                </div>
                {/* Styled Skills Card */}
                <div className="mb-2">Skill Improvement:</div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {skills.map(skill => (
                    <div key={skill.name} className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 flex flex-col items-center w-32 shadow-sm">
                      <span className="text-xs text-blue-700 font-semibold mb-1">{skill.name}</span>
                      <div className="w-full bg-gray-200 rounded h-2 mb-1">
                        <div className="bg-blue-600 h-2 rounded" style={{ width: skill.value + '%' }}></div>
                      </div>
                      <span className="text-xs text-gray-700">{skill.value}%</span>
                    </div>
                  ))}
                    </div>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {badges.map(b => (
                    <span key={b.name} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold">{b.icon} {b.name}</span>
                        ))}
                      </div>
                    </div>
                  </div>
            {/* Active Cases with Avatars - styled card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-4 border border-blue-100">
              <div className="font-bold mb-4 text-lg text-blue-800 flex items-center gap-2">
                <span className="text-2xl">📂</span> Active Cases
              </div>
              <ul className="space-y-3">
                {activeCases.map(c => (
                  <li key={c.id} className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3 shadow-sm border border-blue-200 hover:shadow-md transition-all cursor-pointer" onClick={() => setCaseDetails(c)}>
                    <div className="flex items-center gap-3">
                      {/* Case Avatar */}
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: '#4f46e5',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: 18,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                      }}>{c.name.charAt(0)}</div>
                      <div>
                        <div className="font-semibold text-blue-700 text-base">{c.name}</div>
                        <div className="text-xs text-gray-500">{c.type} • {c.area} • {c.location}</div>
                        {c.storyline && <div className="text-xs text-gray-600 mt-1 italic">{c.storyline}</div>}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      <div>Role: <span className="font-semibold text-blue-700">{c.role}</span></div>
                      <div>Deadline: {c.deadline}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* Uploaded Cases with Evidence */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
              <div className="font-bold mb-4 text-lg text-blue-800 flex items-center gap-2">
                <span className="text-2xl">🧾</span> Uploaded Case Files
              </div>
              <ul className="space-y-3">
                {uploadedCases.map(c => (
                  <li key={c.id} className="bg-blue-50 rounded-xl px-4 py-3 shadow-sm border border-blue-200 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: '#6366f1',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: 18,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                      }}>{c.name.charAt(0)}</div>
                      <div>
                        <div className="font-semibold text-blue-700 text-base">{c.name}</div>
                        <div className="text-xs text-gray-500">{c.type} • Evidence: {c.evidence}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 mb-2">
                      {(evidence[c.id] || []).map(ev => (
                        <div key={ev.id} className="bg-white border rounded p-2 flex flex-col items-center w-32 shadow-sm">
                          <div className="font-medium text-gray-800 text-xs mb-1">{ev.name}</div>
                          {ev.type === 'image' && <img src={ev.url} alt={ev.name} className="w-20 h-14 object-cover rounded mb-1" />}
                          {ev.type === 'video' && <video src={ev.url} controls className="w-20 h-14 rounded mb-1" />}
                          {ev.type === 'document' && <img src={ev.url} alt={ev.name} className="w-20 h-14 object-cover rounded mb-1" />}
                          {ev.type === 'text' && <div className="text-xs text-gray-600 italic">{ev.text}</div>}
                        </div>
                      ))}
                    </div>
                    <form className="flex items-center gap-2" onSubmit={e => {
                      e.preventDefault();
                      const file = e.target.elements.evidence.files[0];
                      const tags = e.target.elements.tags.value.split(',').map(t => t.trim()).filter(Boolean);
                      const relevance = e.target.elements.relevance.value;
                      handleUploadEvidence(c.id, file, tags, relevance);
                      e.target.reset();
                    }}>
                      <input type="file" name="evidence" className="text-xs" accept="image/*,video/*,.pdf,.doc,.docx,.txt" />
                      <input type="text" name="tags" placeholder="tags (comma separated)" className="text-xs border rounded px-1" />
                      <select name="relevance" className="text-xs border rounded px-1">
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                      <button type="submit" className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700">Upload Evidence</button>
                    </form>
                  </li>
                ))}
              </ul>
            </div>
            {showEditProfileModal && (
              <Modal open={true} onClose={() => setShowEditProfileModal(false)} title="Edit Profile" type="info" wide={false}>
                <EditProfileModal profile={profile} onSave={handleSaveProfile} onClose={() => setShowEditProfileModal(false)} />
              </Modal>
            )}
                </div>
        );
      case 'cases':
        return (
          <div className="p-4 space-y-6">
            {/* Active Cases */}
            <div className="bg-white rounded shadow p-4 mb-4">
              <div className="font-bold mb-2">Active Cases</div>
              <ul>
                {activeCases.map(c => (
                  <li key={c.id} className="flex items-center justify-between border-b py-2">
                    <div>
                      <span className="font-semibold text-blue-700">{c.name}</span> <span className="text-xs text-gray-500">({c.role})</span>
                    </div>
                    <div className="text-xs text-gray-500">Deadline: {c.deadline}</div>
                  </li>
                ))}
              </ul>
            </div>
            {/* Uploaded Cases */}
            <div className="bg-white rounded shadow p-4">
              <div className="font-bold mb-2">Uploaded Case Files</div>
              <ul>
                {uploadedCases.map(c => (
                  <li key={c.id} className="flex items-center justify-between border-b py-2">
                    <span>{c.name}</span>
                    <span className="text-xs text-gray-500">Evidence: {c.evidence}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => setShowNewCaseModal(true)}>New Case</button>
              {showNewCaseModal && (
                <Modal open={true} onClose={() => setShowNewCaseModal(false)} title="Create New Case" type="info" wide={true}>
                  <NewCaseModal onCreate={handleCreateCase} onClose={() => setShowNewCaseModal(false)} />
                </Modal>
              )}
            </div>
          </div>
        );
      case 'ai':
        return (
          <div className="p-4 space-y-6">
            {/* Case Selection (if multiple cases) */}
            <div className="bg-white rounded shadow p-4 mb-4">
              <div className="font-bold mb-2">Select Case</div>
              <div className="flex gap-2 flex-wrap">
                {demoActiveCases.map(c => (
                  <button
                    key={c.id}
                    className={`px-3 py-2 rounded border ${currentCaseId === c.id ? 'bg-blue-100 border-blue-600' : 'border-gray-200'} hover:bg-blue-50`}
                    onClick={() => setCurrentCaseId(c.id)}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
            {/* Role Selection */}
            <div className="bg-white rounded shadow p-4 mb-4">
              <div className="font-bold mb-2">Select Role</div>
              <div className="flex gap-2 flex-wrap">
                {demoAgents.map(agent => (
                  <button key={agent.role} className={`flex items-center gap-2 px-3 py-2 rounded border ${selectedAgent.role === agent.role ? 'bg-blue-100 border-blue-600' : 'border-gray-200'} hover:bg-blue-50`} onClick={() => setSelectedAgent(agent)}>
                    <span className="text-2xl">{agentIcons[agent.role]}</span>
                    <span>{agent.role}</span>
                  </button>
                ))}
              </div>
                    </div>
            {/* Only allow chat if user is joined to the selected case */}
            {joinedCases.includes(currentCaseId) ? (
            <div className="bg-white rounded shadow p-4">
              <div className="font-bold mb-2">AI Agent Chat ({selectedAgent.role})</div>
                <div className="flex gap-2 mb-2">
                  <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 text-xs font-semibold" onClick={() => handleSendChat('Can you answer this question?')}>Question</button>
                  <button className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded hover:bg-yellow-200 text-xs font-semibold" onClick={() => handleSendChat('Objection!')}>Object</button>
                  <button className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 text-xs font-semibold" onClick={() => handleSendChat('Here is my argument...')}>Make Argument</button>
                </div>
              <div className="bg-gray-50 rounded p-3 mb-2 h-40 overflow-y-auto flex flex-col gap-1">
                  {(chat[currentCaseId]?.[selectedAgent.role] || []).map((msg, idx) => (
                  <div key={idx} className={msg.sender === 'You' ? 'text-right' : 'text-left'}>
                    <span className={`inline-block px-2 py-1 rounded ${msg.sender === 'You' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-700'}`}>{msg.sender}: {msg.text}</span>
                  </div>
                ))}
              </div>
              <form className="flex gap-2" onSubmit={e => { e.preventDefault(); handleSendChat(e.target.chat.value); e.target.reset(); }}>
                <input name="chat" className="flex-1 border border-gray-300 rounded px-2 py-1" placeholder={`Ask ${selectedAgent.role} a question...`} />
                <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Send</button>
              </form>
            </div>
            ) : (
              <div className="bg-white rounded shadow p-4 text-center text-gray-500">Join a case to access chat and participate.</div>
            )}
          </div>
        );
      case 'feedback':
        return (
          <div className="p-4 space-y-6">
            <div className="bg-white rounded shadow p-4 mb-4">
              <div className="font-bold mb-2">Live Feedback</div>
              <div className="mb-2">Legal Arguments: <span className="text-green-700">Excellent</span></div>
              <div className="mb-2">Objection Handling: <span className="text-yellow-700">Needs Improvement</span></div>
              <div className="mb-2">Case Handling: <span className="text-blue-700">Good</span></div>
              <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={handleViewScore}>View Score Report</button>
                      </div>
            <div className="bg-white rounded shadow p-4">
              <div className="font-bold mb-2">Suggestions for Improvement</div>
              <ul className="list-disc ml-6 text-sm text-gray-700">
                <li>Practice objection handling in the simulation tools.</li>
                <li>Review cross-examination guides in Learning Resources.</li>
                <li>Participate in group practice for peer feedback.</li>
              </ul>
                      </div>
                    </div>
        );
      case 'evidence':
        return (
          <div className="p-4 space-y-6">
            <div className="bg-white rounded shadow p-4 mb-4">
              <div className="font-bold mb-2">Evidence Uploads</div>
              {/* Evidence Filter Bar */}
              <div className="flex gap-2 mb-4">
                <input
                  className="border border-gray-300 rounded px-2 py-1 text-xs"
                  placeholder="Filter by tag..."
                  value={evidenceFilter.tag}
                  onChange={e => setEvidenceFilter(f => ({ ...f, tag: e.target.value }))}
                />
                <select
                  className="border border-gray-300 rounded px-2 py-1 text-xs"
                  value={evidenceFilter.relevance}
                  onChange={e => setEvidenceFilter(f => ({ ...f, relevance: e.target.value }))}
                >
                  <option value="">All Relevance</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                {compareEvidence.length === 2 && (
                  <button className="bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700" onClick={() => setShowCompareModal(true)}>
                    Compare Selected ({compareEvidence.length})
                  </button>
                )}
                {compareEvidence.length > 0 && (
                  <button className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-400" onClick={() => setCompareEvidence([])}>
                    Clear Selection
                  </button>
                )}
              </div>
              <div className="flex gap-4 flex-wrap">
                {demoEvidence
                  .filter(ev =>
                    (!evidenceFilter.tag || (ev.tags && ev.tags.some(t => t.toLowerCase().includes(evidenceFilter.tag.toLowerCase())))) &&
                    (!evidenceFilter.relevance || ev.relevance === evidenceFilter.relevance)
                  )
                  .map(ev => (
                    <div key={ev.id} className={`bg-gray-50 border rounded shadow p-2 w-40 flex flex-col items-center ${compareEvidence.some(e => e.id === ev.id) ? 'ring-2 ring-purple-600' : ''}`}>
                    <div className="font-medium text-gray-800 text-sm mb-1">{ev.name}</div>
                    {ev.type === 'image' && <img src={ev.url} alt={ev.name} className="w-24 h-16 object-cover rounded mb-2" onClick={() => handleViewEvidence(ev)} style={{ cursor: 'pointer' }} />}
                    {ev.type === 'document' && <img src={ev.url} alt={ev.name} className="w-24 h-16 object-cover rounded mb-2" onClick={() => handleViewEvidence(ev)} style={{ cursor: 'pointer' }} />}
                    {ev.type === 'video' && <video src={ev.url} controls className="w-24 h-16 rounded mb-2" onClick={() => handleViewEvidence(ev)} style={{ cursor: 'pointer' }} />}
                      <div className="text-xs text-gray-500 mb-1">Tags: {ev.tags?.join(', ') || 'None'}</div>
                      <div className="text-xs text-gray-500 mb-1">Relevance: {ev.relevance || 'N/A'}</div>
                      <button
                        className={`mt-1 px-2 py-1 rounded text-xs ${compareEvidence.some(e => e.id === ev.id) ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        onClick={() => {
                          setCompareEvidence(sel => {
                            if (sel.some(e => e.id === ev.id)) return sel.filter(e => e.id !== ev.id);
                            if (sel.length < 2) return [...sel, ev];
                            return sel;
                          });
                        }}
                        disabled={compareEvidence.length === 2 && !compareEvidence.some(e => e.id === ev.id)}
                      >
                        {compareEvidence.some(e => e.id === ev.id) ? 'Selected' : 'Select for Compare'}
                      </button>
                  </div>
                ))}
              </div>
              {/* Only allow evidence upload if user is joined to any case */}
              {joinedCases.length > 0 ? (
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Upload Evidence</button>
              ) : (
                <div className="mt-4 text-gray-500 text-center">Join a case to upload evidence.</div>
              )}
            </div>
            <div className="bg-white rounded shadow p-4">
              <div className="font-bold mb-2">Evidence Viewer</div>
              <div className="text-sm text-gray-500">Click on any evidence item to view details.</div>
                    </div>
            {/* Evidence Comparison Modal */}
            {showCompareModal && (
              <Modal open={true} onClose={() => setShowCompareModal(false)} title="Compare Evidence" type="info" wide={true}>
                <div className="flex gap-8">
                  {compareEvidence.map(ev => (
                    <div key={ev.id} className="flex-1 min-w-[200px] max-w-xs bg-gray-50 rounded-lg shadow p-4">
                      <div className="font-bold mb-2">{ev.name}</div>
                      {ev.type === 'image' && <img src={ev.url} alt={ev.name} className="w-full rounded mb-2" />}
                      {ev.type === 'document' && <img src={ev.url} alt={ev.name} className="w-full rounded mb-2" />}
                      {ev.type === 'video' && <video src={ev.url} controls className="w-full rounded mb-2" />}
                      <div className="text-xs text-gray-500 mb-1">Tags: {ev.tags?.join(', ') || 'None'}</div>
                      <div className="text-xs text-gray-500 mb-1">Relevance: {ev.relevance || 'N/A'}</div>
                      <div className="text-xs text-gray-500 mb-1">Chain of Custody:</div>
                      <ul className="text-xs text-gray-700 pl-4 list-disc mb-2">
                        {ev.chainOfCustody?.map((log, idx) => (
                          <li key={idx}>{log.action} by {log.user} at {log.timestamp}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Modal>
            )}
                  </div>
        );
      case 'simulation':
        return (
          <div className="p-4 space-y-6">
            <div className="bg-white rounded shadow p-4 mb-4 flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1">
                <div className="font-bold mb-2">Courtroom Controls</div>
                <div className="flex gap-2 mb-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Start</button>
                  <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">Pause</button>
                  <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">Restart</button>
                  <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">⏩ Fast-Forward</button>
                  <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">⏪ Rewind</button>
                </div>
                <button className="mt-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700" onClick={handleCaseTwist}>Case Twist Generator</button>
              </div>
              <div className="flex-1">
                <div className="font-bold mb-2">Simulation Preview</div>
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">Simulation Video/Preview</div>
                        </div>
                        </div>
                      </div>
        );
      case 'learning':
        return (
          <div className="p-4 space-y-6">
            <div className="bg-white rounded shadow p-4 mb-4">
              <div className="font-bold mb-2">Tutorials & Guides</div>
              <ul className="list-disc ml-6 text-sm text-blue-700">
                <li><a href="#">Video: How to Handle Objections</a></li>
                <li><a href="#">Case Study: Landmark Supreme Court Case</a></li>
                <li><a href="#">Guide: Building Persuasive Arguments</a></li>
              </ul>
            </div>
            <div className="bg-white rounded shadow p-4">
              <div className="font-bold mb-2">Case Library</div>
              <ul className="list-disc ml-6 text-sm text-blue-700">
                <li><a href="#">Historical Case: Brown v. Board of Education</a></li>
                <li><a href="#">AI-Generated Case: The Missing Brief</a></li>
              </ul>
                    </div>
                  </div>
        );
      case 'community':
        return (
          <div className="p-4 space-y-6">
            <div className="bg-white rounded shadow p-4 mb-4">
              <div className="font-bold mb-2">Group Practice</div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Join Practice Group</button>
            </div>
            <div className="bg-white rounded shadow p-4 mb-4">
              <div className="font-bold mb-2">Forum & Q&A</div>
              {demoForumLinks.map(link => (
                <a key={link.href} href={link.href} className="block text-blue-700 underline mb-1">{link.label}</a>
              ))}
                    </div>
            <div className="bg-white rounded shadow p-4">
              <div className="font-bold mb-2">Mentorship</div>
              {demoMentorship.map(m => (
                <div key={m.name} className="flex items-center gap-2 mb-2">
                  <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full" />
                  <div>
                    <div className="font-medium text-gray-800">{m.name}</div>
                    <div className="text-xs text-gray-500">{m.role}</div>
                  </div>
                  <button className="ml-2 bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-xs">Connect</button>
                </div>
              ))}
                    </div>
                  </div>
        );
      case 'notifications':
        return (
          <div className="p-4 space-y-6">
            <div className="bg-white rounded shadow p-4 mb-4">
              <div className="font-bold mb-2">Case Updates</div>
              <ul>
                {notifications.filter(n => n.type === 'case').map(n => (
                  <li key={n.id} className="mb-1 text-sm text-gray-700">{n.message} <span className="text-xs text-gray-400">({n.date})</span></li>
                ))}
              </ul>
                </div>
            <div className="bg-white rounded shadow p-4">
              <div className="font-bold mb-2">System Announcements</div>
              <ul>
                {notifications.filter(n => n.type === 'system').map(n => (
                  <li key={n.id} className="mb-1 text-sm text-gray-700">{n.message} <span className="text-xs text-gray-400">({n.date})</span></li>
                ))}
              </ul>
              </div>
          </div>
        );
      default:
        return <div className="p-4">Section not found.</div>;
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
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  // Helper to get agents for a case (including user if joined, with their chosen role)
  function getCaseAgents(caseObj) {
    const baseAgents = [
      { role: 'Judge', name: 'AI Judge', avatar: agentIcons['Judge'] },
      { role: 'Prosecutor', name: 'AI Prosecutor', avatar: agentIcons['Prosecutor'] },
      { role: 'Defense Attorney', name: 'AI Defense', avatar: agentIcons['Defense'] },
      { role: 'Clerk', name: 'AI Clerk', avatar: agentIcons['Clerk'] },
      { role: 'Defendant', name: 'AI Defendant', avatar: agentIcons['Defendant'] },
      { role: 'Witness', name: 'AI Witness', avatar: agentIcons['Witness'] },
      { role: 'Observer', name: 'AI Observer', avatar: '👀' },
    ];
    // Insert user as an agent with their chosen role if joined
    return [
      ...(joinedCases.includes(caseObj.id) && userRoles[caseObj.id]
        ? [{ role: userRoles[caseObj.id], name: profile.name, avatar: <img src={profile.avatar} alt="avatar" className="w-8 h-8 rounded-full" /> }]
        : []),
      ...baseAgents.filter(a => a.role !== userRoles[caseObj.id])
    ];
  }

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
  const [compareEvidence, setCompareEvidence] = useState([]); // array of evidence objects
  const [showCompareModal, setShowCompareModal] = useState(false);

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-blue-50 to-white">
      <Toast message={toast} onClose={() => setToast('')} />
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <SectionPanel />
        </main>
      </div>
      <Modal open={modal.open} onClose={closeModal} title={modal.title} type={modal.type} wide={modal.wide}>
        {modal.content}
      </Modal>
    </div>
  );
} 