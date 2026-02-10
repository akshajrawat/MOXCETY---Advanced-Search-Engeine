import { Search, SearchCheck } from "lucide-react";
import { Logo } from "../components/Logo";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Stop page reload

    if (!search.trim()) return;

    // Navigate to the Search Page logic
    navigate(`/search?q=${encodeURIComponent(search)}`);
  };

  return (
    // CONTAINER: Deep Matte Black Background (Matches Search Page)
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden font-sans bg-[#0A0A0A] selection:bg-purple-500/30">
      {/* Background Glow Effect (Optional "Moxcety" Vibe) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10 w-full flex flex-col items-center px-6 animate-in fade-in zoom-in duration-700">
        {/* 1. THE LOGO */}
        <div className="mb-12 scale-110">
          <Logo size="large" />
        </div>

        {/* 2. THE SEARCH FORM */}
        <form onSubmit={handleSearch} className="w-full max-w-3xl group">
          <div className="relative flex items-center w-full h-16 md:h-20 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl transition-all duration-300 hover:bg-white/10 hover:border-white/20 focus-within:ring-2 focus-within:ring-purple-500/50 focus-within:border-transparent">
            {/* Icon (Left) */}
            <div className="pl-6 md:pl-8 text-gray-500 group-focus-within:text-purple-400 transition-colors">
              <SearchCheck
                className="w-6 h-6 md:w-8 md:h-8"
                strokeWidth={2.5}
              />
            </div>

            {/* Input Field */}
            <input
              type="text"
              className="w-full h-full bg-transparent border-none outline-none px-4 md:px-6 text-lg md:text-2xl text-white placeholder-gray-500 font-medium"
              placeholder="Search the universe..."
              value={search}
              onChange={onChange}
              autoFocus
            />

            {/* Action Button (Right) */}
            <button
              type="submit"
              className="mr-2 md:mr-3 p-3 md:p-4 bg-purple-600 rounded-full text-white hover:bg-purple-500 transition-all shadow-lg hover:shadow-purple-500/50 active:scale-95"
            >
              <Search className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </form>

        {/* Tagline */}
        <p className="mt-10 text-gray-500 text-sm tracking-widest uppercase font-medium">
          Powered by{" "}
          <span className="text-purple-500 font-bold glow">Moxcety</span>{" "}
          Intelligence
        </p>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-8 text-center text-gray-600 text-xs tracking-wider">
        &copy; 2026 MOXCETY INC. SYSTEM ONLINE.
      </footer>
    </div>
  );
};

export default Home;
