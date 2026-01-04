import { signout } from '../auth/actions'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardTabs from '@/components/dashboard/dashboard-tabs'

export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    return (
        <div className="flex flex-col min-h-screen bg-premium-gradient">
            <header className="border-b px-6 py-4 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-50">
                <h1 className="text-xl font-bold">Vouch.io</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                    <form action={signout}>
                        <Button variant="outline" size="sm">Sign Out</Button>
                    </form>
                </div>
            </header>
            <main className="flex-1 p-6">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col space-y-2 mb-8">
                        <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
                        <p className="text-muted-foreground">Manage your testimonials and generated content.</p>
                    </div>

                    <DashboardTabs />
                </div>
            </main>
        </div>
    )
}
