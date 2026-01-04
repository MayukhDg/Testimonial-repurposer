import OpenAI from "openai";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

// Helper to download file from URL to temp storage
async function downloadFile(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch file: ${response.statusText}`);

    // Create temp file path
    const tempDir = os.tmpdir();
    const fileName = `upload-${Date.now()}.mp4`; // Assuming mp4 or similar audio/video
    const filePath = path.join(tempDir, fileName);

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
    return filePath;
}

export async function POST(req) {
    try {
        const { content, type } = await req.json();
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
        }

        const openai = new OpenAI({ apiKey: apiKey });
        let testimonialText = content;

        // 1. If Video/Audio, Transcribe first
        if (type === 'video') {
            try {
                // 'content' here is expected to be "Video Transcript/Content from: URL" based on current client logic
                // We need to extract the URL.
                // Or better, let's assume the client might send just the URL if we update it.
                // For safety, let's regex or split. 
                // Current client sends: `Video Transcript/Content from: ${fileUrl}`

                const urlMatch = content.match(/Content from: (https:\/\/.*)/);
                const fileUrl = urlMatch ? urlMatch[1] : null;

                if (fileUrl) {
                    console.log("Downloading file for transcription:", fileUrl);
                    const filePath = await downloadFile(fileUrl);

                    console.log("Transcribing file...");
                    const transcription = await openai.audio.transcriptions.create({
                        file: fs.createReadStream(filePath),
                        model: "whisper-1",
                    });

                    testimonialText = transcription.text;
                    console.log("Transcription complete:", testimonialText.substring(0, 50) + "...");

                    // Cleanup temp file
                    fs.unlinkSync(filePath);
                }
            } catch (transcribeError) {
                console.error("Transcription failed:", transcribeError);
                return NextResponse.json({ error: "Failed to transcribe video. Please try a text input." }, { status: 500 });
            }
        }

        // 2. Generate Content with GPT-4o
        const prompt = `
      Act as an expert Copywriter. Repurpose the following ${type} testimonial into multiple engaging formats with strong hooks that engage the reader instantly.
      Return ONLY a valid JSON object with the following keys: "linkedIn_post", "twitter_thread", "email_newsletter", "landing_page_headline", "slide_deck_outline".
      Ensure the tone is professional yet persuasive. Do not wrap the JSON in markdown code blocks.

      Testimonial Content (Transcribed if video):
      "${testimonialText}"
    `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
        });

        const text = completion.choices[0].message.content;

        return NextResponse.json({ result: text, original_transcript: testimonialText });
    } catch (error) {
        console.error("OpenAI API Error:", error);
        return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
    }
}
