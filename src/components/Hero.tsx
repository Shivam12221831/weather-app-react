import weather_img from '../assets/hero_dp.png';
import bg_img from '../assets/hero_bg.jpg';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Searchbar } from './Searchbar';

export const Hero = () => {

    const [city, setCity] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if(!city) return;
        navigate(`/weather?city=${city}`);
    }, [city, navigate]);

    return (
        <section className="text-gray-900 body-font font-serif min-h-screen flex justify-center items-center bg-cover bg-center" style={{ backgroundImage: `url(${bg_img})`}}>
            <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col justify-center items-center">
                <div className="flex justify-center lg:justify-end lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
                    <img className="object-cover object-center w-60 h-60 md:w-80 md:h-80 lg:w-100 lg:h-100 rounded pb-10" alt="hero" src={weather_img} />
                </div>
                <div className="md:w-1/2 lg:pl-14 md:pl-16 flex flex-col md:items-start md:text-left items-center font-bold text-center">
                    <h1 className="title-font sm:text-6xl md:text-5xl lg:text-6xl xl:text-7xl text-5xl mb-4 text-gray-900">WeatherDash</h1>
                    <p className="mb-8 px-10 md:px-0 xl:pr-10 leading-relaxed">A centralized dashboard for real-time atmospheric metrics, featuring precise wind speed, humidity, and visibility tracking.</p>
                    <div className='md:w-100 xl:w-145 text-start'>
                        <label htmlFor="hero-city" className="leading-7 text-sm lg:text-md">Search a city to get started</label>
                        <Searchbar onSearch={ (newCity) => setCity(newCity)} placeholderText=''/>
                    </div>
                </div>
            </div>
        </section>
    )
}