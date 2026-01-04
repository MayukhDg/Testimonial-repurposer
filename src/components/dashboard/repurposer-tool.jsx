'use client'

import { useState } from 'react'
import TestimonialInput from './testimonial-input'
import RefinedOutput from './refined-output'
import { createClient } from '@/utils/supabase/client'

export default function DashboardRepurposer() {
    const [output, setOutput] = useState(null)

    const handleGenerate = async (content, type) => {
        // Prompt generation moved to server-side for security and transcription handling

        try {
            // 1. Generate Content
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, type }),
            })

            const data = await response.json()

            if (data.result) {
                let cleanResult = data.result.replace(/```json/g, '').replace(/```/g, '')
                const parsedResult = JSON.parse(cleanResult)
                setOutput(cleanResult) // Update UI immediately

                // 2. Save to Supabase
                const supabase = createClient()
                const { data: { user } } = await supabase.auth.getUser()

                if (user) {
                    // Save Testimonial
                    const { data: testimonialData, error: testimonialError } = await supabase
                        .from('testimonials')
                        .insert({
                            user_id: user.id,
                            content: data.original_transcript || content,
                            type: type,
                            file_url: type === 'video' ? content.split('Content from: ')[1] : null
                        })
                        .select()
                        .single()

                    if (testimonialError) {
                        console.error("Error saving testimonial:", testimonialError)
                        return
                    }

                    // Save Generated Content
                    const { error: generatedError } = await supabase
                        .from('generated_content')
                        .insert({
                            user_id: user.id,
                            testimonial_id: testimonialData.id,
                            linkedin_post: parsedResult.linkedIn_post,
                            twitter_thread: parsedResult.twitter_thread,
                            email_newsletter: parsedResult.email_newsletter,
                            landing_page_headline: parsedResult.landing_page_headline,
                            slide_deck_outline: parsedResult.slide_deck_outline,
                            raw_json: parsedResult
                        })

                    if (generatedError) console.error("Error saving generated content:", generatedError)
                    else console.log("Saved to database successfully")
                }
            } else {
                console.error("No result in data", data)
            }
        } catch (error) {
            console.error("Generation failed", error)
            alert("Failed to generate content. Please check API key.")
        }
    }

    return (
        <div className="space-y-8">
            <TestimonialInput onGenerate={handleGenerate} />
            {output && <RefinedOutput data={output} />}
        </div>
    )
}
