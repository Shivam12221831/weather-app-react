type ErrorStateProps = {
  message?: string;
};

import { TiWeatherPartlySunny } from "react-icons/ti";
import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";

export const ErrorBox = ({ message = "We couldn’t fetch the weather data right now." }: ErrorStateProps) => {
    const context = useContext(ThemeContext);
    return (
        <div className="w-full my-20 flex justify-center items-center py-16">
            <div className={`max-w-md w-full shadow-sm rounded-xl p-8 text-center ${context?.theme==="dark" ? "bg-[#1e2939] text-white" : "bg-[#dbeafe] border border-gray-200"}`}>
                <div className="text-5xl flex justify-center mb-4"><TiWeatherPartlySunny size={30}/></div>
                <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
                <p className="text-sm mb-6">{message}</p>
            </div>
        </div>
    );
};