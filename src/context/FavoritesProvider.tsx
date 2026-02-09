import { useState, useEffect } from "react";
import { FavoritesContext } from "./FavoritesContext";

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
    const [favs, setFavs] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem("fav_cities");
            const parsed = saved ? JSON.parse(saved) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem("fav_cities", JSON.stringify(favs));
    }, [favs]);

    const isFavorite = (city: string) => {
        return favs.includes(city);
    };

    const addFavorite = (city: string) => {
        setFavs(prev => prev.includes(city) ? prev : [...prev, city]);
    };

    const removeFavorite = (city: string) => {
        setFavs(prev => prev.filter(item => item !== city));
    };

    return (
        <FavoritesContext.Provider value={{ favs, isFavorite, addFavorite, removeFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};