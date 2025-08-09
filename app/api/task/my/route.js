import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connect from '@/lib/db';
import Task from '@/models/Task';

export async function GET(req) {
  await connect();

  try {
    // التحقق من التوكن
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = decoded.userId;

    // جلب المهام التي assignedTo تحتوي على الـ userId
    const myTasks = await Task.find({ assignedTo: userId })
      .populate('project', 'name') // يجيب اسم المشروع
      .populate('assignedTo', 'firstName lastName') // أسماء المعينين
      .sort({ createdAt: -1 });

    return NextResponse.json({ tasks: myTasks }, { status: 200 });

  } catch (error) {
    console.error('Error fetching my tasks:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
