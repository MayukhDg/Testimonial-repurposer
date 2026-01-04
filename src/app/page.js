import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-premium-gradient">
      <header className="px-6 py-4 flex items-center justify-between border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="font-bold text-xl">Vouch.io</div>
        <nav className="flex gap-4">
          <Link href="/auth/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/auth/signup">
            <Button>Get Started</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Turn Testimonials into <span className="text-primary">Content Gold</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-8">
          Automatically generate LinkedIn posts, tweets, slides, and more from your customer reviews using AI.
        </p>
        <div className="flex gap-4">
          <Link href="/auth/signup">
            <Button size="lg" className="h-12 px-8 text-lg">Start Repurposing Free</Button>
          </Link>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © 2026 Vouch.io. All rights reserved.
      </footer>
    </div>
  )
}
