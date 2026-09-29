"use client";
import React, { useState } from "react";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import WatchlistButton from "@/components/WatchlistButton";
import Link from "next/link";

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<StockWithWatchlistStatus[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<StockWithWatchlistStatus[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await searchStocks(searchTerm.trim());
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWatchlist = (symbol: string) => {
    const stock = searchResults.find((s) => s.symbol === symbol);
    if (stock && !watchlist.some((w) => w.symbol === symbol)) {
      setWatchlist([...watchlist, { ...stock, isInWatchlist: true }]);
    }
  };

  const handleRemoveFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter((s) => s.symbol !== symbol));
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Your Watchlist</h1>
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search stocks..."
          className="border px-3 py-2 rounded w-2/3"
        />
        <button
          onClick={handleSearch}
          className="ml-2 px-4 py-2 bg-yellow-500 text-white rounded"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
      {searchResults.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Search Results</h2>
          <ul>
            {searchResults.map((stock) => (
              <li key={stock.symbol} className="flex items-center justify-between py-2 border-b">
                <span>{stock.name} ({stock.symbol})</span>
                <WatchlistButton
                  symbol={stock.symbol}
                  company={stock.name}
                  isInWatchlist={watchlist.some((w) => w.symbol === stock.symbol)}
                  type="button"
                  onWatchlistChange={(symbol, add) => {
                    add ? handleAddToWatchlist(symbol) : handleRemoveFromWatchlist(symbol);
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <h2 className="text-lg font-semibold mb-2">My Watchlist</h2>
        {watchlist.length === 0 ? (
          <div className="text-gray-500">No stocks in your watchlist yet.</div>
        ) : (
          <ul>
            {watchlist.map((stock) => (
              <li key={stock.symbol} className="flex items-center justify-between py-2 border-b">
                <Link href={`/stocks/${stock.symbol}`} className="hover:underline">
                  {stock.name} ({stock.symbol})
                </Link>
                <WatchlistButton
                  symbol={stock.symbol}
                  company={stock.name}
                  isInWatchlist={true}
                  type="button"
                  showTrashIcon={true}
                  onWatchlistChange={(_, add) => {
                    if (!add) handleRemoveFromWatchlist(stock.symbol);
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
