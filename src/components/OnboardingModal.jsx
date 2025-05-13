import React, { useState } from 'react';

export default function OnboardingModal({ onComplete }) {
  const [step, setStep] = useState(0); // 0: avatar, 1: info
  const [avatar, setAvatar] = useState('https://randomuser.me/api/portraits/men/32.jpg');
  const [customAvatar, setCustomAvatar] = useState('');
  const [interests, setInterests] = useState('');
  const [goals, setGoals] = useState('');
  const avatarOptions = [
    'https://randomuser.me/api/portraits/men/32.jpg',
    'https://randomuser.me/api/portraits/women/44.jpg',
    'https://randomuser.me/api/portraits/men/45.jpg',
    'https://randomuser.me/api/portraits/women/46.jpg',
    'https://randomuser.me/api/portraits/men/47.jpg',
    'https://randomuser.me/api/portraits/women/48.jpg',
  ];
  return (
    <form onSubmit={e => { e.preventDefault(); if (step === 0) { setStep(1); } else { onComplete({ interests, goals, avatar }); } }}>
      {step === 0 && (
        <div>
          <div className="mb-2 font-semibold text-lg">Choose Your Avatar</div>
          <div className="flex gap-3 flex-wrap mb-4 justify-center">
            {avatarOptions.map(url => (
              <button
                type="button"
                key={url}
                className={`rounded-full border-2 ${avatar === url ? 'border-blue-600' : 'border-transparent'} focus:outline-none`}
                onClick={() => setAvatar(url)}
              >
                <img src={url} alt="avatar" className="w-16 h-16 rounded-full" />
              </button>
            ))}
          </div>
          <div className="mb-2 text-sm text-gray-700">Or enter a custom avatar URL:</div>
          <input
            className="border border-gray-300 rounded px-2 py-1 w-full mb-4"
            value={customAvatar}
            onChange={e => setCustomAvatar(e.target.value)}
            placeholder="Custom avatar URL"
            onBlur={() => { if (customAvatar) setAvatar(customAvatar); }}
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">Next</button>
        </div>
      )}
      {step === 1 && (
        <div>
          <div className="mb-2 font-semibold text-lg">Welcome to KESI!</div>
          <div className="mb-2 text-sm text-gray-700">Tell us a bit about your interests and goals to personalize your experience.</div>
          <input
            className="border border-gray-300 rounded px-2 py-1 w-full mb-2"
            value={interests}
            onChange={e => setInterests(e.target.value)}
            placeholder="Your interests (e.g., criminal law, advocacy, AI)"
          />
          <input
            className="border border-gray-300 rounded px-2 py-1 w-full mb-4"
            value={goals}
            onChange={e => setGoals(e.target.value)}
            placeholder="Your goals (e.g., become a top litigator, learn AI law)"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">Get Started</button>
        </div>
      )}
    </form>
  );
} 