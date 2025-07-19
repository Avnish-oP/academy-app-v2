'use client';

import { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  User,
  Filter,
  Search,
  Clock,
  AlertCircle,
  Info,
  CheckCircle,
  AlertTriangle,
  Megaphone,
  RefreshCw,
  Save,
  X
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
  isPublished: boolean;
  publishDate: string;
  expiryDate?: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

interface UpdateForm {
  title: string;
  content: string;
  type: 'general' | 'exam' | 'holiday' | 'schedule' | 'important';
  priority: 'low' | 'medium' | 'high';
  isPublished: boolean;
  publishDate: string;
  expiryDate: string;
  sendNotification: boolean;
}

interface Pagination {
  current: number;
  total: number;
  count: number;
  totalUpdates: number;
}

export default function AdminUpdatesPage() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<Update | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    total: 1,
    count: 0,
    totalUpdates: 0
  });
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    priority: 'all'
  });

  const [updateForm, setUpdateForm] = useState<UpdateForm>({
    title: '',
    content: '',
    type: 'general',
    priority: 'medium',
    isPublished: false,
    publishDate: new Date().toISOString().slice(0, 16),
    expiryDate: '',
    sendNotification: true
  });

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

      if (filters.status !== 'all') params.append('status', filters.status);

      const response = await fetch(`/api/admin/updates?${params}`);
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

  const handleAddUpdate = () => {
    setEditingUpdate(null);
    setUpdateForm({
      title: '',
      content: '',
      type: 'general',
      priority: 'medium',
      isPublished: false,
      publishDate: new Date().toISOString().slice(0, 16),
      expiryDate: '',
      sendNotification: true
    });
    setShowModal(true);
  };

  const handleEditUpdate = (update: Update) => {
    setEditingUpdate(update);
    setUpdateForm({
      title: update.title,
      content: update.content,
      type: update.type,
      priority: update.priority,
      isPublished: update.isPublished,
      publishDate: new Date(update.publishDate).toISOString().slice(0, 16),
      expiryDate: update.expiryDate ? new Date(update.expiryDate).toISOString().slice(0, 16) : '',
      sendNotification: false
    });
    setShowModal(true);
  };

  const handleSaveUpdate = async () => {
    try {
      if (!updateForm.title.trim() || !updateForm.content.trim()) {
        alert('Title and content are required');
        return;
      }

      const url = editingUpdate 
        ? `/api/admin/updates/${editingUpdate._id}`
        : '/api/admin/updates';
      
      const method = editingUpdate ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updateForm,
          expiryDate: updateForm.expiryDate || null
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Send notification if requested and it's a new update being published
        if (updateForm.sendNotification && !editingUpdate && updateForm.isPublished) {
          try {
            await fetch('/api/admin/notifications', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                updateId: data.data._id,
                updateTitle: updateForm.title,
                updateType: updateForm.type,
                recipients: { sendToAll: true, users: [], roles: [], courses: [] }
              }),
            });
          } catch (notifError) {
            console.error('Error sending notification:', notifError);
            // Don't fail the update creation if notification fails
          }
        }

        setShowModal(false);
        loadUpdates();
        alert(editingUpdate ? 'Update updated successfully' : 'Update created successfully');
      } else {
        alert(data.error || 'Failed to save update');
      }
    } catch (error) {
      console.error('Error saving update:', error);
      alert('Error saving update');
    }
  };

  const handleDeleteUpdate = async (updateId: string) => {
    if (!confirm('Are you sure you want to delete this update?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/updates/${updateId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        loadUpdates();
        alert('Update deleted successfully');
      } else {
        alert(data.error || 'Failed to delete update');
      }
    } catch (error) {
      console.error('Error deleting update:', error);
      alert('Error deleting update');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exam': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'holiday': return <Calendar className="h-4 w-4 text-green-500" />;
      case 'schedule': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'important': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Updates</h1>
            <p className="text-gray-600 mt-2">
              Create, edit, and manage academy updates and announcements.
            </p>
          </div>
          <button
            onClick={handleAddUpdate}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Update</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
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
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Updates Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Update
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {updates.map((update) => (
                  <tr key={update._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        {getTypeIcon(update.type)}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {update.title}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {update.content.substring(0, 100)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {update.type}
                        </span>
                        <br />
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(update.priority)}`}>
                          {update.priority}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        update.isPublished 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {update.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {update.viewCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(update.publishDate)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditUpdate(update)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUpdate(update._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {updates.length === 0 && !loading && (
              <div className="text-center py-12">
                <Megaphone className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Updates Found</h3>
                <p className="text-gray-500">Create your first update to get started.</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination.total > 1 && (
          <div className="mt-6 flex justify-center">
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

      {/* Add/Edit Update Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingUpdate ? 'Edit Update' : 'Add New Update'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={updateForm.title}
                    onChange={(e) => setUpdateForm({...updateForm, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter update title..."
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {updateForm.title.length}/200 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={updateForm.content}
                    onChange={(e) => setUpdateForm({...updateForm, content: e.target.value})}
                    rows={6}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter update content..."
                    maxLength={2000}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {updateForm.content.length}/2000 characters
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={updateForm.type}
                      onChange={(e) => setUpdateForm({...updateForm, type: e.target.value as any})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
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
                      value={updateForm.priority}
                      onChange={(e) => setUpdateForm({...updateForm, priority: e.target.value as any})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Publish Date
                    </label>
                    <input
                      type="datetime-local"
                      value={updateForm.publishDate}
                      onChange={(e) => setUpdateForm({...updateForm, publishDate: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={updateForm.expiryDate}
                      onChange={(e) => setUpdateForm({...updateForm, expiryDate: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPublished"
                      checked={updateForm.isPublished}
                      onChange={(e) => setUpdateForm({...updateForm, isPublished: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPublished" className="ml-2 text-sm text-gray-700">
                      Publish immediately
                    </label>
                  </div>

                  {!editingUpdate && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="sendNotification"
                        checked={updateForm.sendNotification}
                        onChange={(e) => setUpdateForm({...updateForm, sendNotification: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={!updateForm.isPublished}
                      />
                      <label htmlFor="sendNotification" className="ml-2 text-sm text-gray-700">
                        Send notification to all users
                        <span className="text-xs text-gray-500 block">
                          (Only available when publishing immediately)
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveUpdate}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingUpdate ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
