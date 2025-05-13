import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Modal from '../Modal';
import NewCaseModal from '../NewCaseModal';

export default function CasesSection({ 
  activeCases, 
  uploadedCases, 
  setShowNewCaseModal, 
  showNewCaseModal, 
  handleCreateCase,
  historicalCases,
  updateCaseStatus,
  handleCaseProgression,
  caseProgressionSteps
}) {
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCase, setSelectedCase] = useState(null);
  const [showCaseDetails, setShowCaseDetails] = useState(false);

  const tabs = [
    { id: 'active', name: 'Active Cases', icon: '📁' },
    { id: 'uploaded', name: 'Uploaded Cases', icon: '📤' },
    { id: 'historical', name: 'Historical Cases', icon: '📚' }
  ];

  const statusFilters = [
    { id: 'all', name: 'All Status' },
    { id: 'draft', name: 'Draft' },
    { id: 'filed', name: 'Filed' },
    { id: 'preparation', name: 'In Preparation' },
    { id: 'scheduled', name: 'Scheduled' },
    { id: 'in_progress', name: 'In Progress' },
    { id: 'settlement', name: 'Settlement' },
    { id: 'closed', name: 'Closed' }
  ];

  const getCases = () => {
    switch (activeTab) {
      case 'active':
        return activeCases;
      case 'uploaded':
        return uploadedCases;
      case 'historical':
        return historicalCases;
      default:
        return [];
    }
  };

  const filteredCases = getCases().filter(case_ => {
    const matchesSearch = case_.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         case_.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         case_.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || case_.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCaseClick = (case_) => {
    setSelectedCase(case_);
    setShowCaseDetails(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      filed: 'bg-blue-100 text-blue-800',
      preparation: 'bg-yellow-100 text-yellow-800',
      scheduled: 'bg-purple-100 text-purple-800',
      in_progress: 'bg-green-100 text-green-800',
      settlement: 'bg-orange-100 text-orange-800',
      closed: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || colors.draft;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cases</h1>
        <button
          onClick={() => setShowNewCaseModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          New Case
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`pb-2 px-4 flex items-center gap-2 ${
              activeTab === tab.id ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span>
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search cases..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          {statusFilters.map(filter => (
            <option key={filter.id} value={filter.id}>{filter.name}</option>
          ))}
        </select>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.length > 0 ? (
          filteredCases.map(case_ => (
            <motion.div
              key={case_.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleCaseClick(case_)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">{case_.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(case_.status)}`}>
                  {case_.status.replace('_', ' ')}
                </span>
              </div>
              <div className="text-sm text-gray-500 mb-2">
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>{case_.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📋</span>
                  <span>{case_.area}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{case_.storyline}</p>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">📂</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {activeTab === 'active' ? 'No Active Cases' : 
                   activeTab === 'uploaded' ? 'No Uploaded Cases' : 
                   'No Historical Cases'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {activeTab === 'active' ? 'Get started by creating your first case or joining an existing one.' :
                   activeTab === 'uploaded' ? 'Upload your first case to begin managing your legal documents.' :
                   'No historical cases available at the moment.'}
                </p>
                {activeTab === 'active' && (
                  <button
                    onClick={() => setShowNewCaseModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Case
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Case Details Modal */}
      {showCaseDetails && selectedCase && (
        <Modal
          open={showCaseDetails}
          onClose={() => setShowCaseDetails(false)}
          title="Case Details"
          type="info"
          wide={true}
        >
          <div className="p-4 space-y-4">
            {/* Header Section */}
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedCase.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedCase.status)}`}>
                    {selectedCase.status.replace('_', ' ')}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-sm text-gray-600">{selectedCase.type} Case</span>
                </div>
              </div>
              <div className="flex gap-2">
                {selectedCase.status !== 'closed' && (
                  <button
                    onClick={() => {
                      handleCaseProgression(selectedCase.id, 'next');
                      setShowCaseDetails(false);
                    }}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1.5 text-sm"
                  >
                    <span>Progress</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => setShowCaseDetails(false)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="text-xs font-medium text-gray-500 mb-2">Case Information</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400">📍</span>
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="text-sm text-gray-900">{selectedCase.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400">📋</span>
                      <div>
                        <p className="text-xs text-gray-500">Area</p>
                        <p className="text-sm text-gray-900">{selectedCase.area}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400">👥</span>
                      <div>
                        <p className="text-xs text-gray-500">Role</p>
                        <p className="text-sm text-gray-900">{selectedCase.role || 'Unassigned'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400">📅</span>
                      <div>
                        <p className="text-xs text-gray-500">Deadline</p>
                        <p className="text-sm text-gray-900">{selectedCase.deadline || 'TBD'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="text-xs font-medium text-gray-500 mb-2">Case Progression</h4>
                  <div className="space-y-2">
                    {caseProgressionSteps.map((step, index) => (
                      <div key={step.id} className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          index <= (selectedCase.progression?.currentStepIndex || 0)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className={`text-xs ${
                            index <= (selectedCase.progression?.currentStepIndex || 0)
                              ? 'text-gray-900'
                              : 'text-gray-400'
                          }`}>
                            {step.name}
                          </p>
                          <p className="text-xs text-gray-500">{step.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="text-xs font-medium text-gray-500 mb-2">Case Storyline</h4>
                  <p className="text-sm text-gray-900 leading-relaxed">{selectedCase.storyline}</p>
                </div>

                {selectedCase.timeline && selectedCase.timeline.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="text-xs font-medium text-gray-500 mb-2">Case Timeline</h4>
                    <div className="space-y-2">
                      {selectedCase.timeline.map((event, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-600"></div>
                          <div>
                            <p className="text-xs font-medium text-gray-900">{event.action}</p>
                            <p className="text-xs text-gray-500">{new Date(event.date).toLocaleString()}</p>
                            {event.description && (
                              <p className="text-xs text-gray-600 mt-0.5">{event.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCase.evidence && selectedCase.evidence.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="text-xs font-medium text-gray-500 mb-2">Evidence</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedCase.evidence.map((item, index) => (
                        <div key={index} className="bg-white rounded p-2 shadow-sm">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-gray-400">
                              {item.type === 'image' ? '🖼️' : item.type === 'document' ? '📄' : '🎥'}
                            </span>
                            <p className="text-xs font-medium text-gray-900 truncate">{item.name}</p>
                          </div>
                          <p className="text-xs text-gray-500">Type: {item.type}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* New Case Modal */}
      {showNewCaseModal && (
        <NewCaseModal
          onCreate={handleCreateCase}
          onClose={() => setShowNewCaseModal(false)}
        />
      )}
    </div>
  );
} 