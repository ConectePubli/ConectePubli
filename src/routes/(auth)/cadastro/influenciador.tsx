import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/cadastro/influenciador')({
  component: () => <div>Hello /cadastro/influenciador!</div>,
})
