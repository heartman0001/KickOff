// heartman0001/kickoff/KickOff-e19b0ed1775f45297adf3e9cce5275e834e87132/components/ProfileModal.tsx

import React, { useState, useEffect } from 'react';
import { User, EditProfileFormData } from '../types';
import { X, Upload, User as UserIcon } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  // Note: onUpdate ถูกปรับเป็น async ใน App.tsx
  onUpdate: (data: EditProfileFormData) => Promise<void>; 
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, currentUser, onUpdate }) => {
  const [formData, setFormData] = useState<EditProfileFormData>({
    name: '',
    avatar: '',
    age: undefined,
    height: undefined, // <<< เพิ่ม
    weight: undefined, // <<< เพิ่ม
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        avatar: currentUser.avatar,
        age: currentUser.age,
        height: currentUser.height, // <<< เพิ่ม
        weight: currentUser.weight, // <<< เพิ่ม
      });
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(formData); // <<< ใช้ await
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* ... (Header และ Avatar Upload เหมือนเดิม) */}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Avatar Upload (JSX เหมือนเดิม) */}

          {/* Inputs */}
          <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                required
                />
            </div>
            
            {/* Age Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                type="number"
                min="1"
                max="100"
                value={formData.age || ''}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || undefined })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="e.g. 24"
                />
            </div>
            
            {/* Height Input <<< เพิ่ม */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                <input
                type="number"
                min="50"
                value={formData.height || ''}
                onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || undefined })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="e.g. 175"
                />
            </div>

            {/* Weight Input <<< เพิ่ม */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input
                type="number"
                min="10"
                value={formData.weight || ''}
                onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) || undefined })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="e.g. 70"
                />
            </div>

          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-200 transition-all"
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};