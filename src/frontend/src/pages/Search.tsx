import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, SearchCheck, AlertCircle } from "lucide-react";
import { Logo } from "../components/Logo";
import { searchApi } from "../api/search"; // Ensure this path is correct
import type { SearchResult } from "../types"; // Ensure this path is correct

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [localQuery, setLocalQuery] = useState(query);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  //  fetch the data on load
  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;

      setIsLoading(true);
      setError("");

      try {
        const data = await searchApi(query);
        setResults(data?.data || []);
      } catch (err) {
        setError("Failed to retrieve intelligence from the neural net.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  // handle fetching of data
  const handleSearch = (e: any) => {
    e.preventDefault();
    if (localQuery.trim()) {
      setSearchParams({ q: localQuery });
    }
  };

  // Handle the input feild
  const handleQuerySearch = (e: any) => {
    setLocalQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-300 font-sans selection:bg-purple-500/30">
      {/* --- HEADER (Sticky & Glass) --- */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center gap-8">
          {/* Logo (Click to go Home) */}
          <a href="/" className="hover:opacity-80 transition-opacity">
            <Logo size="small" />
          </a>

          {/* Search Bar (Compact) */}
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-2xl relative group"
          >
            <div className="relative flex items-center w-full h-11 rounded-full bg-white/5 border border-white/10 focus-within:bg-white/10 focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all">
              <div className="pl-4 text-gray-500 group-focus-within:text-purple-400">
                <SearchCheck size={18} />
              </div>
              <input
                className="w-full h-full bg-transparent border-none outline-none px-3 text-sm text-white placeholder-gray-500"
                value={localQuery}
                onChange={handleQuerySearch}
              />
              <button
                type="submit"
                className="pr-4 text-gray-500 hover:text-white transition-colors"
              >
                <SearchIcon size={18} />
              </button>
            </div>
          </form>

          {/* User/Profile (Optional Visual) */}
          <div className="hidden md:flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-purple-500 to-pink-500 ring-2 ring-white/10"></div>
          </div>
        </div>

        {/* Navigation Tabs (Google Style) */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex gap-6 text-sm font-medium text-gray-400">
          <button className="pb-3 border-b-2 border-purple-500 text-white">
            All Results
          </button>
          <button className="pb-3 border-b-2 border-transparent hover:text-white transition-colors">
            Images
          </button>
          <button className="pb-3 border-b-2 border-transparent hover:text-white transition-colors">
            News
          </button>
          <button className="pb-3 border-b-2 border-transparent hover:text-white transition-colors">
            Code
          </button>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        {/* STATS BAR */}
        {!isLoading && !error && results.length > 0 && (
          <p className="text-xs text-gray-500 mb-8 font-mono">
            Moxcety found {results.length} results in 0.42 seconds.
          </p>
        )}

        {/* LOADING STATE (Skeleton) */}
        {isLoading && (
          <div className="space-y-8 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-4 bg-white/5 rounded w-1/3"></div>
                <div className="h-6 bg-white/10 rounded w-2/3"></div>
                <div className="h-16 bg-white/5 rounded w-full"></div>
              </div>
            ))}
          </div>
        )}

        {/* ERROR STATE */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 rounded-full bg-red-500/10 text-red-400 mb-4">
              <AlertCircle size={40} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              System Failure
            </h3>
            <p className="text-gray-400 max-w-md">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* RESULTS LIST */}
        <div className="space-y-10">
          {results.map((result, index) => (
            <div key={index} className="group max-w-2xl">
              {/* 1. URL / BREADCRUMB */}
              <div className="flex items-center gap-3 text-xs mb-1.5">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-gray-400 border border-white/5">
                  {/* Favicon Fallback using Google's service */}
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${new URL(result.url).hostname}&sz=32`}
                    className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity"
                    alt=""
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-300 font-medium">
                    {new URL(result.url).hostname}
                  </span>
                  <span className="text-gray-500 truncate max-w-50">
                    {result.url}
                  </span>
                </div>
              </div>

              {/* 2. TITLE */}
              <a
                href={result.url}
                target="_blank"
                rel="noreferrer"
                className="block group-hover:underline decoration-purple-500/50 decoration-2 underline-offset-4"
              >
                <h2 className="text-xl text-purple-400 font-medium mb-2 group-hover:text-purple-300 transition-colors whites truncate">
                  {result.title}
                </h2>
              </a>

              {/* 3. SNIPPET */}
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                {/* We assume your backend returns a snippet, if not we show a placeholder */}
                {result.title ||
                  "No description available for this result. The crawler has indexed this page but metadata is sparse."}
              </p>

              {/* 4. TAGS (Optional Flair) */}
              <div className="flex gap-2 mt-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 text-gray-500 border border-white/5">
                  WEB
                </span>
                {result.rank && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    SCORE: {result.rank.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION (Simple) */}
        {!isLoading && results.length > 0 && (
          <div className="mt-16 pt-8 border-t border-white/5 flex justify-center">
            <button className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm transition-colors text-purple-400 font-medium">
              Load More Results
            </button>
          </div>
        )}

        {/* NO RESULTS */}
        {!isLoading && !error && results.length === 0 && query && (
          <div className="py-20 text-center">
            <p className="text-gray-500 text-lg">
              No results found for{" "}
              <span className="text-white font-bold">"{query}"</span>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Try checking your keywords or crawling more pages.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Search;
