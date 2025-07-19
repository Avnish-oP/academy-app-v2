'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
  classId?: string;
  phone?: string;
}

interface Update {
  _id: string;
  title: string;
  content: string;
  targetClasses: string[];
  author: string;
  isImportant: boolean;
  createdAt: string;
}

interface Material {
  _id: string;
  title: string;
  description: string;
  subject: string;
  classId: string;
  fileUrl: string;
  fileName: string;
  uploadedBy: string;
  createdAt: string;
}

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'announcement' | 'reminder' | 'warning' | 'success' | 'info';
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  sender: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get user data from localStorage (stored during login)
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userData);
      setUser(user);
      
      // Fetch all data
      fetchData(user);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      router.push('/login');
    }
  }, [router]);

  const fetchData = async (user: User) => {
    try {
      // Fetch all data in parallel
      const [updatesRes, materialsRes, notificationsRes] = await Promise.all([
        fetch('/api/updates'),
        fetch(`/api/materials?classId=${user.classId}`),
        fetch('/api/notifications')
      ]);

      // Process updates
      if (updatesRes.ok) {
        const updatesData = await updatesRes.json();
        const filteredUpdates = updatesData.filter((update: Update) => 
          !update.targetClasses.length || 
          update.targetClasses.includes(user.classId || '') ||
          update.targetClasses.includes('all')
        );
        setUpdates(filteredUpdates);
      }

      // Process materials
      if (materialsRes.ok) {
        const materialsData = await materialsRes.json();
        if (materialsData.success) {
          setMaterials(materialsData.data);
        }
      }

      // Process notifications
      if (notificationsRes.ok) {
        const notificationsData = await notificationsRes.json();
        if (notificationsData.success) {
          setNotifications(notificationsData.data.notifications);
        }
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH'
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar isAdmin={user?.role === 'admin'} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar isAdmin={user?.role === 'admin'} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-gray-600">
            Stay updated with the latest notifications, announcements and access your course materials.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Latest Notifications */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 p-2 rounded-lg mr-3">
                  🔔
                </span>
                Latest Notifications
              </h3>
              <div className="space-y-4">
                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification._id}
                      className={`bg-white rounded-lg shadow-sm border p-6 cursor-pointer hover:shadow-md transition-shadow ${
                        !notification.isRead ? 'border-blue-200 bg-blue-50' : ''
                      }`}
                      onClick={() => !notification.isRead && markNotificationAsRead(notification._id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          notification.type === 'announcement' ? 'bg-blue-100 text-blue-600' :
                          notification.type === 'info' ? 'bg-green-100 text-green-600' :
                          notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                          notification.type === 'success' ? 'bg-green-100 text-green-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {notification.type === 'announcement' && '📢'}
                          {notification.type === 'info' && 'ℹ️'}
                          {notification.type === 'warning' && '⚠️'}
                          {notification.type === 'success' && '✅'}
                          {notification.type === 'reminder' && '🔔'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-medium mb-2 ${
                              !notification.isRead ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              {notification.title}
                              {!notification.isRead && (
                                <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                              )}
                            </h4>
                            {notification.priority === 'high' && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                High Priority
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-3">{notification.message}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            {notification.sender && (
                              <>
                                <span>By {notification.sender.name}</span>
                                <span className="mx-2">•</span>
                              </>
                            )}
                            <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                    <div className="text-gray-400 mb-2">
                      <span className="text-4xl">🔔</span>
                    </div>
                    <p className="text-gray-500">No notifications available at the moment.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Latest Updates */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-green-100 p-2 rounded-lg mr-3">
                  📢
                </span>
                Latest Updates
              </h3>
              <div className="space-y-4">
                {updates.length > 0 ? (
                  updates.slice(0, 3).map((update) => (
                    <div
                      key={update._id}
                      className={`bg-white rounded-lg shadow-sm border p-6 ${
                        update.isImportant ? 'border-red-200 bg-red-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`font-medium mb-2 ${
                            update.isImportant ? 'text-red-900' : 'text-gray-900'
                          }`}>
                            {update.isImportant && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
                                Important
                              </span>
                            )}
                            {update.title}
                          </h4>
                          <p className="text-gray-600 mb-3">{update.content}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <span>By {update.author}</span>
                            <span className="mx-2">•</span>
                            <span>{new Date(update.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                    <p className="text-gray-500">No updates available at the moment.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Course Materials */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-purple-100 p-2 rounded-lg mr-3">
                  📚
                </span>
                Your Course Materials
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {materials.length > 0 ? (
                  materials.slice(0, 6).map((material) => (
                    <div
                      key={material._id}
                      className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          📄
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {material.title}
                          </h4>
                          <p className="text-sm text-blue-600 mb-2">
                            {material.subject}
                          </p>
                          <p className="text-xs text-gray-500 mb-3">
                            {material.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {new Date(material.createdAt).toLocaleDateString()}
                            </span>
                            <a
                              href={material.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                            >
                              View
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 bg-white rounded-lg shadow-sm border p-6 text-center">
                    <div className="text-gray-400 mb-2">
                      <span className="text-4xl">📚</span>
                    </div>
                    <p className="text-gray-500">No materials available for your class yet.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900">{user?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Username</label>
                  <p className="text-gray-900">{user?.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{user?.email}</p>
                </div>
                {user?.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{user.phone}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Role</label>
                  <p className="text-gray-900 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Unread Notifications</span>
                  <span className="font-medium text-blue-600">
                    {notifications.filter(n => !n.isRead).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Updates</span>
                  <span className="font-medium">{updates.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Course Materials</span>
                  <span className="font-medium">{materials.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Important Updates</span>
                  <span className="font-medium text-red-600">
                    {updates.filter(u => u.isImportant).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a 
                  href="/updates"
                  className="w-full text-left px-4 py-2 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors block"
                >
                  View All Updates
                </a>
                <a 
                  href="/courses"
                  className="w-full text-left px-4 py-2 rounded-md bg-green-50 text-green-700 hover:bg-green-100 transition-colors block"
                >
                  Browse All Materials
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
