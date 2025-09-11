"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <Loader2
      className={cn("animate-spin text-primary", sizeClasses[size], className)}
    />
  );
}

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

export function LoadingSkeleton({
  className,
  count = 1,
}: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "loading-skeleton rounded-md bg-muted h-4 w-full",
            className
          )}
        />
      ))}
    </>
  );
}

interface LoadingCardProps {
  className?: string;
}

export function LoadingCard({ className }: LoadingCardProps) {
  return (
    <div
      className={cn(
        "border border-border rounded-lg p-6 bg-card text-card-foreground animate-pulse",
        className
      )}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <LoadingSkeleton className="h-6 w-6 rounded-full" />
          <LoadingSkeleton className="h-6 w-3/4" />
        </div>
        <LoadingSkeleton count={3} className="h-4" />
        <div className="flex gap-2 pt-2">
          <LoadingSkeleton className="h-8 w-20 rounded-md" />
          <LoadingSkeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}

interface LoadingPageProps {
  title?: string;
  subtitle?: string;
}

export function LoadingPage({
  title = "Loading...",
  subtitle,
}: LoadingPageProps) {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-6 animate-fade-in max-w-md w-full">
        <div className="flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground leading-relaxed">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface LoadingButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

export function LoadingButton({
  children,
  isLoading = false,
  className,
}: LoadingButtonProps) {
  return (
    <button
      disabled={isLoading}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2",
        className
      )}
    >
      {isLoading && <LoadingSpinner size="sm" className="absolute" />}
      <span className={isLoading ? "opacity-0" : "opacity-100"}>
        {children}
      </span>
    </button>
  );
}

export default LoadingSpinner;
