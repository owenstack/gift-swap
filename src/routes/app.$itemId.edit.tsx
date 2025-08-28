import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/$itemId/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/$itemId/edit"!</div>
}
