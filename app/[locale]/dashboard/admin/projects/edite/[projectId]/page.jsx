'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { useTranslations } from 'next-intl';

export default function EditProjectPage() {
  const t = useTranslations('EditProjectPage');
  const { projectId } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    description: '',
    dueDate: '',
    members: [],
    owner: '',
  });
  const [loadingProject, setLoadingProject] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('token');
        const projectRes = await axios.get(`http://localhost:3000/api/project/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const project = projectRes.data.project;
        setForm({
          name: project.name,
          description: project.description || '',
          dueDate: project.dueDate ? new Date(project.dueDate).toISOString().split('T')[0] : '',
          members: project.members?.map((m) => m._id) || [],
          owner: project.owner?._id || '',
        });
      } catch (err) {
        console.error('Error fetching project:', err);
        setMessage(t('loadProjectError'));
        setMessageType('error');
      } finally {
        setLoadingProject(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const usersRes = await axios.get('http://localhost:3000/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllUsers(usersRes.data.users);
      } catch (err) {
        console.error('Error fetching users:', err);
        setMessage(t('loadUsersError'));
        setMessageType('error');
      } finally {
        setLoadingUsers(false);
      }
    };

    if (projectId) {
      fetchProject();
      fetchUsers();
    }
  }, [projectId, t]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage('');
    setMessageType('');
  };

  const toggleMember = (userId) => {
    setForm((prev) => ({
      ...prev,
      members: prev.members.includes(userId)
        ? prev.members.filter((id) => id !== userId)
        : [...prev.members, userId],
    }));
    setMessage('');
    setMessageType('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:3000/api/project',
        { projectId, ...form },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(t('updateSuccess'));
      setMessageType('success');
      setTimeout(() => router.push('/dashboard/admin/projects'), 1500);
    } catch (err) {
      console.error('Error updating project:', err);
      setMessage(t('updateError'));
      setMessageType('error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProject || loadingUsers) return <p>{t('loading')}</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>✏️ {t('editProject')}</CardTitle>
        </CardHeader>

        <CardContent>
          {message && (
            <Alert variant={messageType === 'error' ? 'destructive' : 'default'} className="mb-4">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>{t('projectName')}</Label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                disabled={submitting}
              />
            </div>

            <div>
              <Label>{t('description')}</Label>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>

            <div>
              <Label>{t('dueDate')}</Label>
              <Input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>

            <div>
              <Label>{t('owner')}</Label>
              <select
                name="owner"
                value={form.owner}
                onChange={handleChange}
                disabled={submitting}
                className="w-full border rounded p-2"
              >
                <option value="">{t('chooseOwner')}</option>
                {allUsers.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.firstName} {u.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>👥 {t('members')}</Label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border p-2 rounded">
                {allUsers.map((u) => (
                  <label key={u._id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.members.includes(u._id)}
                      onChange={() => toggleMember(u._id)}
                      disabled={submitting}
                    />
                    {u.firstName} {u.lastName}
                  </label>
                ))}
              </div>
            </div>

            <CardFooter className="px-0">
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? t('saving') : t('updateProject')}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
