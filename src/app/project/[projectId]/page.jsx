import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { FloatingChatLauncher } from "@/components/floating-chat-launcher";
import { GenerationView } from "@/components/projects/GenerationView";
import { ProjectPageHeader } from "@/components/projects/ProjectPageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function Page({ params }) {
  const { projectId } = await params;

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-muted/50 p-4 md:p-6">
      <div className="flex flex-1 min-h-0 flex-col gap-6 overflow-hidden rounded-xl border bg-background p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button
            asChild
            className="gap-2 bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/50 dark:hover:bg-input/50"
            size="sm"
            variant="outline"
          >
            <Link href="/dashboard">
              <LayoutDashboard className="size-4" />
              <span>Dashboard</span>
            </Link>
          </Button>
          <ProjectPageHeader projectId={projectId} />
        </div>

        <Tabs className="flex w-full flex-1 min-h-0 flex-col" defaultValue="generation">
          <TabsList>
            <TabsTrigger value="generation">Generation</TabsTrigger>
            <TabsTrigger value="studio">Studio</TabsTrigger>
          </TabsList>

          <TabsContent className="mt-3 flex flex-1 min-h-0 flex-col overflow-hidden" value="generation">
            <GenerationView />
            <FloatingChatLauncher />
          </TabsContent>
          <TabsContent className="mt-3" value="studio">
            <div className="text-muted-foreground text-sm">Studio</div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
