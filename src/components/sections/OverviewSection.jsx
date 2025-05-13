import React, { useState } from 'react';
import Modal from '../Modal';
import OnboardingModal from '../OnboardingModal';
import EditProfileModal from '../EditProfileModal';
import { motion, AnimatePresence } from 'framer-motion';
import CasePreparationSection from './CasePreparationSection';

// Add role mapping based on registration role
const roleMappings = {
  'Lawyer': ['Defense Attorney', 'Prosecutor'],
  'Prosecutor': ['Prosecutor'],
  'Defense': ['Defense Attorney'],
  'Judge': ['Judge'],
  'Clerk': ['Clerk'],
  'Observer': ['Observer', 'Witness']
};

// Add getAvailableRoles function
const getAvailableRoles = (caseObj, userRole) => {
  const baseRoles = roleMappings[userRole] || ['Observer'];
  // Filter out roles that are already taken
  const takenRoles = caseObj.agents?.map(a => a.role) || [];
  return baseRoles.filter(role => !takenRoles.includes(role));
};

export default function OverviewSection({ 
  profile, 
  activeCases, 
  uploadedCases, 
  evidence, 
  skills, 
  badges,
  showOnboarding,
  setShowOnboarding,
  handleCompleteOnboarding,
  handleSaveProfile,
  handleUploadEvidence,
  setCaseDetails,
  setJoinedCases,
  showToast,
  setUserRoles,
  addNotification,
  setCaseInteractions,
  userRoles,
  getCaseAgents,
  roleNextSteps,
  calendarEvents,
  handleAddEvent,
  handleCaseTwist,
  setShowCourtroom,
  courtroomTimeline,
  courtroomChat,
  handleCourtroomSend,
  currentSpeaker,
  setCurrentSpeaker,
  preCourtChat,
  preCourtRecipient,
  setPreCourtRecipient,
  handlePreCourtSend,
  caseInteractions,
  joinedCases = [],
  handleJoinCase,
  onUpdateRole,
  onAddInteraction,
  onAddEvidence
}) {
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [caseDetails, setCaseDetailsLocal] = useState(null);
  const [showCourtroom, setShowCourtroomLocal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [showCaseDetails, setShowCaseDetails] = useState(false);
  const [showRoleChangeModal, setShowRoleChangeModal] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSettlementModal, setShowSettlementModal] = useState(false);
  const [settlementType, setSettlementType] = useState('mediation');
  const [settlementTerms, setSettlementTerms] = useState('');
  const [settlementAmount, setSettlementAmount] = useState('');
  const [settlementDeadline, setSettlementDeadline] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [showChatModal, setShowChatModal] = useState(false);

  const handleSetCaseDetails = (details) => {
    setCaseDetailsLocal(details);
    if (setCaseDetails) {
      setCaseDetails(details);
    }
  };

  const handleSetShowCourtroom = (show) => {
    setShowCourtroomLocal(show);
    if (setShowCourtroom) {
      setShowCourtroom(show);
    }
  };

  const handleRoleChange = () => {
    if (newRole && selectedCase) {
      onUpdateRole(selectedCase.id, newRole);
      setShowRoleChangeModal(false);
      setNewRole('');
    }
  };

  const handleCaseClick = (caseDetails) => {
    setSelectedCase(caseDetails);
    setShowCaseDetails(true);
    handleSetCaseDetails(caseDetails);
  };

  // Calculate total skill level
  const calculateTotalSkillLevel = () => {
    if (!skills || skills.length === 0) return 0;
    const total = skills.reduce((acc, skill) => acc + skill.value, 0);
    return Math.round(total / skills.length);
  };

  // Check if user is new (no progress)
  const isNewUser = !badges?.length && (!skills?.length || skills.every(skill => skill.value === 0));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to KESI</h1>
          <p className="text-gray-600">Your legal practice dashboard</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Cases</p>
                <h3 className="text-2xl font-bold text-gray-900">{activeCases.length}</h3>
              </div>
              <div className="text-3xl">📁</div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Evidence Items</p>
                <h3 className="text-2xl font-bold text-gray-900">{evidence?.length || 0}</h3>
              </div>
              <div className="text-3xl">🔍</div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Skills Level</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {calculateTotalSkillLevel()}%
                </h3>
              </div>
              <div className="text-3xl">📈</div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Badges Earned</p>
                <h3 className="text-2xl font-bold text-gray-900">{badges?.length || 0}</h3>
              </div>
              <div className="text-3xl">🏅</div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Cases */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Cases</h2>
              {activeCases.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📁</div>
                  <p className="text-gray-600">No active cases yet</p>
                  <p className="text-sm text-gray-500 mt-2">Create your first case to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeCases.map((case_, index) => (
                    <motion.div
                      key={`active-case-${case_.id || index}`}
                      whileHover={{ scale: 1.02 }}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{case_.name}</h3>
                          <p className="text-sm text-gray-600">{case_.type} • {case_.area}</p>
                          <p className="text-sm text-gray-500 mt-1">{case_.description}</p>
                          <div className="mt-2">
                            <span className="text-sm text-gray-500">Location: {case_.location}</span>
                            <span className="mx-2">•</span>
                            <span className="text-sm text-gray-500">Deadline: {case_.deadline}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleCaseClick(case_)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Open
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Skills and Badges */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills Progress</h2>
              {isNewUser ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📈</div>
                  <p className="text-gray-600">No skills data yet</p>
                  <p className="text-sm text-gray-500 mt-2">Complete cases to improve your skills</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {skills.map((skill, index) => (
                    <div key={`skill-${skill.name}-${index}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                        <span className="text-sm text-gray-500">{skill.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${skill.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Badges</h2>
              {isNewUser ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🏅</div>
                  <p className="text-gray-600">No badges earned yet</p>
                  <p className="text-sm text-gray-500 mt-2">Complete actions to earn badges</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {badges.map((badge, index) => (
                    <motion.div
                      key={`badge-${badge.name}-${index}`}
                      whileHover={{ scale: 1.05 }}
                      className="bg-gray-50 rounded-lg p-4 text-center"
                    >
                      <div className="text-3xl mb-2">{badge.icon}</div>
                      <div className="font-medium text-gray-900">{badge.name}</div>
                      <div className="text-sm text-gray-500">{badge.description}</div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 