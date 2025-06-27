import { ProtectedRoute } from "@/components/ProtectedRoute"
import { useAuth } from "@/contexts/AuthContext"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}

function DashboardContent() {
  const { user } = useAuth()

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.email}
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold">Upload CSV</h3>
            <p className="text-muted-foreground text-sm">
              Upload your leads CSV to get started
            </p>
          </div>
          
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold">Draft Emails</h3>
            <p className="text-muted-foreground text-sm">
              Review and edit generated email drafts
            </p>
          </div>
          
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold">Analytics</h3>
            <p className="text-muted-foreground text-sm">
              View your email campaign performance
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 