'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'


export async function login(formData) {
    const supabase = await createClient()

    // validate fields
    const email = formData.get('email')
    const password = formData.get('password')

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        redirect('/auth/login?error=Could not authenticate user')
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(formData) {
    const supabase = await createClient()

    const email = formData.get('email')
    const password = formData.get('password')

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
        },
    })

    if (error) {
        console.error("Signup error:", error)
        redirect(`/auth/signup?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/', 'layout')
    redirect('/auth/signup?message=Check email to continue sign in process')
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()

    revalidatePath('/', 'layout')
    redirect('/auth/login')
}

export async function forgotPassword(formData) {
    const supabase = await createClient()
    const email = formData.get('email')
    const origin = (await headers()).get('origin')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?next=/auth/reset-password`,
    })

    if (error) {
        return redirect('/auth/forgot-password?error=Could not send reset password email')
    }

    return redirect('/auth/forgot-password?message=Check your email for a reset link')
}

export async function updatePassword(formData) {
    const supabase = await createClient()
    const password = formData.get('new_password')
    const confirmPassword = formData.get('confirm_password')

    if (password !== confirmPassword) {
        return redirect('/auth/reset-password?error=Passwords do not match')
    }

    const { error } = await supabase.auth.updateUser({
        password: password,
    })

    if (error) {
        return redirect('/auth/reset-password?error=Could not update password')
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard?message=Password updated successfully')
}

