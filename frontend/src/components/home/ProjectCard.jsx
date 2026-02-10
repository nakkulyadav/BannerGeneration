/**
 * Project Card Component
 *
 * Displays a single project in the projects grid with thumbnail,
 * metadata, and action menu (rename, duplicate, delete).
 */

import { useState, useRef, useEffect } from 'react';

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Today - show time
    return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  }
};

/**
 * Get display name for dimension type
 * @param {string} dimensionType - Dimension type identifier
 * @returns {string} Human-readable name
 */
const getDimensionTypeName = (dimensionType) => {
  const names = {
    promotional_banner: 'Promotional Banner',
    widget: 'Widget',
    circular_badge: 'Circular Badge',
    rounded_square: 'Rounded Square',
    banner2: 'Banner 2',
    custom: 'Custom',
  };
  return names[dimensionType] || dimensionType;
};

/**
 * Action Menu Component
 */
const ActionMenu = ({ isOpen, onClose, onRename, onDuplicate, onDelete }) => {
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-1 bg-[#252525] border border-gray-700 rounded-lg shadow-xl z-10 py-1 min-w-[140px]"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRename();
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Rename
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDuplicate();
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        Duplicate
      </button>
      <div className="border-t border-gray-700 my-1" />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Delete
      </button>
    </div>
  );
};

/**
 * Rename Modal Component
 */
const RenameModal = ({ isOpen, currentName, onClose, onSave }) => {
  const [name, setName] = useState(currentName);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setName(currentName);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, currentName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-medium text-white mb-4">Rename Project</h3>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-[#252525] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
            placeholder="Project name"
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * Project Card Component
 */
const ProjectCard = ({
  project,
  onClick,
  onRename,
  onDuplicate,
  onDelete,
  isLoading,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renameModalOpen, setRenameModalOpen] = useState(false);

  return (
    <>
      <div
        onClick={onClick}
        className={`
          group relative bg-[#1a1a1a] border border-gray-800 hover:border-purple-500/50
          rounded-xl p-4 cursor-pointer transition-all duration-200 hover:bg-[#1f1f1f]
          ${isLoading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl z-10">
            <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Thumbnail */}
        <div className="aspect-video bg-[#252525] rounded-lg mb-4 overflow-hidden flex items-center justify-center">
          {project.thumbnail_url ? (
            <img
              src={project.thumbnail_url}
              alt={project.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <div
              className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-gray-700"
              style={{
                width: `${Math.min(project.width / 5, 120)}px`,
                height: `${Math.min(project.height / 5, 80)}px`,
                borderRadius: `${project.border_radius / 5}px`,
              }}
            />
          )}
        </div>

        {/* Project Info */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium truncate group-hover:text-purple-300 transition-colors">
              {project.name}
            </h3>
            <p className="text-gray-500 text-sm">
              {getDimensionTypeName(project.dimension_type)}
            </p>
          </div>

          {/* Action Menu Button */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1 text-gray-500 hover:text-white hover:bg-gray-800 rounded transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>

            <ActionMenu
              isOpen={menuOpen}
              onClose={() => setMenuOpen(false)}
              onRename={() => setRenameModalOpen(true)}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
            />
          </div>
        </div>

        {/* Metadata */}
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
          <span>{project.width} × {project.height}</span>
          <span className="w-1 h-1 rounded-full bg-gray-700" />
          <span>{formatDate(project.updated_at)}</span>
        </div>
      </div>

      {/* Rename Modal */}
      <RenameModal
        isOpen={renameModalOpen}
        currentName={project.name}
        onClose={() => setRenameModalOpen(false)}
        onSave={onRename}
      />
    </>
  );
};

export default ProjectCard;
