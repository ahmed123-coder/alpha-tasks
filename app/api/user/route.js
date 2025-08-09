import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import connect from '@/lib/db';
import User from '@/models/User';

// استخراج المستخدم من التوكن
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

// ✅ GET: جلب جميع المستخدمين (Admin فقط)
export async function GET(req) {
  await connect();
  const user = getUserFromToken(req);

  if (!user || user.role !== 'Admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const users = await User.find().select('-password');
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// ✅ POST: إنشاء مستخدم جديد
export async function POST(req) {
  await connect();
  const user = getUserFromToken(req);

  if (!user || user.role !== 'Admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { firstName, lastName, email, password, role } = body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'Email already in use' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || 'Invité',
    });

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// ✅ PUT: تعديل مستخدم (Admin فقط)
export async function PUT(req) {
  await connect();
  const user = getUserFromToken(req);

  if (!user || user.role !== 'Admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { userId, firstName, lastName, password, email, role } = body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, email, role, password: password ? await bcrypt.hash(password, 10) : undefined },
      { new: true }
    );

    return NextResponse.json({ message: 'User updated', user: updatedUser });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// ✅ DELETE: حذف مستخدم (Admin فقط)
export async function DELETE(req) {
  await connect();
  const user = getUserFromToken(req);

  if (!user || user.role !== 'Admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('id');

    await User.findByIdAndDelete(userId);
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
