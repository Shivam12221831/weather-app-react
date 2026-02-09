import { useState, useEffect } from "react";

type FetchType<T> = {
    data: T | null,
    loading: boolean,
    error: string | null
}

export function useFetch<T>(url: string | null, refetchTrigger?: number){
    const [state, setState] = useState<FetchType<T>>({
        data: null,
        loading: false,
        error: null
    });

    useEffect(() => {
        if(!url) return;
        const fetchData = async() => {
            setState({data: null, loading:true, error:null});
            try{
                const res = await fetch(url);
                if(!res.ok){
                    throw new Error(`Error ${res.status}`);
                }
                const json = await res.json();
                setState({data: json, loading: false, error: null});
            } catch(err){
                console.log("Error : ",err);
                setState({data:null, loading: false, error: "Something went wrong or Cann't find the data for specified city"});
            }
        }
        fetchData();
    }, [url, refetchTrigger]);

    return state;
}