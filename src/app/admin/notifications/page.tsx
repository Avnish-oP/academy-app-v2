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
  X,
  Send,
  Users
} from "lucide-react";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'announcement' | 'reminder' | 'warning' | 'success' | 'info';
  priority: 'low' | 'medium' | 'high';
  sender: {
    name: string;
    email: string;
  };
  sentAt: string;
  expiresAt?: string;
  readCount: number;
  actionButton?: {
    text: string;
    url: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface NotificationForm {
  title: string;
  message: string;
  type: 'announcement' | 'reminder' | 'warning' | 'success' | 'info';
  priority: 'low' | 'medium' | 'high';
  recipients: {
    sendToAll: boolean;
    roles: string[];
  };
  channels: {
    inApp: boolean;
    push: boolean;
    email: boolean;
    sms: boolean;
  };
  expiresAt: string;
  actionButton: {
    text: string;
    url: string;
  };
}

interface Pagination {
  current: number;
  total: number;
  count: number;
  totalNotifications: number;
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    total: 1,
    count: 0,
    totalNotifications: 0
  });
  const [filters, setFilters] = useState({
    type: 'all',
    priority: 'all'
  });

  const [notificationForm, setNotificationForm] = useState<NotificationForm>({
    title: '',
    message: '',
    type: 'info',
    priority: 'medium',
    recipients: {
      sendToAll: true,
      roles: []
    },
    channels: {
      inApp: true,
      push: true,
      email: false,
      sms: false
    },
    expiresAt: '',
    actionButton: {
      text: '',
      url: ''
    }
  });

  useEffect(() => {
    loadNotifications();
  }, [pagination.current, filters]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.current.toString(),
        limit: '10',
      });

      if (filters.type !== 'all') params.append('type', filters.type);
      if (filters.priority !== 'all') params.append('priority', filters.priority);

      const response = await fetch(`/api/admin/notifications?${params}`);
      const data = await response.json();

      if (data.success) {
        setNotifications(data.data.notifications);
        setPagination(data.data.pagination);
      } else {
        console.error('Failed to load notifications:', data.error);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNotification = () => {
    setEditingNotification(null);
    setNotificationForm({
      title: '',
      message: '',
      type: 'info',
      priority: 'medium',
      recipients: {
        sendToAll: true,
        roles: []
      },
      channels: {
        inApp: true,
        push: true,
        email: false,
        sms: false
      },
      expiresAt: '',
      actionButton: {
        text: '',
        url: ''
      }
    });
    setShowModal(true);
  };

  const handleEditNotification = (notification: Notification) => {
    setEditingNotification(notification);
    setNotificationForm({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      priority: notification.priority,
      recipients: {
        sendToAll: true,
        roles: []
      },
      channels: {
        inApp: true,
        push: true,
        email: false,
        sms: false
      },
      expiresAt: notification.expiresAt ? new Date(notification.expiresAt).toISOString().slice(0, 16) : '',
      actionButton: notification.actionButton || { text: '', url: '' }
    });
    setShowModal(true);
  };

  const handleSaveNotification = async () => {
    try {
      if (!notificationForm.title.trim() || !notificationForm.message.trim()) {
        alert('Title and message are required');
        return;
      }

      const url = editingNotification 
        ? `/api/admin/notifications/${editingNotification._id}`
        : '/api/admin/notifications';
      
      const method = editingNotification ? 'PUT' : 'POST';
      
      const payload = {
        ...notificationForm,
        expiresAt: notificationForm.expiresAt || null,
        actionButton: notificationForm.actionButton.text && notificationForm.actionButton.url 
          ? notificationForm.actionButton 
          : null
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setShowModal(false);
        loadNotifications();
        alert(editingNotification ? 'Notification updated successfully' : 'Notification sent successfully');
      } else {
        alert(data.error || 'Failed to save notification');
      }
    } catch (error) {
      console.error('Error saving notification:', error);
      alert('Error saving notification');
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/notifications/${notificationId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        loadNotifications();
        alert('Notification deleted successfully');
      } else {
        alert(data.error || 'Failed to delete notification');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      alert('Error deleting notification');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'announcement': return <Megaphone className="h-4 w-4 text-blue-500" />;
      case 'reminder': return <Clock className="h-4 w-4 text-orange-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'info': 
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
            <h1 className="text-3xl font-bold text-gray-900">Manage Notifications</h1>
            <p className="text-gray-600 mt-2">
              Send notifications and announcements to students and manage existing ones.
            </p>
          </div>
          <button
            onClick={handleAddNotification}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Send Notification</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex gap-4">
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
                <option value="announcement">Announcement</option>
                <option value="reminder">Reminder</option>
                <option value="warning">Warning</option>
                <option value="success">Success</option>
                <option value="info">Info</option>
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
                onClick={loadNotifications}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Table */}
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
                    Notification
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Read Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sent Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <tr key={notification._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        {getTypeIcon(notification.type)}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {notification.message.substring(0, 100)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {notification.type}
                        </span>
                        <br />
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                          {notification.priority}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {notification.readCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(notification.sentAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditNotification(notification)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteNotification(notification._id)}
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

            {notifications.length === 0 && !loading && (
              <div className="text-center py-12">
                <Megaphone className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Notifications Found</h3>
                <p className="text-gray-500">Send your first notification to get started.</p>
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

      {/* Add/Edit Notification Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingNotification ? 'Edit Notification' : 'Send New Notification'}
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
                    value={notificationForm.title}
                    onChange={(e) => setNotificationForm({...notificationForm, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter notification title..."
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {notificationForm.title.length}/200 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={notificationForm.message}
                    onChange={(e) => setNotificationForm({...notificationForm, message: e.target.value})}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter notification message..."
                    maxLength={1000}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {notificationForm.message.length}/1000 characters
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={notificationForm.type}
                      onChange={(e) => setNotificationForm({...notificationForm, type: e.target.value as any})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="info">Info</option>
                      <option value="announcement">Announcement</option>
                      <option value="reminder">Reminder</option>
                      <option value="warning">Warning</option>
                      <option value="success">Success</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={notificationForm.priority}
                      onChange={(e) => setNotificationForm({...notificationForm, priority: e.target.value as any})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={notificationForm.expiresAt}
                    onChange={(e) => setNotificationForm({...notificationForm, expiresAt: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Action Button Text (Optional)
                    </label>
                    <input
                      type="text"
                      value={notificationForm.actionButton.text}
                      onChange={(e) => setNotificationForm({
                        ...notificationForm, 
                        actionButton: {...notificationForm.actionButton, text: e.target.value}
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., View Update"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Action Button URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={notificationForm.actionButton.url}
                      onChange={(e) => setNotificationForm({
                        ...notificationForm, 
                        actionButton: {...notificationForm.actionButton, url: e.target.value}
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., /updates"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Recipients
                  </label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="sendToAll"
                      checked={notificationForm.recipients.sendToAll}
                      onChange={(e) => setNotificationForm({
                        ...notificationForm, 
                        recipients: {...notificationForm.recipients, sendToAll: e.target.checked}
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="sendToAll" className="ml-2 text-sm text-gray-700">
                      Send to all users
                    </label>
                  </div>
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
                  onClick={handleSaveNotification}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>{editingNotification ? 'Update' : 'Send'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
