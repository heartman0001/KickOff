// heartman0001/kickoff/KickOff-e19b0ed1775f45297adf3e9cce5275e834e87132/components/Auth.tsx

import React, { useState } from 'react';

interface AuthProps {
  // แก้ไข Signature ให้รองรับข้อมูลเพิ่มเติมจาก Signup
  onLogin: (user: { 
    id: string; 
    email: string; 
    name?: string; 
    age?: number; 
    height?: number; 
    weight?: number 
  }) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // เพิ่ม State สำหรับข้อมูลเพิ่มเติม
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // สร้าง payload โดยรวมข้อมูลเพิ่มเติมเมื่อเป็นโหมด Signup
    const payload = {
        email,
        password,
        mode: isLogin ? "login" : "signup",
        // เพิ่มข้อมูลส่วนตัวสำหรับ Signup
        ...(isLogin ? {} : { 
            name, 
            age: age !== '' ? Number(age) : undefined,
            height: height !== '' ? Number(height) : undefined,
            weight: weight !== '' ? Number(weight) : undefined
        })
    };
    
    // Reset status (optional)

    try {
      const response = await fetch("http://localhost/kickoff-api/auth.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      console.log("Response status:", response.status);

      const text = await response.text();
      console.log("Raw response:", text);

      let result: any;
      try {
        result = JSON.parse(text);
      } catch (err) {
        alert("Invalid JSON from server");
        return;
      }

      console.log("Parsed result:", result);

      if (result.success) {
        // ✅ ส่งข้อมูลที่จำเป็นทั้งหมดกลับไปให้ App.tsx
        onLogin({ 
            id: result.userId ?? '', 
            email: result.email ?? email, 
            // รวมข้อมูล Signup (ถ้ามี)
            name: result.name ?? name, 
            age: result.age ?? (age !== '' ? Number(age) : undefined),
            height: result.height ?? (height !== '' ? Number(height) : undefined),
            weight: result.weight ?? (weight !== '' ? Number(weight) : undefined),
        });
      } else {
        alert(result.message || (isLogin ? "Login failed" : "Signup failed"));
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Server error: " + err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        
        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
             K
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome to KickOff</h1>
          <p className="text-gray-500 mt-2">Find your squad. Play the game.</p>
        </div>

        <div className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* 1. Display Name Input (Only for Sign Up) */}
                {!isLogin && (
                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Display Name</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                            placeholder="Your name or nickname"
                            required={!isLogin} 
                        />
                    </div>
                )}
                
                {/* 2. Email Input */}
                <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Email Address</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                        placeholder="name@example.com"
                        required
                    />
                </div>
                
                {/* 3. Password Input */}
                <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Password</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                        placeholder="••••••••"
                        required
                    />
                </div>

                {/* 4. Additional Info (Only for Sign Up) */}
                {!isLogin && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Age</label>
                            <input 
                                type="number" 
                                min="1" 
                                value={age}
                                onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                placeholder="e.g. 25"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Height (cm)</label>
                            <input 
                                type="number" 
                                min="50"
                                value={height}
                                onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                placeholder="e.g. 175"
                            />
                        </div>
                        <div className="col-span-2">
                             <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Weight (kg)</label>
                            <input 
                                type="number" 
                                min="10"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                placeholder="e.g. 70"
                            />
                        </div>
                    </div>
                )}
                
                <button 
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all transform active:scale-95 mt-4"
                >
                    {isLogin ? 'Sign In' : 'Create Account'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button 
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-orange-600 font-bold hover:underline"
                    >
                        {isLogin ? 'Sign up' : 'Log in'}
                    </button>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};