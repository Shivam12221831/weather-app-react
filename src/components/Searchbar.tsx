import React, { useEffect, useState, useContext, useRef } from "react";
import type { SearchProps } from "../types/searchType";
import { useDebounce } from "../hooks/useDebounce";
import { getCountryName } from "../utils/formatData";
import type { SuggestionsType } from "../types/searchType";
import { useSearchParams } from "react-router-dom";
import { ThemeContext } from "@/context/ThemeContext";
import { RecentsContext } from "@/context/RecentsContext";
import { IoMdSearch } from "react-icons/io";
import { toast } from "sonner";
import type { RecentsContextType } from "@/types/recentsType";

export const Searchbar = ({ onSearch, placeholderText, type }: SearchProps) => {
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState<SuggestionsType[]>([]);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [isOpen, setIsOpen] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const [searchParam, setSearchParams] = useSearchParams();
    const paramCity = searchParam.get("city");

    const themeContext = useContext(ThemeContext);
    const recentsContext = useContext(RecentsContext);

    const { recents, addRecentCity } = recentsContext as RecentsContextType
    const debouncedCity = useDebounce(inputValue, 500);

    useEffect(() => {
        if (!debouncedCity || debouncedCity.length <= 2) {
            setSuggestions([]);
            return;
        }
        const fetchCities = async () => {
            try {
                const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${debouncedCity}&limit=5&appid=ee7910632a0567ef1dcf70405cc047d7`);
                if (!res.ok) throw new Error();
                const data = await res.json();
                setSuggestions(data);
            } catch {
                setSuggestions([]);
            }
        };
        fetchCities();
    }, [debouncedCity]);

    useEffect(() => {
        if (paramCity) setInputValue(paramCity);
    }, [paramCity]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if ( wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setActiveIndex(-1);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const allowRecents = type === "main";
    const dropdownItems = suggestions.length > 0 ? suggestions : allowRecents ? recents : [];
    const showRecents = isOpen && allowRecents && suggestions.length === 0 && recents.length > 0;
    const showDropdown = isOpen && dropdownItems.length > 0;

    const handleSelect = (city: string) => {
        setInputValue(city);
        setSearchParams({ city });
        addRecentCity(city);
        onSearch(city);
        setIsOpen(false);
        setActiveIndex(-1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const city = inputValue.trim();
        if (!city) {
            toast.error("Please enter a city name");
            return;
        }
        try {
            const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=ee7910632a0567ef1dcf70405cc047d7`);
            const data = await res.json();
            if (!data || data.length === 0) {
                toast.error("City not found.");
                return;
            }
            handleSelect(city);
        } catch {
            toast.error("Unable to validate city.");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showDropdown) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((prev) => prev < dropdownItems.length - 1 ? prev + 1 : 0);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((prev) =>prev > 0 ? prev - 1 : dropdownItems.length - 1);
        } else if (e.key === "Enter") {
            if (activeIndex >= 0) {
                e.preventDefault();
                const selected = suggestions.length > 0 ? (dropdownItems[activeIndex] as SuggestionsType).name : (dropdownItems[activeIndex] as string);
                handleSelect(selected);
            }
        } else if (e.key === "Escape") {
            setIsOpen(false);
            setActiveIndex(-1);
        }
    };

    return (
        <div className="w-full">
            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center" >
                    <div className="relative w-full" ref={wrapperRef}>
                        <span className={`absolute left-0 top-0 h-full flex items-center justify-center w-10 rounded-l-lg ${ themeContext?.theme === "dark" ? "bg-[#1e2939] text-white" : "bg-slate-200 text-black" }`} >
                            <IoMdSearch size={25} />
                        </span>
                        <input ref={inputRef} type="text" autoComplete="off" value={inputValue} placeholder={placeholderText}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                setIsOpen(true);
                            }}
                            onFocus={() => setIsOpen(true)}
                            onKeyDown={handleKeyDown}
                            className="w-full h-11 pl-12 pr-10 border rounded-md outline-none focus:ring-1 focus:ring-blue-500"
                        />

                        {inputValue && (
                            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-gray-300 hover:text-gray-900 cursor-pointer"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    setInputValue("");
                                    setSuggestions([]);
                                    setActiveIndex(-1);
                                    setIsOpen(false);
                                    inputRef.current?.focus();
                                }}
                            > ✕
                            </button>
                        )}
                        {showDropdown && (
                            <ul className=" absolute top-full left-0 w-full mt-1 bg-slate-50 border border-gray-200 rounded-lg shadow-md z-30 max-h-56 overflow-y-auto no-scrollbar ">
                                {showRecents && (
                                    <li className="px-4 py-2 text-xs font-semibold text-gray-400 border-b border-gray-100">Recent Cities</li>
                                )}
                                {dropdownItems.map((item, index) => {
                                    const isSuggestion = suggestions.length > 0;
                                    const city = isSuggestion ? (item as SuggestionsType).name : (item as string);
                                    const isActive = index === activeIndex;
                                    let displayText = city;
                                    if (isSuggestion) {
                                        const state = (item as SuggestionsType).state;
                                        const country = getCountryName((item as SuggestionsType).country);
                                        displayText = state ? `${city}, ${state}, ${country}` : `${city}, ${country}`;
                                    }
                                    return (
                                        <li key={city + index} onMouseDown={() => handleSelect(city)} className={`px-4 py-2 text-sm cursor-pointer transition-colors duration-150 ${isActive ? "bg-blue-100 text-blue-700" : "hover:bg-gray-200 text-gray-700"}`} >
                                            <span className="truncate block">{displayText}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                    <button type="submit" className={`h-11 px-6 text-lg rounded-md whitespace-nowrap ${ themeContext?.theme === "dark" ? "button-dark" : "button-light bg-slate-100" }`}>
                        Search
                    </button>
                </form>
            </div>
        </div>
    );
};