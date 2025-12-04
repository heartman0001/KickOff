// heartman0001/kickoff/KickOff-e19b0ed1775f45297adf3e9cce5275e834e87132/services/userService.ts (*** ต้องสร้าง/แก้ไขไฟล์นี้ ***)

import { User, EditProfileFormData } from '../types';

const API_BASE_URL = 'http://localhost/kickoff-api';

// ต้องมี export const นำหน้า
export const fetchUserProfile = async (userId: string): Promise<User | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/profile.php?userId=${userId}`);
        const result = await response.json();

        if (result.success) {
            // Mapping ข้อมูลที่ได้จาก PHP (ซึ่งใช้ user_id เป็น id) ให้ตรงกับ User type
            const userData = result.data;
            if (userData) {
                return {
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    avatar: userData.avatar,
                    age: userData.age ? Number(userData.age) : undefined,
                    height: userData.height ? Number(userData.height) : undefined,
                    weight: userData.weight ? Number(userData.weight) : undefined,
                } as User;
            }
            return null;
        }
        return null;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
};

// ต้องมี export const นำหน้า
export const updateProfile = async (userId: string, data: EditProfileFormData): Promise<User | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/profile.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
                ...data,
            }),
        });
        const result = await response.json();

        if (result.success) {
            // Mapping ข้อมูลที่ได้จาก PHP ให้ตรงกับ User type
            const userData = result.data;
            if (userData) {
                return {
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    avatar: userData.avatar,
                    age: userData.age ? Number(userData.age) : undefined,
                    height: userData.height ? Number(userData.height) : undefined,
                    weight: userData.weight ? Number(userData.weight) : undefined,
                } as User;
            }
        }
        return null;
    } catch (error) {
        console.error('Error updating user profile:', error);
        return null;
    }
};