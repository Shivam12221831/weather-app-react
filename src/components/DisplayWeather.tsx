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

export const DisplayWeather = () => {
    const navigate = useNavigate();
    const [refetchTrigger, setRefetchTrigger] = useState<number>(0);
    const [error, setError] = useState("");
    const [showFavDropdown, setShowFavDropdown] = useState<boolean>(false);
    const [searchParam, setSearchParams] = useSearchParams();
    const city = searchParam.get("city");
    const themeContext = useContext(ThemeContext);
    const theme = themeContext?.theme === "dark" ? "dark" : "light";
    const favContext = useContext(FavoritesContext);

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setShowFavDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setError("");
    }, [city]);

    if (!favContext) return null;
    
    function handleFavorite() {
        if (!favContext?.favs.length) return;
        setShowFavDropdown(prev => !prev);
    }

    function handleSelectCity(selectedCity: string) {
        const splitedCity = selectedCity.split(",")[0];
        setSearchParams({ city: splitedCity });
        setRefetchTrigger(prev => prev + 1);
        setShowFavDropdown(false);
    }

    return (
        <div className="relative min-h-screen">
            <div className="fixed inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${theme === "dark" ? bg_dark_img : bg_light_img})` }}/>
            <div className="fixed inset-0 backdrop-blur-md bg-black/30 dark:bg-black/40" />

            <div className={ themeContext?.theme === "dark" ? "relative z-10 min-h-screen font-semibold text-black" : "relative z-10 min-h-screen font-semibold text-white" }>
                <div className="font-serif">
                    <div className="py-10 px-5 flex flex-col md:flex-row items-center md:items-center md:justify-between gap-6">
                        <p className="text-4xl sm:text-5xl font-semibold order-1 md:order-2 text-center">WeatherDash</p>

                        <div ref={dropdownRef} className="relative w-45 order-3 md:order-1">
                            <button onClick={handleFavorite} className={`w-full h-9 pl-3 pr-2 cursor-pointer flex items-center justify-between rounded-md ${ theme === "dark" ? "button-dark" : "button-light"}`}>
                                Favourite Cities
                                <RiArrowDropDownLine size={28} />
                            </button>

                            {showFavDropdown && favContext?.favs.length > 0 && (
                                <div className="absolute top-full left-0 w-full text-black bg-white shadow-lg border rounded-b-md z-50">
                                    {favContext.favs.map((cityName) => (
                                        <div key={cityName} className="flex items-center justify-between px-4 py-2 hover:bg-gray-200 cursor-pointer">
                                            <button onClick={() => handleSelectCity(cityName)} className="flex-1 text-left cursor-pointer">{cityName}</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-wrap justify-center gap-5 md:gap-3 order-2">
                            <button onClick={() => navigate('/')} className={`rounded-md h-9 px-4 ${ theme === "dark" ? "button-dark" : "button-light" }`}> Home </button>
                            <button onClick={themeContext?.toggleTheme} className={`rounded-md h-9 px-4 ${ theme === "dark" ? "button-dark" : "button-light" }`}>
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
                            onSearch={(newCity) => {
                                setSearchParams({ city: newCity });
                                setRefetchTrigger(prev => prev + 1);
                            }}
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
                            <CurrentWeather city={city} refetchTrigger={refetchTrigger} setError={setError} />
                            <Forecast city={city} refetchTrigger={refetchTrigger} setError={setError} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};