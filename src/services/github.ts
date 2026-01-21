const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const BASE_URL = 'https://api.github.com';

export async function getGithubUser(username: string) {
    if (!GITHUB_TOKEN) {
        // Return mock data if no token (for development/demo without keys)
        return {
            login: username,
            public_repos: 42,
            followers: 128,
            following: 10,
            avatar_url: 'https://github.com/shadcn.png',
            name: 'Demo User'
        };
    }

    const res = await fetch(`${BASE_URL}/users/${username}`, {
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
        },
        next: { revalidate: 3600 },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch GitHub user');
    }

    return res.json();
}

export async function getGithubRepos(username: string) {
    if (!GITHUB_TOKEN) {
        // Mock data
        return Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            name: `project-${i + 1}`,
            description: 'A cool project built with Next.js',
            stargazers_count: Math.floor(Math.random() * 1000),
            language: ['TypeScript', 'JavaScript', 'Rust', 'Go'][Math.floor(Math.random() * 4)],
            updated_at: new Date().toISOString(),
            html_url: 'https://github.com'
        }));
    }

    const res = await fetch(`${BASE_URL}/users/${username}/repos?sort=updated&per_page=100`, {
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
        },
        next: { revalidate: 3600 },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch GitHub repos');
    }

    return res.json();
}

// Types for GitHub API responses
export interface GithubStats {
    pullRequestCount: number;
    closedIssueCount: number;
    totalStars: number;
    profileViews: number | null; // null if no push access
}

export interface CommitActivity {
    week: number; // Unix timestamp
    total: number;
    days: number[];
}

export interface GithubEvent {
    id: string;
    type: string;
    repo: { name: string };
    created_at: string;
    payload: any;
}

/**
 * Fetch user's PR and Issue counts using GitHub Search API
 */
export async function getGithubStats(username: string): Promise<GithubStats> {
    if (!GITHUB_TOKEN) {
        // Mock data for demo
        return {
            pullRequestCount: 56,
            closedIssueCount: 89,
            totalStars: 234,
            profileViews: 1234,
        };
    }

    const headers = { Authorization: `token ${GITHUB_TOKEN}` };

    // Fetch PR count, Issue count, and repos in parallel
    const [prRes, issueRes, reposRes] = await Promise.all([
        fetch(`${BASE_URL}/search/issues?q=author:${username}+type:pr`, {
            headers,
            next: { revalidate: 3600 },
        }),
        fetch(`${BASE_URL}/search/issues?q=author:${username}+type:issue+is:closed`, {
            headers,
            next: { revalidate: 3600 },
        }),
        fetch(`${BASE_URL}/users/${username}/repos?per_page=100`, {
            headers,
            next: { revalidate: 3600 },
        }),
    ]);

    const [prData, issueData, repos] = await Promise.all([
        prRes.ok ? prRes.json() : { total_count: 0 },
        issueRes.ok ? issueRes.json() : { total_count: 0 },
        reposRes.ok ? reposRes.json() : [],
    ]);

    // Sum stars across all repos
    const totalStars = repos.reduce((sum: number, repo: any) => sum + (repo.stargazers_count || 0), 0);

    return {
        pullRequestCount: prData.total_count || 0,
        closedIssueCount: issueData.total_count || 0,
        totalStars,
        profileViews: null, // Traffic API requires push access
    };
}

/**
 * Fetch recent public events/activity for a user
 */
export async function getGithubEvents(username: string, limit: number = 10): Promise<GithubEvent[]> {
    if (!GITHUB_TOKEN) {
        // Mock events
        return [
            { id: '1', type: 'PushEvent', repo: { name: 'demo/project' }, created_at: new Date().toISOString(), payload: { commits: [{ message: 'Initial commit' }] } },
            { id: '2', type: 'CreateEvent', repo: { name: 'demo/new-repo' }, created_at: new Date().toISOString(), payload: { ref_type: 'repository' } },
        ];
    }

    const res = await fetch(`${BASE_URL}/users/${username}/events/public?per_page=${limit}`, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` },
        next: { revalidate: 1800 }, // 30 min cache
    });

    if (!res.ok) {
        console.error('Failed to fetch GitHub events');
        return [];
    }

    return res.json();
}

/**
 * Fetch weekly commit activity across user's repos (for analytics charts)
 * Returns aggregated commit counts per week for the last 52 weeks
 */
export async function getCommitActivity(username: string): Promise<{ week: string; commits: number }[]> {
    if (!GITHUB_TOKEN) {
        // Mock 12 weeks of data
        return Array.from({ length: 12 }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (11 - i) * 7);
            return {
                week: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                commits: Math.floor(Math.random() * 50) + 5,
            };
        });
    }

    // First get user's repos
    const reposRes = await fetch(`${BASE_URL}/users/${username}/repos?sort=pushed&per_page=10`, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` },
        next: { revalidate: 3600 },
    });

    if (!reposRes.ok) {
        return [];
    }

    const repos = await reposRes.json();

    // Get commit activity for top 5 most recently pushed repos
    const activityPromises = repos.slice(0, 5).map(async (repo: any) => {
        const res = await fetch(`${BASE_URL}/repos/${repo.full_name}/stats/commit_activity`, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` },
            next: { revalidate: 3600 },
        });
        if (!res.ok) return [];
        return res.json();
    });

    const allActivity = await Promise.all(activityPromises);

    // Aggregate commits per week across all repos (last 12 weeks)
    const weeklyCommits: { [key: number]: number } = {};

    allActivity.forEach((repoActivity: CommitActivity[]) => {
        if (!Array.isArray(repoActivity)) return;
        repoActivity.slice(-12).forEach((week) => {
            weeklyCommits[week.week] = (weeklyCommits[week.week] || 0) + week.total;
        });
    });

    // Convert to array sorted by week
    return Object.entries(weeklyCommits)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([timestamp, commits]) => ({
            week: new Date(Number(timestamp) * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            commits,
        }));
}
