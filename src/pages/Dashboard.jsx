import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Modal({ open, onClose, title, children, type = 'info', wide }) {
  if (!open) return null;
  const accent = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className={`relative ${wide ? 'max-w-2xl' : 'max-w-md'} w-full rounded-2xl shadow-2xl bg-white animate-fadeIn`}>
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
  { id: 1, name: 'State vs. Smith', role: 'Prosecutor', deadline: '2024-07-20', status: 'Ongoing' },
  { id: 2, name: 'Johnson Estate', role: 'Defense', deadline: '2024-07-25', status: 'Ongoing' },
];

const demoUploadedCases = [
  { id: 1, name: 'My Uploaded Case', evidence: 3 },
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
  { id: 1, name: 'Photo', type: 'image', url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80' },
  { id: 2, name: 'Contract', type: 'document', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80' },
  { id: 3, name: 'Video', type: 'video', url: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4' },
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

export default function Dashboard() {
  const [section, setSection] = useState('overview');
  const [modal, setModal] = useState({ open: false, title: '', content: null, type: 'info', wide: false });
  const [selectedAgent, setSelectedAgent] = useState(demoAgents[0]);
  const [chat, setChat] = useState([{ sender: 'AI Judge', text: 'Welcome to the courtroom. How can I help?' }]);
  const [evidenceModal, setEvidenceModal] = useState(null);
  const [notifications, setNotifications] = useState(demoNotifications);
  const [activeCases, setActiveCases] = useState(demoActiveCases);
  const [uploadedCases, setUploadedCases] = useState(demoUploadedCases);
  const [badges, setBadges] = useState(demoBadges);
  const [skills, setSkills] = useState(demoSkills);
  const [profile, setProfile] = useState({ name: 'John Doe', role: 'Lawyer', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' });

  // Modal helpers
  const openModal = (title, content, type = 'info', wide = false) => setModal({ open: true, title, content, type, wide });
  const closeModal = () => setModal({ ...modal, open: false });

  // AI Chat
  const handleSendChat = (msg) => {
    if (!msg.trim()) return;
    setChat(prev => [...prev, { sender: 'You', text: msg }]);
    setTimeout(() => {
      setChat(prev => [...prev, { sender: selectedAgent.name, text: `AI response from ${selectedAgent.role}.` }]);
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
        <div className="text-xs text-gray-500">Type: {ev.type}</div>
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
            {/* Profile & Progress */}
            <div className="bg-white rounded shadow p-4 flex flex-col md:flex-row gap-6 items-center">
              <img src={profile.avatar} alt="avatar" className="w-20 h-20 rounded-full border-4 border-blue-100" />
              <div className="flex-1">
                <div className="text-xl font-bold text-gray-800">{profile.name}</div>
                <div className="text-sm text-gray-500 mb-2">Role: {profile.role}</div>
                <div className="flex gap-4 mb-2">
                  <div>Ongoing Cases: <span className="font-semibold text-blue-700">{activeCases.length}</span></div>
                  <div>Completed: <span className="font-semibold text-green-700">3</span></div>
                </div>
                <div className="mb-2">Skill Improvement:</div>
                <div className="flex flex-col gap-1">
                  {skills.map(skill => (
                    <div key={skill.name} className="flex items-center gap-2">
                      <span className="w-32 text-xs text-gray-600">{skill.name}</span>
                      <div className="flex-1 bg-gray-200 rounded h-2">
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
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => openModal('New Case', <div>Case creation form here (AI scenario or upload)</div>, 'info', true)}>New Case</button>
            </div>
          </div>
        );
      case 'ai':
        return (
          <div className="p-4 space-y-6">
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
            {/* AI Chat */}
            <div className="bg-white rounded shadow p-4">
              <div className="font-bold mb-2">AI Agent Chat ({selectedAgent.role})</div>
              <div className="bg-gray-50 rounded p-3 mb-2 h-40 overflow-y-auto flex flex-col gap-1">
                {chat.map((msg, idx) => (
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
              <div className="flex gap-4 flex-wrap">
                {demoEvidence.map(ev => (
                  <div key={ev.id} className="bg-gray-50 border rounded shadow p-2 w-40 flex flex-col items-center">
                    <div className="font-medium text-gray-800 text-sm mb-1">{ev.name}</div>
                    {ev.type === 'image' && <img src={ev.url} alt={ev.name} className="w-24 h-16 object-cover rounded mb-2" onClick={() => handleViewEvidence(ev)} style={{ cursor: 'pointer' }} />}
                    {ev.type === 'document' && <img src={ev.url} alt={ev.name} className="w-24 h-16 object-cover rounded mb-2" onClick={() => handleViewEvidence(ev)} style={{ cursor: 'pointer' }} />}
                    {ev.type === 'video' && <video src={ev.url} controls className="w-24 h-16 rounded mb-2" onClick={() => handleViewEvidence(ev)} style={{ cursor: 'pointer' }} />}
                  </div>
                ))}
              </div>
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Upload Evidence</button>
            </div>
            <div className="bg-white rounded shadow p-4">
              <div className="font-bold mb-2">Evidence Viewer</div>
              <div className="text-sm text-gray-500">Click on any evidence item to view details.</div>
                    </div>
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

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-blue-50 to-white">
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