
import React from 'react';
import { Meetup, User, MeetupStatus } from '../types';
import { X, Calendar, Clock, MapPin, Users, ExternalLink } from 'lucide-react';

interface MeetupDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetup: Meetup | null;
  participants: User[];
}

export const MeetupDetailsModal: React.FC<MeetupDetailsModalProps> = ({ isOpen, onClose, meetup, participants }) => {
  if (!isOpen || !meetup) return null;

  const hasPlusCode = !!meetup.plusCode;
  const googleMapsUrl = hasPlusCode 
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(meetup.plusCode || '')}`
    : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
        
        {/* Header / Image */}
        <div className="relative h-48 shrink-0">
            <img src={meetup.image} alt={meetup.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-md transition-all"
            >
                <X size={20} />
            </button>
            
            <div className="absolute bottom-4 left-6 text-white">
                <h2 className="text-2xl font-bold shadow-sm">{meetup.title}</h2>
            </div>
        </div>

        {/* Content Scrollable Area */}
        <div className="overflow-y-auto p-6 space-y-6">
            
            {/* Info Strip */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-orange-500" />
                    <span>{new Date(meetup.date).toLocaleDateString()}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <Clock size={16} className="text-orange-500" />
                    <span>{meetup.time}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-orange-500" />
                    <span>{meetup.location}</span>
                </div>
                {hasPlusCode && (
                     <a 
                        href={googleMapsUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-orange-600 font-medium hover:underline bg-orange-50 px-2 py-0.5 rounded-md"
                     >
                        <ExternalLink size={14} />
                        View Map
                     </a>
                )}
            </div>

            {/* Description */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">About Match</h3>
                <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                    {meetup.description}
                </p>
            </div>

            {/* Participants List */}
            <div>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                        Participants ({participants.length}/{meetup.maxPlayers})
                    </h3>
                    {meetup.participants.length >= meetup.maxPlayers && (
                        <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                            Full Squad
                        </span>
                    )}
                </div>
                
                <div className="bg-white border border-gray-100 rounded-xl divide-y divide-gray-100 shadow-sm">
                    {participants.length > 0 ? (
                        participants.map((p) => (
                            <div key={p.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors">
                                <img 
                                    src={p.avatar} 
                                    alt={p.name} 
                                    className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100" 
                                />
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">{p.name}</p>
                                    {p.age && (
                                        <p className="text-xs text-gray-500">{p.age} years old</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-center text-gray-400 text-sm">
                            No players joined yet. Be the first!
                        </div>
                    )}
                </div>
            </div>
        </div>
        
        {/* Footer Action (Close) */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 shrink-0">
            <button 
                onClick={onClose}
                className="w-full py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
            >
                Close
            </button>
        </div>

      </div>
    </div>
  );
};
