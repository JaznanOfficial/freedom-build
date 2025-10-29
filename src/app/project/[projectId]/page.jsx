import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function Page({ params }) {
  const { projectId } = await params;

  return (
    <main className="min-h-screen bg-muted/50 p-4 md:p-6">
      <div className="min-h-[calc(100vh-2rem)] space-y-6 rounded-xl border bg-background p-4 md:min-h-[calc(100vh-3rem)] md:p-6">
        <div>
          <Button
            asChild
            className="gap-2 bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/50 dark:hover:bg-input/50"
            size="sm"
            variant="outline"
          >
            <Link href="/dashboard">
              <LayoutDashboard className="size-4" />
              <span>Go to dashboard</span>
            </Link>
          </Button>
        </div>
        <div className="space-y-1">
          <h1 className="font-semibold text-2xl tracking-tight">Project</h1>
          <p className="text-muted-foreground text-sm">ID: {projectId}</p>
        </div>

        <Tabs className="w-full" defaultValue="generation">
          <TabsList>
            <TabsTrigger value="generation">Generation</TabsTrigger>
            <TabsTrigger value="studio">Studio</TabsTrigger>
          </TabsList>

          <div className="mt-3 rounded-lg border p-4">
            <TabsContent value="generation">
              <div className="text-muted-foreground text-sm">Generation</div>
            </TabsContent>
            <TabsContent value="studio">
              <div className="text-muted-foreground text-sm">Studio</div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  );
}
