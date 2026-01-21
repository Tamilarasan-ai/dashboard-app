import Link from "next/link"
import { ArrowRight, LayoutDashboard, Zap, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between border-b px-6 lg:px-12">
        <div className="flex items-center gap-2 font-bold text-xl">
          <LayoutDashboard className="h-6 w-6" />
          <span>DevControl</span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          <Link href="#about" className="hover:text-foreground transition-colors">About</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/overview">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-24 lg:py-32 px-6 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl mb-6">
            Control Your Development <br className="hidden sm:inline" />
            <span className="text-primary">From One Place</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-10">
            A production-grade dashboard for developers. Monitor projects, track analytics,
            and manage your workflow with zero compromise on performance.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/overview">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="https://github.com" target="_blank">
              <Button size="lg" variant="outline">
                View on GitHub
              </Button>
            </Link>
          </div>
        </section>

        <section id="features" className="py-20 bg-muted/50 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background p-8 rounded-xl border shadow-sm">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 text-primary">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Blazing Fast</h3>
                <p className="text-muted-foreground">
                  Built with Next.js App Router and Server Components for optimal performance and zero CLS.
                </p>
              </div>
              <div className="bg-background p-8 rounded-xl border shadow-sm">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 text-primary">
                  <LayoutDashboard className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Modern Stack</h3>
                <p className="text-muted-foreground">
                  Leveraging Zustand, Tailwind CSS, and TypeScript for a robust and maintainable codebase.
                </p>
              </div>
              <div className="bg-background p-8 rounded-xl border shadow-sm">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 text-primary">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Type Safe</h3>
                <p className="text-muted-foreground">
                  End-to-end type safety ensures your application is reliable and easy to refactor.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t px-6 text-center text-sm text-muted-foreground">
        <p>© 2026 DevControl. Built for developers.</p>
      </footer>
    </div>
  )
}
