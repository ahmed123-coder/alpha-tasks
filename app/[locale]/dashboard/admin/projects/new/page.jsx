'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';

export default function CreateProjectPage() {
  const t = useTranslations('CreateProjectPage');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/user/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = response.data;
        setUser(data.user);
        if (data.user.role === 'Membre') router.push('/dashboard/Membre');
        if (data.user.role === 'Invité') router.push('/dashboard');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/user', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setAllUsers(res.data.users);
      } catch (err) {
        console.error('Error fetching users', err);
      }
    };

    fetchUser();
    fetchUsers();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:3000/api/project',
        { name, description, dueDate, members },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      router.push('/dashboard/admin/projects');
    } catch (err) {
      setError(err.response?.data?.error || t('error'));
    }
  };

  const toggleMember = (userId) => {
    setMembers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  return (
    <div className="flex justify-center mt-10">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>📁 {t('createProject')}</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">{t('projectName')}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">{t('description')}</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="dueDate">{t('dueDate')}</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div>
              <Label>👥 {t('members')}</Label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border p-2 rounded">
                {allUsers.map((user) => (
                  <div key={user._id} className="flex items-center space-x-2">
                    <Checkbox
                      id={user._id}
                      checked={members.includes(user._id)}
                      onCheckedChange={() => toggleMember(user._id)}
                    />
                    <Label htmlFor={user._id}>
                      {user.firstName} {user.lastName}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <CardFooter className="p-0">
              <Button type="submit" className="w-full">{t('saveProject')}</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
