'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FaEdit, FaTrash, FaUser } from 'react-icons/fa';

export default function UserCard({ user, onClick }) {
  const router = useRouter();

  const handleDeleteUser = async (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await axios.delete(`http://localhost:3000/api/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.status === 200) {
          alert('✅ User deleted successfully');
          router.refresh();
        } else {
          alert('❌ Error deleting user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300">
      {/* Avatar + Name */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full text-gray-600">
          <FaUser />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">
          {user.firstName} {user.lastName}
        </h2>
      </div>

      {/* Email */}
      <p className="text-sm text-gray-600 mb-2">{user.email}</p>

      {/* Role */}
      <div className="text-sm mb-2">
        <span className="font-medium text-gray-700">Role:</span>{' '}
        <span
          className={
            user.role === 'Admin'
              ? 'text-red-600 font-semibold'
              : user.role === 'Membre'
              ? 'text-blue-600 font-semibold'
              : 'text-gray-500 font-semibold'
          }
        >
          {user.role}
        </span>
      </div>

      {/* Creation date */}
      <div className="text-xs text-gray-400 mb-4">
        Created: {new Date(user.createdAt).toLocaleDateString()}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onClick}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm transition-all"
        >
          <FaEdit /> Edit
        </button>
        <button
          onClick={() => handleDeleteUser(user._id)}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-sm transition-all"
        >
          <FaTrash /> Delete
        </button>
      </div>
    </div>
  );
}
