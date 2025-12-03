
import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Auth } from './components/Auth';
import { MeetupCard } from './components/MeetupCard';
import { CreateModal } from './components/CreateModal';
import { ProfileModal } from './components/ProfileModal';
import { MeetupDetailsModal } from './components/MeetupDetailsModal';
import { FilterBar } from './components/FilterBar';
import { Meetup, User, MeetupStatus, CreateMeetupFormData, EditProfileFormData } from './types';
import { MOCK_USERS, INITIAL_MEETUPS, CURRENT_USER } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  // Maintain a local state of all users to handle profile updates reflecting in participants list
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS);
  
  const [meetups, setMeetups] = useState<Meetup[]>(INITIAL_MEETUPS);
  
  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [viewingMeetup, setViewingMeetup] = useState<Meetup | null>(null);
  const [editingMeetup, setEditingMeetup] = useState<Meetup | null>(null);
  
  // Navigation & Filter States
  const [currentView, setCurrentView] = useState<'feed' | 'history'>('feed');
  const [searchTerm, setSearchTerm] = useState('');

  // Handlers
  const handleLogin = async (email: string, password: string) => {
  const response = await fetch("http://localhost/kickoff-api/auth.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, mode: "login" })
  });

  const result = await response.json();
  if (result.success) {
    setUser({ id: result.userId, email: result.email }); // ใช้ข้อมูลจาก backend
  } else {
    alert(result.message);
  }
};


  const handleLogout = () => {
    setUser(null);
    setCurrentView('feed');
  };

  const handleUpdateProfile = (data: EditProfileFormData) => {
      if (!user) return;
      
      // Update current user state
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);

      // Update the "Database" of users so avatars/ages update in cards/details
      setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
  };

  const handleJoin = (meetupId: string) => {
    if (!user) return;
    setMeetups(prev => prev.map(m => {
      if (m.id === meetupId) {
        const updated = { ...m, participants: [...m.participants, user.id] };
        // If we are viewing this meetup details, update that state too
        if (viewingMeetup?.id === meetupId) {
            setViewingMeetup(updated);
        }
        return updated;
      }
      return m;
    }));
  };

  const handleDecline = (meetupId: string) => {
    if (!user) return;
    setMeetups(prev => prev.map(m => {
      if (m.id === meetupId) {
        const updated = { ...m, participants: m.participants.filter(id => id !== user.id) };
        // If we are viewing this meetup details, update that state too
        if (viewingMeetup?.id === meetupId) {
            setViewingMeetup(updated);
        }
        return updated;
      }
      return m;
    }));
  };

  const handleDelete = (meetupId: string) => {
    if (confirm('Are you sure you want to delete this meetup?')) {
        setMeetups(prev => prev.filter(m => m.id !== meetupId));
        if (viewingMeetup?.id === meetupId) setViewingMeetup(null);
    }
  };

  const handleSaveMeetup = (data: CreateMeetupFormData) => {
    if (!user) return;

    if (editingMeetup) {
        // Update
        setMeetups(prev => prev.map(m => {
            if (m.id === editingMeetup.id) {
                const updated = {
                    ...m,
                    ...data,
                    // Use new image if uploaded, otherwise keep existing
                    image: data.image || m.image,
                    date: new Date(data.date).toISOString().split('T')[0], // simple date handling
                    plusCode: data.plusCode
                };
                // If modifying the one we are viewing, update view state
                if (viewingMeetup?.id === updated.id) setViewingMeetup(updated);
                return updated;
            }
            return m;
        }));
        setEditingMeetup(null);
    } else {
        // Create
        const newMeetup: Meetup = {
            id: `m${Date.now()}`,
            ...data,
            // Use uploaded image or random seed fallback
            image: data.image || `https://picsum.photos/seed/${Date.now()}/800/400`,
            date: new Date(data.date).toISOString().split('T')[0],
            hostId: user.id,
            participants: [user.id],
            status: MeetupStatus.UPCOMING,
            plusCode: data.plusCode,
            comments: []
        };
        setMeetups(prev => [newMeetup, ...prev]);
    }
  };

  const getParticipantDetails = (ids: string[]): User[] => {
    // Use the state 'allUsers' instead of constant to reflect profile updates
    return ids.map(id => allUsers.find(u => u.id === id)).filter(Boolean) as User[];
  };

  // Filtering Logic
  const filteredMeetups = meetups.filter(m => {
    // 1. Filter by View (Feed vs History)
    if (currentView === 'feed') {
        // Feed shows only UPCOMING
        if (m.status !== MeetupStatus.UPCOMING) return false;
    } else {
        // History shows COMPLETED or CANCELLED
        if (m.status === MeetupStatus.UPCOMING) return false;
    }

    // 2. Filter by Search
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        user={user}
        currentView={currentView}
        onNavigate={setCurrentView}
        onLogout={handleLogout} 
        onCreateClick={() => {
            setEditingMeetup(null);
            setIsCreateModalOpen(true);
        }}
        onEditProfile={() => setIsProfileModalOpen(true)}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">
                {currentView === 'feed' ? 'Upcoming Matches' : 'Match History'}
            </h1>
            <p className="text-gray-500 mt-2">
                {currentView === 'feed' 
                    ? 'Join upcoming games or organize your own.' 
                    : 'Review your past games and scores.'}
            </p>
        </div>

        <FilterBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm}
            currentView={currentView}
        />

        {/* Grid Feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredMeetups.length > 0 ? (
                filteredMeetups.map(meetup => (
                    <MeetupCard
                        key={meetup.id}
                        meetup={meetup}
                        currentUser={user}
                        onJoin={handleJoin}
                        onDecline={handleDecline}
                        onDelete={handleDelete}
                        onEdit={(m) => {
                            setEditingMeetup(m);
                            setIsCreateModalOpen(true);
                        }}
                        onViewDetails={(m) => setViewingMeetup(m)}
                        getParticipantDetails={getParticipantDetails}
                    />
                ))
            ) : (
                <div className="col-span-full text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <div className="text-gray-400 text-xl">
                        {currentView === 'feed' 
                         ? "No upcoming meetups found ⚽️" 
                         : "No history found yet."}
                    </div>
                    {searchTerm && (
                        <button 
                            onClick={() => setSearchTerm('')}
                            className="mt-4 text-orange-600 font-medium hover:underline"
                        >
                            Clear search
                        </button>
                    )}
                </div>
            )}
        </div>
      </main>

      {/* Modals */}
      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleSaveMeetup}
        initialData={editingMeetup ? {
            title: editingMeetup.title,
            location: editingMeetup.location,
            date: editingMeetup.date,
            time: editingMeetup.time,
            description: editingMeetup.description,
            maxPlayers: editingMeetup.maxPlayers,
            image: editingMeetup.image,
            plusCode: editingMeetup.plusCode
        } : undefined}
      />

      <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={user}
        onUpdate={handleUpdateProfile}
      />

      <MeetupDetailsModal 
        isOpen={!!viewingMeetup}
        onClose={() => setViewingMeetup(null)}
        meetup={viewingMeetup}
        participants={viewingMeetup ? getParticipantDetails(viewingMeetup.participants) : []}
      />
    </div>
  );
};

export default App;
