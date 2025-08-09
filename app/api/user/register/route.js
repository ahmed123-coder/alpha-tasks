// src/app/api/register/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connect from '@/lib/db';
import User from '@/models/User';

export async function POST(req) {
  await connect();
  const { firstName, lastName, email, password} = await req.json();

  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ message: 'Email already exists' }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ firstName, lastName, email, password: hashedPassword });
  await user.save();

  return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
}