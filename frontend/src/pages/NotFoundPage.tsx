import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export const NotFoundPage = () => {
  return (
    <main className="page">
      <h1>Página não encontrada</h1>
      <p>A rota solicitada não existe.</p>
      <Button asChild>
        <Link to="/">Voltar para o início</Link>
      </Button>
    </main>
  )
}
