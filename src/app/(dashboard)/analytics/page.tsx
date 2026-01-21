import { getCommitActivity, getGithubRepos } from '@/services/github';
import { getSettings } from '@/lib/settings';
import { AnalyticsClient } from './analytics-client';

export default async function AnalyticsPage() {
    const settings = await getSettings();

    // Fetch real commit activity and repo stats
    const [commitActivity, repos] = await Promise.all([
        getCommitActivity(settings.githubUsername),
        getGithubRepos(settings.githubUsername),
    ]);

    // Calculate top repos by stars
    const topRepos = [...repos]
        .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
        .slice(0, 5);

    // Calculate language distribution
    const languageCount: Record<string, number> = {};
    repos.forEach((repo: any) => {
        if (repo.language) {
            languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
        }
    });
    const languageDistribution = Object.entries(languageCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([lang, count]) => ({
            name: lang,
            percentage: Math.round((count / repos.length) * 100),
        }));

    return (
        <AnalyticsClient
            commitActivity={commitActivity}
            topRepos={topRepos}
            languageDistribution={languageDistribution}
            totalRepos={repos.length}
        />
    );
}
