import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TabsLineDemo() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-md">
      <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="settings" disabled>
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="pt-4 text-sm text-muted-foreground">
        Your workspace at a glanceusage, members and recent activity.
      </TabsContent>
      <TabsContent value="analytics" className="pt-4 text-sm text-muted-foreground">
        Traffic, conversion and retention over the last 30 days.
      </TabsContent>
      <TabsContent value="reports" className="pt-4 text-sm text-muted-foreground">
        Scheduled exports and saved report templates.
      </TabsContent>
    </Tabs>
  );
}
