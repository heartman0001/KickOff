
import React, { useState, useEffect } from 'react';
import { CreateMeetupFormData } from '../types';
import { X, Wand2, Loader2, Upload, Image as ImageIcon, MapPin, Info } from 'lucide-react';
import { generateSmartDescription } from '../services/geminiService';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMeetupFormData) => void;
  initialData?: CreateMeetupFormData;
}

export const CreateModal: React.FC<CreateModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<CreateMeetupFormData>({
    title: '',
    location: '',
    plusCode: '',
    date: '',
    time: '',
    description: '',
    maxPlayers: 10,
    image: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
      } else {
        // Reset form on new open
        setFormData({
            title: '',
            location: '',
            plusCode: '',
            date: '',
            time: '',
            description: '',
            maxPlayers: 10,
            image: ''
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSmartGenerate = async () => {
    if (!formData.title || !formData.location) {
      alert("Please enter at least a Title and Location first!");
      return;
    }
    setIsGenerating(true);
    try {
      const smartDesc = await generateSmartDescription(formData.title, formData.description, formData.location);
      setFormData(prev => ({ ...prev, description: smartDesc }));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-orange-500 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-white font-bold text-lg">{initialData ? 'Edit Match' : 'Create New Match'}</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Image Upload */}
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
             <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 relative overflow-hidden group transition-all hover:border-orange-300">
                    {formData.image ? (
                        <>
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                                    <Upload className="text-white w-6 h-6" />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <div className="bg-orange-100 p-3 rounded-full mb-3 text-orange-500">
                                <ImageIcon size={24} />
                            </div>
                            <p className="text-sm text-gray-500 font-medium">Click to upload image</p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                        </div>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Friday Night Futsal"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
            <div className="relative">
                <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Search stadium or place..."
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none pl-10"
                />
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <MapPin size={18} />
                </span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Google Maps Plus Code (Optional)</label>
                <a href="https://support.google.com/maps/answer/7047426" target="_blank" rel="noopener noreferrer" className="text-xs text-orange-600 flex items-center gap-1 hover:underline">
                    <Info size={12} /> What is this?
                </a>
            </div>
            <input
            type="text"
            name="plusCode"
            value={formData.plusCode}
            onChange={handleChange}
            placeholder="e.g. RJM3+R4 Bangkok"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Copy the "Plus Code" from Google Maps for exact location.</p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Description & Notes</label>
                <button
                    type="button"
                    onClick={handleSmartGenerate}
                    disabled={isGenerating}
                    className="text-xs flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium disabled:opacity-50"
                >
                    {isGenerating ? <Loader2 size={12} className="animate-spin"/> : <Wand2 size={12} />}
                    AI Magic
                </button>
            </div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Specific rules? Jersey colors? AI can spice this up!"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Players</label>
            <select
                name="maxPlayers"
                value={formData.maxPlayers}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            >
                {[5, 7, 10, 12, 14, 16, 22].map(num => (
                    <option key={num} value={num}>{num} Players</option>
                ))}
            </select>
          </div>

          <div className="pt-4 pb-2">
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {initialData ? 'Update Match' : 'Create Match'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
