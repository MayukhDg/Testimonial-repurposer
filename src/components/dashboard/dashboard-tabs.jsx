'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardRepurposer from "./repurposer-tool"
import HistoryList from "./history-list"
import SettingsView from "./settings-view"
import { Sparkles, History, Settings } from "lucide-react"

export default function DashboardTabs() {

    return (
        <Tabs defaultValue="create" className="w-full">
            <div className="flex items-center justify-between mb-8">
                <TabsList className="bg-muted/50 p-1">
                    <TabsTrigger value="create" className="px-6 py-2">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Create New
                    </TabsTrigger>
                    <TabsTrigger value="history" className="px-6 py-2">
                        <History className="w-4 h-4 mr-2" />
                        Library & History
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="px-6 py-2">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                    </TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="create" className="space-y-4 animate-in fade-in-50 duration-500">
                <div className="flex flex-col space-y-2 mb-6">
                    <h2 className="text-2xl font-bold tracking-tight">Repurpose Content</h2>
                    <p className="text-muted-foreground">Turn your testimonials into engaging social media posts, emails, and more.</p>
                </div>
                <DashboardRepurposer />
            </TabsContent>

            <TabsContent value="history" className="space-y-4 animate-in fade-in-50 duration-500">
                <div className="flex flex-col space-y-2 mb-6">
                    <h2 className="text-2xl font-bold tracking-tight">Your Library</h2>
                    <p className="text-muted-foreground">Browse your past generated content and repurpose executions.</p>
                </div>
                <HistoryList />
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 animate-in fade-in-50 duration-500">
                <div className="flex flex-col space-y-2 mb-6">
                    <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                    <p className="text-muted-foreground">Manage your account preferences.</p>
                </div>
                <SettingsView />
            </TabsContent>
        </Tabs>
    )
}
