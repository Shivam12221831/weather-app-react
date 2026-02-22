import { useEffect, useState } from "react"
import { RecentsContext } from "./RecentsContext";

export const RecentsProvider = ({ children }: { children: React.ReactNode }) => {
    const [recents, setRecents] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem("recent_cities");
            const parsed = saved ? JSON.parse(saved) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    });

    const addRecentCity = (city: string) => {
        const trimmed = city.trim();
        if (!trimmed) return;
        setRecents((prev) => {
            const updated = [trimmed,...prev.filter(    (c) => c.toLowerCase() !== trimmed.toLowerCase()),].slice(0, 3);
            return updated;
        });
    };

    const clearRecents = () => {
        setRecents([]);
    };

    useEffect(() => {
        localStorage.setItem("recent_cities", JSON.stringify(recents));
    }, [recents]);
    
    return (
        <RecentsContext.Provider value={{ recents, addRecentCity, clearRecents }}>
            {children}
        </RecentsContext.Provider>
    ); 
}