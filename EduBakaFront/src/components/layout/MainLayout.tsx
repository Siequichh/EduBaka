import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, Calendar, Settings, Sparkles, CheckCircle, Shield, Menu, X, Flame, MessageCircle, HelpCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import ChatBubble from '../chat/ChatBubble';
import WowToast from '../wow/WowToast';
import TourGuide from '../tour/TourGuide';
import { wowLabel } from '../../lib/wowCopy';
import { TourProvider, useTour } from '../../context/TourContext';

const MainLayout = () => (
  <TourProvider>
    <MainLayoutContent />
  </TourProvider>
);

const MainLayoutContent = () => {
  const { theme, mode, toggleTheme, toggleMode } = useTheme();
  const { user, logout } = useAuth();
  const { start: startTour } = useTour();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Tour no longer force-opens the sidebar — on mobile it uses a centered card, not a spotlight.
  const sidebarOpen = isMobileMenuOpen;

  const wow = mode === 'wow';

  return (
    <div className={`min-h-screen flex flex-col md:flex-row transition-colors duration-300
      ${wow ? (theme === 'dark' ? 'bg-[#0B1120] text-white' : 'bg-[#F8FAFC] text-slate-800') : 'bg-(--color-paper) dark:bg-(--color-paper-dark) text-(--color-ink) dark:text-(--color-ink-light)'}
      ${wow ? 'wow-mode-active' : ''}
    `}>
      {/* Mobile Header with Hamburger */}
      <div className={`md:hidden flex items-center justify-between p-4 border-b z-20 sticky top-0
        ${wow ? (theme === 'dark' ? 'bg-[#0B1120] border-gray-800' : 'bg-white border-slate-200') : 'bg-(--color-paper) dark:bg-(--color-paper-dark) border-black/10 dark:border-white/10'}
      `}>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${wow ? 'bg-blue-600' : 'bg-(--color-accent) rotate-3'}`}>
            EB
          </div>
          <h1 className={`text-xl font-bold ${wow ? '' : 'font-display'}`}>EduBaka</h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 h-screen w-64 flex flex-col justify-between p-4 border-r z-40 transition-transform duration-300 ease-in-out
        ${wow ? (theme === 'dark' ? 'border-gray-800 bg-[#0B1120]' : 'border-slate-200 bg-white') : 'border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-(--color-surface-dark)'}
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          <div className="hidden md:flex items-center gap-2 mb-8">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold shadow-md ${wow ? 'bg-blue-600 shadow-blue-500/20' : 'bg-(--color-accent) rotate-3 shadow-(--color-accent)/30'}`}>
              EB
            </div>
            <h1 className={`text-xl font-bold tracking-tight ${wow ? '' : 'font-display'}`}>EduBaka</h1>
          </div>

          <nav className="space-y-1.5">
            <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label={wowLabel(mode, 'Dashboard')} wow={wow} theme={theme} onClick={() => setIsMobileMenuOpen(false)} />
            <NavItem to="/tasks" icon={<CheckCircle size={20} />} label={wowLabel(mode, 'Tareas & Focus')} wow={wow} theme={theme} onClick={() => setIsMobileMenuOpen(false)} />
            <NavItem to="/streaks" icon={<Flame size={20} />} label={wowLabel(mode, 'Rachas')} wow={wow} theme={theme} onClick={() => setIsMobileMenuOpen(false)} />
            <NavItem to="/calendar" icon={<Calendar size={20} />} label={wowLabel(mode, 'Calendario')} wow={wow} theme={theme} onClick={() => setIsMobileMenuOpen(false)} />
            <NavItem to="/chat" icon={<MessageCircle size={20} />} label={wowLabel(mode, 'Chat')} wow={wow} theme={theme} onClick={() => setIsMobileMenuOpen(false)} />
            <NavItem to="/settings" icon={<Settings size={20} />} label={wowLabel(mode, 'Configuración')} wow={wow} theme={theme} onClick={() => setIsMobileMenuOpen(false)} />

            {user?.role === 'ADMIN' && (
              <>
                <div className="pt-4 mt-4 border-t border-black/[0.06] dark:border-white/[0.08]"></div>
                <NavLink onClick={() => setIsMobileMenuOpen(false)} to="/admin/users" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl font-medium transition-all hover:-translate-y-0.5 hover:shadow-sm border-l-4
                  ${wow
                    ? (theme === 'dark' ? 'hover:bg-purple-900/30 text-purple-300 hover:text-purple-200' : 'hover:bg-purple-50 text-purple-700 hover:text-purple-800')
                    : 'hover:bg-(--color-violet)/10 text-(--color-violet)'}
                  ${isActive
                    ? (wow ? 'bg-purple-900/20 border-purple-400' : 'bg-(--color-violet)/10 border-(--color-violet)')
                    : 'border-transparent'}`}>
                  <Shield size={20} />
                  <span>Panel de Admin</span>
                </NavLink>
              </>
            )}
          </nav>
        </div>

        <div className={`space-y-4 border-t pt-4 ${wow ? 'border-slate-200 dark:border-slate-800' : 'border-black/[0.06] dark:border-white/[0.08]'}`}>
          <div className="flex flex-col gap-2">
            <button onClick={toggleTheme} className={`text-sm text-left p-3 rounded-xl font-medium transition-colors ${wow ? (theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-white hover:shadow-sm shadow-slate-200/50') : 'hover:bg-black/[0.03] dark:hover:bg-white/5'}`}>
              Tema: {theme === 'light' ? 'Claro' : 'Oscuro'}
            </button>
            <button onClick={toggleMode} className={`text-sm text-left p-3 rounded-xl font-medium transition-colors flex items-center justify-between
              ${wow
                ? (theme === 'dark' ? 'hover:bg-blue-900/30 text-blue-400' : 'hover:bg-blue-50 text-blue-600 hover:shadow-sm shadow-slate-200/50')
                : 'hover:bg-(--color-violet)/10 text-(--color-violet)'}`}>
              <span>Modo WoW</span>
              {wow && <Sparkles size={16} />}
            </button>
            <button onClick={() => { setIsMobileMenuOpen(false); startTour(); }} className={`text-sm text-left p-3 rounded-xl font-medium transition-colors flex items-center gap-2 ${wow ? (theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-white hover:shadow-sm shadow-slate-200/50') : 'hover:bg-black/[0.03] dark:hover:bg-white/5'}`}>
              <HelpCircle size={16} />
              <span>{wowLabel(mode, 'Ver tour guiado')}</span>
            </button>
          </div>

          <div className={`flex items-center justify-between mt-4 p-3 rounded-xl ${wow ? 'bg-slate-100 dark:bg-slate-800' : 'bg-black/[0.03] dark:bg-white/5'}`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className={`w-9 h-9 shrink-0 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-sm shadow-inner ${wow ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-(--color-accent)'}`}>
                {user?.avatarUrl
                  ? <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                  : (user?.fullName?.substring(0, 2).toUpperCase() || 'U')}
              </div>
              <span className="text-sm font-semibold truncate">{user?.fullName || user?.email}</span>
            </div>
            <button onClick={logout} className={`p-2 transition-colors rounded-lg shrink-0 ${wow ? 'text-slate-400 hover:text-red-500 hover:bg-white dark:hover:bg-slate-700' : 'text-(--color-ink-soft) hover:text-(--color-accent-dark) hover:bg-white dark:hover:bg-white/10'}`}>
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 md:p-8 w-full">
        <Outlet />
      </main>

      <ChatBubble />
      {wow && <WowToast />}
      <TourGuide />
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  wow: boolean;
  theme: string;
  onClick: () => void;
}

const NavItem = ({ to, icon, label, wow, theme, onClick }: NavItemProps) => {
  const { registerNavRef } = useTour();
  return (
  <NavLink
    ref={(el) => registerNavRef(to, el)}
    onClick={onClick}
    to={to}
    className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl font-medium transition-all hover:-translate-y-0.5 hover:shadow-sm border-l-4
      ${wow
        ? (theme === 'dark' ? 'hover:bg-slate-800 text-slate-300 hover:text-white' : 'hover:bg-white hover:text-blue-600 hover:shadow-slate-200/50 text-slate-600')
        : 'text-(--color-ink-soft) hover:bg-(--color-accent)/10 hover:text-(--color-accent)'}
      ${isActive
        ? (wow
            ? (theme === 'dark' ? 'bg-slate-800 text-white border-blue-400' : 'bg-white text-blue-600 shadow-sm shadow-slate-200/50 border-blue-500')
            : 'bg-(--color-accent)/10 text-(--color-accent) border-(--color-accent)')
        : 'border-transparent'}`}
  >
    {icon}
    <span>{label}</span>
  </NavLink>
  );
};

export default MainLayout;
