'use client'

import { updatePassword } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Set New Password</CardTitle>
                <CardDescription>Enter your new password below</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={updatePassword} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="new_password">New Password</Label>
                        <Input id="new_password" name="new_password" type="password" required minLength={6} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm_password">Confirm Password</Label>
                        <Input id="confirm_password" name="confirm_password" type="password" required minLength={6} />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <Button type="submit" className="w-full">Update Password</Button>
                </form>
            </CardContent>
        </Card>
    )
}

export default function ResetPasswordPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-premium-gradient px-4">
            <Suspense fallback={<div>Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    )
}
