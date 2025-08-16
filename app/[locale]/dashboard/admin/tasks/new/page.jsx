'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useTranslations } from 'next-intl';

export default function NewTaskPage() {
  const t = useTranslations('NewTaskPage');
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    project: '',
    assignedTo: [],
    status: 'À faire',
    priority: 'Moyenne',
    dueDate: '',
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const projRes = await axios.get('http://localhost:3000/api/project', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(projRes.data.projects);
      } catch (err) {
        console.error(err);
        setError(t('errorFetchProjects'));
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, [t]);

  const handleChange = async (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');

    if (name === 'project') {
      if (value) {
        setLoadingMembers(true);
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(`http://localhost:3000/api/project/${value}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsers(res.data.project.members || []);
        } catch (err) {
          console.error(err);
          setUsers([]);
          setError(t('errorFetchMembers'));
        } finally {
          setLoadingMembers(false);
        }
      } else {
        setUsers([]);
      }
      setForm((prev) => ({ ...prev, assignedTo: [] }));
    }
  };

  const handleAssignedChange = (selected) => {
    setForm((prev) => ({ ...prev, assignedTo: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/api/task', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(t('successCreateTask'));
      setForm({
        title: '',
        description: '',
        project: '',
        assignedTo: [],
        status: 'À faire',
        priority: 'Moyenne',
        dueDate: '',
      });
      setUsers([]);
      setTimeout(() => router.push('/dashboard/admin/tasks'), 1500);
    } catch (err) {
      console.error(err);
      setError(t('errorCreateTask'));
    }
  };

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-6 bg-gray-50">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>➕ {t('title')}</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>{t('error')}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert variant="default" className="mb-4">
                <AlertTitle>{t('success')}</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
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
              <Select value={form.project} onValueChange={(val) => handleChange('project', val)} disabled={loadingProjects}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingProjects ? t('loadingProjects') : t('selectProject')} />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((proj) => (
                    <SelectItem key={proj._id} value={proj._id}>
                      {proj.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={form.status} onValueChange={(val) => handleChange('status', val)}>
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

              <Select value={form.priority} onValueChange={(val) => handleChange('priority', val)}>
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

              <select
                multiple
                value={form.assignedTo}
                onChange={(e) => handleAssignedChange(Array.from(e.target.selectedOptions, (o) => o.value))}
                disabled={loadingMembers || !form.project}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                size={Math.min(users.length || 3, 6)}
              >
                {loadingMembers && <option disabled>{t('loadingMembers')}</option>}
                {!loadingMembers &&
                  users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.firstName} {u.lastName}
                    </option>
                  ))}
              </select>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                {t('saveTask')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
