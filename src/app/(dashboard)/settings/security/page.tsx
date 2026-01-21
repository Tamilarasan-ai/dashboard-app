'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Key, AlertTriangle, Loader2, Check } from 'lucide-react';

export default function SecuritySettingsPage() {
    const router = useRouter();
    const { logout } = useStore();
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [passwordStatus, setPasswordStatus] = useState<'idle' | 'saving' | 'success'>('idle');

    const handlePasswordUpdate = () => {
        setPasswordStatus('saving');
        // Mock API call
        setTimeout(() => {
            setPasswordStatus('success');
            setTimeout(() => {
                setPasswordStatus('idle');
                setShowPasswordForm(false);
            }, 1500);
        }, 1000);
    };

    const handleDeleteAccount = () => {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            startTransition(async () => {
                // Mock deletion
                await new Promise(resolve => setTimeout(resolve, 1000));
                logout();
                router.push('/login');
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Password Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        Password
                    </CardTitle>
                    <CardDescription>
                        Change your password to keep your account secure.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {showPasswordForm ? (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current">Current Password</Label>
                                <Input id="current" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new">New Password</Label>
                                <Input id="new" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm">Confirm New Password</Label>
                                <Input id="confirm" type="password" />
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handlePasswordUpdate} disabled={passwordStatus === 'saving' || passwordStatus === 'success'}>
                                    {passwordStatus === 'saving' ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : passwordStatus === 'success' ? (
                                        <>
                                            <Check className="mr-2 h-4 w-4" />
                                            Updated!
                                        </>
                                    ) : (
                                        'Update Password'
                                    )}
                                </Button>
                                <Button variant="outline" onClick={() => setShowPasswordForm(false)} disabled={passwordStatus !== 'idle'}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button variant="outline" onClick={() => setShowPasswordForm(true)}>
                            Change Password
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        Danger Zone
                    </CardTitle>
                    <CardDescription>
                        Irreversible and destructive actions.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/10">
                        <div>
                            <p className="font-medium text-destructive">Delete Account</p>
                            <p className="text-sm text-muted-foreground">
                                Permanently delete your account and all data.
                            </p>
                        </div>
                        <Button variant="destructive" onClick={handleDeleteAccount} disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete Account'
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
