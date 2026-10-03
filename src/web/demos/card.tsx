import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CardDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign in to your account</CardTitle>
        <CardDescription>Enter your email below to continue.</CardDescription>
        <CardAction>
          <Button variant="link" size="sm">
            Sign up
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="card-email">Email</Label>
          <Input id="card-email" type="email" placeholder="you@company.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="card-password">Password</Label>
          <Input id="card-password" type="password" />
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button className="w-full">Sign in</Button>
        <Button variant="tonal" className="w-full">
          Continue with Google
        </Button>
      </CardFooter>
    </Card>
  );
}
