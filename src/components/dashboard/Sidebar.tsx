import React from 'react';
import type { DashboardView, UserProfile } from '../../types/auth';
import {
  LayoutDashboard,
  Mic,
  BookOpen,
  BarChart3,
  FileText,
  Bot,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  user: UserProfile;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  id: DashboardView;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeType?: 'live' | 'count' | 'new';
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview Hub',
    icon: <LayoutDashboard size={18} />,
  },
  {
    id: 'studio',
    label: 'AI Mock Studio',
    icon: <Mic size={18} />,
    badge: 'LIVE',
    badgeType: 'live',
  },
  {
    id: 'questions',
    label: 'Question Bank',
    icon: <BookOpen size={18} />,
    badge: '500+',
    badgeType: 'count',
  },
  {
    id: 'analytics',
    label: 'Performance',
    icon: <BarChart3 size={18} />,
  },
  {
    id: 'resume',
    label: 'Resume Matcher',
    icon: <FileText size={18} />,
    badge: 'AI',
    badgeType: 'new',
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onViewChange,
  user,
  isCollapsed,
  onToggleCollapse,
}) => {
  return (
    <aside className={`dash-sidebar glass-panel ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <Bot size={22} className="sidebar-logo-svg" />
        </div>
        {!isCollapsed && (
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">
              Interview<span className="brand-gradient">IQ</span>
            </span>
            <span className="sidebar-brand-ver">v2.5 Enterprise</span>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="sidebar-nav" aria-label="Main Navigation">
        <div className="nav-group-title">{!isCollapsed && 'WORKSPACE'}</div>
        <ul className="nav-list">
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onViewChange(item.id)}
                  className={`nav-item-btn ${isActive ? 'nav-active' : ''}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="nav-item-icon">{item.icon}</span>
                  {!isCollapsed && (
                    <>
                      <span className="nav-item-label">{item.label}</span>
                      {item.badge && (
                        <span className={`nav-item-badge badge-${item.badgeType}`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Monthly Quota & Readiness Card (expanded only) */}
      {!isCollapsed && (
        <div className="sidebar-quota-card">
          <div className="quota-header">
            <span className="quota-title">
              <Sparkles size={13} className="text-accent" /> AI Session Pass
            </span>
            <span className="quota-val">12/20</span>
          </div>
          <div className="quota-progress-bar">
            <div className="quota-fill" style={{ width: '60%' }}></div>
          </div>
          <div className="quota-foot">
            <Zap size={11} /> 8 loops available this billing cycle
          </div>
        </div>
      )}

      {/* User Mini Profile & Collapse Toggle */}
      <div className="sidebar-footer">
        <div className="sidebar-user-row">
          <div className="user-avatar-mini">
            {user.name.split(' ').map((n) => n[0]).join('')}
          </div>
          {!isCollapsed && (
            <div className="user-meta-mini">
              <span className="user-name-mini">{user.name}</span>
              <span className="user-role-mini">{user.targetRole}</span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onToggleCollapse}
          className="sidebar-collapse-btn"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>
    </aside>
  );
};
