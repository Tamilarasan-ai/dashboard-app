'use client';

import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Moon, Sun, Laptop, Save, Loader2, Check } from 'lucide-react';
import { saveSettings } from '@/lib/settings';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export function SettingsForm() {
    const router = useRouter();
    const {
        theme, setTheme,
        githubUsername, setGithubUsername,
        city, setCity
    } = useStore();

    const [isPending, startTransition] = useTransition();
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        startTransition(async () => {
            // Save to cookies for server components
            await saveSettings({
                githubUsername,
                city,
                theme,
            });

            // Show success feedback
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);

            // Refresh the page to reload server components with new settings
            router.refresh();
        });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                        Customize the look and feel of the dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Theme</Label>
                        <div className="flex gap-4">
                            <Button
                                variant={theme === 'light' ? 'default' : 'outline'}
                                onClick={() => setTheme('light')}
                                className="flex-1"
                            >
                                <Sun className="mr-2 h-4 w-4" /> Light
                            </Button>
                            <Button
                                variant={theme === 'dark' ? 'default' : 'outline'}
                                onClick={() => setTheme('dark')}
                                className="flex-1"
                            >
                                <Moon className="mr-2 h-4 w-4" /> Dark
                            </Button>
                            <Button
                                variant={theme === 'system' ? 'default' : 'outline'}
                                onClick={() => setTheme('system')}
                                className="flex-1"
                            >
                                <Laptop className="mr-2 h-4 w-4" /> System
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Data Sources</CardTitle>
                    <CardDescription>
                        Configure where your dashboard data comes from.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">GitHub Username</Label>
                        <Input
                            id="username"
                            value={githubUsername}
                            onChange={(e) => setGithubUsername(e.target.value)}
                            placeholder="e.g., octocat"
                        />
                        <p className="text-xs text-muted-foreground">
                            This username will be used to fetch repositories, stats, and activity.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="city">Default City</Label>
                        <Input
                            id="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="e.g., San Francisco"
                        />
                        <p className="text-xs text-muted-foreground">
                            Used for the weather widget on the overview page.
                        </p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSave} disabled={isPending} className="ml-auto">
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : saved ? (
                            <>
                                <Check className="mr-2 h-4 w-4" />
                                Saved!
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Settings
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
