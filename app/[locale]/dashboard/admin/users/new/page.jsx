'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from 'next-intl';

export default function NewUserPage() {
  const t = useTranslations('NewUserPage');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'Invité',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get('http://localhost:3000/api/user/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (data.user.role === 'Membre') {
          router.push('/dashboard/member');
        } else if (data.user.role === 'Invité') {
          router.push('/dashboard');
        }
      } catch {
        setError(t('authFail'));
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router, t]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:3000/api/user', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSuccess(t('createSuccess'));
      setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'Invité' });
    } catch (err) {
      setError(err.response?.data?.message || t('createError'));
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">⏳ {t('loading')}</p>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">{t('title')}</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              name="firstName"
              placeholder={t('firstName')}
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <Input
              type="text"
              name="lastName"
              placeholder={t('lastName')}
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <Input
              type="email"
              name="email"
              placeholder={t('email')}
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              type="password"
              name="password"
              placeholder={t('password')}
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('selectRole')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">{t('admin')}</SelectItem>
                <SelectItem value="Membre">{t('member')}</SelectItem>
                <SelectItem value="Invité">{t('guest')}</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="w-full">{t('createUser')}</Button>
          </form>
        </CardContent>
        <CardFooter />
      </Card>
    </div>
  );
}
