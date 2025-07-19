import Link from "next/link";
import { 
  GraduationCap, 
  Users, 
  Award, 
  BookOpen, 
  Star, 
  ArrowRight,
  CheckCircle,
  Target,
  TrendingUp,
  Calendar
} from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Shivalik Study Circle</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/courses" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Courses
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  About
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Contact
                </Link>
                <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Quality Education for
              <span className="text-blue-600 block">Classes 1st to 12th</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join Shivalik Study Circle - where thousands of students from grade 1 to 12 have achieved 
              academic excellence through our comprehensive coaching programs and expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses" 
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center">
                Explore Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/demo" 
                    className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors">
                Book Free Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-3xl md:text-4xl font-bold mb-2">1,000+</div>
              <div className="text-blue-100">Students Enrolled</div>
            </div>
            <div className="text-white">
              <div className="text-3xl md:text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Success Rate</div>
            </div>
            <div className="text-white">
              <div className="text-3xl md:text-4xl font-bold mb-2">10+</div>
              <div className="text-blue-100">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Grade Levels Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Complete Education for All Grades
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From foundation building in primary classes to advanced competitive exam preparation in senior classes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">1-5</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Primary Classes</h3>
                <p className="text-gray-600 mb-4">
                  Foundation building with focus on basic concepts, reading, writing, and mathematical skills
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• English, Hindi, Mathematics</li>
                  <li>• Science & Environmental Studies</li>
                  <li>• Creative Learning Methods</li>
                  <li>• Regular Assessments</li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">6-10</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Middle & Secondary</h3>
                <p className="text-gray-600 mb-4">
                  Comprehensive curriculum covering all subjects with board exam preparation focus
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• All Core Subjects</li>
                  <li>• Board Exam Preparation</li>
                  <li>• Regular Mock Tests</li>
                  <li>• Career Guidance</li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">11-12</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Senior Secondary</h3>
                <p className="text-gray-600 mb-4">
                  Advanced learning with competitive exam preparation for JEE, NEET, and other entrances
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• PCM & PCB Streams</li>
                  <li>• JEE & NEET Preparation</li>
                  <li>• Board + Competitive Exams</li>
                  <li>• College Admission Guidance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Shivalik Study Circle?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive education solutions for all grades (1-12) with modern teaching methods and personalized attention.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Personalized Learning</h3>
              <p className="text-gray-600">
                Tailored study plans and one-on-one guidance to help each student reach their full potential.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Faculty</h3>
              <p className="text-gray-600">
                Learn from experienced teachers with proven track records in their respective fields.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Proven Results</h3>
              <p className="text-gray-600">
                High success rates and consistent performance improvements across all our programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Courses
            </h2>
            <p className="text-xl text-gray-600">
              Explore our most sought-after programs designed for success.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <BookOpen className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">IIT-JEE Preparation</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive preparation for IIT-JEE Main and Advanced with expert faculty and proven methodology.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Physics, Chemistry, Mathematics
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Mock Tests & Practice Papers
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Doubt Clearing Sessions
                </li>
              </ul>
              <Link href="/courses/iit-jee" className="text-blue-600 font-semibold hover:text-blue-700">
                Learn More →
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <Award className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">NEET Preparation</h3>
              <p className="text-gray-600 mb-4">
                Complete NEET preparation program covering Physics, Chemistry, and Biology with medical entrance focus.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Biology, Physics, Chemistry
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  AIIMS & JIPMER Preparation
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Regular Assessments
                </li>
              </ul>
              <Link href="/courses/neet" className="text-blue-600 font-semibold hover:text-blue-700">
                Learn More →
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <Star className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Board Exams (10th & 12th)</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive board exam preparation with focus on CBSE, ICSE, and state board syllabi.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  All Subjects Covered
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Previous Year Papers
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Exam Strategy Sessions
                </li>
              </ul>
              <Link href="/courses/boards" className="text-blue-600 font-semibold hover:text-blue-700">
                Learn More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Student Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Hear from our successful students who achieved their dreams.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Shivalik Study Circle helped me crack IIT-JEE with AIR 156. The faculty is amazing and the study material is comprehensive."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  A
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-gray-900">Arjun Sharma</div>
                  <div className="text-sm text-gray-600">IIT Delhi, Computer Science</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Thanks to Shivalik Study Circle, I scored 680/720 in NEET and got admission to AIIMS. The mock tests were really helpful."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                  P
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-gray-900">Priya Patel</div>
                  <div className="text-sm text-gray-600">AIIMS Delhi, MBBS</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Scored 98% in 12th boards with Shivalik Study Circle. The personalized attention and doubt clearing sessions made all the difference."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                  R
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-gray-900">Rahul Kumar</div>
                  <div className="text-sm text-gray-600">Class 12th, CBSE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Success Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students who have transformed their futures with our expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" 
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/contact" 
                  className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Schedule a Call
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <GraduationCap className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold text-white">Shivalik Study Circle</span>
              </div>
              <p className="text-gray-400">
                Empowering students from Class 1 to 12 to achieve their dreams through quality education and expert guidance.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/courses" className="hover:text-white">Courses</Link></li>
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/faculty" className="hover:text-white">Faculty</Link></li>
                <li><Link href="/results" className="hover:text-white">Results</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Programs</h3>
              <ul className="space-y-2">
                <li><Link href="/courses/iit-jee" className="hover:text-white">IIT-JEE</Link></li>
                <li><Link href="/courses/neet" className="hover:text-white">NEET</Link></li>
                <li><Link href="/courses/boards" className="hover:text-white">Board Exams</Link></li>
                <li><Link href="/courses/foundation" className="hover:text-white">Foundation</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📍 123 Education Street, Learning City</li>
                <li>📞 +91 98765 43210</li>
                <li>✉️ info@academypro.com</li>
                <li>🌐 www.academypro.com</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Shivalik Study Circle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
         
      