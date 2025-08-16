'use client';

import React from 'react';
import { FaEdit, FaTrash, FaUser } from 'react-icons/fa';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';

export default function UserCard({ user, onClick, onDelete }) {
  const t = useTranslations('UserCard');

  const handleDeleteUser = async () => {
    if (confirm(t('confirmDelete'))) {
      try {
        await axios.delete(`http://localhost:3000/api/user/${user._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        alert(t('deleteSuccess'));
        onDelete(user._id);
      } catch (err) {
        alert(t('deleteError'));
      }
    }
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full text-gray-600">
            <FaUser />
          </div>
          <div>
            <CardTitle>{user.firstName} {user.lastName}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm font-medium">{t('role')} {user.role}</p>
        <p className="text-xs text-gray-400">
          {t('createdAt')} {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button variant="outline" onClick={onClick}>
          <FaEdit /> {t('edit')}
        </Button>
        <Button variant="destructive" onClick={handleDeleteUser}>
          <FaTrash /> {t('delete')}
        </Button>
      </CardFooter>
    </Card>
  );
}
