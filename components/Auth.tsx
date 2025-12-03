import React, { useState } from 'react';

interface AuthProps {
  onLogin: (user: { id: string; email: string }) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost/kickoff-api/auth.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          mode: isLogin ? "login" : "signup"
        })
      });

      console.log("Response status:", response.status);

      // อ่าน raw response ก่อน parse JSON
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
        // ✅ ใช้ข้อมูลจาก backend
        onLogin({ id: result.userId ?? '', email: result.email ?? email });
      } else {
        alert(result.message || "Login failed");
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
