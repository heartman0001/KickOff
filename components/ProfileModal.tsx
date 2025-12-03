
import React, { useState, useEffect } from 'react';
import { User, EditProfileFormData } from '../types';
import { X, Upload, User as UserIcon } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUpdate: (data: EditProfileFormData) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, currentUser, onUpdate }) => {
  const [formData, setFormData] = useState<EditProfileFormData>({
    name: '',
    avatar: '',
    age: undefined
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        avatar: currentUser.avatar,
        age: currentUser.age
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="bg-orange-500 px-6 py-4 flex justify-between items-center">
          <h2 className="text-white font-bold text-lg">Edit Profile</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-orange-100">
                    {formData.avatar ? (
                        <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                            <UserIcon size={40} />
                        </div>
                    )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Upload className="text-white w-8 h-8" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
            </div>
            <span className="text-xs text-gray-500">Click to change photo</span>
          </div>

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
