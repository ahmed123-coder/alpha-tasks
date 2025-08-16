'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiEdit, FiTrash2, FiCalendar } from 'react-icons/fi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';

export default function ProjectCard({ project, onClick }) {
  const t = useTranslations('ProjectCard');
  const router = useRouter();

  const handleDeleteProject = async (projectId) => {
    if (confirm(t('deleteConfirm'))) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/api/project/${projectId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );
        if (response.status === 200) {
          alert(t('deleteSuccess'));
          router.refresh();
        } else {
          alert(t('deleteError'));
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        alert(t('deleteError'));
      }
    }
  };

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{project.name}</CardTitle>
        <CardDescription>
          {project.description || t('noDescription')}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="text-sm space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-700">
            <FiCalendar className="text-blue-500" />
            <span>
              <strong>{t('dueDate')}:</strong>{' '}
              {project.dueDate
                ? new Date(project.dueDate).toLocaleDateString()
                : t('notSet')}
            </span>
          </div>
          <div className="text-xs text-gray-400">
            {t('created')}: {new Date(project.createdAt).toLocaleDateString()}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 mt-auto">
        <Button onClick={onClick} variant="default" className="flex items-center gap-2">
          <FiEdit /> {t('edit')}
        </Button>
        <Button
          onClick={() => handleDeleteProject(project._id)}
          variant="destructive"
          className="flex items-center gap-2"
        >
          <FiTrash2 /> {t('delete')}
        </Button>
      </CardFooter>
    </Card>
  );
}
