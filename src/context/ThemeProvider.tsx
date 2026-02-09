import React, { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";
  
export const ThemeProvider = ({ children } : {children: React.ReactNode}) => {
    const [theme, setTheme] = useState<string>(() => {
        try {
            const saved = localStorage.getItem("theme");;
            return saved ? saved : "dark";
        } catch {
            return "dark";
        }
    });

    useEffect(() => {
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === "dark" ? "light" : "dark");
    }

    return(
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}