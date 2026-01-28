import type { CategoryColorKey, CategoryIconKey } from './categoryOptions'

export type SeedCategory = {
  id: string
  name: string
  description: string
  icon: CategoryIconKey
  color: CategoryColorKey
}

export const seedCategories: readonly SeedCategory[] = [
  {
    id: 'alimentacao',
    name: 'Alimentação',
    icon: 'utensils',
    color: 'blue',
    description: 'Restaurantes, delivery e refeições',
  },
  {
    id: 'entretenimento',
    name: 'Entretenimento',
    icon: 'ticket',
    color: 'pink',
    description: 'Cinema, jogos e lazer',
  },
  {
    id: 'investimento',
    name: 'Investimento',
    icon: 'piggy-bank',
    color: 'green',
    description: 'Aplicações e retornos financeiros',
  },
  {
    id: 'mercado',
    name: 'Mercado',
    icon: 'shopping-cart',
    color: 'orange',
    description: 'Compras de supermercado e mantimentos',
  },
  {
    id: 'salario',
    name: 'Salário',
    icon: 'briefcase',
    color: 'green',
    description: 'Renda mensal e bonificações',
  },
  {
    id: 'saude',
    name: 'Saúde',
    icon: 'heart',
    color: 'red',
    description: 'Medicamentos, consultas e exames',
  },
  {
    id: 'transporte',
    name: 'Transporte',
    icon: 'car',
    color: 'purple',
    description: 'Gasolina, transporte público e viagens',
  },
  {
    id: 'utilidades',
    name: 'Utilidades',
    icon: 'tool-case',
    color: 'yellow',
    description: 'Energia, água, internet e telefone',
  },
] as const
