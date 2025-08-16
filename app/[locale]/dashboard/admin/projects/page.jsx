'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import ProjectCard from '../../components/ProjectCard';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

const AdminProjectsPage = () => {
  const t = useTranslations('AdminProjectsPage');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/user/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
        setError(t('fetchUserError'));
      } finally {
        setLoading(false);
      }
    };

    const fetchProjects = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/project', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProjects(res.data.projects);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(t('fetchProjectsError'));
      }
    };

    fetchMe();
    fetchProjects();
  }, [router, t]);

  if (loading) return <p className="text-center mt-10 text-gray-500">⏳ {t('loading')}</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">👥 {t('allProjects')}</CardTitle>
          <Button onClick={() => router.push('/dashboard/admin/projects/new')}>
            + {t('newProject')}
          </Button>
        </CardHeader>
      </Card>

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
