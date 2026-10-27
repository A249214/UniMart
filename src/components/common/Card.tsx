import React, { HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

export const Card: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'bg-card rounded-md border border-sand-300 shadow-subtle text-card-foreground',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardHeader: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <div className={cn('p-5 border-b border-sand-200', className)} {...props}>
      {children}
    </div>
  )
}

export const CardTitle: React.FC<HTMLAttributes<HTMLHeadingElement>> = ({ className, children, ...props }) => {
  return (
    <h3 className={cn('text-lg font-semibold tracking-tight text-forest-950 font-serif', className)} {...props}>
      {children}
    </h3>
  )
}

export const CardDescription: React.FC<HTMLAttributes<HTMLParagraphElement>> = ({ className, children, ...props }) => {
  return (
    <p className={cn('text-xs text-muted-foreground mt-1', className)} {...props}>
      {children}
    </p>
  )
}

export const CardContent: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <div className={cn('p-5', className)} {...props}>
      {children}
    </div>
  )
}

export const CardFooter: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <div className={cn('p-5 pt-0 flex items-center', className)} {...props}>
      {children}
    </div>
  )
}
