import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CasePreparationSection = ({ 
  caseDetails, 
  userRole,
  onAddInteraction,
  onUpdateRole,
  onAddEvidence
}) => {
  const [activeTab, setActiveTab] = useState('timeline');
  const [showStatementForm, setShowStatementForm] = useState(false);
  const [statement, setStatement] = useState('');

  // Mock data for case preparation timeline
  const preparationSteps = [
    {
      id: 1,
      title: 'Initial Police Report',
      date: '2024-07-15',
      status: 'completed',
      content: 'Police report filed detailing the incident. Evidence collected from the scene.',
      type: 'police'
    },
    {
      id: 2,
      title: 'Victim Statement',
      date: '2024-07-16',
      status: 'completed',
      content: 'Victim provided detailed account of events. Medical reports attached.',
      type: 'victim'
    },
    {
      id: 3,
      title: 'Case Mention',
      date: '2024-07-20',
      status: 'upcoming',
      content: 'First court mention scheduled. All parties required to attend.',
      type: 'court'
    },
    {
      id: 4,
      title: 'Evidence Review',
      date: '2024-07-25',
      status: 'pending',
      content: 'Review all collected evidence and prepare arguments.',
      type: 'preparation'
    }
  ];

  // Mock data for case documents
  const caseDocuments = [
    {
      id: 1,
      name: 'Police Report',
      type: 'document',
      date: '2024-07-15',
      status: 'available'
    },
    {
      id: 2,
      name: 'Medical Report',
      type: 'document',
      date: '2024-07-16',
      status: 'available'
    },
    {
      id: 3,
      name: 'Witness Statement',
      type: 'document',
      date: '2024-07-17',
      status: 'pending'
    }
  ];

  const handleSubmitStatement = () => {
    if (statement.trim()) {
      onAddInteraction({
        type: 'statement',
        content: statement,
        role: userRole,
        timestamp: new Date().toISOString()
      });
      setStatement('');
      setShowStatementForm(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Case Preparation</h2>
        <p className="text-gray-600">Review case details and prepare for court proceedings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          className={`pb-2 px-4 ${activeTab === 'timeline' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('timeline')}
        >
          Timeline
        </button>
        <button
          className={`pb-2 px-4 ${activeTab === 'documents' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('documents')}
        >
          Documents
        </button>
        <button
          className={`pb-2 px-4 ${activeTab === 'interactions' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('interactions')}
        >
          Interactions
        </button>
      </div>

      {/* Timeline Tab */}
      {activeTab === 'timeline' && (
        <div className="space-y-4">
          {preparationSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-4"
            >
              <div className="flex items-start gap-4">
                <div className="text-2xl">
                  {step.type === 'police' ? '👮' :
                   step.type === 'victim' ? '👥' :
                   step.type === 'court' ? '⚖️' : '📋'}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{step.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{step.content}</p>
                    </div>
                    <div className="text-sm text-gray-500">{step.date}</div>
                  </div>
                  <div className="mt-2">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      step.status === 'completed' ? 'bg-green-100 text-green-800' :
                      step.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          {caseDocuments.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">📄</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{doc.name}</h3>
                    <p className="text-sm text-gray-500">{doc.date}</p>
                  </div>
                </div>
                <div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                    doc.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Interactions Tab */}
      {activeTab === 'interactions' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">Case Interactions</h3>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                onClick={() => setShowStatementForm(true)}
              >
                Add Statement
              </button>
            </div>

            {showStatementForm && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <textarea
                  className="w-full p-2 border rounded-lg mb-2"
                  rows="4"
                  placeholder="Enter your statement..."
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <button
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                    onClick={() => setShowStatementForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    onClick={handleSubmitStatement}
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* Mock interactions */}
              <div className="border-l-4 border-blue-600 pl-4 py-2">
                <div className="text-sm text-gray-500">Police Report - 2024-07-15</div>
                <p className="text-gray-800">Initial investigation complete. Evidence collected from the scene.</p>
              </div>
              <div className="border-l-4 border-green-600 pl-4 py-2">
                <div className="text-sm text-gray-500">Victim Statement - 2024-07-16</div>
                <p className="text-gray-800">Victim provided detailed account of the incident.</p>
              </div>
              <div className="border-l-4 border-purple-600 pl-4 py-2">
                <div className="text-sm text-gray-500">Court Notice - 2024-07-17</div>
                <p className="text-gray-800">First mention scheduled for July 20th, 2024.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CasePreparationSection; 