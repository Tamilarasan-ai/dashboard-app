import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CloudSun, Droplets, Thermometer } from "lucide-react"

interface WeatherData {
    main: {
        temp: number
        humidity: number
    }
    weather: Array<{
        main: string
        description: string
    }>
    name: string
}

export function WeatherCard({ data }: { data: WeatherData | null }) {
    if (!data) return null;

    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Weather in {data.name}</CardTitle>
                <CloudSun className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold">{Math.round(data.main.temp)}°C</div>
                    <div className="text-sm text-muted-foreground capitalize">
                        {data.weather[0].description}
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Thermometer className="h-3 w-3" />
                        Feels like {Math.round(data.main.temp)}°
                    </div>
                    <div className="flex items-center gap-1">
                        <Droplets className="h-3 w-3" />
                        {data.main.humidity}% Humidity
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
