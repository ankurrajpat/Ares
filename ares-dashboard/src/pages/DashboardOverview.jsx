import { useEffect, useState } from 'react';
import { Activity, Users, Target, Zap, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';

export default function DashboardOverview() {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/stats');
        setData(res.data);
        
        setHistory(prev => {
          const newPoint = { 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
            load: parseInt(res.data.active_queue) 
          };
          const updated = [...prev, newPoint];
          return updated.slice(-10); 
        });
      } catch (err) {
        console.error("Stats fetch failed", err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="animate-spin text-emerald-500" size={40} />
    </div>
  );

  const kpis = [
    { label: 'Active Queue', value: data.active_queue, icon: Users, color: 'text-blue-500' },
    { label: 'Matches Today', value: data.matches_today, icon: Activity, color: 'text-emerald-500' },
    { label: 'Success Rate', value: data.success_rate, icon: Target, color: 'text-orange-500' },
    { label: 'Engine Load', value: data.engine_load, icon: Zap, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">System Overview</h1>
        <p className="text-zinc-400 text-sm mt-1">Live Matchmaking Intelligence Node.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-[#0a0a0a] border border-white/5 p-5 rounded-2xl shadow-sm hover:border-white/10 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-zinc-400 text-sm font-medium">{kpi.label}</span>
              <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
            </div>
            <div className="text-3xl font-bold tracking-tighter">{kpi.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl h-[400px]">
        <h3 className="text-sm font-medium text-zinc-400 mb-6">Queue Volatility (Real-time)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
            <XAxis dataKey="time" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #27272a', borderRadius: '12px', fontSize: '12px' }} />
            <Line type="monotone" dataKey="load" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }} animationDuration={300} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}