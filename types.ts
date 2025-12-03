
export enum MeetupStatus {
  UPCOMING = 'Upcoming',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  age?: number;
  height?: number; // เพิ่ม: ส่วนสูง (cm)
  weight?: number; // เพิ่ม: น้ำหนัก (kg)
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: number;
}

export interface Meetup {
  id: string;
  title: string;
  location: string;
  plusCode?: string;
  date: string; // ISO string
  time: string;
  image: string;
  hostId: string;
  description: string;
  maxPlayers: number;
  participants: string[]; // Array of User IDs
  status: MeetupStatus;
  comments: Comment[];
}

export interface CreateMeetupFormData {
  title: string;
  location: string;
  plusCode?: string;
  date: string;
  time: string;
  description: string;
  maxPlayers: number;
  image?: string;
}

export interface EditProfileFormData {
  name: string;
  avatar: string;
  age?: number;
  height?: number; // เพิ่ม
  weight?: number; // เพิ่ม
}
