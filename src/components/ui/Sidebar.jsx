import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isCollapsed = false, onToggle = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    financial: true,
    ai: false,
    geographic: false
  });

  const navigationSections = [
    {
      id: 'overview',
      label: 'Overview',
      icon: 'LayoutDashboard',
      description: 'Central command and control',
      items: [
        {
          label: 'Dashboard',
          path: '/dashboard',
          icon: 'Home',
          tooltip: 'Main dashboard with analytics and insights',
          badge: null
        }
      ]
    },
    {
      id: 'financial',
      label: 'Financial Operations',
      icon: 'DollarSign',
      description: 'Core document processing workflows',
      items: [
        {
          label: 'Cheques Management',
          path: '/cheques-management',
          icon: 'CreditCard',
          tooltip: 'Process and validate cheque documents',
          badge: null
        },
        {
          label: 'Kimbiales Management',
          path: '/kimbiales-management',
          icon: 'Receipt',
          tooltip: 'Specialized kimbiales document processing',
          badge: null
        },
        {
          label: 'Factures Management',
          path: '/factures-management',
          icon: 'FileText',
          tooltip: 'Invoice processing and validation workflows',
          badge: 'New'
        }
      ]
    },
    {
      id: 'ai',
      label: 'AI & Analytics',
      icon: 'Brain',
      description: 'Advanced processing and visualization tools',
      items: [
        {
          label: 'AI Document Processing',
          path: '/ai-document-processing-playground',
          icon: 'Cpu',
          tooltip: 'Advanced AI-powered document analysis',
          badge: 'Beta'
        },
        {
          label: '3D Network Visualization',
          path: '/3d-network-visualization',
          icon: 'Network',
          tooltip: 'Interactive network analytics and insights',
          badge: null
        }
      ]
    },
    {
      id: 'geographic',
      label: 'Geographic Management',
      icon: 'MapPin',
      description: 'Location-based POS operations',
      items: [
        {
          label: 'POS Management',
          path: '/pos-management',
          icon: 'Map',
          tooltip: 'Geographic POS operations and mapping',
          badge: null
        }
      ]
    },
    {
      id: 'tools',
      label: 'Tools & Utilities',
      icon: 'Settings',
      description: 'System tools and data export',
      items: [
        {
          label: 'Export Center',
          path: '/export-center',
          icon: 'Download',
          tooltip: 'Centralized data export and scheduling',
          badge: null
        }
      ]
    }
  ];

  useEffect(() => {
    // Determine active section based on current path
    const currentPath = location?.pathname;
    const section = navigationSections?.find(section =>
      section?.items?.some(item => item?.path === currentPath)
    );
    
    if (section) {
      setActiveSection(section?.id);
      setExpandedSections(prev => ({
        ...prev,
        [section?.id]: true
      }));
    }
  }, [location?.pathname]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev?.[sectionId]
    }));
  };

  const isActivePath = (path) => location?.pathname === path;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`fixed left-0 top-16 bottom-0 z-40 bg-card border-r border-border transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-80'
      } hidden lg:block`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {!isCollapsed && (
              <div>
                <h2 className="text-lg font-semibold text-foreground font-heading">Navigation</h2>
                <p className="text-sm text-muted-foreground">Document Intelligence Platform</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={20} />
            </Button>
          </div>

          {/* Navigation Sections */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="space-y-2">
              {navigationSections?.map((section) => (
                <div key={section?.id} className="px-3">
                  {/* Section Header */}
                  <button
                    onClick={() => !isCollapsed && toggleSection(section?.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 group ${
                      activeSection === section?.id
                        ? 'bg-primary/10 text-primary border border-primary/20' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                    disabled={isCollapsed}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon 
                        name={section?.icon} 
                        size={20} 
                        className={activeSection === section?.id ? 'text-primary' : 'text-current'}
                      />
                      {!isCollapsed && (
                        <div className="text-left">
                          <div className="font-medium text-sm">{section?.label}</div>
                          <div className="text-xs opacity-75">{section?.description}</div>
                        </div>
                      )}
                    </div>
                    {!isCollapsed && (
                      <Icon 
                        name="ChevronDown" 
                        size={16} 
                        className={`transition-transform duration-200 ${
                          expandedSections?.[section?.id] ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>

                  {/* Section Items */}
                  {(!isCollapsed && expandedSections?.[section?.id]) && (
                    <div className="mt-2 ml-4 space-y-1">
                      {section?.items?.map((item) => (
                        <button
                          key={item?.path}
                          onClick={() => handleNavigation(item?.path)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg text-sm transition-all duration-200 group ${
                            isActivePath(item?.path)
                              ? 'bg-primary text-primary-foreground shadow-synthwave'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Icon name={item?.icon} size={18} />
                            <span className="font-medium">{item?.label}</span>
                          </div>
                          {item?.badge && (
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                              item?.badge === 'New' ?'bg-success text-success-foreground'
                                : item?.badge === 'Beta' ?'bg-warning text-warning-foreground' :'bg-accent text-accent-foreground'
                            }`}>
                              {item?.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Collapsed Section Items */}
                  {isCollapsed && (
                    <div className="mt-2 space-y-1">
                      {section?.items?.map((item) => (
                        <div key={item?.path} className="relative group">
                          <button
                            onClick={() => handleNavigation(item?.path)}
                            className={`w-full flex items-center justify-center p-3 rounded-lg transition-all duration-200 ${
                              isActivePath(item?.path)
                                ? 'bg-primary text-primary-foreground shadow-synthwave'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }`}
                          >
                            <Icon name={item?.icon} size={18} />
                          </button>
                          
                          {/* Tooltip */}
                          <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-lg shadow-synthwave-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap">
                            <div className="font-medium">{item?.label}</div>
                            <div className="text-xs text-muted-foreground">{item?.tooltip}</div>
                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-popover rotate-45"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border">
            {!isCollapsed ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-success to-secondary rounded-full flex items-center justify-center">
                    <Icon name="CheckCircle" size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">System Status</div>
                    <div className="text-xs text-success">All systems operational</div>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground text-center">
                  Sotunol Enterprise v2.1.0
                  <br />
                  Last updated: Aug 12, 2025
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-gradient-to-br from-success to-secondary rounded-full flex items-center justify-center">
                  <Icon name="CheckCircle" size={16} className="text-white" />
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
        <nav className="flex items-center justify-around py-2">
          {navigationSections?.slice(0, 4)?.map((section) => {
            const hasActiveItem = section?.items?.some(item => isActivePath(item?.path));
            return (
              <button
                key={section?.id}
                onClick={() => {
                  const firstItem = section?.items?.[0];
                  if (firstItem) handleNavigation(firstItem?.path);
                }}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors duration-200 ${
                  hasActiveItem
                    ? 'text-primary' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={section?.icon} size={20} />
                <span className="text-xs font-medium truncate max-w-16">{section?.label?.split(' ')?.[0]}</span>
                {hasActiveItem && (
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;