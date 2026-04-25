import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardOverview from './pages/DashboardOverview';
import QueueExplorer from './pages/QueueExplorer';
import MatchLedger from './pages/MatchLedger';
import SystemAnalytics from './pages/SystemAnalytics';

export default function App() {
  return (
    <Router>
      <div className="flex h-screen bg-black text-zinc-100 overflow-hidden font-sans">
        <Sidebar />
        <main className="flex-1 overflow-y-auto relative">
          {/* Global Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 p-8 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="/queue" element={<QueueExplorer />} />
              <Route path="/ledger" element={<MatchLedger />} />
              <Route path="/analytics" element={<SystemAnalytics />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}