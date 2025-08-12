import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Breadcrumb = ({ customItems = null, showHome = true }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeLabels = {
    '/': 'Dashboard',
    '/pos-management': 'POS Management',
    '/cheques-management': 'Cheques Management',
    '/kimbiales-management': 'Kimbiales Management',
    '/factures-management': 'Factures Management',
    '/ai-document-processing-playground': 'AI Document Processing',
    '/3d-network-visualization': '3D Network Visualization',
    '/profile': 'Profile Settings',
    '/settings': 'System Settings',
    '/help': 'Help & Support'
  };

  const routeIcons = {
    '/': 'Home',
    '/pos-management': 'MapPin',
    '/cheques-management': 'CreditCard',
    '/kimbiales-management': 'Receipt',
    '/factures-management': 'FileText',
    '/ai-document-processing-playground': 'Brain',
    '/3d-network-visualization': 'Network',
    '/profile': 'User',
    '/settings': 'Settings',
    '/help': 'HelpCircle'
  };

  const generateBreadcrumbs = () => {
    if (customItems) {
      return customItems;
    }

    const pathSegments = location?.pathname?.split('/')?.filter(segment => segment);
    const breadcrumbs = [];

    if (showHome && location?.pathname !== '/') {
      breadcrumbs?.push({
        label: 'Dashboard',
        path: '/',
        icon: 'Home',
        isActive: false
      });
    }

    let currentPath = '';
    pathSegments?.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments?.length - 1;
      
      breadcrumbs?.push({
        label: routeLabels?.[currentPath] || segment?.charAt(0)?.toUpperCase() + segment?.slice(1)?.replace(/-/g, ' '),
        path: currentPath,
        icon: routeIcons?.[currentPath] || 'ChevronRight',
        isActive: isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs?.length <= 1 && !showHome) {
    return null;
  }

  const handleNavigation = (path) => {
    if (path && path !== location?.pathname) {
      navigate(path);
    }
  };

  return (
    <nav className="flex items-center space-x-2 py-4" aria-label="Breadcrumb">
      <div className="flex items-center space-x-2 text-sm">
        {breadcrumbs?.map((item, index) => (
          <React.Fragment key={item?.path || index}>
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={14} 
                className="text-muted-foreground flex-shrink-0" 
              />
            )}
            
            <div className="flex items-center space-x-2">
              {item?.isActive ? (
                <div className="flex items-center space-x-2 text-foreground">
                  <Icon 
                    name={item?.icon} 
                    size={16} 
                    className="text-primary flex-shrink-0" 
                  />
                  <span className="font-medium">{item?.label}</span>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation(item?.path)}
                  className="h-auto p-1 text-muted-foreground hover:text-foreground transition-colors duration-150"
                >
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={item?.icon} 
                      size={16} 
                      className="flex-shrink-0" 
                    />
                    <span>{item?.label}</span>
                  </div>
                </Button>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
      {/* Current Page Indicator */}
      {breadcrumbs?.length > 0 && (
        <div className="ml-auto flex items-center space-x-2 text-xs text-muted-foreground">
          <Icon name="Clock" size={12} />
          <span>Last updated: {new Date()?.toLocaleTimeString()}</span>
        </div>
      )}
    </nav>
  );
};

export default Breadcrumb;