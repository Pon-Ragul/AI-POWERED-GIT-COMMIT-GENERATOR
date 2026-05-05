import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, GitBranch, User, LogOut, Search, Filter } from 'lucide-react';
import { apiService } from '../services/api';

const Dashboard = ({ user, onLogout }) => {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRepo, setFilterRepo] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadCommits();
  }, []);

  const loadCommits = async () => {
    try {
      const data = await apiService.getCommits();
      setCommits(data);
    } catch (error) {
      console.error('Failed to load commits:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCommits = commits.filter(commit => {
    const messageText = `${commit.commit_title || ''}\n${commit.commit_body || ''}`;
    const matchesSearch = messageText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (commit.repository_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRepo = !filterRepo || commit.repository_name === filterRepo;
    return matchesSearch && matchesRepo;
  });

  const uniqueRepositories = Array.from(new Set(commits.map(c => c.repository_name).filter(Boolean)));

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStyleColor = (style) => {
    if (style === 'developer') return 'text-blue-400';
    if (style === 'detailed') return 'text-purple-400';
    if (style === 'short') return 'text-green-400';
    return 'text-slate-500';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <GitBranch className="h-8 w-8 text-sky-500" />
              <h1 className="text-2xl font-bold">Commit History</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-slate-600">
                <User className="h-5 w-5" />
                <span>{user.username || user.name }</span>
              </div>
              <button
                onClick={() => navigate('/generator')}
                className="bg-sky-600 hover:bg-sky-700 px-4 py-2 rounded-lg text-sm font-medium text-white transition"
              >
                New Commit
              </button>
              <button
                onClick={onLogout}
                className="bg-rose-600 hover:bg-rose-700 px-4 py-2 rounded-lg text-sm font-medium text-white transition flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg p-6 mb-8 border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-2">
                <Search className="h-4 w-4 inline mr-2" />
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search commits..."
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-2">
                <Filter className="h-4 w-4 inline mr-2" />
                Repository
              </label>
              <select
                value={filterRepo}
                onChange={(e) => setFilterRepo(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="">All Repositories</option>
                {uniqueRepositories.map(repo => (
                  <option key={repo} value={repo}>{repo}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <div className="text-sm text-slate-500">
                <History className="h-4 w-4 inline mr-2" />
                {filteredCommits.length} of {commits.length} commits
              </div>
            </div>
          </div>
        </div>

        {/* Commits List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-slate-500">Loading commits...</p>
          </div>
        ) : filteredCommits.length === 0 ? (
          <div className="text-center py-12">
            <History className="h-12 w-12 mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">No commits found</h3>
            <p className="text-slate-500">
              {commits.length === 0 
                ? "Start by generating your first commit message"
                : "Try adjusting your search or filter criteria"
              }
            </p>
            {commits.length === 0 && (
              <button
                onClick={() => navigate('/generator')}
                className="mt-4 bg-sky-600 hover:bg-sky-700 px-6 py-2 rounded-lg font-medium text-white transition"
              >
                Generate First Commit
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCommits.map((commit) => (
              <div key={commit.id} className="bg-white rounded-lg p-6 hover:bg-slate-50 transition border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {commit.commit_title || 'No message'}
                    </h3>
                    {commit.commit_body && (
                      <p className="text-slate-500 text-sm mb-3 whitespace-pre-wrap">
                        {commit.commit_body}
                      </p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStyleColor(commit.style)} bg-slate-100`}>
                    {commit.style || 'conventional'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-slate-500">
                  
                  <span>{formatDate(commit.created_at || commit.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
