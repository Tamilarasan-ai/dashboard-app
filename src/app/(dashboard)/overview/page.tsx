import { getGithubUser, getGithubStats, getGithubEvents } from '@/services/github';
import { getWeather } from '@/services/weather';
import { getSettings } from '@/lib/settings';
import { StatCard } from '@/components/cards/stat-card';
import { WeatherCard } from '@/components/cards/weather-card';
import { Github, Users, FolderGit2, Star, GitPullRequest, CircleCheck, Activity } from 'lucide-react';

export default async function OverviewPage() {
    const settings = await getSettings();

    const [user, weather, stats, events] = await Promise.all([
        getGithubUser(settings.githubUsername),
        getWeather(settings.city),
        getGithubStats(settings.githubUsername),
        getGithubEvents(settings.githubUsername, 5),
    ]);

    // Format event for display
    const formatEvent = (event: any) => {
        switch (event.type) {
            case 'PushEvent':
                const commits = event.payload?.commits?.length || 0;
                return `Pushed ${commits} commit${commits !== 1 ? 's' : ''} to ${event.repo.name}`;
            case 'CreateEvent':
                return `Created ${event.payload?.ref_type || 'repository'} in ${event.repo.name}`;
            case 'PullRequestEvent':
                return `${event.payload?.action || 'Updated'} PR in ${event.repo.name}`;
            case 'IssuesEvent':
                return `${event.payload?.action || 'Updated'} issue in ${event.repo.name}`;
            case 'WatchEvent':
                return `Starred ${event.repo.name}`;
            case 'ForkEvent':
                return `Forked ${event.repo.name}`;
            default:
                return `Activity in ${event.repo.name}`;
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) return `${diffDays}d ago`;
        if (diffHours > 0) return `${diffHours}h ago`;
        if (diffMins > 0) return `${diffMins}m ago`;
        return 'Just now';
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Public Repos"
                    value={user.public_repos}
                    icon={FolderGit2}
                    description="Total public repositories"
                />
                <StatCard
                    title="Followers"
                    value={user.followers}
                    icon={Users}
                    description="People following you"
                />
                <StatCard
                    title="Total Stars"
                    value={stats.totalStars}
                    icon={Star}
                    description="Stars across all repos"
                />
                <WeatherCard data={weather} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                    {/* Real Activity Feed */}
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 h-[400px] overflow-auto">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Recent Activity
                        </h3>
                        <div className="space-y-4">
                            {events.length > 0 ? (
                                events.map((event) => (
                                    <div key={event.id} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Github className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {formatEvent(event)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatTimeAgo(event.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted-foreground text-sm">No recent activity</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-span-3">
                    {/* Real Quick Stats */}
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 h-[400px]">
                        <h3 className="font-semibold mb-4">Quick Stats</h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <div className="flex items-center gap-3">
                                    <GitPullRequest className="h-5 w-5 text-blue-500" />
                                    <span className="text-sm text-muted-foreground">Pull Requests</span>
                                </div>
                                <span className="font-bold text-lg">{stats.pullRequestCount.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <div className="flex items-center gap-3">
                                    <CircleCheck className="h-5 w-5 text-green-500" />
                                    <span className="text-sm text-muted-foreground">Issues Closed</span>
                                </div>
                                <span className="font-bold text-lg">{stats.closedIssueCount.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <div className="flex items-center gap-3">
                                    <Users className="h-5 w-5 text-purple-500" />
                                    <span className="text-sm text-muted-foreground">Following</span>
                                </div>
                                <span className="font-bold text-lg">{user.following.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <div className="flex items-center gap-3">
                                    <Star className="h-5 w-5 text-yellow-500" />
                                    <span className="text-sm text-muted-foreground">Total Stars</span>
                                </div>
                                <span className="font-bold text-lg">{stats.totalStars.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
