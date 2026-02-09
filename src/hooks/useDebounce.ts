import { useState, useEffect } from "react";

export function useDebounce(value: string, delay: number = 600){

    const [debounceValue, setDebounceValue] = useState<string>(value);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebounceValue(value);
        }, delay);

        return () => clearInterval(timerId);
    });

    return debounceValue;
}