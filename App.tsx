// heartman0001/kickoff/KickOff-e19b0ed1775f45297adf3e9cce5275e834e87132/App.tsx

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Auth } from './components/Auth';
// ... imports อื่นๆ
import { FilterBar } from './components/FilterBar';
import { MeetupCard } from './components/MeetupCard';
import { CreateModal } from './components/CreateModal';
import { MeetupDetailsModal } from './components/MeetupDetailsModal';
import { ProfileModal } from './components/ProfileModal';
import { Meetup, User, MeetupStatus, CreateMeetupFormData, EditProfileFormData } from './types';
import { MOCK_USERS, INITIAL_MEETUPS } from './constants';
// ต้อง import fetchUserProfile และ updateProfile จาก services/userService
import { fetchUserProfile, updateProfile } from './services/userService'; // <<< ต้องมีไฟล์นี้!

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const allUsers = MOCK_USERS; 
  const [meetups, setMeetups] = useState<Meetup[]>(INITIAL_MEETUPS);
  const [currentView, setCurrentView] = useState<'feed' | 'history'>('feed');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingMeetup, setEditingMeetup] = useState<Meetup | null>(null);
  const [detailsMeetup, setDetailsMeetup] = useState<Meetup | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // ... (states อื่นๆ เหมือนเดิม)

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
        } as User); // Cast as User เนื่องจาก types.ts ปัจจุบันอาจยังขาด height/weight
    }

    setCurrentView('feed');
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
  
  // ... (Handlers อื่นๆ และ return JSX เหมือนเดิม)
  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const getParticipantDetails = (ids: string[]): User[] => {
    const usersMap = new Map<string, User>();
    allUsers.forEach(u => usersMap.set(u.id, u));
    usersMap.set(user.id, user);
    return ids.map(id => usersMap.get(id)).filter(Boolean) as User[];
  };

  const handleCreateSubmit = (data: CreateMeetupFormData) => {
    const newMeetup: Meetup = {
      id: `m_${Date.now()}`,
      title: data.title,
      location: data.location,
      plusCode: data.plusCode,
      date: data.date,
      time: data.time,
      image: data.image || 'https://picsum.photos/seed/soccernew/800/400',
      hostId: user.id,
      description: data.description,
      maxPlayers: data.maxPlayers,
      participants: [user.id],
      status: MeetupStatus.UPCOMING,
      comments: [],
    };
    setMeetups(prev => [newMeetup, ...prev]);
  };

  const handleJoin = (meetupId: string) => {
    setMeetups(prev => prev.map(m => {
      if (m.id !== meetupId) return m;
      if (m.participants.includes(user.id)) return m;
      if (m.participants.length >= m.maxPlayers) return m;
      return { ...m, participants: [...m.participants, user.id] };
    }));
  };

  const handleDecline = (meetupId: string) => {
    setMeetups(prev => prev.map(m => {
      if (m.id !== meetupId) return m;
      return { ...m, participants: m.participants.filter(id => id !== user.id) };
    }));
  };

  const handleDeleteMeetup = (meetupId: string) => {
    setMeetups(prev => prev.filter(m => m.id !== meetupId));
  };

  const handleEditMeetup = (meetup: Meetup) => {
    setEditingMeetup(meetup);
    setIsCreateOpen(true);
  };

  const handleEditSubmit = (data: CreateMeetupFormData) => {
    if (!editingMeetup) return;
    setMeetups(prev => prev.map(m => {
      if (m.id !== editingMeetup.id) return m;
      return {
        ...m,
        title: data.title,
        location: data.location,
        plusCode: data.plusCode,
        date: data.date,
        time: data.time,
        description: data.description,
        maxPlayers: data.maxPlayers,
        image: data.image || m.image,
      };
    }));
    setEditingMeetup(null);
  };

  const initialCreateData: CreateMeetupFormData | undefined = editingMeetup ? {
    title: editingMeetup.title,
    location: editingMeetup.location,
    plusCode: editingMeetup.plusCode,
    date: editingMeetup.date,
    time: editingMeetup.time,
    description: editingMeetup.description,
    maxPlayers: editingMeetup.maxPlayers,
    image: editingMeetup.image,
  } : undefined;

  const filteredMeetups = meetups
    .filter(m => currentView === 'feed' ? m.status === MeetupStatus.UPCOMING : m.status !== MeetupStatus.UPCOMING)
    .filter(m => {
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      return m.title.toLowerCase().includes(q) || m.location.toLowerCase().includes(q);
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        user={user}
        currentView={currentView}
        onNavigate={setCurrentView}
        onLogout={handleLogout}
        onCreateClick={() => {
          setEditingMeetup(null);
          setIsCreateOpen(true);
        }}
        onEditProfile={() => setIsProfileOpen(true)}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <FilterBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} currentView={currentView} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMeetups.map(meetup => (
            <MeetupCard
              key={meetup.id}
              meetup={meetup}
              currentUser={user}
              onJoin={handleJoin}
              onDecline={handleDecline}
              onDelete={handleDeleteMeetup}
              onEdit={handleEditMeetup}
              onViewDetails={(m) => setDetailsMeetup(m)}
              getParticipantDetails={getParticipantDetails}
            />
          ))}
        </div>
      </main>

      <CreateModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingMeetup(null);
        }}
        onSubmit={(data) => {
          if (editingMeetup) {
            handleEditSubmit(data);
          } else {
            handleCreateSubmit(data);
          }
        }}
        initialData={initialCreateData}
      />

      <MeetupDetailsModal
        isOpen={!!detailsMeetup}
        onClose={() => setDetailsMeetup(null)}
        meetup={detailsMeetup}
        participants={detailsMeetup ? getParticipantDetails(detailsMeetup.participants) : []}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={user}
        onUpdate={handleUpdateProfile}
      />
    </div>
  );
};

export default App;