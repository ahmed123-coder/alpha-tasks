import { NextResponse } from 'next/server';
import connect from '@/lib/db';
import Task from '@/models/Task';
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
}

// get task by id
export async function GET(req, { params }) {
  await connect();
  const user = getUserFromToken(req);

  if (!user || user.role !== 'Admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const task = await Task.findById(params.taskId);
    if (!task) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ task });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching task' }, { status: 500 });
  }
}

// delete task by id
export async function DELETE(req, { params }) {
  await connect();
  const user = getUserFromToken(req);

  if (!user || user.role !== 'Admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const task = await Task.findByIdAndDelete(params.taskId);
    if (!task) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting task' }, { status: 500 });
  }
}

// update task by id
export async function PUT(req, { params }) {
  await connect();
  const user = getUserFromToken(req);

  if (!user || user.role === 'Invité') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { status } = await req.json();
    const updatedTask = await Task.findByIdAndUpdate(
      params.taskId,
      { status },
      { new: true }
    );

    if (!updatedTask) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ task: updatedTask }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating task' }, { status: 500 });
  }
}