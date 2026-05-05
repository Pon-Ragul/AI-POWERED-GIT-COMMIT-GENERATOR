import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/auth';

const Signup = ({ onSignup }) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.signup(userData);
      authService.setStoredToken(response.access_token);
      onSignup(response.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 border border-slate-200">
        <div className="flex items-center justify-center mb-8">
          <UserPlus className="h-8 w-8 text-emerald-500 mr-3" />
          <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-500 mb-2">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={userData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-500 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={userData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-500 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={userData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-10"
                placeholder="Enter your password (min 6 characters)"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-900"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-500">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-emerald-600 hover:text-emerald-500 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
