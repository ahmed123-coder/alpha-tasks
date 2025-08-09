'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function EditProjectPage() {
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
  const [messageType, setMessageType] = useState(''); // 'error' or 'success'
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
        setMessage('حدث خطأ أثناء تحميل بيانات المشروع');
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
        setMessage('حدث خطأ أثناء تحميل بيانات المستخدمين');
        setMessageType('error');
      } finally {
        setLoadingUsers(false);
      }
    };

    if (projectId) {
      fetchProject();
      fetchUsers();
    }
  }, [projectId]);

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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('تم تحديث المشروع بنجاح ✔️');
      setMessageType('success');

      setTimeout(() => {
        router.push('/dashboard/admin/projects');
      }, 1500);
    } catch (err) {
      console.error('Error updating project:', err);
      setMessage('حدث خطأ أثناء تحديث المشروع ❌');
      setMessageType('error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProject || loadingUsers) return <p>جارٍ تحميل البيانات...</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">✏️ تعديل المشروع</h1>

      {message && (
        <p
          className={`mb-4 text-center font-semibold ${
            messageType === 'error' ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="اسم المشروع"
          className="w-full p-2 border rounded"
          required
          disabled={submitting}
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="الوصف"
          className="w-full p-2 border rounded"
          disabled={submitting}
        />

        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          disabled={submitting}
        />

        <select
          name="owner"
          value={form.owner}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          disabled={submitting}
        >
          <option value="">اختر المالك</option>
          {allUsers.map((u) => (
            <option key={u._id} value={u._id}>
              {u.firstName} {u.lastName}
            </option>
          ))}
        </select>

        <div>
          <label className="block font-semibold mb-2">👥 الأعضاء:</label>
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

        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-2 rounded text-white ${
            submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {submitting ? 'جارٍ الحفظ...' : 'تحديث المشروع'}
        </button>
      </form>
    </div>
  );
}
