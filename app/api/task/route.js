import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connect from '@/lib/db';
import Task from '@/models/Task';

// 🧠 استخراج المستخدم من التوكن
function getUserFromToken(req) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;

  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error('Token error:', err);
    return null;
  }
}

// ✅ GET: جلب كل المهام
export async function GET(req) {
  await connect();
    const user = getUserFromToken(req);

  if (!user || user.role !== 'Admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const tasks = await Task.find().populate('project assignedTo');
    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// ✅ POST: إنشاء مهمة جديدة (Admin فقط)
export async function POST(req) {
  await connect();
  const user = getUserFromToken(req);

  if (!user || user.role !== 'Admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const newTask = await Task.create(body);
    return NextResponse.json({ message: 'Task created', task: newTask }, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// ✅ PUT: تعديل مهمة (Admin فقط)
export async function PUT(req) {
  await connect();
  const user = getUserFromToken(req);

  if (!user || user.role !== 'Admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { taskId, ...updates } = body;

    const updatedTask = await Task.findByIdAndUpdate(taskId, updates, { new: true });
    return NextResponse.json({ message: 'Task updated', task: updatedTask }, { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// ✅ DELETE: حذف مهمة (Admin فقط)
export async function DELETE(req) {
  await connect();
  const user = getUserFromToken(req);

  if (!user || user.role !== 'Admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get('id');

    await Task.findByIdAndDelete(taskId);
    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
