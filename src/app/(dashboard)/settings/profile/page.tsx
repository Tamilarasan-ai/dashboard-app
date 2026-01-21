'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { saveSettings } from '@/lib/settings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User, Mail, Github, MapPin, Save, Loader2, Check } from 'lucide-react';

export default function ProfileSettingsPage() {
    const router = useRouter();
    const {
        user,
        githubUsername, setGithubUsername,
        city, setCity
    } = useStore();

    // Local state for form inputs
    const [displayName, setDisplayName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [localGithub, setLocalGithub] = useState(githubUsername);
    const [localCity, setLocalCity] = useState(city);

    const [isPending, startTransition] = useTransition();
    const [saved, setSaved] = useState(false);

    // Sync local state with store when it loads
    useEffect(() => {
        if (user?.name) setDisplayName(user.name);
        if (user?.email) setEmail(user.email);
        setLocalGithub(githubUsername);
        setLocalCity(city);
    }, [user, githubUsername, city]);

    const handleSave = () => {
        startTransition(async () => {
            // 1. Save to cookies (server)
            await saveSettings({
                githubUsername: localGithub,
                city: localCity,
            });

            // 2. Update store (client)
            setGithubUsername(localGithub);
            setCity(localCity);

            // Mock updating user profile in store (since we don't have a real auth backend)
            // In a real app, this would be an API call
            useStore.setState(state => ({
                ...state,
                user: state.user ? { ...state.user, name: displayName, email: email } : null
            }));

            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
            router.refresh();
        });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Profile Information
                    </CardTitle>
                    <CardDescription>
                        Update your profile details and public information.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={displayName} className="h-full w-full object-cover" />
                            ) : (
                                <User className="h-10 w-10 text-primary" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-semibold">{displayName || 'Guest User'}</h3>
                            <p className="text-sm text-muted-foreground">{email || 'Not signed in'}</p>
                        </div>
                    </div>

                    <div className="grid gap-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="displayName">Display Name</Label>
                            <Input
                                id="displayName"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Your display name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                                <Mail className="h-4 w-4" /> Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="github" className="flex items-center gap-2">
                                <Github className="h-4 w-4" /> GitHub Username
                            </Label>
                            <Input
                                id="github"
                                value={localGithub}
                                onChange={(e) => setLocalGithub(e.target.value)}
                                placeholder="octocat"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location" className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> Location
                            </Label>
                            <Input
                                id="location"
                                value={localCity}
                                onChange={(e) => setLocalCity(e.target.value)}
                                placeholder="San Francisco"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isPending}>
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
                            Save Changes
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
