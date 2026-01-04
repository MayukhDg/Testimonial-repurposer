'use client'

import { forgotPassword } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { ArrowLeft } from 'lucide-react'

function ForgotPasswordForm() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')
    const message = searchParams.get('message')

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Reset Password</CardTitle>
                <CardDescription>Enter your email to receive a password reset link</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={forgotPassword} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required placeholder="m@example.com" />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    {message && <p className="text-sm text-green-500">{message}</p>}
                    <Button type="submit" className="w-full">Send Reset Link</Button>
                </form>
            </CardContent>
            <CardFooter className="flex justify-center">
                <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-primary flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Sign In
                </Link>
            </CardFooter>
        </Card>
    )
}

export default function ForgotPasswordPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-premium-gradient px-4">
            <Suspense fallback={<div>Loading...</div>}>
                <ForgotPasswordForm />
            </Suspense>
        </div>
    )
}
