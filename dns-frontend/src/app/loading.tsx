import { LoadingSpinner } from "@/components/ui/loading";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6 animate-fade-in max-w-md mx-auto px-4">
        <div className="relative">
          <LoadingSpinner size="lg" />
          <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping" />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-foreground">
            Loading DNS Platform
          </h2>
          <p className="text-muted-foreground text-lg">
            Preparing your decentralized domain experience...
          </p>
        </div>

        <div className="flex justify-center items-center space-x-2">
          <div className="h-2 w-2 bg-primary rounded-full animate-bounce" />
          <div className="h-2 w-2 bg-primary rounded-full animate-bounce delay-200" />
          <div className="h-2 w-2 bg-primary rounded-full animate-bounce delay-400" />
        </div>
      </div>
    </div>
  );
}
