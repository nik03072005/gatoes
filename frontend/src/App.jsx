import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Home, FileText, Plus, BarChart3, Menu, X } from 'lucide-react';
import FormsList from './pages/FormsList.jsx';
import FormBuilder from './pages/FormBuilder.jsx';
import FormRender from './pages/FormRender.jsx';
import FormPreview from './pages/FormPreview.jsx';
import FormSettings from './pages/FormSettings.jsx';
import Analytics from './pages/Analytics.jsx';
import Submissions from './pages/Submissions.jsx';
import SubmissionDetail from './pages/SubmissionDetail.jsx';

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/forms/new', label: 'New Form', icon: Plus },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        w-64 glass-card m-0 lg:m-4 lg:rounded-xl flex flex-col
        transform transition-all duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        shadow-lg border-0
      `}>
        {/* Header */}
        <div className="p-6 border-b border-slate-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-2.5 shadow-sm">
                <FileText size={20} className="text-white" />
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900">
                  Form Builder
                </div>
                <div className="text-xs text-slate-500 font-medium">Professional Dashboard</div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 rounded-lg transition-all focus-ring"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-2">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={onClose}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group focus-ring ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm font-semibold'
                    : 'text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 font-medium'
                }`}
              >
                <Icon size={18} className={`${isActive(item.path) ? 'text-white' : 'text-slate-500 group-hover:text-indigo-500'} transition-colors`} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
        
        {/* Footer */}
        <div className="p-6 border-t border-slate-200/50">
          <div className="text-xs text-slate-500 text-center font-medium">
            © {new Date().getFullYear()} Form Builder Pro
          </div>
        </div>
      </aside>
    </>
  );
}

function Layout({ children }) {
  const location = useLocation();
  
  // Hide sidebar for public form pages
  const isPublicForm = location.pathname.match(/^\/forms\/[^/]+$/) && !location.pathname.includes('/edit');
  
  if (isPublicForm) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50 animate-gradient-move">
      <main className="flex-1 flex flex-col items-center justify-start w-full py-8 px-2 sm:px-6">
        <div className="w-full max-w-6xl mx-auto">
          <div className="modern-card p-6 md:p-10 shadow-xl border border-gray-100/80 rounded-2xl bg-white/90 backdrop-blur-md">
            {children}
          </div>
        </div>
      </main>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#ffffff',
            color: '#374151',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<FormsList />} />
          <Route path="/forms/new" element={<FormBuilder />} />
          <Route path="/forms/:id/edit" element={<FormBuilder />} />
          <Route path="/forms/:id/preview" element={<FormPreview />} />
          <Route path="/forms/:id/settings" element={<FormSettings />} />
          <Route path="/forms/:id/analytics" element={<Analytics />} />
          <Route path="/forms/:id" element={<FormRender />} />
          <Route path="/forms/:id/submissions" element={<Submissions />} />
          <Route path="/forms/:id/submissions/:submissionId" element={<SubmissionDetail />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}