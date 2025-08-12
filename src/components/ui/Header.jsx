import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ user = null, onThemeChange = () => {}, currentTheme = 'synthwave' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const themes = [
    { id: 'synthwave', name: 'Synthwave Professional', icon: 'Zap' },
    { id: 'luxury', name: 'Luxury Dark', icon: 'Crown' },
    { id: 'cyberpunk', name: 'Cyberpunk', icon: 'Cpu' },
    { id: 'light', name: 'Light Mode', icon: 'Sun' }
  ];

  const primaryNavItems = [
    { 
      label: 'Cheques Management', 
      path: '/cheques-management', 
      icon: 'CreditCard',
      tooltip: 'Manage cheque processing and validation'
    },
    { 
      label: 'Factures Management', 
      path: '/factures-management', 
      icon: 'FileText',
      tooltip: 'Handle invoice processing workflows'
    },
    { 
      label: 'AI Playground', 
      path: '/ai-document-processing-playground', 
      icon: 'Brain',
      tooltip: 'Advanced AI document processing tools'
    },
    { 
      label: 'POS Management', 
      path: '/pos-management', 
      icon: 'MapPin',
      tooltip: 'Geographic POS operations and mapping'
    }
  ];

  const secondaryNavItems = [
    { 
      label: 'Kimbiales Management', 
      path: '/kimbiales-management', 
      icon: 'Receipt',
      tooltip: 'Specialized kimbiales document processing'
    },
    { 
      label: '3D Network Visualization', 
      path: '/3d-network-visualization', 
      icon: 'Network',
      tooltip: 'Advanced network analytics and visualization'
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef?.current && !userMenuRef?.current?.contains(event?.target)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef?.current && !mobileMenuRef?.current?.contains(event?.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleThemeChange = (themeId) => {
    onThemeChange(themeId);
    setIsUserMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
    setIsUserMenuOpen(false);
  };

  const isActivePath = (path) => location?.pathname === path;

  const currentUser = user || {
    name: 'Enterprise User',
    email: 'user@sotunol.com',
    role: 'Document Analyst',
    avatar: null
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Icon name="Zap" size={20} className="text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground font-heading">
                Sotunol Enterprise
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">
                Document Intelligence Platform
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {primaryNavItems?.map((item) => (
            <Button
              key={item?.path}
              variant={isActivePath(item?.path) ? "default" : "ghost"}
              size="sm"
              onClick={() => handleNavigation(item?.path)}
              className={`relative transition-all duration-200 ${
                isActivePath(item?.path) 
                  ? 'bg-primary text-primary-foreground shadow-synthwave' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              iconName={item?.icon}
              iconPosition="left"
              iconSize={16}
            >
              {item?.label}
              {isActivePath(item?.path) && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-accent rounded-full"></div>
              )}
            </Button>
          ))}
          
          {/* More Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-muted-foreground hover:text-foreground hover:bg-muted"
              iconName="MoreHorizontal"
              iconSize={16}
            >
              More
            </Button>
            
            {isMobileMenuOpen && (
              <div 
                ref={mobileMenuRef}
                className="absolute top-full right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-synthwave-lg z-50 py-2"
              >
                {secondaryNavItems?.map((item) => (
                  <button
                    key={item?.path}
                    onClick={() => handleNavigation(item?.path)}
                    className={`w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors duration-150 ${
                      isActivePath(item?.path)
                        ? 'bg-primary/10 text-primary border-r-2 border-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <Icon name={item?.icon} size={16} />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{item?.label}</div>
                      <div className="text-xs text-muted-foreground">{item?.tooltip}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </Button>
        </div>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {currentUser?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium text-foreground">{currentUser?.name}</div>
              <div className="text-xs text-muted-foreground">{currentUser?.role}</div>
            </div>
            <Icon name="ChevronDown" size={16} className={`transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
          </Button>

          {isUserMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-72 bg-card border border-border rounded-lg shadow-synthwave-lg z-50 py-2">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-white">
                      {currentUser?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{currentUser?.name}</div>
                    <div className="text-sm text-muted-foreground">{currentUser?.email}</div>
                    <div className="text-xs text-accent">{currentUser?.role}</div>
                  </div>
                </div>
              </div>

              {/* Theme Selection */}
              <div className="px-4 py-3 border-b border-border">
                <div className="text-sm font-medium text-foreground mb-2">Theme</div>
                <div className="grid grid-cols-2 gap-2">
                  {themes?.map((theme) => (
                    <button
                      key={theme?.id}
                      onClick={() => handleThemeChange(theme?.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors duration-150 ${
                        currentTheme === theme?.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon name={theme?.icon} size={14} />
                      <span className="truncate">{theme?.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150"
                >
                  <Icon name="User" size={16} />
                  <span>Profile Settings</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/settings');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150"
                >
                  <Icon name="Settings" size={16} />
                  <span>System Settings</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/help');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150"
                >
                  <Icon name="HelpCircle" size={16} />
                  <span>Help & Support</span>
                </button>
                <div className="border-t border-border my-2"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors duration-150"
                >
                  <Icon name="LogOut" size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <nav className="px-4 py-4 space-y-2">
            {[...primaryNavItems, ...secondaryNavItems]?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition-colors duration-150 ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={18} />
                <div className="flex-1 text-left">
                  <div className="font-medium">{item?.label}</div>
                  <div className="text-xs opacity-75">{item?.tooltip}</div>
                </div>
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;