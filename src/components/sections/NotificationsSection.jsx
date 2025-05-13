import React from 'react';

const NotificationsSection = ({ notifications = [] }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>
      
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No new notifications
          </div>
        ) : (
          notifications.map((notification, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow"
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
                  <div className="font-semibold text-gray-800">{notification.message}</div>
                  <div className="text-sm text-gray-500 mt-1">{notification.date}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsSection; 