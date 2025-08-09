'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function CreateProjectPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
  const router = useRouter();

  // جلب المستخدم الحالي والتأكد أنه Admin
  useEffect(() => {
          const fetchUser = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/user/me', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          const data = response.data;
          setUser(data.user);
          console.log('User data:', data.user);
          if (data.user.role === 'Membre') {
            router.push('/dashboard/Membre');
          }
          if (data.user.role === 'Invité') {
            router.push('/dashboard');
          }
        }
       catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // جلب جميع المستخدمين لاختيار الأعضاء
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
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
      const res = await axios.post(
        'http://localhost:3000/api/project',
        {
          name,
          description,
          dueDate,
          members,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      router.push('/dashboard/admin/projects'); // توجيه بعد الإنشاء
    } catch (err) {
      setError(err.response?.data?.error || 'حدث خطأ أثناء إنشاء المشروع');
    }
  };

  const toggleMember = (userId) => {
    setMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📁 إنشاء مشروع جديد</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">اسم المشروع:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border w-full p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">الوصف:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border w-full p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">تاريخ التسليم:</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border w-full p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">👥 الأعضاء:</label>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border p-2 rounded">
            {allUsers.map((user) => (
              <label key={user._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={members.includes(user._id)}
                  onChange={() => toggleMember(user._id)}
                />
                {user.firstName} {user.lastName}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          حفظ المشروع
        </button>
      </form>
    </div>
  );
}
