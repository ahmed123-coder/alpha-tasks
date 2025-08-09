'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function EditTaskPage() {
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

  // جلب بيانات المهمة والمشاريع
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        // جلب المهمة
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

        // جلب المشاريع
        const resProjects = await axios.get('http://localhost:3000/api/project', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(resProjects.data.projects);

        // تحميل أعضاء المشروع الحالي مباشرة
        if (fetchedTask.project?._id || fetchedTask.project) {
          const resProjectDetail = await axios.get(
            `http://localhost:3000/api/project/${fetchedTask.project?._id || fetchedTask.project}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setProjectMembers(resProjectDetail.data.project.members || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('❌ فشل في تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };

    if (taskId) fetchData();
  }, [taskId]);

  // عند تغيير المشروع، نحدّث قائمة الأعضاء
  const handleProjectChange = async (e) => {
    const projectId = e.target.value;
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssignedChange = (e) => {
    const options = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setForm((prev) => ({ ...prev, assignedTo: options }));
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
      setMessage('✔️ تم تحديث المهمة بنجاح');
      setTimeout(() => router.push('/dashboard/admin/tasks'), 1500);
    } catch (error) {
      console.error('Error updating task:', error);
      setMessage('❌ حدث خطأ أثناء التحديث');
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-500">⏳ جاري تحميل بيانات المهمة...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">✏️ تعديل المهمة</h1>

      {message && (
        <p
          className={`mb-6 text-center font-semibold ${
            message.includes('✔️') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
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
          onChange={handleProjectChange}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="">اختر المشروع</option>
          {projects.map((proj) => (
            <option key={proj._id} value={proj._id}>
              {proj.name}
            </option>
          ))}
        </select>

        <select
          multiple
          name="assignedTo"
          value={form.assignedTo}
          onChange={handleAssignedChange}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          size={Math.min(projectMembers.length, 6)}
          title="اختر أعضاء المشروع"
        >
          {projectMembers.map((usr) => (
            <option key={usr._id} value={usr._id}>
              {usr.firstName} {usr.lastName}
            </option>
          ))}
        </select>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
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
          required
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
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          تحديث المهمة
        </button>
      </form>
    </div>
  );
}
