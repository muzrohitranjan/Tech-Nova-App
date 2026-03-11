import { useNavigate, useParams } from 'react-router-dom'
import AppShell from '../components/ui/AppShell'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

function CompletionScreen() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <AppShell title="Great job!" subtitle="You completed your cooking session.">
      <div className="stack">
        <Card>
          <p className="status status-success">Recipe #{id} is done.</p>
          <p className="helper-text">Session saved. Continue to dashboard or open saved recipes.</p>
        </Card>
        <div className="button-row">
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
          <Button variant="secondary" onClick={() => navigate('/saved')}>Download Complete</Button>
        </div>
      </div>
    </AppShell>
  )
}

export default CompletionScreen