import { useEffect, useState } from 'react';
import { Users, Clock, Hash, Loader2, User } from 'lucide-react';
import api from '../services/api';

export default function QueueExplorer() {
  const [parties, setParties] = useState({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await api.get('/queue');
        setParties(res.data.waiting_parties);
        setTotal(res.data.total_count);
      } catch (err) {
        console.error("Queue fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQueue();
    const interval = setInterval(fetchQueue, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="animate-spin text-emerald-500" size={40} />
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Live Queue Intelligence</h1>
          <p className="text-zinc-400 text-sm mt-1">Real-time visualization of party-based bin packing.</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl text-emerald-400 font-mono text-sm">
          TOTAL_NODES: {total}
        </div>
      </header>

      {total === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center bg-[#0a0a0a] border border-dashed border-white/10 rounded-3xl">
          <Users className="text-zinc-700 mb-4" size={48} />
          <p className="text-zinc-500 font-medium">Queue is currently drained.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(parties).map(([partyId, players]) => (
            <div key={partyId} className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 hover:border-white/20 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className={ `p-2 rounded-lg ${players.length > 1 ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}` }>
                    <Users size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-zinc-500 uppercase tracking-tighter">Party Ref</div>
                    <div className="text-sm font-bold text-zinc-200">#{partyId.slice(0, 8)}</div>
                  </div>
                </div>
                <div className="text-[10px] bg-zinc-900 text-zinc-500 px-2 py-1 rounded font-mono">
                  SIZE: {players.length}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {players.map((player, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white/[0.02] p-2 rounded-lg border border-white/5">
                    <div className="flex items-center gap-2">
                      <User size={12} className="text-zinc-500" />
                      <span className="text-xs font-medium text-zinc-300">{player.username}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-500">{player.total_elo}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-4 text-[10px] font-mono text-zinc-500">
                <div className="flex items-center gap-1">
                  <Clock size={10} /> {Math.floor((new Date() - new Date(players[0].entered_at)) / 1000)}s
                </div>
                <div className="flex items-center gap-1 uppercase">
                  <Hash size={10} /> {players[0].region}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}