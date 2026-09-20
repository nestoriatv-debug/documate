import React, { useState, useEffect } from 'react';
import { ToolId, ScreenType, RecentFile } from './types';
import { AppHeader } from './components/common/AppHeader';
import { BottomNavigation } from './components/common/BottomNavigation';
import { NotificationToast, ToastMessage } from './components/common/NotificationToast';
import { FileActionSheet } from './components/common/FileActionSheet';
import { FilePreviewModal } from './components/common/FilePreviewModal';
import { AdInterstitialModal } from './components/common/AdInterstitialModal';

import { HomeScreen } from './components/screens/HomeScreen';
import { FilesScreen } from './components/screens/FilesScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';

import { ImageToPdfTool } from './components/tools/ImageToPdfTool';
import { PdfMergeTool } from './components/tools/PdfMergeTool';
import { PdfSplitTool } from './components/tools/PdfSplitTool';
import { PdfCompressTool } from './components/tools/PdfCompressTool';
import { ImageCompressorTool } from './components/tools/ImageCompressorTool';
import { ImageResizerTool } from './components/tools/ImageResizerTool';
import { FormatConverterTool } from './components/tools/FormatConverterTool';
import { PassportPhotoTool } from './components/tools/PassportPhotoTool';
import { DocumentScannerTool } from './components/tools/DocumentScannerTool';

import {
  loadRecentFiles,
  deleteRecentFile,
  clearAllRecentFiles,
  renameRecentFile,
} from './services/storageService';
import { adManager } from './services/adManager';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);
  const [selectedFileForAction, setSelectedFileForAction] = useState<RecentFile | null>(null);
  const [previewFile, setPreviewFile] = useState<RecentFile | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('documate_dark_mode') === 'true';
  });

  // Interstitial Ad State
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [interstitialPlacement, setInterstitialPlacement] = useState('');
  const [pendingAdCallback, setPendingAdCallback] = useState<(() => void) | null>(null);

  // Refs to allow popstate listener access to latest states without tearing down listener
  const previewFileRef = React.useRef(previewFile);
  previewFileRef.current = previewFile;

  const selectedFileRef = React.useRef(selectedFileForAction);
  selectedFileRef.current = selectedFileForAction;

  const showInterstitialRef = React.useRef(showInterstitial);
  showInterstitialRef.current = showInterstitial;

  const activeToolRef = React.useRef(activeTool);
  activeToolRef.current = activeTool;

  const currentScreenRef = React.useRef(currentScreen);
  currentScreenRef.current = currentScreen;

  // Load recent files on mount
  useEffect(() => {
    refreshFiles();
  }, []);

  // Sync dark mode class with HTML document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('documate_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('documate_dark_mode', 'false');
    }
  }, [isDarkMode]);

  // Android hardware/gesture back navigation integration
  useEffect(() => {
    if (!window.history.state?.documate) {
      window.history.replaceState({ documate: 'home' }, '');
    }

    const handlePopState = () => {
      if (previewFileRef.current) {
        setPreviewFile(null);
      } else if (selectedFileRef.current) {
        setSelectedFileForAction(null);
      } else if (showInterstitialRef.current) {
        setShowInterstitial(false);
        if (pendingAdCallback) {
          pendingAdCallback();
          setPendingAdCallback(null);
        }
      } else if (activeToolRef.current) {
        setActiveTool(null);
        refreshFiles();
      } else if (currentScreenRef.current !== 'home') {
        setCurrentScreen('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [pendingAdCallback]);

  // Register AdMob Interstitial Trigger
  useEffect(() => {
    adManager.registerInterstitialHandler((placement, onClosed) => {
      setInterstitialPlacement(placement);
      setPendingAdCallback(() => onClosed);
      setShowInterstitial(true);
      window.history.pushState({ documate: 'interstitial' }, '');
    });
  }, []);

  const refreshFiles = async () => {
    const files = await loadRecentFiles();
    setRecentFiles(files);
  };

  const handleCloseInterstitial = () => {
    setShowInterstitial(false);
    if (pendingAdCallback) {
      pendingAdCallback();
      setPendingAdCallback(null);
    }
    if (window.history.state?.documate === 'interstitial') {
      window.history.back();
    }
  };

  const showSuccessToast = (msg: string) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type: 'success', message: msg }]);
    refreshFiles();
  };

  const showErrorToast = (msg: string) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type: 'error', message: msg }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToolSelect = (toolId: ToolId) => {
    window.history.pushState({ documate: 'tool', id: toolId }, '');
    setActiveTool(toolId);
  };

  const handleBackToDashboard = () => {
    if (window.history.state?.documate === 'tool') {
      window.history.back();
    } else {
      setActiveTool(null);
      refreshFiles();
    }
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleOpenActionSheet = (file: RecentFile) => {
    window.history.pushState({ documate: 'actionSheet', id: file.id }, '');
    setSelectedFileForAction(file);
  };

  const handleCloseActionSheet = () => {
    if (window.history.state?.documate === 'actionSheet') {
      window.history.back();
    } else {
      setSelectedFileForAction(null);
    }
  };

  const handleOpenPreview = (file: RecentFile) => {
    window.history.pushState({ documate: 'preview', id: file.id }, '');
    setPreviewFile(file);
  };

  const handleClosePreview = () => {
    if (window.history.state?.documate === 'preview') {
      window.history.back();
    } else {
      setPreviewFile(null);
    }
  };

  const handleTabChange = (screen: ScreenType) => {
    if (screen !== currentScreen) {
      if (screen !== 'home') {
        window.history.pushState({ documate: 'tab', tab: screen }, '');
      }
      setCurrentScreen(screen);
    }
  };

  const handleDeleteFile = async (id: string) => {
    await deleteRecentFile(id);
    setSelectedFileForAction(null);
    showSuccessToast('File deleted.');
    refreshFiles();
  };

  const handleRenameFile = async (id: string, newName: string) => {
    await renameRecentFile(id, newName);
    setSelectedFileForAction(null);
    showSuccessToast('File renamed.');
    refreshFiles();
  };

  const handleClearAllFiles = async () => {
    await clearAllRecentFiles();
    showSuccessToast('All recent files cleared.');
    refreshFiles();
  };

  const renderActiveTool = () => {
    if (!activeTool) return null;

    const commonProps = {
      onSuccess: showSuccessToast,
      onError: showErrorToast,
      onDone: handleBackToDashboard,
    };

    switch (activeTool) {
      case 'image-to-pdf':
        return <ImageToPdfTool {...commonProps} />;
      case 'pdf-merge':
        return <PdfMergeTool {...commonProps} />;
      case 'pdf-split':
        return <PdfSplitTool {...commonProps} />;
      case 'pdf-compress':
        return <PdfCompressTool {...commonProps} />;
      case 'image-compress':
        return <ImageCompressorTool {...commonProps} />;
      case 'image-resize':
        return <ImageResizerTool {...commonProps} />;
      case 'format-converter':
        return <FormatConverterTool {...commonProps} />;
      case 'passport-photo':
        return <PassportPhotoTool {...commonProps} />;
      case 'document-scanner':
        return <DocumentScannerTool {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* App Header */}
      <AppHeader
        currentTab={currentScreen}
        activeTool={activeTool}
        onBack={handleBackToDashboard}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* Main Screen Content */}
      <main className="flex-1 w-full max-w-md mx-auto">
        {activeTool ? (
          renderActiveTool()
        ) : (
          <>
            {currentScreen === 'home' && (
              <HomeScreen
                onSelectTool={handleToolSelect}
                recentFiles={recentFiles}
                onOpenFileAction={handleOpenActionSheet}
                onViewAllFiles={() => handleTabChange('files')}
              />
            )}

            {currentScreen === 'files' && (
              <FilesScreen
                files={recentFiles}
                onSelectFile={handleOpenActionSheet}
                onDeleteFile={handleDeleteFile}
                onClearAll={handleClearAllFiles}
                onPreviewFile={handleOpenPreview}
              />
            )}

            {currentScreen === 'settings' && (
              <SettingsScreen
                isDarkMode={isDarkMode}
                onToggleDarkMode={handleToggleDarkMode}
                onClearAllFiles={handleClearAllFiles}
                recentCount={recentFiles.length}
              />
            )}
          </>
        )}
      </main>

      {/* Persistent Bottom Navigation (Hidden when active in a specific tool for focused canvas) */}
      {!activeTool && (
        <BottomNavigation
          currentTab={currentScreen}
          onTabChange={handleTabChange}
          recentCount={recentFiles.length}
        />
      )}

      {/* File Action Bottom Sheet */}
      <FileActionSheet
        file={selectedFileForAction}
        isOpen={Boolean(selectedFileForAction)}
        onClose={handleCloseActionSheet}
        onDelete={handleDeleteFile}
        onRename={handleRenameFile}
        onPreview={handleOpenPreview}
      />

      {/* File Preview Modal */}
      <FilePreviewModal
        file={previewFile}
        onClose={handleClosePreview}
      />

      {/* AdMob Interstitial Mock / Bridge Modal */}
      <AdInterstitialModal
        isOpen={showInterstitial}
        onClose={handleCloseInterstitial}
        actionName={interstitialPlacement}
      />

      {/* Toast Notification Alert */}
      <NotificationToast
        toasts={toasts}
        onDismiss={dismissToast}
      />
    </div>
  );
}
