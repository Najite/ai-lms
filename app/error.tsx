"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { logger } from "@/lib/logger";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    logger.error("Root route error encountered", error, {
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center p-6">
      <Card className="max-w-md border-border bg-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Application Error</CardTitle>
          <CardDescription>
            A system error occurred while processing your request.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Our telemetry has automatically captured this event for investigation.
          </p>
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 rounded bg-muted p-3 text-xs font-mono text-destructive overflow-auto max-h-36">
              {error.message}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button variant="default" size="sm" onClick={() => reset()}>
            Reload View
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push("/")}>
            Return Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
