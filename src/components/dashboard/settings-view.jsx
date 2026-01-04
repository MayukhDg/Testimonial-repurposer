'use client'

import { updatePassword } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'

export default function SettingsView() {
    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your account password. You'll be logged out of other sessions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={updatePassword} className="space-y-4 max-w-sm">
                        <div className="space-y-2">
                            <Label htmlFor="new_password">New Password</Label>
                            <Input id="new_password" name="new_password" type="password" required minLength={6} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm_password">Confirm New Password</Label>
                            <Input id="confirm_password" name="confirm_password" type="password" required minLength={6} />
                        </div>
                        <Button type="submit">Update Password</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
