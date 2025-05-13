import React, { useState } from 'react';

export default function EditProfileModal({ profile, onSave, onClose }) {
  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState(profile.role);
  const [avatar, setAvatar] = useState(profile.avatar);
  return (
    <form onSubmit={e => { e.preventDefault(); onSave({ name, role, avatar }); }}>
      <div className="mb-2 font-semibold">Edit Profile</div>
      <input
        className="border border-gray-300 rounded px-2 py-1 w-full mb-2"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Name"
      />
      <select
        className="border border-gray-300 rounded px-2 py-1 w-full mb-2"
        value={role}
        onChange={e => setRole(e.target.value)}
      >
        <option value="Lawyer">Lawyer</option>
        <option value="Prosecutor">Prosecutor</option>
        <option value="Defense">Defense</option>
        <option value="Judge">Judge</option>
        <option value="Clerk">Clerk</option>
        <option value="Observer">Observer</option>
      </select>
      <input
        className="border border-gray-300 rounded px-2 py-1 w-full mb-4"
        value={avatar}
        onChange={e => setAvatar(e.target.value)}
        placeholder="Avatar URL"
      />
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
        <button type="button" className="text-gray-500 underline" onClick={onClose}>Cancel</button>
      </div>
    </form>
  );
} 