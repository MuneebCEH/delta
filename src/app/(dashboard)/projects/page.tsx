import { getProjects } from "@/app/actions/projects"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"

export default async function ProjectsPage() {
    const projects = await getProjects()

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground">
                        Manage your projects and data sheets.
                    </p>
                </div>
                <CreateProjectDialog />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.length === 0 && (
                    <Card className="col-span-full border-dashed">
                        <CardHeader>
                            <CardTitle>No projects found</CardTitle>
                            <CardDescription>Get started by creating a new project above.</CardDescription>
                        </CardHeader>
                    </Card>
                )}
                {projects.map((project) => (
                    <Link key={project.id} href={`/projects/${project.id}`}>
                        <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                            <CardHeader>
                                <CardTitle>{project.name}</CardTitle>
                                <CardDescription>{project.description || "No description"}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground">
                                    {project._count?.sheets ?? 0} Sheets
                                </div>
                            </CardContent>
                            <CardFooter className="text-xs text-muted-foreground">
                                Updated {new Date(project.updatedAt).toLocaleDateString()}
                            </CardFooter>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
