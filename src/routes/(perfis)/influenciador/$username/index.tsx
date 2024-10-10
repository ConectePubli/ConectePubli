import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(perfis)/influenciador/$username/')({
  component: () => <div>Hello /influenciador/$username/!</div>,
})
