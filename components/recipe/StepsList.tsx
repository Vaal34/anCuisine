import React from 'react'
import { Badge } from '@/components/ui/Badge'

export interface StepsListProps {
  steps: string[]
  numbered?: boolean
}

export function StepsList({ steps, numbered = true }: StepsListProps) {
  return (
    <ol className="space-y-4">
      {steps.map((step, index) => (
        <li key={index} className="flex items-start gap-3">
          {numbered && (
            <Badge variant="blue" className="flex-shrink-0 mt-1">
              {index + 1}
            </Badge>
          )}
          <p className="text-base text-ios-label leading-relaxed flex-1">{step}</p>
        </li>
      ))}
    </ol>
  )
}
