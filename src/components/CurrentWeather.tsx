import { useFetch } from "../hooks/useFetch";
import { CiLocationArrow1 } from "react-icons/ci";
import { WiSunrise, WiSunset, WiDaySunny } from "react-icons/wi";
import { IoIosWater } from "react-icons/io";
import { LiaTachometerAltSolid } from "react-icons/lia";
import { FaTemperatureHigh, FaTemperatureLow, FaHeart, FaWind } from "react-icons/fa";
import type { CurrentWeatherProp, CurrentWeatherType } from "../types/currentWeatherType";
import { formatTime, toCelsius, getCountryName } from "../utils/formatData";
import { Skeleton } from "./Skeleton";
import { useContext, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FavoritesContext } from "@/context/FavoritesContext";

export const CurrentWeather = ({ city, refetchTrigger, setError }: CurrentWeatherProp) => {
    const context = useContext(ThemeContext);
    const favContext = useContext(FavoritesContext);

    const cls = context?.theme === "dark" ? "p-6 sm:p-8 lg:p-10 rounded-2xl dark" : "p-6 sm:p-8 lg:p-10 rounded-2xl text-black bg-blue-100";
    const button = context?.theme === "dark" ? "flex items-center justify-center gap-2 text-center rounded-lg m-1 px-4 py-2 w-full bg-[#334155]" : "flex items-center justify-center gap-2 text-center rounded-lg m-1 px-4 py-2 w-full bg-blue-200";

    const { data, loading, error } = useFetch<CurrentWeatherType>(
        city
            ? `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=ee7910632a0567ef1dcf70405cc047d7`
            : null,
        refetchTrigger
    );

    useEffect(() => {
        if (error) {
            setError(error);
        }
    }, [error, setError]);

    function handleFavorite() {
        if (!data || !favContext) return;
        const cityFullName = data.name + ", " + getCountryName(data.sys.country);
        if (favContext.isFavorite(cityFullName)) {
            favContext.removeFavorite(cityFullName);
        } else {
            favContext.addFavorite(cityFullName);
        }
    }

    return (
        <div className="mb-10 col-span-1">
            <h2 className="text-2xl font-serif font-semibold mb-3 px-2">Current Weather</h2>

            {!city && <p>Please enter city name</p>}

            {city && loading && <Skeleton />}

            {city && !loading && !error && data && (
                <div className={cls}>
                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">{data.name}, {getCountryName(data.sys.country)}</p>
                            <FaHeart
                                onClick={handleFavorite}
                                className={ favContext?.isFavorite( data.name + ", " + getCountryName(data.sys.country)) ? "border-none text-red-500 cursor-pointer" : "text-white cursor-pointer" }
                                size={40}
                            />
                        </div>

                        <p className="flex items-center gap-2 text-sm sm:text-base">
                            <CiLocationArrow1 />
                            <span>{data.coord.lat}, {data.coord.lon}</span>
                        </p>
                    </div>

                    <div className="my-3 grid grid-cols-1 sm:grid-cols-2 gap-1">
                        <p className={button}>
                            <WiSunrise size={22} />
                            Sunrise: {formatTime(data.sys.sunrise)}
                        </p>
                        <p className={button}>
                            <WiSunset size={22} />
                            Sunset: {formatTime(data.sys.sunset)}
                        </p>
                        <p className={button}>
                            <IoIosWater size={18} />
                            Humidity: {data.main.humidity}%
                        </p>
                        <p className={button}>
                            <WiDaySunny size={22} />
                            Feels Like: {toCelsius(data.main.feels_like)}
                        </p>
                        <p className={button}>
                            <FaTemperatureLow />
                            Temp Min: {toCelsius(data.main.temp_min)}
                        </p>
                        <p className={button}>
                            <FaTemperatureHigh />
                            Temp Max: {toCelsius(data.main.temp_max)}
                        </p>
                        <p className={button}>
                            <LiaTachometerAltSolid size={22} />
                            Pressure: {data.main.pressure} hPa
                        </p>
                        <p className={button}>
                            <FaWind size={18} />
                            Wind Speed: {Math.round(data.wind.speed)}km
                        </p>
                        <p className={button}>
                            <LiaTachometerAltSolid size={22} />
                            Sea Level: {data.main.sea_level} hPa
                        </p>
                        <p className={button}>
                            <LiaTachometerAltSolid size={22} />
                            Ground Level: {data.main.grnd_level} hPa
                        </p>
                    </div>
                    <hr />
                    <div className="mt-2 flex items-center justify-between gap-4">
                        <div className="text-base sm:text-lg space-y-1">
                            <p>Visibility: {data.visibility / 1000} km</p>
                            <p>Weather: {data.weather[0].description}</p>
                        </div>
                        <div>
                            <p className="text-5xl sm:text-6xl lg:text-7xl font-sans font-bold">
                                {toCelsius(data.main.temp)}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};