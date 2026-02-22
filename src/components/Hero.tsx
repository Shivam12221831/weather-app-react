import bg_img from '../assets/hero_background4.jpg';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Searchbar } from './Searchbar';
import { MdMyLocation } from "react-icons/md";
import { getCurrentLocation } from "@/utils/getCurrentLocation";
import { toast } from "sonner";

export const Hero = () => {
    const [city, setCity] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!city) return;
        navigate(`/weather?city=${city}`, { replace: true });
    }, [city, navigate]);

    async function handleCurrentLocation() {
        const toastId = toast.loading("Detecting your location...");
        const result = await getCurrentLocation();
        if (result.error) {
            toast.error("Unable to detect location", { id: toastId });
            return;
        }
        if (!result.city) {
            toast.error("Unable to fetch location", { id: toastId });
            return;
        }
        toast.success(`Showing weather for ${result.city}`, { id: toastId });
        navigate(`/weather?city=${result.city}`, { replace: true });
    }

    return (
        <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bg_img})` }}/>
            <div className="absolute inset-0 backdrop-blur-sm bg-black/20" />
            <div className="relative z-10 w-full max-w-3xl text-center text-black font-serif">
                <h1 className=" text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">WeatherDash</h1>
                <p className=" text-base sm:text-md sm:px-20 lg:px-10 leading-relaxed mb-5 text-black font-semibold">
                    Real-time weather intelligence at your fingertips. Track temperature, humidity, wind, and visibility with precision.
                </p>
                <div className="w-full max-w-md gap-2 mx-auto space-y-4">
                    <div className='text-start'>
                        <label htmlFor="hero-city" className="leading-7 text-sm lg:text-md">Search a city to get started</label>
                        <Searchbar onSearch={(newCity) => setCity(newCity)} placeholderText="" type='hero'/>
                    </div>
                    <button
                        onClick={handleCurrentLocation}
                        className="group w-full h-11 flex items-center justify-center gap-2 bg-white text-gray-900 font-semibold rounded-lg shadow-md transition-all duration-300 ease-out hover:bg-[#ac3047] hover:text-white hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer">
                        <MdMyLocation size={18} className="transition-transform duration-300 group-hover:scale-110"/>
                        <span className="transition-all duration-300">Use Current Location</span>
                    </button>
                </div>
            </div>
        </section>    
    );
};