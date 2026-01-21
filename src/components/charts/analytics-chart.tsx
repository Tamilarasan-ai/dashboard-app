'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { useStore } from '@/store';

const data7d = [
    { name: 'Mon', visits: 4000, clicks: 2400 },
    { name: 'Tue', visits: 3000, clicks: 1398 },
    { name: 'Wed', visits: 2000, clicks: 9800 },
    { name: 'Thu', visits: 2780, clicks: 3908 },
    { name: 'Fri', visits: 1890, clicks: 4800 },
    { name: 'Sat', visits: 2390, clicks: 3800 },
    { name: 'Sun', visits: 3490, clicks: 4300 },
];

const data30d = Array.from({ length: 30 }).map((_, i) => ({
    name: `${i + 1}`,
    visits: Math.floor(Math.random() * 5000) + 1000,
    clicks: Math.floor(Math.random() * 3000) + 500,
}));

const data90d = Array.from({ length: 90 }).map((_, i) => ({
    name: `${i + 1}`,
    visits: Math.floor(Math.random() * 5000) + 1000,
    clicks: Math.floor(Math.random() * 3000) + 500,
}));

export default function AnalyticsChart() {
    const { range } = useStore();

    const data = range === '7d' ? data7d : range === '30d' ? data30d : data90d;

    return (
        <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs text-muted-foreground" />
                    <YAxis className="text-xs text-muted-foreground" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: 'var(--radius)',
                            color: 'hsl(var(--card-foreground))'
                        }}
                    />
                    <Area type="monotone" dataKey="visits" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorVisits)" />
                    <Area type="monotone" dataKey="clicks" stroke="hsl(var(--secondary))" fillOpacity={1} fill="url(#colorClicks)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
