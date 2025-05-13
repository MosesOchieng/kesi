import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function FeedbackSection() {
  const [activeTab, setActiveTab] = useState('give');
  const [feedbackType, setFeedbackType] = useState('general');

  const feedbackCategories = [
    { id: 'general', name: 'General Feedback', icon: '💭' },
    { id: 'bug', name: 'Bug Report', icon: '🐛' },
    { id: 'feature', name: 'Feature Request', icon: '✨' },
    { id: 'improvement', name: 'Improvement', icon: '📈' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Feedback Center</h1>
          <p className="text-gray-600">Share your thoughts and help us improve KESI</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('give')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'give'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Give Feedback
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Feedback History
          </button>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {activeTab === 'give' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {feedbackCategories.map(category => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setFeedbackType(category.id)}
                    className={`p-4 rounded-lg text-center ${
                      feedbackType === category.id
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <div className="font-medium text-gray-900">{category.name}</div>
                  </motion.button>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Brief description of your feedback"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows="6"
                    placeholder="Please provide detailed feedback..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>

                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Submit Feedback
                </button>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <motion.div
                  key={item}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">💭</span>
                      <h3 className="text-lg font-semibold text-gray-900">General Feedback</h3>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      Medium Priority
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Submitted on March 15, 2024</span>
                    <span>Status: Under Review</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
      </div>
      </div>
    </div>
  );
} 