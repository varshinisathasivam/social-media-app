import React, { useState } from 'react';
import { Sparkles, User, Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { resolveImageUrl } from '../services/api';

export default function AuthModal() {
  const { login, register, loginAsDemo, demoUsers } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  
  // Register fields
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      await login(loginIdentifier, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      await register({
        username,
        name,
        email,
        password: regPassword
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#121926] w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col">
        
        {/* Brand header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/25 mb-3">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Pulse
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Connect, share stories, and explore what's happening
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* Quick Demo Login Section */}
        <div className="mb-6 p-3.5 bg-gradient-to-r from-pink-50/50 to-purple-50/50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-2xl border border-pink-100 dark:border-pink-900/30">
          <div className="flex items-center gap-1.5 text-xs font-bold text-pink-600 dark:text-pink-400 mb-2">
            <UserCheck className="w-4 h-4" />
            <span>Instant Demo Login (1-Click Test):</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {demoUsers.map((du) => (
              <button
                key={du.id}
                type="button"
                onClick={() => loginAsDemo(du.username)}
                className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-[#1a2333] hover:ring-2 hover:ring-pink-500 transition-all text-left shadow-sm group"
              >
                <img
                  src={resolveImageUrl(du.avatar)}
                  alt={du.username}
                  className="w-7 h-7 rounded-full object-cover shrink-0"
                />
                <div className="truncate">
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate group-hover:text-pink-500">
                    @{du.username.split('_')[0]}
                  </p>
                  <p className="text-[10px] text-gray-400 truncate">demo account</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex py-1 items-center mb-5">
          <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
          <span className="flex-shrink mx-3 text-gray-400 text-[11px] uppercase tracking-wider font-semibold">Or use form</span>
          <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
        </div>

        {/* Login Form */}
        {!isRegister ? (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Username or Email</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="alex_dev or alex@example.com"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f141f] text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-800 dark:text-gray-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f141f] text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-800 dark:text-gray-100"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-pink-500/25 hover:opacity-95 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2 mt-4"
            >
              {loading ? 'Logging in...' : 'Log In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Username</label>
              <input
                type="text"
                placeholder="choose_unique_handle"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f141f] text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-800 dark:text-gray-100"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Full Name</label>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f141f] text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-800 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Email</label>
              <input
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f141f] text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-800 dark:text-gray-100"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f141f] text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-800 dark:text-gray-100"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-pink-500/25 hover:opacity-95 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Toggle Register / Login */}
        <div className="mt-5 text-center text-xs text-gray-500">
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="font-bold text-pink-600 hover:underline"
              >
                Log In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="font-bold text-pink-600 hover:underline"
              >
                Sign Up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
