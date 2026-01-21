'use client';

import { useState, useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { RepoCard } from '@/components/cards/repo-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface Repo {
    id: number
    name: string
    description: string
    stargazers_count: number
    language: string
    html_url: string
    updated_at: string
}

const ITEM_HEIGHT = 220;

export function ProjectList({ initialRepos }: { initialRepos: Repo[] }) {
    const [filter, setFilter] = useState('');
    const [sort, setSort] = useState('updated');
    const parentRef = useRef<HTMLDivElement>(null);

    const filteredRepos = useMemo(() => {
        let result = [...initialRepos];

        if (filter) {
            result = result.filter(repo =>
                repo.name.toLowerCase().includes(filter.toLowerCase()) ||
                (repo.description && repo.description.toLowerCase().includes(filter.toLowerCase()))
            );
        }

        result.sort((a, b) => {
            if (sort === 'stars') return b.stargazers_count - a.stargazers_count;
            if (sort === 'name') return a.name.localeCompare(b.name);
            return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        });

        return result;
    }, [initialRepos, filter, sort]);

    const virtualizer = useVirtualizer({
        count: filteredRepos.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => ITEM_HEIGHT,
        overscan: 3, // Render 3 extra items above/below for smoother scrolling
    });

    return (
        <div className="h-[calc(100vh-12rem)] flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search projects..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="updated">Last Updated</SelectItem>
                        <SelectItem value="stars">Stars</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div
                ref={parentRef}
                className="flex-1 border rounded-md bg-background/50 backdrop-blur overflow-auto"
            >
                {filteredRepos.length > 0 ? (
                    <div
                        style={{
                            height: virtualizer.getTotalSize(),
                            width: '100%',
                            position: 'relative',
                        }}
                    >
                        {virtualizer.getVirtualItems().map((virtualItem) => (
                            <div
                                key={filteredRepos[virtualItem.index].id}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: `${virtualItem.size}px`,
                                    transform: `translateY(${virtualItem.start}px)`,
                                }}
                            >
                                <RepoCard
                                    repo={filteredRepos[virtualItem.index]}
                                    style={{ height: '100%' }}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        No projects found.
                    </div>
                )}
            </div>
        </div>
    );
}
