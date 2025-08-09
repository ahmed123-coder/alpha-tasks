import { NextResponse } from 'next/server';
import connect from '@/lib/db';
import User from '@/models/User';
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
    const targetUser = await User.findById(params.userId);
    if (!targetUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ user: targetUser });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching user' }, { status: 500 });
  }
} 

export async function DELETE(req, { params }) {
  await connect();
  const user = getUserFromToken(req);

  if (!user || user.role !== 'Admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(params.userId);
    if (!deletedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Error deleting user' }, { status: 500 });
  }
}