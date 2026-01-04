'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UploadDropzone } from '@/utils/uploadthing'
import { Loader2, Sparkles } from 'lucide-react'
// import { useToast } from '@/hooks/use-toast' 

export default function TestimonialInput({ onGenerate }) {
    const [text, setText] = useState('')
    const [fileUrl, setFileUrl] = useState(null)
    const [isGenerating, setIsGenerating] = useState(false)

    // Tabs state
    const [activeTab, setActiveTab] = useState('text')

    const handleGenerate = async () => {
        setIsGenerating(true)
        try {
            const content = activeTab === 'text' ? text : `Video Transcript/Content from: ${fileUrl}`

            // Simple validation
            if (!content && activeTab === 'text') {
                alert("Please enter some text")
                setIsGenerating(false)
                return
            }

            await onGenerate(content, activeTab)
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Input Testimonial</CardTitle>
                <CardDescription>
                    Paste a customer review or upload a video testimonial to repurpose.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="text" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="text">Text / Review</TabsTrigger>
                        <TabsTrigger value="video">Video / Audio File</TabsTrigger>
                    </TabsList>

                    <TabsContent value="text">
                        <Textarea
                            placeholder="Paste the customer testimonial here..."
                            className="min-h-[200px]"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </TabsContent>

                    <TabsContent value="video">
                        <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px] bg-slate-50 dark:bg-slate-900/50">
                            {fileUrl ? (
                                <div className="text-center space-y-2">
                                    <p className="text-green-600 font-medium">File Uploaded Successfully!</p>
                                    <p className="text-xs text-muted-foreground break-all">{fileUrl}</p>
                                    <Button variant="outline" size="sm" onClick={() => setFileUrl(null)}>Remove</Button>
                                </div>
                            ) : (
                                <UploadDropzone
                                    endpoint="testimonialUploader"
                                    onClientUploadComplete={(res) => {
                                        // Do something with the response
                                        console.log("Files: ", res);
                                        setFileUrl(res[0].url);
                                        // alert("Upload Completed");
                                    }}
                                    onUploadError={(error) => {
                                        // Do something with the error.
                                        alert(`ERROR! ${error.message}`);
                                    }}
                                    className="ut-label:text-primary ut-button:bg-primary ut-button:ut-readying:bg-primary/50"
                                />
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button
                    size="lg"
                    onClick={handleGenerate}
                    disabled={isGenerating || (activeTab === 'text' && !text) || (activeTab === 'video' && !fileUrl)}
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating Magic...
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Repurpose Content
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}
