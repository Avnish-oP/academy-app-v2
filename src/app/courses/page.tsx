'use client';

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { 
  BookOpen, 
  ArrowLeft,
  FileText,
  Download,
  PlayCircle,
  Clock,
  User,
  Calendar,
  ChevronRight,
  GraduationCap
} from "lucide-react";

interface Material {
  _id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'document' | 'presentation';
  driveLink: string;
  uploadDate: string;
  downloadCount: number;
  uploadedBy: {
    name: string;
  };
}

interface Subject {
  _id: string;
  name: string;
  description: string;
  order: number;
  materialCount: number;
  materials?: Material[];
}

interface Class {
  _id: string;
  name: string;
  description: string;
  level: number;
  category: string;
  subjectCount: number;
  materialCount: number;
  subjects?: Subject[];
}

export default function CoursesPage() {
  const [currentView, setCurrentView] = useState<'classes' | 'subjects' | 'materials'>('classes');
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [user, setUser] = useState<any>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    // Load classes on component mount
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

  const handleViewMaterial = async (material: Material) => {
    try {
      // Increment view count
      await fetch(`/api/materials?materialId=${material._id}`, {
        method: 'PATCH',
      });
      
      // Update local state
      setMaterials(materials.map(m => 
        m._id === material._id 
          ? { ...m, downloadCount: m.downloadCount + 1 }
          : m
      ));

      // Open Google Drive link in new tab
      window.open(material.driveLink, '_blank');
    } catch (error) {
      console.error('Error accessing material:', error);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'video': return <PlayCircle className="h-5 w-5 text-red-500" />;
      case 'pdf': return <FileText className="h-5 w-5 text-red-600" />;
      case 'document': return <FileText className="h-5 w-5 text-blue-600" />;
      case 'presentation': return <FileText className="h-5 w-5 text-orange-600" />;
      default: return <FileText className="h-5 w-5 text-gray-600" />;
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
                  <GraduationCap className="h-8 w-8 text-blue-600 mr-3" />
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
                  View Subjects →
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
        <div className="text-sm text-gray-500">
          {selectedClass?.subjectCount} subjects available
        </div>
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
              onClick={() => handleSubjectClick(subject)}
              className="bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-200 cursor-pointer group"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <BookOpen className="h-8 w-8 text-green-600" />
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{subject.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {subject.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {subject.materialCount} materials
                  </span>
                  <span className="text-green-600 font-medium group-hover:text-green-700">
                    View Materials →
                  </span>
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
        <div className="text-sm text-gray-500">
          {selectedSubject?.materialCount} materials available
        </div>
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
                className="bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        {getFileIcon(material.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {material.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {material.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(material.uploadDate).toLocaleDateString()}
                          </span>
                          <span>{material.downloadCount} views</span>
                          {material.uploadedBy && (
                            <span>By: {material.uploadedBy.name}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleViewMaterial(material)}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>View Material</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Materials Available</h3>
          <p className="text-gray-500">
            Materials for this subject will be uploaded soon.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAdmin={user?.role === 'admin'} userName={user?.name} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Courses & Study Materials 📚
          </h1>
          <p className="text-gray-600">
            {currentView === 'classes' && 'Select your class to access study materials'}
            {currentView === 'subjects' && `Subjects available for ${selectedClass?.name}`}
            {currentView === 'materials' && `Study materials for ${selectedSubject?.name}`}
          </p>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <span 
            className={currentView === 'classes' ? 'text-blue-600 font-medium' : 'cursor-pointer hover:text-blue-600'} 
            onClick={() => {
              if (currentView !== 'classes') {
                setCurrentView('classes');
                setSelectedClass(null);
                setSelectedSubject(null);
                setSubjects([]);
                setMaterials([]);
              }
            }}
          >
            Classes
          </span>
          {selectedClass && (
            <>
              <ChevronRight className="h-4 w-4" />
              <span 
                className={currentView === 'subjects' ? 'text-blue-600 font-medium' : 'cursor-pointer hover:text-blue-600'} 
                onClick={() => {
                  if (currentView === 'materials') {
                    setCurrentView('subjects');
                    setSelectedSubject(null);
                    setMaterials([]);
                  }
                }}
              >
                {selectedClass.name}
              </span>
            </>
          )}
          {selectedSubject && (
            <>
              <ChevronRight className="h-4 w-4" />
              <span className="text-blue-600 font-medium">{selectedSubject.name}</span>
            </>
          )}
        </div>

        {/* Content */}
        {currentView === 'classes' && renderClassesView()}
        {currentView === 'subjects' && renderSubjectsView()}
        {currentView === 'materials' && renderMaterialsView()}
      </div>
    </div>
  );
}