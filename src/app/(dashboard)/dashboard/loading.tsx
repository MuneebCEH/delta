import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Loading() {
    return (
        <div className="flex-1 space-y-6 p-6 md:p-8 pt-6 bg-slate-50/30">
            <div className="flex flex-col gap-1">
                <Skeleton className="h-9 w-[250px]" />
                <Skeleton className="h-4 w-[350px]" />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="border-none shadow-sm h-32">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-3 w-[100px]" />
                            <Skeleton className="h-8 w-8 rounded-xl" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-10 w-[80px]" />
                            <Skeleton className="h-3 w-[120px] mt-2" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4 border-none shadow-sm h-[450px]">
                    <CardHeader>
                        <Skeleton className="h-5 w-[150px]" />
                        <Skeleton className="h-3 w-[250px]" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-full w-full" />
                    </CardContent>
                </Card>
                <Card className="lg:col-span-3 border-none shadow-sm h-[450px]">
                    <CardHeader>
                        <Skeleton className="h-5 w-[150px]" />
                        <Skeleton className="h-3 w-[250px]" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
