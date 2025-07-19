'use client';

import { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import { 
  BookOpen, 
  Plus,
  Edit,
  Trash2,
  Upload,
  FileText,
  Save,
  X,
  ChevronRight,
  ArrowLeft
} from "lucide-react";

interface Class {
  _id: string;
  name: string;
  description: string;
  level: number;
  category: string;
  subjectCount: number;
}

interface Subject {
  _id: string;
  name: string;
  description: string;
  order: number;
  materialCount: number;
}

interface Material {
  _id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'document' | 'presentation';
  driveLink: string;
  uploadDate: string;
  downloadCount: number;
}

export default function AdminCoursesPage() {
  const [currentView, setCurrentView] = useState<'classes' | 'subjects' | 'materials'>('classes');
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Modal states
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  // Form states
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    description: '',
    order: 1
  });
  const [materialForm, setMaterialForm] = useState({
    title: '',
    description: '',
    type: 'pdf' as const,
    driveLink: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (parsedUser.role !== 'admin') {
        window.location.href = '/dashboard';
        return;
      }
    } else {
      window.location.href = '/login';
      return;
    }
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/classes');
      const data = await response.json();
      
      if (data.success) {
        setClasses(data.data);
      } else {
        console.error('Failed to load classes:', data.error);
      }
    } catch (error) {
      console.error('Error loading classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSubjects = async (classId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/subjects?classId=${classId}`);
      const data = await response.json();
      
      if (data.success) {
        setSubjects(data.data);
      } else {
        console.error('Failed to load subjects:', data.error);
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMaterials = async (subjectId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/materials?subjectId=${subjectId}`);
      const data = await response.json();
      
      if (data.success) {
        setMaterials(data.data);
      } else {
        console.error('Failed to load materials:', data.error);
      }
    } catch (error) {
      console.error('Error loading materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClassClick = async (classItem: Class) => {
    setSelectedClass(classItem);
    setCurrentView('subjects');
    await loadSubjects(classItem._id);
  };

  const handleSubjectClick = async (subject: Subject) => {
    setSelectedSubject(subject);
    setCurrentView('materials');
    await loadMaterials(subject._id);
  };

  const handleBackClick = () => {
    if (currentView === 'materials') {
      setCurrentView('subjects');
      setSelectedSubject(null);
      setMaterials([]);
    } else if (currentView === 'subjects') {
      setCurrentView('classes');
      setSelectedClass(null);
      setSubjects([]);
    }
  };

  const handleAddSubject = () => {
    setEditingSubject(null);
    setSubjectForm({
      name: '',
      description: '',
      order: subjects.length + 1
    });
    setShowSubjectModal(true);
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setSubjectForm({
      name: subject.name,
      description: subject.description,
      order: subject.order
    });
    setShowSubjectModal(true);
  };

  const handleSaveSubject = async () => {
    try {
      const url = editingSubject 
        ? `/api/admin/subjects/${editingSubject._id}`
        : '/api/admin/subjects';
      
      const method = editingSubject ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...subjectForm,
          class: selectedClass?._id
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setShowSubjectModal(false);
        if (selectedClass) {
          await loadSubjects(selectedClass._id);
        }
      } else {
        alert('Error saving subject: ' + data.error);
      }
    } catch (error) {
      console.error('Error saving subject:', error);
      alert('Error saving subject');
    }
  };

  const handleDeleteSubject = async (subjectId: string) => {
    if (!confirm('Are you sure you want to delete this subject? This will also delete all associated materials.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/subjects/${subjectId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        if (selectedClass) {
          await loadSubjects(selectedClass._id);
        }
      } else {
        alert('Error deleting subject: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting subject:', error);
      alert('Error deleting subject');
    }
  };

  const handleAddMaterial = () => {
    setEditingMaterial(null);
    setMaterialForm({
      title: '',
      description: '',
      type: 'pdf',
      driveLink: ''
    });
    setShowMaterialModal(true);
  };

  const handleSaveMaterial = async () => {
    try {
      if (!materialForm.driveLink.trim()) {
        alert('Please provide a Google Drive link');
        return;
      }

      // Validate Google Drive link
      if (!/^https:\/\/(drive\.google\.com|docs\.google\.com)/.test(materialForm.driveLink)) {
        alert('Please provide a valid Google Drive link (must start with https://drive.google.com or https://docs.google.com)');
        return;
      }

      const payload = {
        title: materialForm.title,
        description: materialForm.description,
        type: materialForm.type,
        driveLink: materialForm.driveLink,
        subjectId: selectedSubject?._id,
        classId: selectedClass?._id
      };

      const url = editingMaterial 
        ? `/api/admin/materials/${editingMaterial._id}`
        : '/api/admin/materials';
      
      const method = editingMaterial ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (data.success) {
        setShowMaterialModal(false);
        if (selectedSubject) {
          await loadMaterials(selectedSubject._id);
        }
      } else {
        alert('Error saving material: ' + data.error);
      }
    } catch (error) {
      console.error('Error saving material:', error);
      alert('Error saving material');
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    if (!confirm('Are you sure you want to delete this material?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/materials/${materialId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        if (selectedSubject) {
          await loadMaterials(selectedSubject._id);
        }
      } else {
        alert('Error deleting material: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting material:', error);
      alert('Error deleting material');
    }
  };

  const renderClassesView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {loading ? (
        <div className="col-span-full text-center py-8">
          <p className="text-gray-500">Loading classes...</p>
        </div>
      ) : (
        classes.map((classItem) => (
          <div
            key={classItem._id}
            onClick={() => handleClassClick(classItem)}
            className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer group"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">{classItem.name}</h3>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {classItem.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {classItem.subjectCount} subjects
                </span>
                <span className="text-blue-600 font-medium group-hover:text-blue-700">
                  Manage →
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderSubjectsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={handleBackClick}
          className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Classes
        </button>
        <button
          onClick={handleAddSubject}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Subject
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">{selectedClass?.name}</h2>
        <p className="text-blue-700">{selectedClass?.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">Loading subjects...</p>
          </div>
        ) : (
          subjects.map((subject) => (
            <div
              key={subject._id}
              className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-200"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <BookOpen className="h-8 w-8 text-green-600" />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditSubject(subject)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSubject(subject._id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{subject.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {subject.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {subject.materialCount} materials
                  </span>
                  <button
                    onClick={() => handleSubjectClick(subject)}
                    className="text-green-600 font-medium hover:text-green-700"
                  >
                    Manage Materials →
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderMaterialsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={handleBackClick}
          className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Subjects
        </button>
        <button
          onClick={handleAddMaterial}
          className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Material
        </button>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center mb-2">
          <BookOpen className="h-6 w-6 text-green-600 mr-2" />
          <h2 className="text-2xl font-bold text-green-900">{selectedSubject?.name}</h2>
          <span className="ml-2 text-sm text-green-700">({selectedClass?.name})</span>
        </div>
        <p className="text-green-700">{selectedSubject?.description}</p>
      </div>

      {materials && materials.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading materials...</p>
            </div>
          ) : (
            materials.map((material) => (
              <div
                key={material._id}
                className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <FileText className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {material.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {material.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Type: {material.type}</span>
                          <span>{material.downloadCount} views</span>
                          <span>{new Date(material.uploadDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDeleteMaterial(material._id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <Upload className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Materials Available</h3>
          <p className="text-gray-500">Upload study materials for this subject.</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Course Management 📚
          </h1>
          <p className="text-gray-600">
            {currentView === 'classes' && 'Manage classes, subjects, and study materials'}
            {currentView === 'subjects' && `Manage subjects for ${selectedClass?.name}`}
            {currentView === 'materials' && `Manage materials for ${selectedSubject?.name}`}
          </p>
        </div>

        {/* Content */}
        {currentView === 'classes' && renderClassesView()}
        {currentView === 'subjects' && renderSubjectsView()}
        {currentView === 'materials' && renderMaterialsView()}

        {/* Subject Modal */}
        {showSubjectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {editingSubject ? 'Edit Subject' : 'Add Subject'}
                </h3>
                <button
                  onClick={() => setShowSubjectModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    value={subjectForm.name}
                    onChange={(e) => setSubjectForm({...subjectForm, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Mathematics"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={subjectForm.description}
                    onChange={(e) => setSubjectForm({...subjectForm, description: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Subject description"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    value={subjectForm.order}
                    onChange={(e) => setSubjectForm({...subjectForm, order: parseInt(e.target.value)})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowSubjectModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSubject}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Material Modal */}
        {showMaterialModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {editingMaterial ? 'Edit Material' : 'Upload Material'}
                </h3>
                <button
                  onClick={() => setShowMaterialModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={materialForm.title}
                    onChange={(e) => setMaterialForm({...materialForm, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Chapter 1 - Number Systems"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={materialForm.description}
                    onChange={(e) => setMaterialForm({...materialForm, description: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                    placeholder="Material description"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={materialForm.type}
                    onChange={(e) => setMaterialForm({...materialForm, type: e.target.value as any})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="video">Video</option>
                    <option value="document">Document</option>
                    <option value="presentation">Presentation</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Drive Link
                  </label>
                  <input
                    type="url"
                    value={materialForm.driveLink}
                    onChange={(e) => setMaterialForm({...materialForm, driveLink: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="https://drive.google.com/file/d/..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Paste the Google Drive share link here. Make sure the link is public or accessible to anyone with the link.
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowMaterialModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMaterial}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {editingMaterial ? 'Save' : 'Add Material'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
