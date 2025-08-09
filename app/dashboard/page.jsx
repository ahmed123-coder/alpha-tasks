'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const DashboardPage = () => {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/user/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const me = res.data.user;

        if (me.role === 'Admin') {
          router.push('/dashboard/admin');
        }
        if (me.role === 'Membre') {
          router.push('/dashboard/member');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('فشل في التحقق من المستخدم.');
      }
    };

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const projectsRes = await axios.get('http://localhost:3000/api/project/my', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(projectsRes.data.projects || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchMe();
    fetchData();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <section className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
          📁 مشاريعي
        </h2>

        {error && (
          <div className="mb-6 bg-red-100 text-red-600 px-4 py-2 rounded-lg shadow">
            {error}
          </div>
        )}

        {projects.length === 0 ? (
          <p className="text-gray-500 text-lg text-center">لا توجد مشاريع حالياً 🚀</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{project.name}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {project.description || 'لا يوجد وصف'}
                </p>

                <div className="space-y-1 text-sm text-gray-500">
                  <p>
                    <span className="font-medium text-gray-700">📅 تاريخ التسليم:</span>{' '}
                    {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'غير محدد'}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">👑 المالك:</span>{' '}
                    {project.owner ? `${project.owner.firstName} ${project.owner.lastName}` : 'غير محدد'}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">👥 الأعضاء:</span>{' '}
                    {project.members?.map((member) => member.firstName).join(', ') || 'لا يوجد أعضاء'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;
