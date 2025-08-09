'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import SidebarAdmin from '@/app/dashboard/components/sidebaradmin';
import ProjectCard from '@/app/dashboard/components/ProjectCard'; // تأكد من أن المسار صحيح

const AdminProjectsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/user/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const me = res.data.user;
        setUser(me);

        // 🔐 التوجيه حسب الدور
        if (me.role === 'Membre') {
          router.push('/dashboard/Membre');
        } else if (me.role === 'Invité') {
          router.push('/dashboard');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('فشل في التحقق من المستخدم.');
      } finally {
        setLoading(false);
      }
    };

    const fetchProjects = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/project', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProjects(res.data.projects);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('فشل في جلب المشاريع.');
      }
    };

    fetchMe();
    fetchProjects();
  }, [router]);

  if (loading) return <p>جارٍ التحميل...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4">
      <SidebarAdmin />
      <h1 className="text-2xl font-bold mb-4">📁 المشاريع</h1>
      <div className="mb-4">
        <button
          onClick={() => router.push('/dashboard/admin/projects/new')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + مشروع جديد
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            onClick={() => router.push(`/dashboard/admin/projects/edite/${project._id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminProjectsPage;
