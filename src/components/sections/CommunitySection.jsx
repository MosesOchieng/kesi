import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const demoForumLinks = [
  { label: 'KESI Forum', href: 'https://forum.kesi.com' },
  { label: 'Q&A', href: 'https://forum.kesi.com/qna' },
  { label: 'Discussion Board', href: 'https://forum.kesi.com/discussion' },
  { label: 'Resources', href: 'https://forum.kesi.com/resources' }
];

export default function CommunitySection() {
  const [activeTab, setActiveTab] = useState('discussions');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [discussions, setDiscussions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showContributionModal, setShowContributionModal] = useState(false);
  const [newContribution, setNewContribution] = useState({
    title: '',
    content: '',
    category: 'cases',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  const categories = [
    { id: 'all', name: 'All Topics', icon: '🌐' },
    { id: 'cases', name: 'Case Discussions', icon: '📁' },
    { id: 'practice', name: 'Practice Groups', icon: '👥' },
    { id: 'resources', name: 'Resource Sharing', icon: '📚' }
  ];

  // Fetch discussions from the backend
  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/community/discussions');
        if (!response.ok) throw new Error('Failed to fetch discussions');
        const data = await response.json();
        setDiscussions(data);
      } catch (error) {
        console.error('Error fetching discussions:', error);
        // Fallback to demo data if API fails
        setDiscussions([
          {
            id: 1,
            title: 'Best practices for cross-examination',
            category: 'cases',
            author: 'Sarah Johnson',
            replies: 12,
            views: 245,
            lastActivity: '2 hours ago',
            tags: ['cross-examination', 'practice']
          },
          {
            id: 2,
            title: 'New evidence handling techniques',
            category: 'practice',
            author: 'Michael Chen',
            replies: 8,
            views: 189,
            lastActivity: '5 hours ago',
            tags: ['evidence', 'techniques']
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiscussions();
  }, []);

  const handleContributionSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/community/contributions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(newContribution)
      });

      if (!response.ok) throw new Error('Failed to submit contribution');

      const savedContribution = await response.json();
      setDiscussions(prev => [savedContribution, ...prev]);
      setShowContributionModal(false);
      setNewContribution({
        title: '',
        content: '',
        category: 'cases',
        tags: []
      });
    } catch (error) {
      console.error('Error submitting contribution:', error);
      alert('Failed to submit contribution. Please try again.');
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !newContribution.tags.includes(tagInput.trim())) {
      setNewContribution(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setNewContribution(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Hub</h1>
          <p className="text-gray-600">Connect with legal professionals and share knowledge</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('discussions')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'discussions'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Discussions
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'groups'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Practice Groups
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'events'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Events
          </button>
        </div>

        {/* Category Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {categories.map(category => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-lg text-center ${
                selectedCategory === category.id
                  ? 'bg-blue-50 border-2 border-blue-500'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <div className="font-medium text-gray-900">{category.name}</div>
            </motion.button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {activeTab === 'discussions' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Discussions</h2>
                <button 
                  onClick={() => setShowContributionModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Start New Discussion
                </button>
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading discussions...</p>
                </div>
              ) : (
          <div className="space-y-4">
                  {discussions
                    .filter(discussion => 
                      selectedCategory === 'all' || discussion.category === selectedCategory
                    )
                    .map(discussion => (
                      <motion.div
                        key={discussion.id}
                        whileHover={{ scale: 1.01 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {discussion.title}
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {discussion.tags.map(tag => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <span>Posted by {discussion.author}</span>
                              <span className="mx-2">•</span>
                              <span>{discussion.lastActivity}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="text-center">
                              <div className="font-medium text-gray-900">{discussion.replies}</div>
                              <div>Replies</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium text-gray-900">{discussion.views}</div>
                              <div>Views</div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              )}
            </>
          )}

          {/* Contribution Modal */}
          {showContributionModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Start New Discussion</h3>
                  <button
                    onClick={() => setShowContributionModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleContributionSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newContribution.title}
                      onChange={(e) => setNewContribution(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content
                    </label>
                    <textarea
                      value={newContribution.content}
                      onChange={(e) => setNewContribution(prev => ({ ...prev, content: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newContribution.category}
                      onChange={(e) => setNewContribution(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {categories.filter(cat => cat.id !== 'all').map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Add a tag..."
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {newContribution.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-blue-900"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setShowContributionModal(false)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'groups' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Practice Groups</h2>
              <p className="text-gray-600 mb-6">
                Join practice groups to collaborate with other legal professionals and improve your skills.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(group => (
                  <motion.div
                    key={group}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-50 rounded-lg p-4"
                  >
                    <div className="text-2xl mb-2">👥</div>
                    <h3 className="font-semibold text-gray-900 mb-2">Practice Group {group}</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Regular practice sessions for improving legal skills
                    </p>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Join Group
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h2>
              <div className="space-y-4">
                {[1, 2, 3].map(event => (
                  <motion.div
                    key={event}
                    whileHover={{ scale: 1.01 }}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Legal Workshop {event}</h3>
                        <p className="text-gray-600 text-sm mb-2">
                          Learn advanced techniques for legal practice
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>📅 March {event + 15}, 2024</span>
                          <span className="mx-2">•</span>
                          <span>⏰ 2:00 PM EST</span>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Register
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 