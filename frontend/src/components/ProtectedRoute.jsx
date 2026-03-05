import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

import { supabase } from '../supabaseClient'
import AppShell from './ui/AppShell'
import Card from './ui/Card'

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      setLoading(false)
    }

    checkSession()
  }, [])

  if (loading) {
    return (
      <AppShell title="Loading">
        <Card>
          <p className="helper-text">Loading...</p>
        </Card>
      </AppShell>
    )
  }

  if (!session) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
