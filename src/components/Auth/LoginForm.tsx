'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const demoCredentials = [
    { email: 'admin@upnd.zm', role: 'National Admin', name: 'Hakainde Hichilema' },
    { email: 'provincial@upnd.zm', role: 'Provincial Admin', name: 'Cornelius Mweetwa' },
    { email: 'district@upnd.zm', role: 'District Admin', name: 'Mutale Nalumango' },
    { email: 'branch@upnd.zm', role: 'Branch Admin', name: 'Sylvia Masebo' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-upnd-red via-upnd-red-dark to-upnd-yellow flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 p-2 shadow-lg">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/thumb/3/36/Logo_of_the_United_Party_for_National_Development.svg/400px-Logo_of_the_United_Party_for_National_Development.svg.png"
              alt="UPND Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-upnd-black mb-2">UPND Admin Portal</h1>
          <p className="text-upnd-yellow font-medium">Unity, Work, Progress</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-upnd-black mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent transition-all"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-upnd-black mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-upnd-red focus:border-transparent transition-all"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-upnd-red transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center text-red-700">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-upnd-red to-upnd-yellow text-white hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            {isLoading ? 'Signing In...' : 'Sign In to UPND Portal'}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="text-sm font-semibold text-upnd-black mb-4 text-center">Demo Accounts</h3>
          <div className="space-y-2">
            {demoCredentials.map((cred, index) => (
              <button
                key={index}
                onClick={() => setFormData({ email: cred.email, password: 'upnd2024' })}
                className="w-full text-left p-3 bg-gray-50 hover:bg-upnd-red-light/10 rounded-lg transition-colors text-sm"
              >
                <div className="font-medium text-upnd-black">{cred.name}</div>
                <div className="text-gray-600">{cred.role} - {cred.email}</div>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Password for all demo accounts: <span className="font-mono">upnd2024</span>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            UPND Membership Management Platform
          </p>
          <p className="text-xs text-upnd-red font-medium mt-1">
            For authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
}