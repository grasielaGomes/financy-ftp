import type { ElementType } from 'react'
import {
  BaggageClaim,
  BookOpen,
  BriefcaseBusiness,
  CarFront,
  Dumbbell,
  ReceiptText,
  Gift,
  HeartPulse,
  Home,
  Mailbox,
  PawPrint,
  PiggyBank,
  ShoppingCart,
  Ticket,
  ToolCase,
  Utensils,
  Tag,
} from 'lucide-react'
import {
  CATEGORY_COLOR_KEYS,
  CATEGORY_ICON_KEYS,
  type CategoryColorKey,
  type CategoryIconKey,
} from '@financy/contracts'

const iconLabels: Record<CategoryIconKey, string> = {
  briefcase: 'Maleta',
  car: 'Carro',
  heart: 'Saúde',
  'piggy-bank': 'Cofrinho',
  'shopping-cart': 'Carrinho',
  ticket: 'Ticket',
  'tool-case': 'Ferramentas',
  utensils: 'Talheres',
  pet: 'Pet',
  home: 'Casa',
  gift: 'Presente',
  dumbbell: 'Academia',
  'book-open': 'Livro',
  'baggage-claim': 'Bagagem',
  mailbox: 'Caixa postal',
  'file-text': 'Documento',
}

export const categoryIconMap: Record<CategoryIconKey, ElementType> = {
  briefcase: BriefcaseBusiness,
  car: CarFront,
  heart: HeartPulse,
  'piggy-bank': PiggyBank,
  'shopping-cart': ShoppingCart,
  ticket: Ticket,
  'tool-case': ToolCase,
  utensils: Utensils,
  pet: PawPrint,
  home: Home,
  gift: Gift,
  dumbbell: Dumbbell,
  'book-open': BookOpen,
  'baggage-claim': BaggageClaim,
  mailbox: Mailbox,
  'file-text': ReceiptText,
}

export const categoryIconOptions = CATEGORY_ICON_KEYS.map((key) => ({
  key,
  label: iconLabels[key],
  icon: categoryIconMap[key],
}))

const colorLabels: Record<CategoryColorKey, string> = {
  blue: 'Azul',
  purple: 'Roxo',
  pink: 'Rosa',
  red: 'Vermelho',
  orange: 'Laranja',
  yellow: 'Amarelo',
  green: 'Verde',
}

export const categoryColorChipClasses: Record<CategoryColorKey, string> = {
  blue: 'bg-blue-base',
  purple: 'bg-purple-base',
  pink: 'bg-pink-base',
  red: 'bg-red-base',
  orange: 'bg-orange-base',
  yellow: 'bg-yellow-base',
  green: 'bg-green-base',
}

export const categoryColorBadgeClasses: Record<CategoryColorKey, string> = {
  green: 'bg-green-100 text-green-base',
  blue: 'bg-blue-100 text-blue-base',
  purple: 'bg-purple-100 text-purple-base',
  pink: 'bg-pink-100 text-pink-base',
  red: 'bg-red-100 text-red-base',
  orange: 'bg-orange-100 text-orange-base',
  yellow: 'bg-yellow-100 text-yellow-700',
}

export const categoryIconTextClasses: Record<CategoryColorKey, string> = {
  blue: 'text-blue-base',
  purple: 'text-purple-base',
  pink: 'text-pink-base',
  red: 'text-red-base',
  orange: 'text-orange-base',
  yellow: 'text-yellow-base',
  green: 'text-green-base',
}

export const categoryColorOptions = CATEGORY_COLOR_KEYS.map((key) => ({
  key,
  label: colorLabels[key],
  className: categoryColorChipClasses[key],
}))

export const DEFAULT_ICON_KEY: CategoryIconKey = 'briefcase'
export const DEFAULT_COLOR_KEY: CategoryColorKey = 'green'

export const isCategoryIconKey = (key: unknown): key is CategoryIconKey => {
  return typeof key === 'string' && key in categoryIconMap
}

export const isCategoryColorKey = (key: unknown): key is CategoryColorKey => {
  return typeof key === 'string' && key in categoryColorBadgeClasses
}

export const getSafeIconKey = (key: unknown): CategoryIconKey => {
  if (isCategoryIconKey(key)) return key
  return DEFAULT_ICON_KEY
}

export const getSafeColorKey = (key: unknown): CategoryColorKey => {
  if (isCategoryColorKey(key)) return key
  return DEFAULT_COLOR_KEY
}

export const MostUsedFallbackIcon = Tag

export type { CategoryColorKey, CategoryIconKey }
