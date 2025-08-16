'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function TaskCard({ task, onEdit, onDeleteLocal }) {
  const t = useTranslations('TaskCard'); // مفتاح الترجمة
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDeleteTask = async () => {
    if (confirm(t('confirmDelete'))) {
      setDeleting(true);
      try {
        await axios.delete(`http://localhost:3000/api/task/${task._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        onDeleteLocal(task._id);
      } catch (error) {
        console.error('Error deleting task:', error);
        alert(t('errorDelete'));
      } finally {
        setDeleting(false);
      }
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{task.title}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-600 mb-3">
          {task.description || t('noDescription')}
        </p>
        <div className="text-sm space-y-1">
          <p>
            <span className="font-medium text-gray-700">📅 {t('dueDate')}:</span>{' '}
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : t('noDueDate')}
          </p>
          <p className="text-xs text-gray-400">
            🕒 {t('createdAt')}: {new Date(task.createdAt).toLocaleDateString()}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex gap-3">
        <Button onClick={onEdit} variant="default" className="flex items-center gap-2">
          <FaEdit /> {t('edit')}
        </Button>
        <Button
          onClick={handleDeleteTask}
          variant="destructive"
          className="flex items-center gap-2"
          disabled={deleting}
        >
          <FaTrash /> {deleting ? t('deleting') : t('delete')}
        </Button>
      </CardFooter>
    </Card>
  );
}
