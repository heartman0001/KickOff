
import React, { useState } from 'react';
import { Meetup, User, MeetupStatus } from '../types';
import { MapPin, Calendar, Clock, Users, MessageSquare, Trash2, Edit2, CheckCircle, XCircle, Eye, ExternalLink } from 'lucide-react';

interface MeetupCardProps {
  meetup: Meetup;
  currentUser: User;
  onJoin: (meetupId: string) => void;
  onDecline: (meetupId: string) => void;
  onDelete: (meetupId: string) => void;
  onEdit: (meetup: Meetup) => void;
  onViewDetails: (meetup: Meetup) => void;
  getParticipantDetails: (ids: string[]) => User[];
}

export const MeetupCard: React.FC<MeetupCardProps> = ({
  meetup,
  currentUser,
  onJoin,
  onDecline,
  onDelete,
  onEdit,
  onViewDetails,
  getParticipantDetails
}) => {
  const isHost = meetup.hostId === currentUser.id;
  const isJoined = meetup.participants.includes(currentUser.id);
  const participants = getParticipantDetails(meetup.participants);
  const spotsLeft = meetup.maxPlayers - meetup.participants.length;
  const [showComments, setShowComments] = useState(false);

  const hasPlusCode = !!meetup.plusCode;
  const googleMapsUrl = hasPlusCode 
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(meetup.plusCode || '')}`
    : undefined;

  // Mock status badge colors
  const statusColors = {
    [MeetupStatus.UPCOMING]: 'bg-green-100 text-green-800 border-green-200',
    [MeetupStatus.COMPLETED]: 'bg-gray-100 text-gray-600 border-gray-200',
    [MeetupStatus.CANCELLED]: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col">
      {/* Image Section */}
      <div 
        className="relative h-48 w-full overflow-hidden group cursor-pointer"
        onClick={() => onViewDetails(meetup)}
      >
        <img
          src={meetup.image}
          alt={meetup.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80"></div>
        
        <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${statusColors[meetup.status]}`}>
                {meetup.status}
            </span>
        </div>

        {isHost && (
          <div className="absolute top-3 left-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
             <button 
                onClick={() => onEdit(meetup)}
                className="p-2 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-sm backdrop-blur-sm transition-all"
             >
               <Edit2 size={14} />
             </button>
             <button 
                onClick={() => onDelete(meetup.id)}
                className="p-2 bg-red-500/90 hover:bg-red-600 text-white rounded-full shadow-sm backdrop-blur-sm transition-all"
             >
               <Trash2 size={14} />
             </button>
          </div>
        )}

        <div className="absolute bottom-3 left-4 text-white">
           <h3 className="text-xl font-bold leading-tight shadow-black drop-shadow-md group-hover:text-orange-200 transition-colors">{meetup.title}</h3>
        </div>
      </div>

      {/* Body Section */}
      <div className="p-5 flex flex-col gap-4 flex-grow">
        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
                <Calendar size={16} className="text-orange-500" />
                <span>{new Date(meetup.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric'})}</span>
            </div>
            <div className="flex items-center gap-2">
                <Clock size={16} className="text-orange-500" />
                <span>{meetup.time}</span>
            </div>
            <div className="flex items-center gap-2 col-span-2">
                <MapPin size={16} className="text-orange-500" />
                {hasPlusCode ? (
                    <a 
                        href={googleMapsUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="truncate hover:text-orange-600 hover:underline flex items-center gap-1"
                        title={`Open ${meetup.plusCode} in Google Maps`}
                    >
                        {meetup.location}
                        <ExternalLink size={12} />
                    </a>
                ) : (
                    <span className="truncate">{meetup.location}</span>
                )}
            </div>
        </div>

        {/* Description */}
        <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
            <p className="text-gray-700 text-sm italic line-clamp-2">"{meetup.description}"</p>
        </div>

        {/* Participants */}
        <div className="flex items-center justify-between mt-auto pt-2">
            <div 
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => onViewDetails(meetup)}
            >
                <div className="flex -space-x-2 overflow-hidden">
                    {participants.slice(0, 4).map((p) => (
                        <img 
                            key={p.id} 
                            className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" 
                            src={p.avatar} 
                            alt={p.name} 
                        />
                    ))}
                    {participants.length > 4 && (
                        <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 text-xs font-medium text-gray-600">
                            +{participants.length - 4}
                        </div>
                    )}
                </div>
                <div className="text-xs text-gray-500 group-hover:text-orange-500 transition-colors">
                   <span className="font-semibold text-gray-900 group-hover:text-orange-600">{meetup.participants.length}/{meetup.maxPlayers}</span>
                </div>
            </div>
            
            {meetup.status === MeetupStatus.UPCOMING && (
                <div className="flex gap-2">
                    {!isJoined ? (
                        <button 
                            onClick={() => onJoin(meetup.id)}
                            disabled={spotsLeft <= 0}
                            className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold shadow-sm transition-all ${
                                spotsLeft > 0 
                                ? 'bg-orange-500 hover:bg-orange-600 text-white hover:shadow-orange-200' 
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {spotsLeft > 0 ? 'Join' : 'Full'}
                        </button>
                    ) : (
                        <button 
                            onClick={() => onDecline(meetup.id)}
                            className="flex items-center gap-1 px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-all"
                        >
                            Decline
                        </button>
                    )}
                </div>
            )}
        </div>

        {/* Actions Footer */}
        <div className="flex items-center gap-4 mt-2 pt-3 border-t border-gray-50">
             <button 
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-orange-500 transition-colors"
            >
                <MessageSquare size={14} />
                {meetup.comments.length} Comments
            </button>

            <button
                onClick={() => onViewDetails(meetup)}
                className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-orange-500 transition-colors ml-auto"
            >
                <Eye size={14} />
                View Details
            </button>
        </div>

      </div>

       {/* Comments Section */}
       {showComments && (
           <div className="bg-gray-50 p-4 border-t border-gray-100">
               {meetup.comments.length === 0 ? (
                   <p className="text-xs text-gray-400 text-center">No comments yet.</p>
               ) : (
                   <div className="space-y-3 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                       {meetup.comments.map(c => (
                           <div key={c.id} className="flex gap-2 items-start">
                               <img src={c.userAvatar} alt={c.userName} className="w-6 h-6 rounded-full" />
                               <div className="bg-white p-2 rounded-r-lg rounded-bl-lg shadow-sm text-xs flex-1">
                                   <p className="font-bold text-gray-800">{c.userName}</p>
                                   <p className="text-gray-600">{c.text}</p>
                               </div>
                           </div>
                       ))}
                   </div>
               )}
               <div className="mt-3 flex gap-2">
                   <input 
                    type="text" 
                    placeholder="Write a comment..." 
                    className="flex-1 text-xs border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:border-orange-500"
                   />
               </div>
           </div>
       )}
    </div>
  );
};
