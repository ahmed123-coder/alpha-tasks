import { NextResponse } from 'next/server';
import Project from '@/models/Project';
import connect from '@/lib/db';
import jwt from 'jsonwebtoken';


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
};
export async function GET(req) {
  await connect();

  const user = getUserFromToken(req);
  if (!user || user.role !== 'Admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const projects = await Project.find().populate('members owner', 'firstName lastName email');
    return NextResponse.json({ projects });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req) {
  await connect();

  const user = getUserFromToken(req);
  if (!user || user.role !== 'Admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const newProject = await Project.create({
      name: body.name,
      description: body.description,
      dueDate: body.dueDate,
      members: body.members, // يجب أن يكون مصفوفة من معرفات المستخدمين
      owner: user._id, // تعيين المالك للمستخدم الحالي
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(req) {
  await connect();

  const user = getUserFromToken(req);
  if (!user || user.role !== 'Admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const projectId = body.projectId;

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      {
        name: body.name,
        description: body.description,
        dueDate: body.dueDate,
        members: body.members,
      },
      { new: true }
    );

    if (!updatedProject) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProject);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}