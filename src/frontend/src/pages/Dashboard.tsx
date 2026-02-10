import { useState, useEffect } from "react";
import {
  Activity,
  Database,
  Server,
  ShieldAlert,
  Play,
  Square,
  RefreshCw,
} from "lucide-react";
import { Logo } from "../components/Logo";

const Dashboard = () => {
  // --- STATE (MOCK DATA FOR NOW) ---
  const [status, setStatus] = useState<"idle" | "active" | "error">("active");
  const [stats, setStats] = useState({
    total_pages: 1240,
    queue_size: 45,
    error_count: 3,
    avg_speed: "120ms",
  });

  const [logs, setLogs] = useState([
    {
      time: "10:42:01",
      level: "info",
      message: "Crawled https://react.dev/learn",
    },
    { time: "10:42:05", level: "success", message: "Indexed 45 new keywords" },
    {
      time: "10:42:08",
      level: "warning",
      message: "Skipped duplicate: https://react.dev",
    },
    {
      time: "10:42:12",
      level: "info",
      message: "Fetching https://google.com...",
    },
  ]);

  // --- ACTIONS ---
  const toggleCrawler = () => {
    setStatus((prev) => (prev === "active" ? "idle" : "active"));
    // TODO: Call API POST /api/crawler/toggle
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-300 font-sans p-8">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <Logo size="small" />
          <span className="px-3 py-1 rounded-full bg-white/5 text-xs font-mono text-gray-500 border border-white/10">
            v1.0.0-beta
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full border ${status === "active" ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-gray-800 border-gray-700"}`}
          >
            <div
              className={`w-2 h-2 rounded-full ${status === "active" ? "bg-green-400 animate-pulse" : "bg-gray-500"}`}
            ></div>
            <span className="text-sm font-medium uppercase tracking-wider">
              {status === "active" ? "System Online" : "System Offline"}
            </span>
          </div>
        </div>
      </header>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {/* Card 1: Total Pages */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400 group-hover:text-purple-300">
              <Database size={24} />
            </div>
            <span className="text-xs text-gray-500 font-mono">+12%</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">
            {stats.total_pages.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-500">Pages Indexed</p>
        </div>

        {/* Card 2: Queue */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
              <Activity size={24} />
            </div>
            <span className="text-xs text-gray-500 font-mono">Busy</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">
            {stats.queue_size}
          </h3>
          <p className="text-sm text-gray-500">Pending URLs</p>
        </div>

        {/* Card 3: Speed */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-green-500/50 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-green-500/20 text-green-400">
              <Server size={24} />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">
            {stats.avg_speed}
          </h3>
          <p className="text-sm text-gray-500">Avg Response Time</p>
        </div>

        {/* Card 4: Errors */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/50 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-red-500/20 text-red-400">
              <ShieldAlert size={24} />
            </div>
            <span className="text-xs text-red-400 font-mono">Critical</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">
            {stats.error_count}
          </h3>
          <p className="text-sm text-gray-500">Failed Crawls</p>
        </div>
      </div>

      {/* MAIN CONTROL AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Console / Logs */}
        <div className="lg:col-span-2 bg-black rounded-2xl border border-white/10 overflow-hidden flex flex-col h-[400px]">
          <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
            <h4 className="font-medium text-gray-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              Live Crawler Logs
            </h4>
            <button className="p-2 hover:bg-white/10 rounded-lg text-gray-500 transition-colors">
              <RefreshCw size={16} />
            </button>
          </div>
          <div className="flex-1 p-6 font-mono text-sm overflow-y-auto space-y-3 custom-scrollbar">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-gray-600 select-none">[{log.time}]</span>
                <span
                  className={`${
                    log.level === "info"
                      ? "text-blue-400"
                      : log.level === "success"
                        ? "text-green-400"
                        : "text-yellow-400"
                  }`}
                >
                  {log.message}
                </span>
              </div>
            ))}
            <div className="animate-pulse text-gray-600">_</div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6 flex flex-col justify-between h-[400px]">
          <div>
            <h4 className="text-xl font-bold text-white mb-2">Control Panel</h4>
            <p className="text-sm text-gray-400 mb-8">
              Manage the distributed crawler nodes directly from this terminal.
            </p>

            <div className="space-y-4">
              <button
                onClick={toggleCrawler}
                className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 font-bold transition-all ${
                  status === "active"
                    ? "bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500/20"
                    : "bg-green-600 text-white hover:bg-green-500 shadow-lg shadow-green-900/20"
                }`}
              >
                {status === "active" ? (
                  <Square size={20} fill="currentColor" />
                ) : (
                  <Play size={20} fill="currentColor" />
                )}
                {status === "active" ? "EMERGENCY STOP" : "INITIATE CRAWL"}
              </button>

              <button className="w-full py-3 rounded-xl bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 transition-colors font-medium">
                Clear Database
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <h5 className="text-purple-300 text-xs font-bold uppercase mb-2">
              System Health
            </h5>
            <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full w-[70%]"></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>CPU: 45%</span>
              <span>MEM: 1.2GB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
