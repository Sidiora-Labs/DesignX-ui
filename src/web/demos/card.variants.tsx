import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CardVariants() {
  return (
    <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-3">
      {(["outline", "tonal", "elevated"] as const).map((v) => (
        <Card key={v} variant={v}>
          <CardHeader>
            <CardTitle className="capitalize">{v}</CardTitle>
            <CardDescription>
              {v === "outline" ? "Hairline border on surface." : v === "tonal" ? "Container tone, no border." : "Soft float shadow."}
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
