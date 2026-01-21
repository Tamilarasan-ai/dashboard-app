const OPENWEATHER_KEY = process.env.OPENWEATHER_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function getWeather(city: string) {
    if (!OPENWEATHER_KEY) {
        // Mock data
        return {
            main: { temp: 22, humidity: 60 },
            weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
            name: city
        };
    }

    const res = await fetch(
        `${BASE_URL}/weather?q=${city}&units=metric&appid=${OPENWEATHER_KEY}`,
        { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
        // Fallback or throw
        console.error('Weather fetch failed');
        return null;
    }

    return res.json();
}
