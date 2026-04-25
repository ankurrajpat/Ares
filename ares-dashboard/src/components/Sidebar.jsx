import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Swords, Activity, Shield } from 'lucide-react';
import { cn } from '../utils/cn';

const navItems = [
  { name: 'Overview', path: '/', icon: LayoutDashboard },
  { name: 'Queue Explorer', path: '/queue', icon: Users },
  { name: 'Match Ledger', path: '/ledger', icon: Swords },
  { name: 'System Analytics', path: '/analytics', icon: Activity },
];

export default function Sidebar() {
  return (
    <div className="w-64 border-r border-white/5 bg-[#0a0a0a] h-screen flex flex-col z-50">
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <Shield className="text-emerald-500 mr-3" size={24} />
        <span className="text-white font-semibold tracking-wide">ARES_NOC</span>
      </div>
      
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive 
                  ? "bg-white/10 text-white" 
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              )
            }
          >
            <item.icon className="mr-3 h-4 w-4" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 text-xs text-zinc-600 font-mono">
        MODE: PURE_OBSERVER <br/>
        STATUS: MONITORING_ACTIVE
      </div>
    </div>
  );
}