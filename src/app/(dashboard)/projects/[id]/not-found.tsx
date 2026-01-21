import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ProjectNotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="text-6xl font-bold text-muted-foreground">404</div>
            <h1 className="text-2xl font-semibold">Project Not Found</h1>
            <p className="text-muted-foreground text-center max-w-md">
                The project you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/projects">
                <Button>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Projects
                </Button>
            </Link>
        </div>
    );
}
