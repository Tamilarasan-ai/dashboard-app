import { getGithubRepos } from '@/services/github';
import { getSettings } from '@/lib/settings';
import { ProjectList } from '@/components/projects/project-list';

export default async function ProjectsPage() {
    const settings = await getSettings();
    const repos = await getGithubRepos(settings.githubUsername);

    return (
        <div className="space-y-6 h-full">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
                <p className="text-muted-foreground">
                    Repositories from <span className="font-medium text-foreground">{settings.githubUsername}</span> on GitHub.
                </p>
            </div>
            <ProjectList initialRepos={repos} />
        </div>
    );
}
