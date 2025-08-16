'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useTranslations } from 'next-intl';

export default function EditTaskPage() {
  const t = useTranslations('EditTaskPage');
  const { taskId } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    project: '',
    assignedTo: [],
    status: 'À faire',
    priority: 'Moyenne',
    dueDate: '',
  });
  const [projects, setProjects] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        const resTask = await axios.get(`http://localhost:3000/api/task/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedTask = resTask.data.task;

        setForm({
          title: fetchedTask.title,
          description: fetchedTask.description || '',
          project: fetchedTask.project?._id || fetchedTask.project || '',
          assignedTo: fetchedTask.assignedTo?.map(u => u._id || u) || [],
          status: fetchedTask.status,
          priority: fetchedTask.priority,
          dueDate: fetchedTask.dueDate
            ? new Date(fetchedTask.dueDate).toISOString().split('T')[0]
            : '',
        });

        const resProjects = await axios.get('http://localhost:3000/api/project', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(resProjects.data.projects);

        if (fetchedTask.project?._id || fetchedTask.project) {
          const resProjectDetail = await axios.get(
            `http://localhost:3000/api/project/${fetchedTask.project?._id || fetchedTask.project}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setProjectMembers(resProjectDetail.data.project.members || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage(t('errorFetchTask'));
      } finally {
        setLoading(false);
      }
    };

    if (taskId) fetchData();
  }, [taskId, t]);

  const handleProjectChange = async (projectId) => {
    setForm((prev) => ({ ...prev, project: projectId, assignedTo: [] }));
    if (projectId) {
      try {
        const token = localStorage.getItem('token');
        const resProjectDetail = await axios.get(
          `http://localhost:3000/api/project/${projectId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProjectMembers(resProjectDetail.data.project.members || []);
      } catch (err) {
        console.error('Error fetching project members:', err);
        setProjectMembers([]);
      }
    } else {
      setProjectMembers([]);
    }
  };

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:3000/api/task/',
        { ...form, taskId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(t('successUpdateTask'));
      setTimeout(() => router.push('/dashboard/admin/tasks'), 1500);
    } catch (error) {
      console.error('Error updating task:', error);
      setMessage(t('errorUpdateTask'));
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">{t('loadingTask')}</p>;

  return (
    <Card className="max-w-2xl mx-auto mt-6">
      <CardHeader>
        <CardTitle>✏️ {t('title')}</CardTitle>
      </CardHeader>

      <CardContent>
        {message && (
          <Alert variant={message.includes('✔️') ? 'default' : 'destructive'} className="mb-4">
            <AlertTitle>{message.includes('✔️') ? t('success') : t('error')}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder={t('placeholderTitle')}
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />

          <Textarea
            placeholder={t('placeholderDescription')}
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />

          <Select value={form.project} onValueChange={handleProjectChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('selectProject')} />
            </SelectTrigger>
            <SelectContent>
              {projects.map((proj) => (
                <SelectItem key={proj._id} value={proj._id}>
                  {proj.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={form.status}
            onValueChange={(value) => handleChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('taskStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="À faire">À faire</SelectItem>
              <SelectItem value="En cours">En cours</SelectItem>
              <SelectItem value="En révision">En révision</SelectItem>
              <SelectItem value="Terminé">Terminé</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={form.priority}
            onValueChange={(value) => handleChange('priority', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('taskPriority')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Basse">Basse</SelectItem>
              <SelectItem value="Moyenne">Moyenne</SelectItem>
              <SelectItem value="Haute">Haute</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            value={form.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
          />

          <Button type="submit" className="w-full">
            {t('saveTask')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
