import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Modal from '../Modal';

export default function EvidenceSection({ 
  demoEvidence, 
  evidenceFilter, 
  setEvidenceFilter, 
  compareEvidence, 
  setCompareEvidence, 
  setShowCompareModal, 
  showCompareModal, 
  handleViewEvidence
}) {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Evidence Collection</h1>
          <p className="text-gray-600">Manage and analyze case evidence</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 gap-4">
            {demoEvidence.map(evidence => (
              <motion.div
                key={evidence.id}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-50 rounded-lg p-4 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-600">{evidence.type}</span>
                  <span className="text-sm text-gray-500">{evidence.date}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{evidence.title}</h3>
                <p className="text-gray-600 mb-3">{evidence.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Source: {evidence.source}</span>
                  <button 
                    onClick={() => handleViewEvidence(evidence)}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
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
} 