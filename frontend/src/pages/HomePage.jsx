/**
 * Home Page Component
 *
 * Main landing page after authentication showing:
 * - Dimension selector with preset cards and custom option
 * - User's past projects dashboard
 *
 * This is the entry point for creating new projects or accessing existing ones.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { ProjectsList } from '../components/home';

// Preset dimension configurations
const PRESET_DIMENSIONS = [
  {
    id: 'promotional_banner',
    name: 'Promotional Banner',
    description: 'Standard DigiHaat promotional banner',
    width: 722,
    height: 312,
    borderRadius: 12,
    preview: '/previews/promotional-banner.png',
  },
  {
    id: 'widget',
    name: 'Widget',
    description: 'Square widget for compact displays',
    width: 164,
    height: 164,
    borderRadius: 40,
    preview: '/previews/widget.png',
  },
  {
    id: 'circular_badge',
    name: 'Circular Badge',
    description: 'Circular badge for profile or icons',
    width: 226,
    height: 226,
    borderRadius: 188,
    preview: '/previews/circular-badge.png',
  },
  {
    id: 'rounded_square',
    name: 'Rounded Square',
    description: 'Square with rounded corners',
    width: 226,
    height: 226,
    borderRadius: 48,
    preview: '/previews/rounded-square.png',
  },
  {
    id: 'banner2',
    name: 'Banner 2',
    description: 'Wide banner format',
    width: 722,
    height: 134,
    borderRadius: 24,
    preview: '/previews/banner2.png',
  },
];

/**
 * Dimension Card Component
 * Displays a clickable card for preset or custom dimensions
 */
const DimensionCard = ({ preset, onClick, isCustom = false }) => {
  if (isCustom) {
    return (
      <button
        onClick={onClick}
        className="group relative bg-[#1a1a1a] border-2 border-dashed border-gray-700 hover:border-purple-500 rounded-xl p-6 flex flex-col items-center justify-center min-h-[200px] transition-all duration-200 hover:bg-[#1f1f1f]"
      >
        {/* Plus Icon */}
        <div className="w-16 h-16 rounded-full bg-gray-800 group-hover:bg-purple-500/20 flex items-center justify-center mb-4 transition-colors">
          <svg
            className="w-8 h-8 text-gray-500 group-hover:text-purple-400 transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <span className="text-white font-medium mb-1">Custom Dimensions</span>
        <span className="text-gray-500 text-sm">Create your own size</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => onClick(preset)}
      className="group bg-[#1a1a1a] border border-gray-800 hover:border-purple-500 rounded-xl p-6 flex flex-col items-start min-h-[200px] transition-all duration-200 hover:bg-[#1f1f1f] text-left"
    >
      {/* Preview Area */}
      <div className="w-full aspect-video bg-[#252525] rounded-lg mb-4 flex items-center justify-center overflow-hidden">
        <div
          className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-gray-700"
          style={{
            width: `${Math.min(preset.width / 5, 120)}px`,
            height: `${Math.min(preset.height / 5, 80)}px`,
            borderRadius: `${preset.borderRadius / 5}px`,
          }}
        />
      </div>

      {/* Card Content */}
      <h3 className="text-white font-medium mb-1 group-hover:text-purple-300 transition-colors">
        {preset.name}
      </h3>
      <p className="text-gray-500 text-sm mb-2">{preset.description}</p>
      <div className="mt-auto flex items-center gap-2 text-xs text-gray-600">
        <span>{preset.width} × {preset.height}</span>
        <span className="w-1 h-1 rounded-full bg-gray-700" />
        <span>{preset.borderRadius}px radius</span>
      </div>
    </button>
  );
};

/**
 * Custom Dimension Modal
 */
const CustomDimensionModal = ({ isOpen, onClose, onCreate }) => {
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(300);
  const [error, setError] = useState('');

  const handleCreate = () => {
    setError('');

    if (width < 100 || width > 4096) {
      setError('Width must be between 100 and 4096 pixels');
      return;
    }
    if (height < 100 || height > 4096) {
      setError('Height must be between 100 and 4096 pixels');
      return;
    }

    // Corner radius defaults to 0; user can adjust it in the custom editor
    onCreate({ width, height, borderRadius: 0 });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-white mb-6">Custom Dimensions</h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Width Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Width (px)
          </label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
            min={100}
            max={4096}
            className="w-full px-4 py-3 bg-[#252525] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Height Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Height (px)
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
            min={100}
            max={4096}
            className="w-full px-4 py-3 bg-[#252525] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Preview */}
        <div className="mb-6 p-4 bg-[#252525] rounded-lg">
          <p className="text-gray-400 text-xs mb-2">Preview</p>
          <div className="flex items-center justify-center h-24">
            <div
              className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-500/50"
              style={{
                width: `${Math.min(width / 4, 150)}px`,
                height: `${Math.min(height / 4, 80)}px`,
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium rounded-lg transition-all"
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Home Page Component
 */
const HomePage = () => {
  const navigate = useNavigate();
  const { user, signOut, isSupabaseConfigured } = useAuth();
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * Handle preset dimension selection
   */
  const handlePresetSelect = async (preset) => {
    setLoading(true);

    // For now, navigate directly to editor with preset params
    // In production, this would create a project in Supabase first
    const projectId = `new-${preset.id}-${Date.now()}`;
    navigate(`/editor/${projectId}`, {
      state: {
        dimensionType: preset.id,
        width: preset.width,
        height: preset.height,
        borderRadius: preset.borderRadius,
        isNew: true,
      },
    });
  };

  /**
   * Handle custom dimension creation
   */
  const handleCustomCreate = async ({ width, height, borderRadius }) => {
    setShowCustomModal(false);
    setLoading(true);

    // For now, navigate directly to editor with custom params
    // In production, this would create a project in Supabase first
    const projectId = `new-custom-${Date.now()}`;
    navigate(`/editor/${projectId}`, {
      state: {
        dimensionType: 'custom',
        width,
        height,
        borderRadius,
        isNew: true,
      },
    });
  };

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">DigiHaat</span>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-gray-400 text-sm hidden sm:block">
                {user.email}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create New Project Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-2">Create New Project</h2>
          <p className="text-gray-400 mb-6">Choose a dimension preset or create a custom size</p>

          {/* Dimension Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRESET_DIMENSIONS.map((preset) => (
              <DimensionCard
                key={preset.id}
                preset={preset}
                onClick={handlePresetSelect}
              />
            ))}
            <DimensionCard
              isCustom
              onClick={() => setShowCustomModal(true)}
            />
          </div>
        </section>

        {/* Past Projects Section */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-2">Your Projects</h2>
          <p className="text-gray-400 mb-6">Continue working on your saved projects</p>

          {/* Projects List with search, actions, and empty state */}
          <ProjectsList />
        </section>
      </main>

      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #333',
          },
        }}
      />

      {/* Custom Dimension Modal */}
      <CustomDimensionModal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onCreate={handleCustomCreate}
      />

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default HomePage;
