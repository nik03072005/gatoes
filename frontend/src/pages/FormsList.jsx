import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, FileText, Eye, BarChart3, Edit3, MoreVertical, Trash2, Copy, Settings, ExternalLink, Menu, X } from 'lucide-react';
import { TableSkeleton } from '../components/Skeleton';
import { ConfirmModal } from '../components/Modal';
import api from '../api';

export default function FormsList() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, form: null });
  const [duplicateModal, setDuplicateModal] = useState({ isOpen: false, form: null });
  const [openMenuId, setOpenMenuId] = useState(null);

  const load = async () => {
    try {
      const { data } = await api.get('/forms');
      setForms(data);
    } catch (e) {
      toast.error('Failed to load forms: ' + e.message);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const duplicateForm = async (form) => {
    try {
      toast.loading('Duplicating form...', { id: 'duplicate' });
      const response = await api.post(`/forms/${form._id}/duplicate`);
      setForms(prev => [response.data, ...prev]);
      toast.success(`"${form.title}" duplicated successfully!`, { id: 'duplicate' });
    } catch (e) {
      toast.error('Failed to duplicate form: ' + e.message, { id: 'duplicate' });
    }
  };

  const deleteForm = async (form) => {
    try {
      toast.loading('Deleting form...', { id: 'delete' });
      await api.delete(`/forms/${form._id}`);
      setForms(prev => prev.filter(f => f._id !== form._id));
      toast.success(`"${form.title}" deleted successfully!`, { id: 'delete' });
    } catch (e) {
      toast.error('Failed to delete form: ' + e.message, { id: 'delete' });
    }
  };
  useEffect(() => { load(); }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenuId]);

  const ActionMenu = ({ form, isOpen, onToggle }) => (
    <div className="relative">
      <button
        onClick={onToggle}
        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all md:hidden focus-ring"
        title="More actions"
      >
        <MoreVertical size={16} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 glass-card rounded-lg shadow-lg z-10">
          <div className="py-1">
            <Link 
              to={`/forms/${form._id}/edit`} 
              className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all rounded-lg mx-1"
              onClick={() => setOpenMenuId(null)}
            >
              <Edit3 size={14} className="mr-3 text-indigo-500" />
              Edit Form
            </Link>
            <Link 
              to={`/forms/${form._id}/preview`} 
              className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all rounded-lg mx-1"
              onClick={() => setOpenMenuId(null)}
            >
              <Eye size={14} className="mr-3 text-emerald-500" />
              Preview
            </Link>
            <Link 
              to={`/forms/${form._id}/analytics`} 
              className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all rounded-lg mx-1"
              onClick={() => setOpenMenuId(null)}
            >
              <BarChart3 size={14} className="mr-3 text-purple-500" />
              Analytics
            </Link>
            <Link 
              to={`/forms/${form._id}/settings`} 
              className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all rounded-lg mx-1"
              onClick={() => setOpenMenuId(null)}
            >
              <Settings size={14} className="mr-3 text-slate-500" />
              Settings
            </Link>
            <div className="border-t border-slate-200 my-1"></div>
            <button
              onClick={() => {
                setDuplicateModal({ isOpen: true, form });
                setOpenMenuId(null);
              }}
              className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all rounded-lg mx-1 w-full text-left"
            >
              <Copy size={14} className="mr-3 text-slate-500" />
              Duplicate
            </button>
            <button
              onClick={() => {
                setDeleteModal({ isOpen: true, form });
                setOpenMenuId(null);
              }}
              className="flex items-center px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-all rounded-lg mx-1 w-full text-left"
            >
              <Trash2 size={14} className="mr-3" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (loading) return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="h-8 bg-slate-200 rounded-lg animate-pulse w-64 mb-2"></div>
          <div className="h-5 bg-slate-200 rounded-lg animate-pulse w-96"></div>
        </div>
        <div className="h-10 bg-slate-200 rounded-lg animate-pulse w-32"></div>
      </div>
      <TableSkeleton rows={5} columns={5} />
    </div>
  );
  
  if (error) return (
    <div className="modern-card p-6 border-l-4 border-red-500">
      <div className="flex">
        <div className="text-red-500 text-xl">⚠</div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-red-800">Unable to load forms</h3>
          <div className="mt-2 text-red-700">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 btn-gradient text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-8 space-y-6 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Forms Dashboard
          </h1>
          <p className="text-lg text-slate-600 mb-4">Manage and track your form submissions</p>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <div className="status-dot status-active"></div>
              <span className="font-medium">{forms.length} Total Forms</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <div className="status-dot bg-slate-400"></div>
              <span className="font-medium">Live Dashboard</span>
            </div>
          </div>
        </div>
        <Link 
          to="/forms/new" 
          className="btn-gradient flex items-center justify-center gap-2 font-semibold w-full sm:w-auto focus-ring"
        >
          <Plus size={18} />
          <span>Create Form</span>
        </Link>
      </div>

        {forms.length === 0 ? (
          <div className="text-center py-20 modern-card">
            <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6">
              <FileText size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No forms created yet</h3>
            <p className="text-slate-600 mb-8 max-w-sm mx-auto">Get started by creating your first form to collect responses and manage submissions.</p>
            <Link to="/forms/new" className="btn-gradient inline-flex items-center gap-2 font-semibold focus-ring">
              <Plus size={18} />
              Create Your First Form
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block modern-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full table-professional">
                  <thead>
                    <tr>
                      <th className="text-left">Form Details</th>
                      <th className="text-left">Status</th>
                      <th className="text-left">Responses</th>
                      <th className="text-left">Created</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forms.map(f => (
                      <tr key={f._id} className="group">
                        <td>
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                                <FileText className="h-5 w-5 text-white" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-slate-900">{f.title}</div>
                              <div className="text-sm text-slate-500">{f.description || 'No description'}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            f.status === 'published' 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {f.status}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center">
                            <BarChart3 className="h-4 w-4 text-slate-400 mr-2" />
                            <span className="text-sm font-semibold text-slate-900">{f.submissionsCount}</span>
                          </div>
                        </td>
                        <td className="text-sm text-slate-500 font-medium">
                          {new Date(f.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </td>
                        <td className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Link 
                              to={`/forms/${f._id}/edit`} 
                              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors focus-ring"
                              title="Edit Form"
                            >
                              <Edit3 size={12} className="mr-1" />
                              <span className="hidden xl:inline">Edit</span>
                            </Link>
                            <Link 
                              to={`/forms/${f._id}/preview`} 
                              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors focus-ring"
                              title="Preview Form"
                            >
                              <Eye size={12} className="mr-1" />
                              <span className="hidden xl:inline">Preview</span>
                            </Link>
                            <Link 
                              to={`/forms/${f._id}/analytics`} 
                              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors focus-ring"
                              title="View Analytics"
                            >
                              <BarChart3 size={12} className="mr-1" />
                              <span className="hidden xl:inline">Analytics</span>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {forms.map(f => (
                <div key={f._id} className="modern-card p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold text-slate-900 truncate">{f.title}</h3>
                        <p className="text-sm text-slate-500 truncate">{f.description || 'No description'}</p>
                      </div>
                    </div>
                    <ActionMenu 
                      form={f} 
                      isOpen={openMenuId === f._id} 
                      onToggle={() => setOpenMenuId(openMenuId === f._id ? null : f._id)} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        f.status === 'published' 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {f.status}
                      </span>
                      <div className="flex items-center space-x-1">
                        <BarChart3 className="h-3 w-3 text-slate-400" />
                        <span className="font-medium">{f.submissionsCount} responses</span>
                      </div>
                    </div>
                    <span className="font-medium text-xs">{new Date(f.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link 
                      to={`/forms/${f._id}/edit`} 
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors focus-ring"
                    >
                      <Edit3 size={12} className="mr-1" />
                      <span>Edit</span>
                    </Link>
                    <Link 
                      to={`/forms/${f._id}/preview`} 
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors focus-ring"
                    >
                      <Eye size={12} className="mr-1" />
                      <span>Preview</span>
                    </Link>
                    <Link 
                      to={`/forms/${f._id}/analytics`} 
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors focus-ring"
                    >
                      <BarChart3 size={12} className="mr-1" />
                      <span>Analytics</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, form: null })}
        onConfirm={() => deleteForm(deleteModal.form)}
        title="Delete Form"
        message={`Are you sure you want to delete "${deleteModal.form?.title}" and all its submissions? This action cannot be undone.`}
        confirmText="Delete"
        confirmColor="red"
      />

      {/* Duplicate Confirmation Modal */}
      <ConfirmModal
        isOpen={duplicateModal.isOpen}
        onClose={() => setDuplicateModal({ isOpen: false, form: null })}
        onConfirm={() => duplicateForm(duplicateModal.form)}
        title="Duplicate Form"
        message={`Do you want to create a copy of "${duplicateModal.form?.title}"?`}
        confirmText="Duplicate"
        confirmColor="blue"
      />
    </div>
  );
}
