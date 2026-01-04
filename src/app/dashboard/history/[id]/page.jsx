import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import RefinedOutput from '@/components/dashboard/refined-output'
import { ArrowLeft, Calendar, FileText, Video } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default async function HistoryDetailPage({ params }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    // Fetch the specific item
    // We also want the related testimonial data
    const { data: item, error } = await supabase
        .from('generated_content')
        .select(`
            *,
            testimonials (
                content,
                type,
                created_at,
                file_url
            )
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (error || !item) {
        console.error("Error fetching detail:", error)
        notFound()
    }

    return (
        <div className="flex flex-col min-h-screen bg-premium-gradient">
            <header className="border-b px-6 py-4 flex items-center bg-white/50 backdrop-blur-md sticky top-0 z-50">
                <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="mr-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-xl font-bold truncate pr-4">
                        {item.testimonials?.content?.substring(0, 50)}...
                    </h1>
                </div>
            </header>

            <main className="flex-1 p-6 max-w-5xl mx-auto w-full space-y-8">
                {/* Meta Info Card */}
                <div className="bg-white/40 backdrop-blur-sm rounded-lg p-6 border shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                            <Badge variant={item.testimonials?.type === 'video' ? 'secondary' : 'default'} className="capitalize text-base px-3 py-1">
                                {item.testimonials?.type === 'video' ? <Video className="w-4 h-4 mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
                                {item.testimonials?.type || 'Text'} Repurpose
                            </Badge>
                            <span className="text-sm text-muted-foreground flex items-center ml-2">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(item.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Original Input</h3>
                        <div className="p-4 bg-muted/50 rounded-md text-sm whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto">
                            {item.testimonials?.content}
                        </div>
                        {item.testimonials?.file_url && (
                            <div className="mt-2 text-xs">
                                <span className="font-semibold">Source URL: </span>
                                <a href={item.testimonials.file_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate inline-block max-w-full align-bottom">
                                    {item.testimonials.file_url}
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Generated Output */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Generated Content</h2>
                    </div>
                    <RefinedOutput data={item.raw_json} />
                </div>
            </main>
        </div>
    )
}
