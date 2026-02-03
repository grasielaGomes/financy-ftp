import { useEffect, useState } from 'react'

type DebouncedValueConfig = {
  value: string
  delay: number
  onChange: (value: string) => void
}

export const useDebouncedValue = ({
  value,
  delay,
  onChange,
}: DebouncedValueConfig) => {
  const [draft, setDraft] = useState(value)

  useEffect(() => {
    setDraft(value)
  }, [value])

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (draft !== value) onChange(draft)
    }, delay)

    return () => window.clearTimeout(id)
  }, [draft, value, onChange, delay])

  return [draft, setDraft] as const
}
