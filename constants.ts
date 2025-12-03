
import { Meetup, MeetupStatus, User } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Alex Striker',
    email: 'alex@example.com',
    avatar: 'https://picsum.photos/seed/u1/100/100',
    age: 24,
  },
  {
    id: 'u2',
    name: 'Ben Goalie',
    email: 'ben@example.com',
    avatar: 'https://picsum.photos/seed/u2/100/100',
    age: 28,
  },
  {
    id: 'u3',
    name: 'Charlie Winger',
    email: 'charlie@example.com',
    avatar: 'https://picsum.photos/seed/u3/100/100',
    age: 22,
  },
];

export const CURRENT_USER: User = MOCK_USERS[0];

export const INITIAL_MEETUPS: Meetup[] = [
  {
    id: 'm1',
    title: 'Saturday Morning Futsal',
    location: 'Grand Arena, Downtown',
    plusCode: 'PJH9+W5 Bangkok', // Example: National Stadium area
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days from now
    time: '10:00',
    image: 'https://picsum.photos/seed/soccer1/800/400',
    hostId: 'u1',
    description: 'Casual 5v5 game. Need a goalie! Bring water and good vibes.',
    maxPlayers: 10,
    participants: ['u1', 'u2'],
    status: MeetupStatus.UPCOMING,
    comments: [
      {
        id: 'c1',
        userId: 'u2',
        userName: 'Ben Goalie',
        userAvatar: 'https://picsum.photos/seed/u2/100/100',
        text: 'I will bring the gloves!',
        timestamp: Date.now() - 100000,
      }
    ]
  },
  {
    id: 'm2',
    title: 'Evening League Practice',
    location: 'City Sports Complex',
    date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    time: '19:30',
    image: 'https://picsum.photos/seed/soccer2/800/400',
    hostId: 'u3',
    description: 'Competitive practice session. Working on tactical drills and set pieces.',
    maxPlayers: 14,
    participants: ['u3', 'u1'],
    status: MeetupStatus.UPCOMING,
    comments: []
  },
  {
    id: 'm3',
    title: 'Sunday Funday Kickabout',
    location: 'Riverside Park',
    plusCode: 'MGW5+7R Bangkok', // Example: Park area
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    time: '16:00',
    image: 'https://picsum.photos/seed/soccer3/800/400',
    hostId: 'u2',
    description: 'Just a chill game in the park.',
    maxPlayers: 20,
    participants: ['u2', 'u3'],
    status: MeetupStatus.COMPLETED,
    comments: []
  },
];
