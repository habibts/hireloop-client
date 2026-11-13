import type { LucideIcon } from "lucide-react"

import { cn } from "cn"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

/**
 * Shared dark-theme form primitives: a labelled control with the required
 * marker, optional hint text, and consistent input styling.
 */

const inputClasses =
  "h-11 border-white/10 bg-white/[0.04] text-white placeholder:text-white/40"

const labelClasses = "text-sm font-medium text-white/80"

export function FieldLabel({
  htmlFor,
  required,
  hint,
  className,
  children,
}: {
  htmlFor?: string
  required?: boolean
  hint?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("flex items-baseline justify-between gap-2", className)}
    >
      <span className={labelClasses}>
        {children}
        {required ? (
          <span className="text-[#8b7ff6]" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </span>
      {hint ? <span className="text-xs text-zinc-500">{hint}</span> : null}
    </label>
  )
}

export function LabeledInput({
  id,
  label,
  required,
  hint,
  icon: Icon,
  className,
  ...props
}: React.ComponentProps<"input"> & {
  label: string
  required?: boolean
  hint?: string
  icon?: LucideIcon
}) {
  return (
    <div className="space-y-1.5">
      <FieldLabel htmlFor={id} required={required} hint={hint}>
        {label}
      </FieldLabel>
      <div className="relative">
        {Icon ? (
          <Icon
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-500"
          />
        ) : null}
        <Input
          id={id}
          className={cn(inputClasses, Icon ? "pl-9" : "px-3.5", className)}
          {...props}
        />
      </div>
    </div>
  )
}

export function LabeledTextarea({
  id,
  label,
  required,
  hint,
  className,
  ...props
}: React.ComponentProps<"textarea"> & {
  label: string
  required?: boolean
  hint?: string
}) {
  return (
    <div className="space-y-1.5">
      <FieldLabel htmlFor={id} required={required} hint={hint}>
        {label}
      </FieldLabel>
      <Textarea
        id={id}
        className={cn(
          "min-h-28 rounded-xl border-white/10 bg-white/[0.04] p-4 text-white placeholder:text-white/40",
          className
        )}
        {...props}
      />
    </div>
  )
}

export function LabeledSelect({
  label,
  required,
  hint,
  placeholder,
  options,
  value,
  onValueChange,
  triggerClassName,
}: {
  label: string
  required?: boolean
  hint?: string
  placeholder?: string
  options: readonly { value: string; label: string }[]
  value: string
  onValueChange: (value: string | null) => void
  triggerClassName?: string
}) {
  return (
    <div className="space-y-1.5">
      <FieldLabel required={required} hint={hint}>
        {label}
      </FieldLabel>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          className={cn(
            "h-11 w-full border-white/10 bg-white/[0.04] px-3.5 py-0 text-white",
            triggerClassName
          )}
        >
          <SelectValue>
            {value || (
              <span className="text-white/40">{placeholder ?? "Select"}</span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
