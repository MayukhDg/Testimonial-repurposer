'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2, Calendar, FileText, Video, Trash2 } from 'lucide-react'
import RefinedOutput from './refined-output'

export default function HistoryList() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    const [items, setItems] = useState([])
    const [selectedItem, setSelectedItem] = useState(null)
    const supabase = createClient()

    useEffect(() => {
        fetchHistory()
    }, [])

    const fetchHistory = async () => {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        // Fetch generated content joined with testimonials
        // We want: generated_content.*, testimonials(content, type, created_at)
        const { data, error } = await supabase
            .from('generated_content')
            .select(`
                *,
                testimonials (
                    content,
                    type,
                    created_at
                )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) {
            console.error("Error fetching history:", error)
        } else {
            setItems(data || [])
        }
        setLoading(false)
    }

    const handleDelete = async (e, id) => {
        e.stopPropagation()
        if (!confirm("Are you sure you want to delete this item?")) return

        const { error } = await supabase
            .from('generated_content')
            .delete()
            .eq('id', id)

        if (error) {
            console.error("Error deleting item:", error)
            alert("Failed to delete item")
        } else {
            setItems(items.filter(item => item.id !== id))
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/50">
                <h3 className="text-xl font-semibold mb-2">No History Yet</h3>
                <p className="text-muted-foreground">Start repurposing content to build your library.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
                <Card
                    key={item.id}
                    className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50 group relative h-full flex flex-col"
                    onClick={() => router.push(`/dashboard/history/${item.id}`)}
                >
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-2">
                            <Badge variant={item.testimonials?.type === 'video' ? 'secondary' : 'default'} className="capitalize">
                                {item.testimonials?.type === 'video' ? <Video className="w-3 h-3 mr-1" /> : <FileText className="w-3 h-3 mr-1" />}
                                {item.testimonials?.type || 'Text'}
                            </Badge>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {new Date(item.created_at).toLocaleDateString()}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mr-2 z-10 relative"
                                    onClick={(e) => handleDelete(e, item.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <CardTitle className="text-base line-clamp-2 leading-tight group-hover:text-primary transition-colors pr-6">
                            {item.testimonials?.content || "Untitled Testimonial"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                            {item.testimonials?.content}
                        </p>
                    </CardContent>
                    <CardFooter className="pt-0 text-xs text-muted-foreground mt-auto">
                        Click to view generated assets
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}
