export type CurrentWeatherProp = {
    city:string;
    refetchTrigger: number;
    setError: (error: string) => void;
}

export type CurrentWeatherType = {
    name: string,
    main: {
        temp: number,
        feels_like: number,
        temp_min: number,
        temp_max: number,
        pressure: number,
        humidity: number,
        sea_level: number,
        grnd_level: number
    },
    coord: {
        lon: number,
        lat: number,
    },
    sys: {
        country: string,
        sunrise: number,
        sunset: number,
    },
    visibility: number,
    weather: Array<{
        description: string,
        icon: string,
        main: string,
    }>,
    wind: {
        speed: number,
        deg: number
    }
}