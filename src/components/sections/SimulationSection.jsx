import React from 'react';

export default function SimulationSection({ handleCaseTwist }) {
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
} 