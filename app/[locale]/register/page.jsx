'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

const RegisterPage = () => {
  const t = useTranslations('RegisterPage');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3000/api/user/register', formData);

      if (response.status !== 201) {
        throw new Error(response.data.message || t('registerFailed'));
      }

      router.push('/login');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">{t('register')}</h1>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded-lg border border-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First Name */}
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
            <FaUser className="text-gray-400 mr-2" />
            <input
              type="text"
              name="firstName"
              placeholder={t('firstName')}
              value={formData.firstName}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent outline-none text-gray-700"
            />
          </div>

          {/* Last Name */}
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
            <FaUser className="text-gray-400 mr-2" />
            <input
              type="text"
              name="lastName"
              placeholder={t('lastName')}
              value={formData.lastName}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent outline-none text-gray-700"
            />
          </div>

          {/* Email */}
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
            <FaEnvelope className="text-gray-400 mr-2" />
            <input
              type="email"
              name="email"
              placeholder={t('email')}
              value={formData.email}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent outline-none text-gray-700"
            />
          </div>

          {/* Password */}
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type="password"
              name="password"
              placeholder={t('password')}
              value={formData.password}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent outline-none text-gray-700"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-all"
          >
            {t('submit')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {t('haveAccount')}{' '}
          <Link href="/login" className="text-blue-500 hover:underline">
            {t('login')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
