import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connect from '@/lib/db';
import Project from '@/models/Project';

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

    // جلب المشاريع التي المستخدم عضو فيها أو هو المالك
    const myProjects = await Project.find({
      $or: [
        { owner: userId },
        { members: userId }
      ]
    })
      .populate('owner', 'firstName lastName email')
      .populate('members', 'firstName lastName email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ projects: myProjects }, { status: 200 });

  } catch (error) {
    console.error('Error fetching my projects:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
