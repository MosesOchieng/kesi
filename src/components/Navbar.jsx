import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ notifications = [], onNotificationClick }) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-700">KESI</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                <div className="relative">
                  <span className="text-2xl">🔔</span>
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </div>
              </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ✕
                        </button>
                      </div>
                      
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="text-center text-gray-500 py-4">
                            No new notifications
                          </div>
                        ) : (
                          notifications.map((notification, index) => (
                            <div
                              key={index}
                              onClick={() => {
                                if (onNotificationClick) {
                                  onNotificationClick(notification);
                                }
                                setShowNotifications(false);
                              }}
                              className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                            >
                              <div className="flex items-start gap-3">
                                <div className="text-2xl">
                                  {notification.type === 'case' ? '📁' : 
                                   notification.type === 'system' ? '🔔' : 
                                   notification.type === 'police' ? '👮' :
                                   notification.type === 'victim' ? '👥' :
                                   notification.type === 'court' ? '⚖️' : '📌'}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">{notification.message}</div>
                                  <div className="text-sm text-gray-500 mt-1">{notification.timestamp}</div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div className="flex items-center">
              <img
                className="h-8 w-8 rounded-full"
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="User profile"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 