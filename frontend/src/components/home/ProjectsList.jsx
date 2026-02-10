/**
 * Projects List Component
 *
 * Displays a grid of user's saved projects with search and actions.
 * Used on the HomePage to show past projects.
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getProjects, deleteProject, duplicateProject, renameProject } from '../../services/projectService';
import ProjectCard from './ProjectCard';
import toast from 'react-hot-toast';

/**
 * Loading skeleton for project cards
 */
const ProjectCardSkeleton = () => (
  <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 animate-pulse">
    <div className="aspect-video bg-gray-800 rounded-lg mb-4" />
    <div className="h-4 bg-gray-800 rounded w-3/4 mb-2" />
    <div className="h-3 bg-gray-800 rounded w-1/2" />
  </div>
);

/**
 * Empty state when no projects exist
 */
const EmptyState = () => (
  <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-12 text-center">
    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
      <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    </div>
    <h3 className="text-white font-medium mb-2">No projects yet</h3>
    <p className="text-gray-500 text-sm">
      Create your first project by selecting a dimension above
    </p>
  </div>
);

/**
 * No search results state
 */
const NoResultsState = ({ searchTerm, onClear }) => (
  <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-12 text-center">
    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
      <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <h3 className="text-white font-medium mb-2">No projects found</h3>
    <p className="text-gray-500 text-sm mb-4">
      No projects matching "{searchTerm}"
    </p>
    <button
      onClick={onClear}
      className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
    >
      Clear search
    </button>
  </div>
);

/**
 * Projects List Component
 */
const ProjectsList = () => {
  const navigate = useNavigate();
  const { user, isSupabaseConfigured } = useAuth();

  // State
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(null); // Project ID being acted on

  /**
   * Load user's projects
   */
  const loadProjects = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await getProjects(user.id);

      if (error) {
        console.error('Failed to load projects:', error);
        toast.error('Failed to load projects');
        return;
      }

      setProjects(data || []);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  /**
   * Handle project click - open in editor
   */
  const handleProjectClick = (project) => {
    navigate(`/editor/${project.id}`, {
      state: {
        dimensionType: project.dimension_type,
        width: project.width,
        height: project.height,
        borderRadius: project.border_radius,
        isNew: false,
      },
    });
  };

  /**
   * Handle project rename
   */
  const handleRename = async (projectId, newName) => {
    setActionLoading(projectId);

    try {
      const { error } = await renameProject(projectId, newName);

      if (error) {
        toast.error('Failed to rename project');
        return;
      }

      // Update local state
      setProjects(prev =>
        prev.map(p =>
          p.id === projectId ? { ...p, name: newName } : p
        )
      );
      toast.success('Project renamed');
    } catch (err) {
      toast.error('Failed to rename project');
    } finally {
      setActionLoading(null);
    }
  };

  /**
   * Handle project duplicate
   */
  const handleDuplicate = async (projectId) => {
    setActionLoading(projectId);

    try {
      const { data, error } = await duplicateProject(projectId);

      if (error) {
        toast.error('Failed to duplicate project');
        return;
      }

      // Add to local state
      setProjects(prev => [data, ...prev]);
      toast.success('Project duplicated');
    } catch (err) {
      toast.error('Failed to duplicate project');
    } finally {
      setActionLoading(null);
    }
  };

  /**
   * Handle project delete
   */
  const handleDelete = async (projectId) => {
    // Confirm deletion
    if (!window.confirm('Are you sure you want to delete this project? This cannot be undone.')) {
      return;
    }

    setActionLoading(projectId);

    try {
      const { error } = await deleteProject(projectId);

      if (error) {
        toast.error('Failed to delete project');
        return;
      }

      // Remove from local state
      setProjects(prev => prev.filter(p => p.id !== projectId));
      toast.success('Project deleted');
    } catch (err) {
      toast.error('Failed to delete project');
    } finally {
      setActionLoading(null);
    }
  };

  // Filter projects by search term
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show empty state if no Supabase
  if (!isSupabaseConfigured) {
    return <EmptyState />;
  }

  return (
    <div>
      {/* Search Bar */}
      {projects.length > 0 && (
        <div className="mb-6">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && projects.length === 0 && <EmptyState />}

      {/* No Search Results */}
      {!loading && projects.length > 0 && filteredProjects.length === 0 && (
        <NoResultsState searchTerm={searchTerm} onClear={() => setSearchTerm('')} />
      )}

      {/* Projects Grid */}
      {!loading && filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => handleProjectClick(project)}
              onRename={(newName) => handleRename(project.id, newName)}
              onDuplicate={() => handleDuplicate(project.id)}
              onDelete={() => handleDelete(project.id)}
              isLoading={actionLoading === project.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
