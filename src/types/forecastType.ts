export type ForecastProps = {
    city: string,
    setError: (error: string) => void;
}

export type ForecastItem = {
    dt:number;
    dt_txt: string;
    main: {
        temp: number;
        humidity: number;
        pressure: number;
        temp_max: number;
        temp_min: number
    },
    visibility: number;
    wind: {
        speed: number;
        deg: number;
    };
    weather: Array<{
        description: string;
        icon: string;
        main: string;
    }>
}

export type ForecastType = {
    city: {
        name: string,
        sunrise: number,
        sunset: number
    };
    list: Array<ForecastItem>
}