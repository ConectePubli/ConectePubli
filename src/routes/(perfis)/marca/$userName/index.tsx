import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(perfis)/marca/$userName/')({
  component: () => <div>Hello /marca/$userName/!</div>,
})
