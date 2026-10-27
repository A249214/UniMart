import React, { HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'academic' | 'clay' | 'outline' | 'success' | 'muted'
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'academic',
  children,
  ...props
}) => {
  const variants = {
    academic: 'bg-sand-100 text-forest-800 border-sand-300',
    clay: 'bg-clay-50 text-clay-700 border-clay-200',
    outline: 'bg-transparent text-forest-800 border-sand-300',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    muted: 'bg-sand-50 text-forest-700/70 border-sand-200',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full border',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
