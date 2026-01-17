import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/products/edit/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/products/edit/$id"!</div>
}
