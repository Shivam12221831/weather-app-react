/* eslint-disable react-hooks/set-state-in-effect */
import { CurrentWeather } from "./CurrentWeather";
import { Forecast } from "./Forecast";
import { Searchbar } from "./Searchbar";
import { useState, useContext, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import bg_light_img from '../assets/hero_background7.avif';
import bg_dark_img from '../assets/hero_background4.jpg';
import { ThemeContext } from "../context/ThemeContext";
import { FavoritesContext } from "@/context/FavoritesContext";
import { RiArrowDropDownLine } from "react-icons/ri";
import { IoSunnySharp } from "react-icons/io5";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { ErrorBox } from "./ErrorBox";
import { getCurrentLocation } from "@/utils/getCurrentLocation";
import { toast } from "sonner";
import { MdMyLocation } from "react-icons/md";

export const DisplayWeather = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [showFavDropdown, setShowFavDropdown] = useState<boolean>(false)
    const [searchParam, setSearchParams] = useSearchParams();
    const city = searchParam.get("city");
    const themeContext = useContext(ThemeContext);
    const theme = themeContext?.theme === "dark" ? "dark" : "light";
    const favContext = useContext(FavoritesContext);

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowFavDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setError("");
    }, [city]);

    if (!favContext) return null;
    
    function handleFavorite() {
        setShowFavDropdown(prev => !prev);
    }

    function handleSelectCity(selectedCity: string) {
        const splitedCity = selectedCity.split(",")[0];
        setSearchParams({ city: splitedCity });
        setShowFavDropdown(false);
    }

    async function handleCurrentLocation() {
        const toastId = toast.loading("Detecting your location...");
        const result = await getCurrentLocation();
        if (result.error === "permission") {
            toast.error("Location permission denied", { id: toastId });
            return;
        }
        if (result.error === "unavailable") {
            toast.error("Location unavailable", { id: toastId });
            return;
        }
        if (result.error === "timeout") {
            toast.error("Location request timed out", { id: toastId });
            return;
        }
        if (!result.city) {
            toast.error("Unable to fetch location", { id: toastId });
            return;
        }
        if (result.city === city) {
            toast.error("Already showing the current location weather", { id: toastId });
            return;
        }
        toast.success(`Showing weather for ${result.city}`, { id: toastId });
        setSearchParams({ city: result.city });
    }

    return (
        <div className="relative min-h-screen">
            <div className="fixed inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${theme === "dark" ? bg_dark_img : bg_light_img})` }}/>
            <div className="fixed inset-0 backdrop-blur-md bg-black/30 dark:bg-black/40" />

            <div className={ themeContext?.theme === "dark" ? "relative z-10 min-h-screen font-semibold text-black" : "relative z-10 min-h-screen font-semibold text-white" }>
                <div className="font-serif">
                    <div className="py-5 px-5 flex flex-col lg:flex-row items-center lg:items-center lg:justify-between gap-6">
                        <p className="text-4xl sm:text-5xl lg:pl-17 font-semibold order-1 lg:order-2 text-center">WeatherDash</p>

                        <div ref={dropdownRef} className="relative w-48 order-3 lg:order-1">
                            <button onClick={handleFavorite} className={`w-full h-9 pl-3 pr-2 cursor-pointer flex items-center justify-between rounded-md ${ theme === "dark" ? "button-dark" : "button-light"}`}>
                                Favourite Cities
                                <RiArrowDropDownLine size={28} />
                            </button>

                            {showFavDropdown &&  (
                                <div className="absolute top-full left-0 w-full text-black bg-white shadow-lg border rounded-b-md z-50">
                                    {favContext.favs.length > 0 ? (
                                        favContext.favs.map((cityName) => (
                                            <div key={cityName} className="flex items-center justify-between px-4 py-2 hover:bg-gray-200 cursor-pointer">
                                                <button onClick={() => handleSelectCity(cityName)} className="flex-1 text-left cursor-pointer">{cityName}</button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="absolute top-full left-0 w-full text-black bg-white shadow-lg border rounded-b-md z-50">
                                            <div className="flex items-center justify-between px-4 py-2 hover:bg-gray-200 cursor-pointer">
                                                <button className="flex-1 text-left">No Favourites</button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                            )}
                        </div>

                        <div className="flex flex-wrap justify-center gap-2 md:gap-2 order-2">
                            <button onClick={handleCurrentLocation} className={`rounded-md h-9 px-3 ${ theme === "dark" ? "button-dark" : "button-light" }`}>
                                <div className="flex gap-1 items-center">
                                    <MdMyLocation className="text-red-500 pb-0.5" size={16}/>
                                    Current Location
                                </div>
                            </button>
                            <button onClick={() => navigate('/')} className={`rounded-md h-9 px-3 ${ theme === "dark" ? "button-dark" : "button-light" }`}> Home </button>
                            <button onClick={themeContext?.toggleTheme} className={`rounded-md h-9 px-3 ${ theme === "dark" ? "button-dark" : "button-light" }`}>
                                {themeContext?.theme==="dark" ? 
                                    <div className="flex gap-1 items-center">
                                        <BsFillMoonStarsFill className="text-yellow-400" size={15}/>
                                        Dark
                                    </div>
                                    : 
                                    <div className="flex gap-1 items-center">
                                        <IoSunnySharp className="text-yellow-400"/>
                                        Light
                                    </div>    
                                }
                            </button>
                        </div>
                    </div>

                    <div className="my-5 px-8">
                        <Searchbar
                            onSearch={(newCity) => setSearchParams({ city: newCity })}
                            placeholderText="Search a city to get weather"
                        />
                    </div>

                    {city && 
                        <div className="flex justify-center items-center gap-5 pb-5">
                            <p className="text-center font-bold pb-5 h-8">Weather searched for the city : {city}</p>
                        </div>
                    }
                </div>

                {!city && <ErrorBox message="Please Enter The City Name" />}

                {city && error && <ErrorBox />}

                {city && !error && (
                    <div>
                        <div className="m-10 lg:grid lg:grid-cols-2 gap-5">
                            <CurrentWeather city={city} setError={setError} />
                            <Forecast city={city} setError={setError} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};