'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from 'next-intl';

export default function EditUserPage() {
  const t = useTranslations('EditUserPage');
  const { userId } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/user/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const fetchedUser = res.data.user;
        setForm({
          firstName: fetchedUser.firstName,
          lastName: fetchedUser.lastName,
          email: fetchedUser.email,
          password: '',
          role: fetchedUser.role,
        });
      } catch {
        setError(t('fetchError'));
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [userId, t]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value) => {
    setForm((prev) => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await axios.put(
        `http://localhost:3000/api/user`,
        { userId, ...form },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setMessage(t('updateSuccess'));
      setTimeout(() => router.push('/dashboard/admin'), 1500);
    } catch {
      setError(t('updateError'));
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">⏳ {t('loading')}</p>;

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">{t('title')}</CardTitle>
        </CardHeader>
        <CardContent>
          {message && (
            <Alert className="mb-4">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder={t('firstName')}
              required
            />
            <Input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder={t('lastName')}
              required
            />
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder={t('email')}
              required
            />
            <Input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder={t('password')}
            />
            <Select value={form.role} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder={t('selectRole')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">{t('admin')}</SelectItem>
                <SelectItem value="Membre">{t('member')}</SelectItem>
                <SelectItem value="Invité">{t('guest')}</SelectItem>
              </SelectContent>
            </Select>

            <Button type="submit" className="w-full">{t('updateUser')}</Button>
          </form>
        </CardContent>
        <CardFooter />
      </Card>
    </div>
  );
}
