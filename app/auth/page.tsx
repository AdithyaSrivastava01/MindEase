'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Trim whitespace from fields
    const trimmedData = {
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
      confirmPassword: formData.confirmPassword
    };

    // Check for empty fields
    if (!trimmedData.username || !trimmedData.email || !trimmedData.password || !trimmedData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    // Username validation
    if (trimmedData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    if (trimmedData.username.length > 20) {
      setError('Username must be less than 20 characters');
      return;
    }

    // Only allow alphanumeric and underscores in username
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(trimmedData.username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }

    // Check if username already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('username')
      .eq('username', trimmedData.username)
      .single();

    if (existingUser) {
      setError('Username already taken. Please choose another one.');
      return;
    }

    // Email validation - more comprehensive
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(trimmedData.email)) {
      setError('Please enter a valid email address (e.g., user@example.com)');
      return;
    }

    // Check if email has valid domain
    const emailParts = trimmedData.email.split('@');
    if (emailParts.length !== 2 || !emailParts[1].includes('.') || emailParts[1].endsWith('.')) {
      setError('Please enter a valid email address with a proper domain');
      return;
    }

    // Password validation
    if (trimmedData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Check for tabs in password
    if (trimmedData.password.includes('\t')) {
      setError('Password cannot contain tab characters');
      return;
    }

    // Check for leading/trailing spaces in password
    if (trimmedData.password !== trimmedData.password.trim()) {
      setError('Password cannot have leading or trailing spaces');
      return;
    }

    if (trimmedData.password !== trimmedData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Create user with Supabase Auth using real email
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: trimmedData.email,
        password: trimmedData.password,
        options: {
          data: {
            username: trimmedData.username,
            display_name: trimmedData.username
          }
        }
      });

      if (signUpError) throw signUpError;

      setSuccess('Account created successfully! Redirecting...');

      // Save username to sessionStorage
      if (data.user) {
        sessionStorage.setItem('userId', data.user.id);
        sessionStorage.setItem('username', trimmedData.username);
      }

      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Trim whitespace from fields
    const trimmedData = {
      username: formData.username.trim(),
      password: formData.password
    };

    // Check for empty fields
    if (!trimmedData.username || !trimmedData.password) {
      setError('Please fill in all fields');
      return;
    }

    // Username validation
    if (trimmedData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    // Only allow alphanumeric and underscores in username
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(trimmedData.username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }

    // Password validation
    if (trimmedData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Check for tabs in password
    if (trimmedData.password.includes('\t')) {
      setError('Password cannot contain tab characters');
      return;
    }

    // Check for leading/trailing spaces in password
    if (trimmedData.password !== trimmedData.password.trim()) {
      setError('Password cannot have leading or trailing spaces');
      return;
    }

    setLoading(true);

    try {
      // First, try to find the user by username in Supabase
      // We'll query the users table to get the email associated with this username
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('username', trimmedData.username)
        .single();

      if (userError || !userData) {
        setError('Invalid username or password');
        setLoading(false);
        return;
      }

      // Now sign in with the email
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: trimmedData.password
      });

      if (signInError) throw signInError;

      setSuccess('Logged in successfully! Redirecting...');

      // Save username to sessionStorage
      if (data.user) {
        const username = data.user.user_metadata?.username || trimmedData.username;
        sessionStorage.setItem('userId', data.user.id);
        sessionStorage.setItem('username', username);
      }

      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (err: any) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setSuccess('');
    setFormData({ username: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        {/* Left Side - Welcome Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block"
        >
          <div className="relative w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/welcome.png"
              alt="MindEase Welcome"
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>

        {/* Right Side - Auth Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
        >
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mr-3">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              MindEase
            </h1>
          </div>

          {/* Toggle Tabs */}
          <div className="flex mb-8 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => !loading && setIsSignUp(true)}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                isSignUp
                  ? 'bg-white text-purple-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => !loading && setIsSignUp(false)}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                !isSignUp
                  ? 'bg-white text-purple-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Log In
            </button>
          </div>

          {/* Form Title */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-gray-600 mb-6">
            {isSignUp
              ? 'Start your mental wellness journey today'
              : 'Continue your wellness journey'}
          </p>

          {/* Error/Success Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-800">{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start space-x-3"
              >
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-green-800">{success}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-5">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 transition-all"
                placeholder="Enter your username (letters, numbers, _ only)"
                disabled={loading}
                required
                minLength={3}
                maxLength={20}
                pattern="[a-zA-Z0-9_]+"
                title="Username must be 3-20 characters and contain only letters, numbers, and underscores"
              />
            </div>

            {/* Email (Sign Up Only) */}
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 transition-all"
                  placeholder="user@example.com"
                  disabled={loading}
                  required={isSignUp}
                  title="Please enter a valid email address"
                />
              </motion.div>
            )}

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 transition-all"
                  placeholder="Enter your password (min 6 characters)"
                  disabled={loading}
                  required
                  minLength={6}
                  title="Password must be at least 6 characters, no tabs or leading/trailing spaces"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Sign Up Only) */}
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 transition-all"
                    placeholder="Confirm your password"
                    disabled={loading}
                    required={isSignUp}
                    minLength={6}
                    title="Please confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{isSignUp ? 'Creating Account...' : 'Logging In...'}</span>
                </>
              ) : (
                <span>{isSignUp ? 'Create Account' : 'Log In'}</span>
              )}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <button
              onClick={toggleMode}
              disabled={loading}
              className="text-sm text-gray-600 hover:text-purple-600 transition-colors disabled:opacity-50"
            >
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <span className="font-semibold text-purple-600">
                {isSignUp ? 'Log In' : 'Sign Up'}
              </span>
            </button>
          </div>

          {/* Footer */}
          <p className="mt-8 text-xs text-center text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </div>
    </div>
  );
}
