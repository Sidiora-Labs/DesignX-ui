import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TabsDemo() {
  return (
    <Tabs defaultValue="account" className="w-full max-w-sm">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Make changes to your account here.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="tabs-name">Name</Label>
              <Input id="tabs-name" defaultValue="Ada Lovelace" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tabs-user">Username</Label>
              <Input id="tabs-user" defaultValue="@ada" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>You'll be signed out after changing it.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="tabs-current">Current password</Label>
              <Input id="tabs-current" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tabs-new">New password</Label>
              <Input id="tabs-new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Update password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
