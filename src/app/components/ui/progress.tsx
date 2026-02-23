"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "./utils";

interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  value?: number;
  colorByValue?: boolean;
}

function Progress({
  className,
  value = 0,
  colorByValue = false,
  ...props
}: ProgressProps) {
  // Определение цвета на основе значения
  const getColorClass = () => {
    if (!colorByValue) return "bg-primary";
    
    if (value >= 80) {
      return "bg-gradient-to-r from-green-500 to-emerald-500";
    } else if (value >= 60) {
      return "bg-gradient-to-r from-yellow-500 to-orange-500";
    } else if (value >= 40) {
      return "bg-gradient-to-r from-orange-500 to-red-500";
    } else {
      return "bg-gradient-to-r from-red-500 to-rose-600";
    }
  };

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "h-full w-full flex-1 transition-all",
          getColorClass()
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };