"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <motion.input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-md border border-border bg-card/50 px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 transition-all duration-300 backdrop-blur-sm",
          "hover:border-neon-cyan/50",
          className
        )}
        ref={ref}
        whileFocus={{ scale: 1.01 }}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
