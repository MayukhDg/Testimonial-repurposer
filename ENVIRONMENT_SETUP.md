# Environment Variables Setup Guide

To run the **AI Testimonial Repurposer**, you need to configure the following keys in your `.env.local` file.

## 1. Supabase (`NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/projects).
2. Select your project.
3. navigating to **Project Settings** (gear icon) > **API**.
4. Copy the **Project URL** and **anon / public** Key.

## 2. OpenAI API (`OPENAI_API_KEY`)
1. Visit [OpenAI API Keys](https://platform.openai.com/api-keys).
2. Click **Create new secret key**.
3. Copy the key string.

## 3. UploadThing (`UPLOADTHING_TOKEN`)
1. Go to the [UploadThing Dashboard](https://uploadthing.com/dashboard).
2. Create a new app (if you haven't already).
3. Click on the **API Keys** tab.
4. Copy the `UPLOADTHING_TOKEN`.

---

**Example `.env.local` file:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6Ik...
OPENAI_API_KEY=sk-...
UPLOADTHING_TOKEN=eyJhbGciOiJ...
```
