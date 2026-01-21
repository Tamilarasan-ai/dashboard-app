import { getGithubRepos } from '@/services/github';
import { getSettings } from '@/lib/settings';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Star, GitFork, Eye, ExternalLink, Calendar, Code } from 'lucide-react';

interface ProjectDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
    const { id } = await params;
    const settings = await getSettings();

    // Fetch all repos and find the one matching the ID (repo name)
    const repos = await getGithubRepos(settings.githubUsername);
    const repo = repos.find((r: any) => r.name === id || r.id.toString() === id);

    if (!repo) {
        notFound();
    }

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/projects" className="hover:text-foreground transition-colors">
                    Projects
                </Link>
                <span>/</span>
                <span className="text-foreground font-medium">{repo.name}</span>
            </div>

            {/* Back button and title */}
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <Link href="/projects">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight">{repo.name}</h1>
                    </div>
                    {repo.description && (
                        <p className="text-muted-foreground ml-12">{repo.description}</p>
                    )}
                </div>
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                    <Button>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View on GitHub
                    </Button>
                </a>
            </div>

            {/* Stats cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-yellow-500/10">
                            <Star className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{repo.stargazers_count?.toLocaleString() || 0}</p>
                            <p className="text-xs text-muted-foreground">Stars</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                            <GitFork className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{repo.forks_count?.toLocaleString() || 0}</p>
                            <p className="text-xs text-muted-foreground">Forks</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-green-500/10">
                            <Eye className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{repo.watchers_count?.toLocaleString() || 0}</p>
                            <p className="text-xs text-muted-foreground">Watchers</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-purple-500/10">
                            <Code className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{repo.language || 'N/A'}</p>
                            <p className="text-xs text-muted-foreground">Language</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Details */}
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Repository Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-muted-foreground">Default Branch</span>
                            <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                                {repo.default_branch || 'main'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-muted-foreground">Visibility</span>
                            <span className="capitalize">{repo.visibility || (repo.private ? 'Private' : 'Public')}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-muted-foreground">Open Issues</span>
                            <span>{repo.open_issues_count || 0}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-muted-foreground">Size</span>
                            <span>{((repo.size || 0) / 1024).toFixed(2)} MB</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Timestamps</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <Calendar className="h-4 w-4" /> Created
                            </span>
                            <span>{new Date(repo.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <Calendar className="h-4 w-4" /> Last Updated
                            </span>
                            <span>{new Date(repo.updated_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <Calendar className="h-4 w-4" /> Last Push
                            </span>
                            <span>{new Date(repo.pushed_at).toLocaleDateString()}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Topics */}
            {repo.topics && repo.topics.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Topics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {repo.topics.map((topic: string) => (
                                <span
                                    key={topic}
                                    className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                                >
                                    {topic}
                                </span>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
