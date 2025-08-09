'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function MemberDashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const editstatusofTask = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:3000/api/task/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('تم تحديث حالة المهمة بنجاح ✅');
      router.refresh();
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('حدث خطأ أثناء تحديث حالة المهمة ❌');
    }
  };

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/user/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const me = res.data.user;

        if (me.role === 'Admin') router.push('/dashboard/admin');
        if (me.role === 'Invité') router.push('/dashboard');
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('فشل في التحقق من المستخدم.');
      }
    };

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const projectsRes = await axios.get('http://localhost:3000/api/project/my', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const tasksRes = await axios.get('http://localhost:3000/api/task/my', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProjects(projectsRes.data.projects || []);
        setTasks(tasksRes.data.tasks || []);
      } catch (err) {
        console.error(err);
        setError('فشل في تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
    fetchData();
  }, [router]);

  if (loading) return <p className="text-center mt-10 text-lg">⏳ جارٍ التحميل...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="bg-gray-50 min-h-screen px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-10 flex items-center gap-2">
          📋 لوحة تحكم العضو
        </h1>

        {/* المشاريع */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">📁 مشاريعي</h2>
          {projects.length === 0 ? (
            <p className="text-gray-500 text-center">لا توجد مشاريع حالياً 🚀</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {project.description || 'لا يوجد وصف'}
                  </p>
                  <div className="space-y-1 text-sm text-gray-500">
                    <p>📅 تاريخ التسليم: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'غير محدد'}</p>
                    <p>👑 المالك: {project.owner ? `${project.owner.firstName} ${project.owner.lastName}` : 'غير محدد'}</p>
                    <p>👥 الأعضاء: {project.members?.map((m) => m.firstName).join(', ') || 'لا يوجد أعضاء'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* المهام */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">✅ مهامي</h2>
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center">لا توجد مهام حالياً 📌</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{task.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {task.description || 'لا يوجد وصف'}
                  </p>
                  <div className="space-y-1 text-sm text-gray-500 mb-4">
                    <p>📅 تاريخ التسليم: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'غير محدد'}</p>
                    <p>📌 الحالة: <span className="font-medium">{task.status || 'غير محدد'}</span></p>
                  </div>

                  {/* أزرار تغيير الحالة */}
                  <div className="flex flex-wrap gap-2">
                    {['À faire', 'En cours', 'En révision', 'Terminé']
                      .filter(status => status !== task.status)
                      .map(status => (
                        <button
                          key={status}
                          onClick={() => editstatusofTask(task._id, status)}
                          className={`px-3 py-1 text-sm rounded-full transition ${
                            status === 'À faire'
                              ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                              : status === 'En cours'
                              ? 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                              : status === 'En révision'
                              ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
                              : 'bg-green-100 hover:bg-green-200 text-green-700'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
