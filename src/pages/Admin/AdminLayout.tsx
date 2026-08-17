import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import { LayoutDashboard, ShieldAlert, Ban, BarChart3, Settings, LogOut, Video } from 'lucide-react';
import { APP_NAME } from '../../constants/app.constants';
import { Button } from '../../components/ui/Button';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAdminStore((state) => state.logout);
  const adminUser = useAdminStore((state) => state.adminUser);

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Reports', path: '/admin/reports', icon: ShieldAlert },
    { name: 'Bans', path: '/admin/bans', icon: Ban },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <div className="flex h-screen bg-bgDark text-textLight">
      {/* Sidebar Panel */}
      <aside className="w-64 border-r border-borderDark/40 bg-bgSurface/50 flex flex-col justify-between shrink-0 select-none">
        <div className="flex flex-col">
          {/* Header Title */}
          <div className="px-6 py-5 border-b border-borderDark/40 flex items-center space-x-2">
            <div className="p-1.5 bg-primary/20 rounded-lg text-primary">
              <Video className="h-4 w-4" />
            </div>
            <span className="font-bold tracking-tight text-textLight">{APP_NAME} Admin</span>
          </div>

          {/* Logged in User Profile */}
          <div className="px-6 py-4 border-b border-borderDark/40">
            <div className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
              {adminUser?.role === 'super_admin' ? 'Super Admin' : 'Moderator'}
            </div>
            <div className="font-semibold text-sm truncate mt-0.5 text-textLight">{adminUser?.username}</div>
          </div>

          {/* Links navigation list */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-textLight shadow-md shadow-indigo-500/10'
                      : 'text-textMuted hover:text-textLight hover:bg-bgSurface'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Action button at bottom */}
        <div className="p-4 border-t border-borderDark/40">
          <Button
            variant="ghost"
            fullWidth
            onClick={handleLogout}
            className="justify-start gap-3 text-textMuted hover:text-danger hover:bg-danger/5 text-sm rounded-xl py-2.5 px-4 transition-all"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main page content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-borderDark/40 bg-bgSurface/20 px-8 flex items-center justify-between shrink-0">
          <h2 className="text-base font-semibold tracking-wide text-textLight">
            {menuItems.find((m) => m.path === location.pathname)?.name || 'Admin Panel'}
          </h2>
          <Link to="/" className="text-xs text-primary hover:underline font-semibold">
            Back to App
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto p-8 no-scrollbar bg-slate-950/20">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
