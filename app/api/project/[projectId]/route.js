import { NextResponse } from 'next/server';
import connect from '@/lib/db';
import Project from '@/models/Project';
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
export async function GET(req, { params }) {
  await connect();

  const user = getUserFromToken(req);
  if (!user || user.role !== 'Admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const project = await Project.findById(params.projectId).populate('members owner', 'firstName lastName email');
    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ project });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await connect();

  const user = getUserFromToken(req);
  if (!user || user.role !== 'Admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const deletedProject = await Project.findByIdAndDelete(params.projectId);
    if (!deletedProject) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ message: 'Error deleting project' }, { status: 500 });
  }
}
