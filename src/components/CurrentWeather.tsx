import { useFetch } from "../hooks/useFetch";
import { CiLocationArrow1 } from "react-icons/ci";
import { WiSunrise, WiSunset, WiDaySunny } from "react-icons/wi";
import { IoIosWater } from "react-icons/io";
import { LiaTachometerAltSolid } from "react-icons/lia";
import { FaTemperatureHigh, FaTemperatureLow, FaHeart, FaWind } from "react-icons/fa";
import type { CurrentWeatherProp, CurrentWeatherType } from "../types/currentWeatherType";
import { formatTime, toCelsius, getCountryName } from "../utils/formatData";
import { Skeleton } from "./Skeleton";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FavoritesContext } from "@/context/FavoritesContext";
import { InfoRow } from "./ui/CurrentInfoRow";

export const CurrentWeather = ({ city, setError }: CurrentWeatherProp) => {
    const context = useContext(ThemeContext);
    const favContext = useContext(FavoritesContext);
    const isDark = context?.theme === "dark";
    const [isAnimating, setIsAnimating] = useState(false);

    const { data, loading, error } = useFetch<CurrentWeatherType>(city? `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=ee7910632a0567ef1dcf70405cc047d7`: null);

    const fullName = `${data?.name}, ${getCountryName(data?.sys.country || "")}`;
    const cityFullName = data ? data.name + ", " + getCountryName(data.sys.country) : "";

    useEffect(() => {
        if (error) setError(error);
    }, [error, setError]);

    function handleFavorite() {
        if (!data || !favContext) return;
        if (favContext.isFavorite(cityFullName)) {
            favContext.removeFavorite(cityFullName);
        } else {
            favContext.addFavorite(cityFullName);
        }
    }

    const handleClick = () => {
        setIsAnimating(true);
        handleFavorite();

        setTimeout(() => {
            setIsAnimating(false);
        }, 300);
    };

    const isFav = favContext?.isFavorite(cityFullName) ?? false;

    return (
        <div className="mb-10 col-span-1">
            <h2 className="text-2xl font-serif font-semibold mb-3 px-2">Current Weather</h2>

            {!city && <p>Please enter city name</p>}
            {city && loading && <Skeleton />}

            {city && !loading && !error && data && (
                <div className={`relative rounded-2xl p-6 sm:p-8 ${     isDark ? "dark" : "bg-blue-100 text-black" }`}>
                    <button onClick={handleClick} aria-label={isFav ? "Remove from favourites" : "Add to favourites"} className="absolute top-3 right-4 z-10 p-2 rounded-full transition-all duration-200 hover:bg-black/10 active:scale-90 cursor-pointer">
                        <FaHeart size={25} className={`transition-all duration-300 ${isFav ? "text-red-500 scale-110" : isDark ? "text-slate-500" : "text-blue-300"} ${isAnimating ? "animate-ping-once" : ""} `} />
                    </button>

                    <div className="flex items-start justify-between gap-4 pr-10">
                        <div className="min-w-0">
                            <p className="text-2xl sm:text-3xl xl:text-4xl font-bold leading-tight truncate">{fullName.length > 16 ? data.name : fullName}</p>
                            <p className={`flex items-center gap-1 mt-1 text-sm ${ isDark ? "text-slate-400" : "text-blue-600" }`}>
                                <CiLocationArrow1 className="shrink-0" />
                                <span>{data.coord.lat}, {data.coord.lon}</span>
                            </p>
                        </div>
                        <p className="text-4xl sm:text-5xl xl:text-6xl font-bold font-sans shrink-0 leading-none">{toCelsius(data.main.temp)}</p>
                    </div>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <InfoRow icon={<WiSunrise size={22} className="text-yellow-500" />} label="Sunrise" value={formatTime(data.sys.sunrise)} isDark={isDark} />
                        <InfoRow icon={<WiSunset size={22} className="text-orange-500" />} label="Sunset" value={formatTime(data.sys.sunset)} isDark={isDark} />
                        <InfoRow icon={<IoIosWater size={18} className="text-blue-400" />} label="Humidity" value={`${data.main.humidity}%`} isDark={isDark} />
                        <InfoRow icon={<WiDaySunny size={22} className="text-orange-400" />} label="Feels Like" value={toCelsius(data.main.feels_like)} isDark={isDark} />
                        <InfoRow icon={<FaTemperatureLow className="text-cyan-400" />} label="Temp Min" value={toCelsius(data.main.temp_min)} isDark={isDark} />
                        <InfoRow icon={<FaTemperatureHigh className="text-red-400" />} label="Temp Max" value={toCelsius(data.main.temp_max)} isDark={isDark} />
                        <InfoRow icon={<LiaTachometerAltSolid size={20} className="text-blue-400" />} label="Pressure" value={`${data.main.pressure} hPa`} isDark={isDark} />
                        <InfoRow icon={<FaWind size={16} className="text-emerald-400" />} label="Wind Speed" value={`${Math.round(data.wind.speed)} m/s`} isDark={isDark} />
                        <InfoRow icon={<LiaTachometerAltSolid size={20} className="text-blue-400" />} label="Sea Level" value={`${data.main.sea_level} hPa`} isDark={isDark} />
                        <InfoRow icon={<LiaTachometerAltSolid size={20} className="text-blue-400" />} label="Ground Level" value={`${data.main.grnd_level} hPa`} isDark={isDark} />
                    </div>

                    <hr className={`my-4 ${isDark ? "border-slate-600" : "border-blue-300"}`} />
                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm sm:text-base sm:px-2">
                        <p>
                            <span className={isDark ? "text-slate-400" : "text-blue-600"}>Condition:{" "}</span>
                            {data.weather[0].description}
                        </p>
                        <p>
                            <span className={isDark ? "text-slate-400" : "text-blue-600"}>Visibility:{" "}</span>
                            {(data.visibility / 1000).toFixed(2)} km
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};