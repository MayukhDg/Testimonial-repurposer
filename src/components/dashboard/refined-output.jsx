'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Copy, Check, Share2 } from 'lucide-react'
import { useState } from 'react'

const FormattedOutput = ({ title, content }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{title}</h3>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
            <div className="bg-muted p-4 rounded-md whitespace-pre-wrap font-mono text-sm max-h-[400px] overflow-y-auto">
                {content}
            </div>
        </div>
    )
}

export default function RefinedOutput({ data }) {
    if (!data) return null;

    // Assuming data comes in as a JSON object with keys like 'linkedin', 'twitter', 'email'
    // If it's raw text, we might need to parse it or display it as raw.
    // For now, let's assume the API returns a JSON string that we parse.

    let parsedData = {}
    try {
        parsedData = typeof data === 'string' ? JSON.parse(data) : data
    } catch (e) {
        // Fallback if not valid JSON
        parsedData = { "Raw Output": data }
    }

    const keys = Object.keys(parsedData)

    return (
        <Card className="w-full animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
            <CardHeader>
                <CardTitle>Generated Content</CardTitle>
                <CardDescription>Your testimonial has been repurposed into these formats.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue={keys[0]} className="w-full">
                    <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent justify-start mb-4">
                        {keys.map(key => (
                            <TabsTrigger key={key} value={key} className="capitalize data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                {key.replace(/_/g, ' ')}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {keys.map(key => (
                        <TabsContent key={key} value={key}>
                            <FormattedOutput title={key.replace(/_/g, ' ')} content={parsedData[key]} />
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
        </Card>
    )
}
