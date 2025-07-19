'use client';

import { useState, useEffect } from 'react';
import Navbar from "../../components/Navbar";
import { 
  Users, 
  BookOpen, 
  Bell, 
  TrendingUp,
  Calendar,
  Plus,
  BarChart3,
  FileText,
  Clock,
  Target,
  Award,
  UserPlus,
  Send,
  Edit,
  Trash2,
  Save,
  X,
  Upload
} from "lucide-react";

interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
  classId?: string;
  phone?: string;
  createdAt: string;
}

interface Class {
  _id: string;
  name: string;
  level: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  
  // User form states
  const [showUserModal, setShowUserModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState<any>(null);
  const [userForm, setUserForm] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    role: 'student' as 'admin' | 'student',
    classId: '',
    password: ''
  });

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (parsedUser.role !== 'admin') {
        window.location.href = '/home';
        return;
      }
    } else {
      window.location.href = '/login';
      return;
    }

    // Load initial data
    loadClasses();
    if (activeTab === 'users') {
      loadUsers();
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    }
  }, [activeTab]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data);
      } else {
        console.error('Failed to load users:', data.error);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadClasses = async () => {
    try {
      const response = await fetch('/api/classes');
      const data = await response.json();
      
      if (data.success) {
        setClasses(data.data);
      }
    } catch (error) {
      console.error('Error loading classes:', error);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setUserForm({
      username: '',
      name: '',
      email: '',
      phone: '',
      role: 'student',
      classId: '',
      password: ''
    });
    setShowUserModal(true);
  };

  const handleBulkUpload = () => {
    setCsvFile(null);
    setUploadProgress(0);
    setUploadResults(null);
    setShowBulkUploadModal(true);
  };

  const handleCsvFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
    } else {
      alert('Please select a valid CSV file');
      event.target.value = '';
    }
  };

  const downloadCsvTemplate = () => {
    const csvContent = 'name,username,email,phone,classId,password\n' +
                      'John Doe,johndoe,john@example.com,9876543210,Class 10,password123\n' +
                      'Jane Smith,janesmith,jane@example.com,9876543211,Class 11,password456';
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'students_template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleBulkUploadSubmit = async () => {
    if (!csvFile) {
      alert('Please select a CSV file');
      return;
    }

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      setUploadProgress(0);
      
      const response = await fetch('/api/admin/users/bulk', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        setUploadResults(data);
        setUploadProgress(100);
        await loadUsers();
        alert(`Upload completed! Successfully created ${data.successful} users. ${data.failed} failed.`);
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (error) {
      console.error('Bulk upload error:', error);
      alert('Upload failed');
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      username: user.username,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role as 'admin' | 'student',
      classId: user.classId || '',
      password: '' // Don't show existing password
    });
    setShowUserModal(true);
  };

  const handleSaveUser = async () => {
    try {
      if (!userForm.name || !userForm.email || !userForm.username) {
        alert('Please fill in all required fields');
        return;
      }

      if (!editingUser && !userForm.password) {
        alert('Password is required for new users');
        return;
      }

      // Prepare payload and conditionally include password
      const { password, ...basePayload } = {
        ...userForm,
        classId: userForm.classId || null
      };

      const payload = editingUser && !password 
        ? basePayload 
        : { ...basePayload, password };

      const url = editingUser 
        ? `/api/admin/users/${editingUser._id}`
        : '/api/admin/users';
      
      const method = editingUser ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (data.success) {
        setShowUserModal(false);
        await loadUsers();
        alert(editingUser ? 'User updated successfully' : 'User created successfully');
      } else {
        alert('Error saving user: ' + data.error);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error saving user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        await loadUsers();
        alert('User deleted successfully');
      } else {
        alert('Error deleting user: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  const stats = [
    {
      label: "Total Students",
      value: users.filter(u => u.role === 'student').length.toString(),
      change: "+12%",
      icon: Users,
      color: "blue"
    },
    {
      label: "Total Classes",
      value: classes.length.toString(),
      change: "+3",
      icon: BookOpen,
      color: "green"
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "enrollment",
      message: `${users.filter(u => u.role === 'student').length} students enrolled`,
      time: "Updated now",
      icon: Users
    },
    {
      id: 2,
      type: "material",
      message: "Course materials available in Courses section",
      time: "Manage materials",
      icon: BookOpen
    },
    {
      id: 3,
      type: "notification",
      message: "Send notifications from Updates section",
      time: "Create notifications",
      icon: Bell
    },
    {
      id: 4,
      type: "result",
      message: "Student management available here",
      time: "Manage users",
      icon: FileText
    }
  ];

  const getStatColor = (color: string) => {
    switch (color) {
      case "blue": return "text-blue-600 bg-blue-100";
      case "green": return "text-green-600 bg-green-100";
      case "purple": return "text-purple-600 bg-purple-100";
      case "yellow": return "text-yellow-600 bg-yellow-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-lg ${getStatColor(stat.color)}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab('users')}
            className="flex items-center p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <UserPlus className="h-5 w-5 mr-3" />
            <span>Manage Students</span>
          </button>
          <button
            onClick={handleBulkUpload}
            className="flex items-center p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Upload className="h-5 w-5 mr-3" />
            <span>Bulk Upload CSV</span>
          </button>
          <a
            href="/admin/courses"
            className="flex items-center p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <BookOpen className="h-5 w-5 mr-3" />
            <span>Manage Courses</span>
          </a>
          <a
            href="/admin/updates"
            className="flex items-center p-4 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            <Send className="h-5 w-5 mr-3" />
            <span>Send Updates</span>
          </a>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-white rounded-lg">
                <activity.icon className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
        <div className="flex space-x-3">
          <button
            onClick={handleBulkUpload}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Bulk Upload (CSV)
          </button>
          <button
            onClick={handleAddUser}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Individual
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading users...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => {
                  const userClass = classes.find(c => c._id === user.classId);
                  return (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">@{user.username}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {userClass ? userClass.name : 'No class assigned'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                        {user.phone && <div className="text-sm text-gray-500">{user.phone}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAdmin={true} userName={user?.name} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your academy efficiently</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart3 className="h-4 w-4 inline mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="h-4 w-4 inline mr-2" />
                Students
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'users' && renderUsers()}

        {/* User Modal */}
        {showUserModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowUserModal(false);
              }
            }}
          >
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingUser ? 'Edit User' : 'Add New Student'}
                </h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); handleSaveUser(); }} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={userForm.name}
                    onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 bg-white transition-all"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Username *</label>
                  <input
                    type="text"
                    value={userForm.username}
                    onChange={(e) => setUserForm({...userForm, username: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 bg-white transition-all"
                    placeholder="Enter username"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 bg-white transition-all"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 bg-white transition-all"
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({...userForm, role: e.target.value as any})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white transition-all"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                {userForm.role === 'student' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Class</label>
                    <select
                      value={userForm.classId}
                      onChange={(e) => setUserForm({...userForm, classId: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white transition-all"
                    >
                      <option value="" className="text-gray-400">Select a class</option>
                      {classes.map((cls) => (
                        <option key={cls._id} value={cls._id} className="text-gray-900">{cls.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password {editingUser ? '(leave blank to keep current)' : '*'}
                  </label>
                  <input
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 bg-white transition-all"
                    placeholder="Enter password"
                    required={!editingUser}
                  />
                </div>
                
                <div className="flex space-x-3 mt-8 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowUserModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center transition-colors"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingUser ? 'Update User' : 'Create Student'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Bulk Upload Modal */}
        {showBulkUploadModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowBulkUploadModal(false);
              }
            }}
          >
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Bulk Upload Students</h3>
                <button
                  onClick={() => setShowBulkUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                  <h4 className="font-semibold text-blue-900 mb-3">📋 CSV Format Instructions:</h4>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li>• <strong>Required columns:</strong> name, username, email, password</li>
                    <li>• <strong>Optional columns:</strong> phone, classId</li>
                    <li>• <strong>For classId:</strong> use the exact class name (e.g., "Class 10", "Class 11")</li>
                    <li>• <strong>Important:</strong> Make sure usernames and emails are unique</li>
                  </ul>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <div>
                    <h4 className="font-semibold text-gray-900">📥 Download Template</h4>
                    <p className="text-sm text-gray-600 mt-1">Get a sample CSV file to fill out</p>
                  </div>
                  <button
                    onClick={downloadCsvTemplate}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 font-medium transition-colors"
                  >
                    Download Template
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    📂 Select CSV File
                  </label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCsvFileChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition-all"
                  />
                  {csvFile && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700 font-medium">
                        ✅ Selected: {csvFile.name}
                      </p>
                    </div>
                  )}
                </div>

                {uploadProgress > 0 && (
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                    <div className="flex justify-between text-sm font-medium text-blue-700 mb-2">
                      <span>Upload Progress</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-3">
                      <div 
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
                        style={{ width: `${uploadProgress}%` }}
                      >
                        {uploadProgress > 20 && (
                          <span className="text-xs text-white font-medium">{uploadProgress}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {uploadResults && (
                  <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
                    <h4 className="font-semibold text-green-900 mb-3">📊 Upload Results:</h4>
                    <div className="text-sm text-green-800 space-y-2">
                      <p className="flex items-center">
                        <span className="text-green-600 mr-2">✅</span>
                        <strong>Successfully created:</strong> {uploadResults.successful} users
                      </p>
                      <p className="flex items-center">
                        <span className="text-red-600 mr-2">❌</span>
                        <strong>Failed:</strong> {uploadResults.failed} users
                      </p>
                      {uploadResults.errors && uploadResults.errors.length > 0 && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="font-semibold text-red-900 mb-2">⚠️ Errors:</p>
                          <ul className="ml-4 list-disc space-y-1 text-red-800">
                            {uploadResults.errors.slice(0, 5).map((error: string, index: number) => (
                              <li key={index} className="text-sm">{error}</li>
                            ))}
                            {uploadResults.errors.length > 5 && (
                              <li className="text-sm italic">... and {uploadResults.errors.length - 5} more</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3 mt-8 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowBulkUploadModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkUploadSubmit}
                  disabled={!csvFile || uploadProgress > 0}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium flex items-center justify-center transition-colors"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploadProgress > 0 ? 'Uploading...' : 'Upload Students'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
