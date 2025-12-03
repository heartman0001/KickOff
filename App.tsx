import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Auth } from './components/Auth';
import { MeetupCard } from './components/MeetupCard';
import { CreateModal } from './components/CreateModal';
import { ProfileModal } from './components/ProfileModal';
import { MeetupDetailsModal } from './components/MeetupDetailsModal';
import { FilterBar } from './components/FilterBar';
import { Meetup, User, MeetupStatus, CreateMeetupFormData, EditProfileFormData } from './types';
import { MOCK_USERS, INITIAL_MEETUPS } from './constants';
// ต้อง Import Service ที่ใช้เรียก API (สมมติว่าคุณได้สร้างไฟล์นี้แล้ว)
import { fetchUserProfile, updateProfile } from './services/userService'; 

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  // คง MOCK_USERS ไว้ใช้กับ MeetupCard (participants) ชั่วคราว
  const allUsers = MOCK_USERS; 
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
  // <<< FIX: เพิ่ม async ที่นี่
  const handleLogin = async (loggedInUser: { 
      id: string; 
      email: string; 
      name?: string; 
      age?: number;
      height?: number;
      weight?: number;
  }) => {
    
    // 1. เรียก API เพื่อดึงข้อมูล Profile ฉบับเต็มจาก DB
    const fullUserDetails = await fetchUserProfile(loggedInUser.id);
    
    if (fullUserDetails) {
        // 2. ถ้าพบข้อมูลใน DB (Login/Signup สำเร็จ)
        setUser(fullUserDetails);
    } else {
        // 3. Fallback: กรณีผู้ใช้ใหม่ หรือ API fetch ล้มเหลว (ใช้ข้อมูลที่มีอยู่)
        setUser({ 
            id: loggedInUser.id, 
            email: loggedInUser.email, 
            name: loggedInUser.name || "KickOff Player", 
            avatar: "https://picsum.photos/seed/default/100/100", 
            age: loggedInUser.age,
            height: loggedInUser.height,
            weight: loggedInUser.weight,
        });
    }
  };


  const handleLogout = () => {
    setUser(null);
    setCurrentView('feed');
  };

  const handleUpdateProfile = async (data: EditProfileFormData) => {
      if (!user) return;
      
      // 1. เรียก API เพื่ออัปเดตข้อมูลในฐานข้อมูล
      const updatedUser = await updateProfile(user.id, data);

      if (updatedUser) {
          // 2. ถ้าอัปเดตสำเร็จ ให้อัปเดต State ของผู้ใช้ปัจจุบันด้วยข้อมูลที่ได้จาก Server
          setUser(updatedUser);
          alert('Profile updated successfully!');
      } else {
          alert('Failed to update profile. Please try again.');
      }
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
    // Auth.tsx จะเรียก onLogin ด้วย Object ข้อมูลผู้ใช้
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