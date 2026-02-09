export const getCurrentLocation = (): Promise<{ city: string | null; error?: "permission" | "unavailable" | "timeout" | "unknown" }> => {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve({ city: null, error: "unknown" });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=ee7910632a0567ef1dcf70405cc047d7`);
                    const data = await res.json();
                    const cityName = data?.name;
                    if (!cityName) {
                        resolve({ city: null, error: "unknown" });
                        return;
                    }
                    resolve({ city: cityName });
                } catch {
                    resolve({ city: null, error: "unknown" });
                }
            },
            (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                    resolve({ city: null, error: "permission" });
                    break;

                    case error.POSITION_UNAVAILABLE:
                    resolve({ city: null, error: "unavailable" });
                    break;

                    case error.TIMEOUT:
                    resolve({ city: null, error: "timeout" });
                    break;

                    default:
                    resolve({ city: null, error: "unknown" });
                }
            },
            { enableHighAccuracy: true, timeout: 12000 }
        );
    });
};