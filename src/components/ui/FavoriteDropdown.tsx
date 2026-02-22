import type { FavoriteDropdownProps } from "@/types/ui/favoriteDropdownProps";
import { useState, useMemo } from "react";

export const FavoriteDropdown = ({ favs, onSelect, className = "" }: FavoriteDropdownProps) => {
    const [search, setSearch] = useState("");
    const filteredFavs = useMemo(() => {
        return favs.filter((city) =>
            city.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, favs]);

    return (
        <div className={`min-w-60 rounded-xl border border-white/10 overflow-hidden ${className}`} style={{ background: "rgba(30, 41, 57, 0.98)", boxShadow: "0 20px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.05)",}}>
            <div className="px-3 py-2 border-b border-white/10">
                <input type="text" placeholder="Search favourite..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full px-3 py-2 rounded-md text-sm bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>

            <div className="max-h-30 overflow-y-auto custom-scroll">
                {filteredFavs.length > 0 ? (
                    filteredFavs.map((city) => (
                        <button key={city} onClick={() => onSelect(city)} className="w-full text-left px-4 py-2.5 text-sm text-white/75 hover:text-white hover:bg-slate-700/70 transition-colors duration-150 " >
                            {city}
                        </button>
                    ))
                ) : (
                    <p className="px-4 py-5 text-sm text-center text-white/25">
                        No matching favourites
                    </p>
                )}
            </div>
        </div>
    );
};