// heartman0001/kickoff/KickOff-e19b0ed1775f45297adf3e9cce5275e834e87132/App.tsx

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Auth } from './components/Auth';
// ... imports อื่นๆ
import { Meetup, User, MeetupStatus, CreateMeetupFormData, EditProfileFormData } from './types';
import { MOCK_USERS, INITIAL_MEETUPS } from './constants';
// ต้อง import fetchUserProfile และ updateProfile จาก services/userService
import { fetchUserProfile, updateProfile } from './services/userService'; // <<< ต้องมีไฟล์นี้!

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const allUsers = MOCK_USERS; 
  const [meetups, setMeetups] = useState<Meetup[]>(INITIAL_MEETUPS);
  
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

  // ... (return JSX)
};

export default App;