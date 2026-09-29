import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center p-6">
      <Card className="max-w-md border-border bg-card text-center">
        <CardHeader>
          <div className="text-4xl font-extrabold text-primary mb-2 font-mono">404</div>
          <CardTitle className="text-xl font-semibold">Resource Not Found</CardTitle>
          <CardDescription>
            The requested route, resource, or document does not exist in the Academy catalog.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Please check the URL or return to the main Command Center.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild variant="default" size="sm">
            <Link href="/">Return to Command Center</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
