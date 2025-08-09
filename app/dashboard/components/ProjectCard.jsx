'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiEdit, FiTrash2, FiCalendar } from 'react-icons/fi';

export default function ProjectCard({ project, onClick }) {
  const router = useRouter();

  const handleDeleteProject = async (projectId) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/api/project/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        if (response.status === 200) {
          alert('✅ Project deleted successfully');
          router.reload();
        } else {
          alert('❌ Error deleting project');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-5 border hover:shadow-xl transition-all duration-200 flex flex-col justify-between">
      {/* اسم المشروع */}
      <h2 className="text-xl font-bold text-gray-800 mb-1">{project.name}</h2>
      <p className="text-sm text-gray-600 mb-3">
        {project.description || 'No description provided.'}
      </p>

      {/* التواريخ */}
      <div className="text-sm space-y-1 mb-4">
        <div className="flex items-center gap-2 text-gray-700">
          <FiCalendar className="text-blue-500" />
          <span>
            <strong>Due Date:</strong>{' '}
            {project.dueDate
              ? new Date(project.dueDate).toLocaleDateString()
              : 'Not set'}
          </span>
        </div>
        <div className="text-xs text-gray-400">
          Created: {new Date(project.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* الأزرار */}
      <div className="flex gap-3 mt-auto">
        <button
          onClick={onClick}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          <FiEdit /> Edit
        </button>
        <button
          onClick={() => handleDeleteProject(project._id)}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          <FiTrash2 /> Delete
        </button>
      </div>
    </div>
  );
}
