'use client';

import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function TaskCard({ task, onEdit }) {
  const router = useRouter();

  const handleDeleteTask = async (taskId) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`http://localhost:3000/api/task/${taskId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        alert('✅ Task deleted successfully');
        router.refresh();
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('❌ Error deleting task');
      }
    }
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300">
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{task.title}</h2>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-3">
        {task.description || 'No description provided'}
      </p>

      {/* Dates */}
      <div className="text-sm space-y-1">
        <p>
          <span className="font-medium text-gray-700">📅 Due Date:</span>{' '}
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
        </p>
        <p className="text-xs text-gray-400">
          🕒 Created: {new Date(task.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-5">
        <button
          onClick={onEdit}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm transition-all"
        >
          <FaEdit /> Edit
        </button>
        <button
          onClick={() => handleDeleteTask(task._id)}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-sm transition-all"
        >
          <FaTrash /> Delete
        </button>
      </div>
    </div>
  );
}
