import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function LearningSection() {
  const [activeTab, setActiveTab] = useState('tutorials');

  const tutorials = [
    {
      id: 1,
      title: 'Mastering Objection Handling',
      type: 'video',
      duration: '45 min',
      level: 'Intermediate',
      description: 'Learn advanced techniques for handling common objections in court.',
      thumbnail: 'https://example.com/objection-thumb.jpg',
      instructor: 'Judge Sarah Williams'
    },
    {
      id: 2,
      title: 'Building Persuasive Arguments',
      type: 'interactive',
      duration: '60 min',
      level: 'Advanced',
      description: 'Interactive workshop on constructing compelling legal arguments.',
      thumbnail: 'https://example.com/arguments-thumb.jpg',
      instructor: 'Prof. Michael Chen'
    },
    {
      id: 3,
      title: 'Cross-Examination Essentials',
      type: 'video',
      duration: '30 min',
      level: 'Beginner',
      description: 'Fundamental techniques for effective cross-examination.',
      thumbnail: 'https://example.com/cross-exam-thumb.jpg',
      instructor: 'Attorney Lisa Rodriguez'
    }
  ];

  const caseStudies = [
    {
      id: 1,
      title: 'Brown v. Board of Education',
      year: '1954',
      category: 'Constitutional Law',
      description: 'Landmark case that declared state laws establishing separate public schools for black and white students unconstitutional.',
      keyPoints: [
        'Equal Protection Clause',
        'Separate but Equal Doctrine',
        'Public Education Rights'
      ]
    },
    {
      id: 2,
      title: 'Miranda v. Arizona',
      year: '1966',
      category: 'Criminal Procedure',
      description: 'Established the Miranda rights, requiring law enforcement to inform suspects of their rights before interrogation.',
      keyPoints: [
        'Right to Remain Silent',
        'Right to Counsel',
        'Self-Incrimination'
      ]
    }
  ];

  const resources = [
    {
      id: 1,
      title: 'Legal Writing Guide',
      type: 'document',
      format: 'PDF',
      size: '2.4 MB',
      description: 'Comprehensive guide to legal writing and document preparation.'
    },
    {
      id: 2,
      title: 'Courtroom Etiquette',
      type: 'document',
      format: 'PDF',
      size: '1.8 MB',
      description: 'Essential guidelines for proper courtroom conduct and decorum.'
    },
    {
      id: 3,
      title: 'Evidence Rules',
      type: 'document',
      format: 'PDF',
      size: '3.2 MB',
      description: 'Detailed overview of evidence rules and their application.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Center</h1>
          <p className="text-gray-600">Enhance your legal skills with our comprehensive learning resources</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('tutorials')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'tutorials'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Tutorials & Courses
          </button>
          <button
            onClick={() => setActiveTab('cases')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'cases'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Case Studies
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'resources'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Resources
          </button>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {activeTab === 'tutorials' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorials.map(tutorial => (
                <motion.div
                  key={tutorial.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="aspect-video bg-gray-200 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-4xl">
                      {tutorial.type === 'video' ? '🎥' : '🎮'}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-600">{tutorial.level}</span>
                      <span className="text-sm text-gray-500">{tutorial.duration}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{tutorial.title}</h3>
                    <p className="text-gray-600 mb-4">{tutorial.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Instructor: {tutorial.instructor}</span>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Start Learning
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'cases' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {caseStudies.map(caseStudy => (
                <motion.div
                  key={caseStudy.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{caseStudy.title}</h3>
                    <span className="text-sm font-medium text-blue-600">{caseStudy.year}</span>
                  </div>
                  <p className="text-gray-600 mb-4">{caseStudy.description}</p>
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {caseStudy.category}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Key Points:</h4>
                    <ul className="space-y-2">
                      {caseStudy.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          {point}
                        </li>
                      ))}
        </ul>
      </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map(resource => (
                <motion.div
                  key={resource.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{resource.title}</h3>
                    <span className="text-sm font-medium text-blue-600">{resource.format}</span>
                  </div>
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{resource.size}</span>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Download
                    </button>
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