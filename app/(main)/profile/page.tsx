'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useStore } from '@/store/useStore';

export default function ProfilePage() {
  const router = useRouter();
  const user = useStore((state) => state.user);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    setFormData({
      username: user.username || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
    });
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');

    try {
      // In a real app, this would call an API to update the user profile
      // For now, we'll just simulate the save
      setTimeout(() => {
        setMessage('Profile updated successfully!');
        setIsEditing(false);
        setIsSaving(false);

        setTimeout(() => setMessage(''), 3000);
      }, 500);
    } catch (error) {
      setMessage('Failed to update profile');
      setIsSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-amber-900 mb-8">My Profile</h1>

      {message && (
        <div
          className={`mb-6 px-4 py-3 rounded border ${
            message.includes('success')
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {message}
        </div>
      )}

      <Card className="p-8 border-amber-200">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Username
            </label>
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={!isEditing}
              className="border-amber-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Email
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className="border-amber-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Phone
            </label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className="border-amber-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Address
            </label>
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={!isEditing}
              className="border-amber-200"
            />
          </div>

          <div className="flex gap-4">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700 text-white flex-1"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="border-amber-200 flex-1"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white w-full"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
