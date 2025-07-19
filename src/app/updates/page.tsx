'use client';

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { 
  Bell, 
  Calendar,
  User,
  Eye,
  Filter,
  Search,
  Clock,
  AlertCircle,
  Info,
  CheckCircle,
  AlertTriangle,
  Megaphone,
  RefreshCw
} from "lucide-react";

interface Update {
  _id: string;
  title: string;
  content: string;
  type: 'general' | 'exam' | 'holiday' | 'schedule' | 'important';
  priority: 'low' | 'medium' | 'high';
  author: {
    name: string;
    email: string;
  };
  publishDate: string;
  expiryDate?: string;
  viewCount: number;
  isExpired?: boolean;
}

interface Pagination {
  current: number;
  total: number;
  count: number;
  totalUpdates: number;
}

export default function UpdatesPage() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    total: 1,
    count: 0,
    totalUpdates: 0
  });
  const [filters, setFilters] = useState({
    type: 'all',
    priority: 'all',
    search: ''
  });
  const [expandedUpdate, setExpandedUpdate] = useState<string | null>(null);

  useEffect(() => {
    loadUpdates();
  }, [pagination.current, filters]);

  const loadUpdates = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.current.toString(),
        limit: '10',
      });

      if (filters.type !== 'all') params.append('type', filters.type);
      if (filters.priority !== 'all') params.append('priority', filters.priority);

      const response = await fetch(`/api/updates?${params}`);
      const data = await response.json();

      if (data.success) {
        setUpdates(data.data.updates);
        setPagination(data.data.pagination);
      } else {
        console.error('Failed to load updates:', data.error);
      }
    } catch (error) {
      console.error('Error loading updates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClick = async (update: Update) => {
    // Toggle expand/collapse
    if (expandedUpdate === update._id) {
      setExpandedUpdate(null);
    } else {
      setExpandedUpdate(update._id);
      
      // Increment view count
      try {
        await fetch(`/api/updates?updateId=${update._id}`, {
          method: 'PATCH'
        });
        
        // Update local state
        setUpdates(updates.map(u => 
          u._id === update._id 
            ? { ...u, viewCount: u.viewCount + 1 }
            : u
        ));
      } catch (error) {
        console.error('Error updating view count:', error);
      }
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exam': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'holiday': return <Calendar className="h-5 w-5 text-green-500" />;
      case 'schedule': return <Clock className="h-5 w-5 text-blue-500" />;
      case 'important': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      default: return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Bell className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Updates & Announcements</h1>
          </div>
          <p className="text-gray-600">
            Stay informed with the latest updates, announcements, and important information from the academy.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Updates
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search by title or content..."
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="general">General</option>
                <option value="exam">Exam</option>
                <option value="holiday">Holiday</option>
                <option value="schedule">Schedule</option>
                <option value="important">Important</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters({...filters, priority: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={loadUpdates}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Updates List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : updates.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Megaphone className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Updates Found</h3>
            <p className="text-gray-500">There are no updates matching your current filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {updates.map((update) => (
              <div
                key={update._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleUpdateClick(update)}
              >
                {/* Update Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3 flex-1">
                      {getTypeIcon(update.type)}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {update.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {update.author.name}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(update.publishDate)}
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {update.viewCount} views
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(update.priority)}`}>
                        {update.priority.toUpperCase()}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        {update.type.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Content Preview or Full Content */}
                  <div className="text-gray-700">
                    {expandedUpdate === update._id ? (
                      <div className="prose prose-sm max-w-none">
                        <p className="whitespace-pre-wrap">{update.content}</p>
                      </div>
                    ) : (
                      <p className="line-clamp-2">
                        {update.content.substring(0, 150)}
                        {update.content.length > 150 && '...'}
                      </p>
                    )}
                  </div>

                  {/* Expiry Date */}
                  {update.expiryDate && (
                    <div className="mt-4 flex items-center text-sm text-orange-600">
                      <Clock className="h-4 w-4 mr-1" />
                      Expires on {formatDate(update.expiryDate)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.total > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPagination({...pagination, current: pagination.current - 1})}
                disabled={pagination.current === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="px-4 py-2 text-gray-700">
                Page {pagination.current} of {pagination.total}
              </span>
              
              <button
                onClick={() => setPagination({...pagination, current: pagination.current + 1})}
                disabled={pagination.current === pagination.total}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
