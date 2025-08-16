'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useTranslations } from 'next-intl';

export default function DashboardPage() {
  const t = useTranslations('DashboardPage');
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

        if (me.role === 'Admin') router.push('/dashboard/admin');
        if (me.role === 'Membre') router.push('/dashboard/member');
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(t('errorFetchUser'));
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
  }, [router, t]);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <section className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
          📁 {t('myProjects')}
        </h2>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>{t('error')}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {projects.length === 0 ? (
          <p className="text-gray-500 text-lg text-center">{t('noProjects')}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project._id} className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription>{project.description || t('noDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1 text-sm text-gray-500">
                  <p>
                    📅 <span className="font-medium">{t('dueDate')}:</span>{' '}
                    {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : t('notSet')}
                  </p>
                  <p>
                    👑 <span className="font-medium">{t('owner')}:</span>{' '}
                    {project.owner ? `${project.owner.firstName} ${project.owner.lastName}` : t('notSet')}
                  </p>
                  <p>
                    👥 <span className="font-medium">{t('members')}:</span>{' '}
                    {project.members?.map((member) => member.firstName).join(', ') || t('noMembers')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
