import React from 'react'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && (
        <div className="w-20 h-20 bg-ios-bg-tertiary rounded-3xl corner-squircle flex items-center justify-center mb-6 text-ios-label-tertiary">
          {icon}
        </div>
      )}
      <h3 className="text-2xl font-bold text-ios-label mb-2">{title}</h3>
      {description && (
        <p className="text-base text-ios-label-secondary max-w-md mb-6">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  )
}
