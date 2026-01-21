'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GitBranch, Star, Code } from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from 'recharts';

interface AnalyticsClientProps {
    commitActivity: { week: string; commits: number }[];
    topRepos: { name: string; stargazers_count: number; language: string }[];
    languageDistribution: { name: string; percentage: number }[];
    totalRepos: number;
}

export function AnalyticsClient({
    commitActivity,
    topRepos,
    languageDistribution,
    totalRepos,
}: AnalyticsClientProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
                    <p className="text-muted-foreground">
                        GitHub activity and repository statistics.
                    </p>
                </div>
            </div>

            {/* Commit Activity Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GitBranch className="h-5 w-5" />
                        Commit Activity
                    </CardTitle>
                    <CardDescription>
                        Weekly commits across your repositories (last 12 weeks)
                    </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={commitActivity}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis dataKey="week" className="text-xs text-muted-foreground" />
                                <YAxis className="text-xs text-muted-foreground" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: 'var(--radius)',
                                        color: 'hsl(var(--card-foreground))'
                                    }}
                                    formatter={(value) => [`${value} commits`, 'Commits']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="commits"
                                    stroke="hsl(var(--primary))"
                                    fillOpacity={1}
                                    fill="url(#colorCommits)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Top Repositories */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-500" />
                            Top Repositories
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {topRepos.map((repo: any) => (
                                <div key={repo.name} className="flex justify-between items-center text-sm">
                                    <span className="truncate max-w-[150px]" title={repo.name}>
                                        {repo.name}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">
                                            {repo.language || 'N/A'}
                                        </span>
                                        <span className="font-bold flex items-center gap-1">
                                            <Star className="h-3 w-3" />
                                            {repo.stargazers_count}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Language Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Code className="h-5 w-5 text-blue-500" />
                            Languages
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {languageDistribution.map((lang) => (
                                <div key={lang.name} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span>{lang.name}</span>
                                        <span className="font-bold">{lang.percentage}%</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full transition-all"
                                            style={{ width: `${lang.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Repository Stats Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Repository Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                                <span className="text-sm text-muted-foreground">Total Repositories</span>
                                <span className="font-bold text-lg">{totalRepos}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                                <span className="text-sm text-muted-foreground">Total Commits (12w)</span>
                                <span className="font-bold text-lg">
                                    {commitActivity.reduce((sum, week) => sum + week.commits, 0)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                                <span className="text-sm text-muted-foreground">Languages Used</span>
                                <span className="font-bold text-lg">{languageDistribution.length}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
