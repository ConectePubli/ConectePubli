import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/cadastro/marca')({
  component: () => <div>Hello /cadastro/marca!</div>,
})
