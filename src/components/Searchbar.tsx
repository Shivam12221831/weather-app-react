import React, { useEffect, useState, useContext } from "react";
import type { SearchProps } from "../types/searchType";
import { useDebounce } from "../hooks/useDebounce";
import { getCountryName } from "../utils/formatData";
import type { SuggestionsType } from "../types/searchType";
import { useSearchParams } from "react-router-dom";
import { ThemeContext } from "@/context/ThemeContext";

export const Searchbar = ({ onSearch, placeholderText }: SearchProps) => {
    const [inputValue, setInputValue] = useState<string>("");
    const [suggestions, setSuggestions] = useState<SuggestionsType[]>([]);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [triggerCityFetch, setTriggerCityFetch] = useState<number>(0);
    const [searchParam, setSearchParams] = useSearchParams();
    const paramCity = searchParam.get("city");
    const themeContext = useContext(ThemeContext);
    
    const debouncedCity = useDebounce(inputValue, 700);
    const isOpen = isFocused && suggestions.length > 0 && inputValue.trim().length > 2;

    useEffect(() => {
        if (!debouncedCity || debouncedCity.length <= 2) return;

        const fetchCities = async () => {
            try {
                const res = await fetch( `https://api.openweathermap.org/geo/1.0/direct?q=${debouncedCity}&limit=5&appid=ee7910632a0567ef1dcf70405cc047d7`);
                if (!res.ok) {
                    throw new Error("Something went wrong, cannot fetch cities");
                }
                const cities = await res.json();
                setSuggestions(cities);
            } catch (err) {
                console.log("Error", err);
                setSuggestions([]);
            }
        };
        fetchCities();
    }, [debouncedCity, triggerCityFetch]);

    useEffect(() => {
        if (!paramCity) return;
        setInputValue(paramCity);
    }, [paramCity]);

    const handleSelect = (city: string) => {
        setInputValue(city);
        setSearchParams({ city });
        onSearch(city);
        setTriggerCityFetch(prev => prev + 1);
        setSuggestions([]);
    };

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (inputValue.trim().length !== 0) onSearch(inputValue);
        setIsFocused(false);
        setSuggestions([]);
    }

    return (
        <div className="w-full">
            <div className="max-w-3xl mx-auto">
                <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
                    <div className="relative w-full">
                        <input type="text" autoComplete="off" value={inputValue} placeholder={placeholderText}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                setIsFocused(true);
                            }}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            className="w-full h-11 px-3 pr-10 border rounded-md outline-none focus:ring-1 focus:ring-blue-500"
                        />

                        {isOpen && (
                            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 font-extrabold cursor-pointer text-gray-400 hover:text-gray-700"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    setIsFocused(false);
                                    setSuggestions([]);
                                }}
                            >
                                ✕
                            </button>
                        )}

                        {isOpen && (
                            <ul className="absolute top-full left-0 w-full border border-t-0 bg-white z-20 max-h-60 overflow-y-auto rounded-b-md">
                                {suggestions.map((item, index) => (
                                    <li key={item.name + index} onMouseDown={() => handleSelect(item.name)} className="px-3 py-2 cursor-pointer border-b text-black hover:bg-gray-200 text-left">
                                        <strong> {item.name} {item.state ? `, ${item.state}` : ""} ({getCountryName(item.country)}) </strong>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <button type="submit" className={`h-11 px-6 text-lg rounded-md whitespace-nowrap ${themeContext?.theme === "dark" ? "button-dark" : "button-light"}`}>Search</button>
                </form>
            </div>
        </div>
    );
};