import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function SystemAnalytics() {
  const [data, setData] = useState({ throughput: [], regions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics/throughput');
        setData(res.data);
      } catch (err) {
        console.error("Analytics fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="animate-spin text-emerald-500" size={40} />
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">System Analytics</h1>
        <p className="text-zinc-400 text-sm mt-1">Live throughput and regional node distribution.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Throughput Chart */}
        <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl h-[350px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-medium text-zinc-400">Match Deployment Volume</h3>
            <Activity className="text-emerald-500" size={16} />
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.throughput}>
              <defs>
                <linearGradient id="colorMatch" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
              <XAxis dataKey="time" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #27272a', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="matches" stroke="#10b981" fillOpacity={1} fill="url(#colorMatch)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Regional Distribution */}
        <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl h-[350px]">
          <h3 className="text-sm font-medium text-zinc-400 mb-6">Regional Node Activity</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.regions} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" horizontal={false} />
              <XAxis type="number" stroke="#52525b" fontSize={10} hide />
              <YAxis dataKey="name" type="category" stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} width={100} />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#000', border: '1px solid #27272a' }} />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}