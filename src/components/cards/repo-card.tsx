import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Star, GitFork, Eye } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Repo {
    id: number
    name: string
    description: string
    stargazers_count: number
    language: string
    html_url: string
    updated_at: string
}

export function RepoCard({ repo, style }: { repo: Repo; style?: React.CSSProperties }) {
    return (
        <div style={style} className="p-2">
            <Card className="h-full flex flex-col">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-lg truncate pr-2">{repo.name}</CardTitle>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                            <Star className="h-4 w-4" />
                            <span>{repo.stargazers_count}</span>
                        </div>
                    </div>
                    <CardDescription className="line-clamp-2 h-10">
                        {repo.description || "No description provided."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-primary" />
                            {repo.language || "Unknown"}
                        </span>
                        <span>•</span>
                        <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
                    </div>
                </CardContent>
                <CardFooter className="gap-2">
                    <Link href={`/projects/${repo.name}`} className="flex-1">
                        <Button variant="default" className="w-full">View Details</Button>
                    </Link>
                    <Link href={repo.html_url} target="_blank">
                        <Button variant="outline" size="icon">
                            <GitFork className="h-4 w-4" />
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
