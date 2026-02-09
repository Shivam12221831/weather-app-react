import { useFetch } from "../hooks/useFetch";
import { FiThermometer } from "react-icons/fi";
import { FaWind } from "react-icons/fa";
import { IoIosWater } from "react-icons/io";
import { MdOutlineVisibility } from "react-icons/md";
import type { ForecastType, ForecastProps } from "../types/forecastType";
import { Skeleton } from "./Skeleton";
import { toCelsius, groupForecast, getTime, formatDate } from '../utils/formatData';
import { ThemeContext } from "../context/ThemeContext";
import { useContext, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import '../assets/swiperStyles.css';

import { Pagination, Navigation } from 'swiper/modules';

export const Forecast = ({ city, setError }: ForecastProps) => {
    const {data, loading, error} = useFetch<ForecastType>(
        city ? `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=ee7910632a0567ef1dcf70405cc047d7` : null,
    );
    
    const context = useContext(ThemeContext);
    
    useEffect(() => {
        if (error) {
            setError(error);
        }
    }, [error, setError]);
    
    const groupedForecast = groupForecast(data);
    const itemStyle = context?.theme === "dark" ? "col-span-1 my-2 justify-center rounded-lg p-2 bg-[#334155]" : "col-span-1 my-2 justify-center rounded-lg p-2 bg-blue-200";

    return (
        <div className="col-span-1">
            <h2 className="text-2xl font-serif font-semibold mb-3 px-2 ">Forecast</h2>

            {city && loading && ( <Skeleton /> )}

            {city && !loading && error && (
                <div>
                    <p>{error}</p>
                </div>
            )}

            {city && !loading && !error && data && groupedForecast &&(                     
                <Swiper
                    spaceBetween={30}
                    slidesPerView={1}
                    pagination={{
                        type: 'progressbar',
                        // dynamicBullets: true,
                    }}
                    navigation={true}
                    modules={[Pagination, Navigation]}
                    className="mySwiper w-full"
                >
                    {Object.entries(groupedForecast).map(([date, date_list]) => (
                        <SwiperSlide key={date} className={context?.theme==="dark" ? "dark" : "text-black bg-blue-100"}>
                            <div className="flex flex-col items-center py-2">
                                <h1 className="text-2xl font-bold">{formatDate(date)}</h1>
                                <hr className="w-5/6 my-2" />
                            </div>
                            <div className="mx-14 lg:mb-9 mb-5 grid grid-cols-2 md:grid-cols-4 gap-5">
                                {date_list.map((item) => (
                                    <div key={item.dt + item.main.temp} className={itemStyle}>
                                        <p className="mb-1">{getTime(item.dt_txt)}</p>
                                        <div className="flex justify-center gap-3 items-center">
                                            <FiThermometer/>
                                            <span>{toCelsius(item.main.temp)}</span>
                                        </div>
                                        <div className="flex justify-center gap-3 items-center">
                                            <IoIosWater/>
                                            <span>{item.main.humidity}%</span>
                                        </div>
                                        <div className="flex justify-center gap-3 items-center">
                                            <MdOutlineVisibility/>
                                            <span>{item.visibility/1000}km</span>
                                        </div>
                                        <div className="flex justify-center gap-3 items-center">
                                            <FaWind/>
                                            <span>{Math.round(item.wind.speed)}km</span>
                                        </div>
                                        <p>{item.weather[0].description}</p>
                                    </div>
                                ))}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    )
}