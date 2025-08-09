'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import SidebarAdmin from '@/app/dashboard/components/sidebaradmin';

const NewTaskPage = () => {
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
      } catch (error) {
        console.error('Error fetching projects', error);
        setError('فشل في جلب المشاريع');
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');

    if (name === 'project' && value) {
      setLoadingMembers(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:3000/api/project/${value}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.project.members || []);
      } catch (error) {
        console.error('Error fetching project members:', error);
        setUsers([]);
        setError('فشل في جلب أعضاء المشروع');
      } finally {
        setLoadingMembers(false);
      }
    } else if (name === 'project') {
      setUsers([]);
    }
  };

  const handleAssignedChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
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
      setSuccess('تم إنشاء المهمة بنجاح!');
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
    } catch (error) {
      console.error('Error creating task', error);
      setError('حدث خطأ أثناء إنشاء المهمة');
    }
  };

  return (
    <div className="flex min-h-screen">
      <SidebarAdmin />
      <main className="flex-1 p-6 bg-gray-50">
        <h1 className="text-3xl font-bold mb-6">➕ إضافة مهمة جديدة</h1>

        {error && <p className="mb-4 text-red-600 font-semibold">{error}</p>}
        {success && <p className="mb-4 text-green-600 font-semibold">{success}</p>}

        <form onSubmit={handleSubmit} className="max-w-xl space-y-5 bg-white p-6 rounded shadow">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="عنوان المهمة"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="وصف المهمة"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={4}
          />
          <select
            name="project"
            value={form.project}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            disabled={loadingProjects}
          >
            <option value="">{loadingProjects ? 'جارِ تحميل المشاريع...' : 'اختر المشروع'}</option>
            {projects.map((proj) => (
              <option key={proj._id} value={proj._id}>
                {proj.name}
              </option>
            ))}
          </select>

          <select
            name="assignedTo"
            multiple
            value={form.assignedTo}
            onChange={handleAssignedChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            size={Math.min(users.length || 3, 6)}
            disabled={loadingMembers || !form.project}
            title="اختر أعضاء المشروع"
          >
            {loadingMembers && <option disabled>جارِ تحميل الأعضاء...</option>}
            {!loadingMembers && users.length === 0 && form.project && (
              <option disabled>لا يوجد أعضاء لهذا المشروع</option>
            )}
            {!loadingMembers &&
              users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.firstName} {u.lastName}
                </option>
              ))}
          </select>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="À faire">À faire</option>
            <option value="En cours">En cours</option>
            <option value="En révision">En révision</option>
            <option value="Terminé">Terminé</option>
          </select>

          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="Basse">Basse</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Haute">Haute</option>
          </select>

          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
          >
            حفظ المهمة
          </button>
        </form>
      </main>
    </div>
  );
};

export default NewTaskPage;
