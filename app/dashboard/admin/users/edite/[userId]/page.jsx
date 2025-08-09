'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

const EditUserPage = () => {
  const { userId } = useParams();
  const router = useRouter();

  const [user, setUser] = useState(null);
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

  // Get single user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const fetchedUser = res.data.user;
        setUser(fetchedUser);
        setForm({
          firstName: fetchedUser.firstName,
          lastName: fetchedUser.lastName,
          email: fetchedUser.email,
          password: '',
          role: fetchedUser.role,
        });
      } catch (error) {
        console.error('Failed to fetch user', error);
        setError('فشل في جلب بيانات المستخدم');
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await axios.put(
        `http://localhost:3000/api/user`,
        {
          userId,
          ...form,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setMessage('✅ تم تحديث المستخدم بنجاح');
      setTimeout(() => {
        router.push('/dashboard/admin'); // أو إلى صفحة المستخدمين
      }, 1500);
    } catch (error) {
      console.error('Error updating user:', error);
      setError('❌ حدث خطأ أثناء التحديث، حاول مرة أخرى.');
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">⏳ جاري تحميل بيانات المستخدم...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">✏️ تعديل المستخدم</h1>

      {message && (
        <div className="mb-6 p-3 text-green-700 bg-green-100 rounded text-center font-semibold">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 text-red-700 bg-red-100 rounded text-center font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="الاسم الأول"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="الاسم العائلي"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="البريد الإلكتروني"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="كلمة المرور (اتركها فارغة للاحتفاظ الحالية)"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="Admin">مدير (Admin)</option>
          <option value="Membre">عضو (Membre)</option>
          <option value="Invité">ضيف (Invité)</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
        >
          تحديث المستخدم
        </button>
      </form>
    </div>
  );
};

export default EditUserPage;
