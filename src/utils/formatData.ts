import type { ForecastType, ForecastItem } from "../types/forecastType";

export function toCelsius(temp: number){
    return Math.round(temp - 273.15).toString() + "\u00B0C";
}

export function formatDate(dateString: string){
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) return "Invalid Date";

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(date);
};

export function formatTime(time: number){
    const result = new Date(time * 1000).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    return result;
}

export function getCountryName(code: string){
    try{
        const regionNames = new Intl.DisplayNames(["en"], {type: 'region'});
        return regionNames.of(code);
    }catch(err){
        console.log(err);
        return code;
    }
}

export function getDate(str: string){
    return str.split(' ')[0];
}

export function getTime(str: string){
    const result = new Date(str).toLocaleTimeString("en-US", {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    })
    return result;
}

export function groupForecast(data: ForecastType | null){
    const groupedForecast: Record<string, ForecastItem[]> = {};
    if(!data) return null;
    const today = new Date().toISOString().split('T')[0];
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 5);
    const fiveDaysLater = newDate.toISOString().split('T')[0];

    data.list.forEach(item => {
        const date = getDate(item.dt_txt);
        if(date === today || date === fiveDaysLater) return;
        if(!groupedForecast[date]) groupedForecast[date] = [];
        groupedForecast[date].push(item);
    });

    return groupedForecast;
}