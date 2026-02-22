import { useFetch } from "../hooks/useFetch";
import { FiThermometer } from "react-icons/fi";
import { FaWind } from "react-icons/fa";
import { IoIosWater } from "react-icons/io";
import { MdOutlineVisibility } from "react-icons/md";
import type { ForecastType, ForecastProps } from "../types/forecastType";
import { Skeleton } from "./Skeleton";
import { toCelsius, groupForecast, getTime, formatDate } from "../utils/formatData";
import { ThemeContext } from "../context/ThemeContext";
import { useContext, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../assets/swiperStyles.css";
import { Pagination, Navigation } from "swiper/modules";
import { StatRow } from "./ui/ForecastStatRow";

export const Forecast = ({ city, setError }: ForecastProps) => {
    const { data, loading, error } = useFetch<ForecastType>( city ? `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=ee7910632a0567ef1dcf70405cc047d7` : null);

    const context = useContext(ThemeContext);
    const isDark = context?.theme === "dark";

    useEffect(() => {
        if (error) setError(error);
    }, [error, setError]);

    const groupedForecast = groupForecast(data);

    const cardStyle = isDark ? "flex flex-col rounded-xl p-3 bg-[#334155]" : "flex flex-col rounded-xl p-3 bg-blue-200";
    const badgeStyle = isDark ? "mt-auto pt-2 text-xs font-semibold text-slate-300 text-center" : "mt-auto pt-2 text-xs font-semibold text-blue-700 text-center";

    return (
        <div className="col-span-1">
            <h2 className="text-2xl font-serif font-semibold mb-3 px-2">Forecast</h2>

            {city && loading && <Skeleton />}

            {city && !loading && error && (
                <div>
                    <p>{error}</p>
                </div>
            )}

            {city && !loading && !error && data && groupedForecast && (
                <Swiper
                    spaceBetween={30}
                    slidesPerView={1}
                    pagination={{ type: "progressbar" }}
                    navigation={true}
                    modules={[Pagination, Navigation]}
                    className="mySwiper w-full"
                >
                    {Object.entries(groupedForecast).map(([date, date_list]) => (
                        <SwiperSlide key={date} className={isDark ? "dark" : "text-black bg-blue-100"} >
                            <div className="flex flex-col items-center py-3">
                                <h1 className="text-xl sm:text-2xl font-bold">{formatDate(date)}</h1>
                                <hr className={`w-5/6 my-2 ${ isDark ? "border-slate-600" : "border-blue-300" }`} />
                            </div>
                            <div className="px-12 pb-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                {date_list.map((item) => (
                                    <div key={item.dt + item.main.temp} className={cardStyle}>
                                        <p className={`text-xs font-bold mb-3 pb-2 border-b ${ isDark ? "text-slate-300 border-slate-500" : "text-blue-800 border-blue-300" }`} >
                                            {getTime(item.dt_txt)}
                                        </p>
                                        <div className="flex justify-center w-full">
                                            <div className="flex flex-col gap-1.5">
                                                <StatRow icon={<FiThermometer className="text-red-400" />} value={toCelsius(item.main.temp)} />
                                                <StatRow icon={<IoIosWater className="text-blue-400" />} value={`${item.main.humidity}%`} />
                                                <StatRow icon={<MdOutlineVisibility className="text-orange-400" />} value={`${item.visibility / 1000} km`} />
                                                <StatRow icon={<FaWind className="text-emerald-400" />} value={`${Math.round(item.wind.speed)} m/s`} />
                                            </div>
                                        </div>
                                        <p className={badgeStyle}>{item.weather[0].main}</p>
                                    </div>
                                ))}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
};