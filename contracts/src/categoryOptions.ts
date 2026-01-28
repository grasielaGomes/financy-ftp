export const CATEGORY_ICON_KEYS = [
  'briefcase',
  'car',
  'heart',
  'piggy-bank',
  'shopping-cart',
  'ticket',
  'tool-case',
  'utensils',
  'pet',
  'home',
  'gift',
  'dumbbell',
  'book-open',
  'baggage-claim',
  'mailbox',
  'file-text',
] as const

export type CategoryIconKey = (typeof CATEGORY_ICON_KEYS)[number]

export const CATEGORY_COLOR_KEYS = [
  'blue',
  'purple',
  'pink',
  'red',
  'orange',
  'yellow',
  'green',
] as const

export type CategoryColorKey = (typeof CATEGORY_COLOR_KEYS)[number]
