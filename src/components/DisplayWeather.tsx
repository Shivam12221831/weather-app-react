/* eslint-disable react-hooks/set-state-in-effect */
import { CurrentWeather } from "./CurrentWeather";
import { Forecast } from "./Forecast";
import { Searchbar } from "./Searchbar";
import { useState, useContext, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import bg_light_img from "../assets/hero_background7.avif";
import bg_dark_img from "../assets/hero_background4.jpg";
import { ThemeContext } from "../context/ThemeContext";
import { FavoritesContext } from "@/context/FavoritesContext";
import { RiArrowDropDownLine } from "react-icons/ri";
import { IoSunnySharp } from "react-icons/io5";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { ErrorBox } from "./ErrorBox";
import { getCurrentLocation } from "@/utils/getCurrentLocation";
import { toast } from "sonner";
import { MdMyLocation } from "react-icons/md";
import { HiMenu, HiX } from "react-icons/hi";
import { FaHeart, FaHome } from "react-icons/fa";
import { RecentsContext } from "@/context/RecentsContext";
import type { RecentsContextType } from "@/types/recentsType";
import { FavoriteDropdown } from "./ui/FavoriteDropdown";
import { NavBtn } from "./ui/DisplayNavBtn";
import { MobileNavBtn } from "./ui/DisplayMobileNavBtn";

export const DisplayWeather = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [showFavDropdown, setShowFavDropdown] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showMobileFavs, setShowMobileFavs] = useState(false);
    const [searchParam, setSearchParams] = useSearchParams();
    const city = searchParam.get("city");
    const themeContext = useContext(ThemeContext);
    const isDark = themeContext?.theme === "dark";
    const favContext = useContext(FavoritesContext);
    const recentContext = useContext(RecentsContext);
    const {addRecentCity} = recentContext as RecentsContextType;

    const dropdownRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setShowFavDropdown(false);
        }
        if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
            setShowMobileMenu(false);
            setShowMobileFavs(false);
        }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => { 
        setError(""); 
    }, [city]);

    if (!favContext) return null;

    function handleSelectCity(selectedCity: string) {
        const splitedCity = selectedCity.split(",")[0];
        setSearchParams({ city: splitedCity });
        setShowFavDropdown(false);
        setShowMobileMenu(false);
        setShowMobileFavs(false);
    }

    async function handleCurrentLocation() {
        setShowMobileMenu(false);
        const toastId = toast.loading("Detecting your location...");
        const result = await getCurrentLocation();
        if (result.error === "permission") { toast.error("Location permission denied", { id: toastId }); return; }
        if (result.error === "unavailable") { toast.error("Location unavailable", { id: toastId }); return; }
        if (result.error === "timeout") { toast.error("Location request timed out", { id: toastId }); return; }
        if (!result.city) { toast.error("Unable to fetch location", { id: toastId }); return; }
        if (result.city === city) { toast.error("Already showing the current location weather", { id: toastId }); return; }
        toast.success(`Showing weather for ${result.city}`, { id: toastId });
        addRecentCity(result.city);
        setSearchParams({ city: result.city });
    }

    return (
        <div className="relative min-h-screen">
            <div className="fixed inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${isDark ? bg_dark_img : bg_light_img})` }} />
            <div className="fixed inset-0 backdrop-blur-md bg-black/40 dark:bg-black/20" />

            <div className={`relative z-10 min-h-screen font-semibold ${isDark ? "text-black" : "text-slate-200"}`}>
                <nav className="backdrop-blur-xl" style={{ background: isDark ? "rgba(30, 41, 57, 0.92)" : "rgba(51, 65, 85, 0.82)", boxShadow: "0 1px 0 0 rgba(255,255,255,0.02), 0 4px 14px rgba(0,0,0,0.3)", }}>
                    <div className="px-5 lg:px-10 h-12 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5 shrink-0">
                            <p className={`text-xl sm:text-3xl font-serif font-bold tracking-wide pl-2 text-slate-300`}>WeatherDash</p>
                        </div>
                        <div className="hidden lg:flex items-center">
                            <NavBtn onClick={() => navigate("/")} icon={<FaHome size={13} className="text-white/50 group-hover:text-white mb-0.5" />}>Home</NavBtn>
                            <NavBtn onClick={handleCurrentLocation} icon={<MdMyLocation size={14} className="text-red-400 group-hover:text-red-600 mb-0.5" />}>My Location</NavBtn>
                            <div ref={dropdownRef} className="relative group">
                                <button onClick={() => setShowFavDropdown((p) => !p)} className="relative h-12 pl-4 flex items-center gap-2 text-sm font-serif font-medium cursor-pointer text-white/65 hover:text-white transition-colors duration-200">
                                    <FaHeart size={12} className="text-red-400 transition-transform duration-200 group-hover:scale-110 mb-0.5" />
                                    Favourites
                                    <RiArrowDropDownLine size={18} className={`transition-transform duration-300 ${showFavDropdown ? "rotate-180" : ""}`} />
                                </button>
                                {showFavDropdown && (
                                    <div className="absolute top-full right-0 mt-1 z-999">
                                        <FavoriteDropdown favs={favContext.favs} onSelect={handleSelectCity} />
                                    </div>
                                )}
                            </div>
                            <div className="w-px h-5 bg-white/15 mx-3" />
                            <button onClick={themeContext?.toggleTheme} title={isDark ? "Switch to Light" : "Switch to Dark"} className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer text-white/60 hover:text-white bg-white/5 hover:bg-white/12 border border-white/8 hover:border-white/20 transition-all duration-200">
                                {isDark ? <BsFillMoonStarsFill className="text-yellow-300" size={13} /> : <IoSunnySharp className="text-yellow-200" size={15} /> }
                            </button>
                        </div>

                        <button onClick={() => { setShowMobileMenu((p) => !p); setShowMobileFavs(false); }} aria-label="Toggle menu" className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer text-white/80 hover:text-white bg-white/5 hover:bg-white/12 border border-white/10 hover:border-white/25 transition-all duration-200">
                            {showMobileMenu ? <HiX size={17} /> : <HiMenu size={17} />}
                        </button>
                    </div>

                    {showMobileMenu && (
                        <div ref={mobileMenuRef} className="lg:hidden border-t border-white/8" style={{ background: isDark ? "rgba(26,37,53,0.97)" : "rgba(42,54,72,0.97)" }}>
                            <div className="flex flex-col items-center gap-1 px-6 py-4">
                                <MobileNavBtn
                                    onClick={() => setShowMobileFavs((p) => !p)}
                                    icon={<FaHeart size={13} className="text-red-400 ml-8" />}
                                    suffix={
                                        <RiArrowDropDownLine size={18} className={`text-white/40 transition-transform duration-200 ${showMobileFavs ? "rotate-180" : ""}`} />
                                    }
                                >   
                                    Favourite Cities
                                </MobileNavBtn>
                                {showMobileFavs && (
                                    <div className="w-full max-w-xs mt-2 mb-4 z-999">
                                        <FavoriteDropdown favs={favContext.favs} onSelect={handleSelectCity} />
                                    </div>
                                )}
                                <MobileNavBtn onClick={handleCurrentLocation} icon={<MdMyLocation size={15} className="text-red-400" />}>My Location</MobileNavBtn>
                                <MobileNavBtn onClick={() => { navigate("/"); setShowMobileMenu(false); }} icon={<FaHome size={14} className="text-white/50" />}>Home</MobileNavBtn>
                                <div className="w-full max-w-sm h-px bg-white/8 my-2" />
                                <MobileNavBtn
                                    onClick={() => { themeContext?.toggleTheme(); setShowMobileMenu(false); }}
                                    icon={isDark ? <BsFillMoonStarsFill className="text-yellow-300" size={14} /> : <IoSunnySharp className="text-yellow-200" size={15} />}
                                >
                                    {isDark ? "Dark Mode" : "Light Mode"}
                                </MobileNavBtn>
                            </div>
                        </div>
                    )}
                </nav>
                <div className="font-serif">
                    <div className="my-6 px-8 mx-6">
                        <Searchbar onSearch={(newCity) => setSearchParams({ city: newCity })} placeholderText="Search a city to get weather" type="main" />
                    </div>
                    {city && (
                        <div className="flex justify-center pb-3">
                            <p className="text-center font-bold">Weather for <span className="underline">{city}</span></p>
                        </div>
                    )}
                </div>
                
                {!city && <ErrorBox message="Please Enter The City Name" />}
                
                {city && error && <ErrorBox />}
                
                {city && !error && (
                    <div className="my-6 mx-4 sm:mx-10 xl:grid xl:grid-cols-2 gap-5">
                        <CurrentWeather city={city} setError={setError} />
                        <Forecast city={city} setError={setError} />
                    </div>
                )}
            </div>
        </div>
    );
};