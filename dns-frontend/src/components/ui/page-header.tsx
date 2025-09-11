"use client";

import React from "react";
import { BackButton } from "./back-button";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  showBackButton?: boolean;
  backHref?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  showBackButton = false,
  backHref,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-4 mb-8 animate-fade-in", className)}>
      {showBackButton && <BackButton href={backHref} />}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
            {title}
          </h1>
          {subtitle && (
            <div className="text-sm md:text-base text-muted-foreground break-all lg:break-normal">
              {subtitle}
            </div>
          )}
        </div>

        {children && (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
