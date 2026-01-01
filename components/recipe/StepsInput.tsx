'use client'

import React from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'

export interface StepsInputProps {
  steps: string[]
  onChange: (steps: string[]) => void
  disabled?: boolean
}

export function StepsInput({ steps, onChange, disabled }: StepsInputProps) {
  const addStep = () => {
    onChange([...steps, ''])
  }

  const updateStep = (index: number, value: string) => {
    const updated = [...steps]
    updated[index] = value
    onChange(updated)
  }

  const removeStep = (index: number) => {
    onChange(steps.filter((_, i) => i !== index))
  }

  if (steps.length === 0) {
    onChange([''])
  }

  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div key={index} className="flex gap-2 items-start">
          {/* Numéro */}
          <Badge variant="blue" className="mt-2 flex-shrink-0">
            {index + 1}
          </Badge>

          {/* Textarea */}
          <Textarea
            value={step}
            onChange={(e) => updateStep(index, e.target.value)}
            placeholder={`Décrivez l'étape ${index + 1}...`}
            rows={3}
            className="flex-1"
            disabled={disabled}
          />

          {/* Supprimer */}
          {steps.length > 1 && !disabled && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeStep(index)}
              className="mt-2 flex-shrink-0"
              type="button"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      ))}

      {!disabled && (
        <Button
          variant="secondary"
          onClick={addStep}
          leftIcon={<Plus className="w-5 h-5" />}
          fullWidth
          type="button"
        >
          Ajouter une étape
        </Button>
      )}
    </div>
  )
}
