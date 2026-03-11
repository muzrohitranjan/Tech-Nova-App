import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppShell from '../components/ui/AppShell'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const demoSteps = [
  'Prep all ingredients and keep them within reach.',
  'Heat the pan on medium and add your base ingredients.',
  'Stir gently and cook until texture is consistent.',
  'Taste, adjust seasoning, and plate your dish.',
]

function CookingSession() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [stepIndex, setStepIndex] = useState(0)

  const currentStep = demoSteps[stepIndex]
  const progress = useMemo(() => ((stepIndex + 1) / demoSteps.length) * 100, [stepIndex])

  const handleNext = () => {
    if (stepIndex < demoSteps.length - 1) {
      setStepIndex(stepIndex + 1)
      return
    }
    navigate(`/complete/${id}`)
  }

  const handleRepeat = () => {
    setStepIndex(stepIndex)
  }

  return (
    <AppShell title="Cooking Session" subtitle="Follow each step at your pace.">
      <div className="stack-tight">
        <Card>
          <div className="progress-row">
            <strong>Step {stepIndex + 1} / {demoSteps.length}</strong>
            <span className="helper-text">Recipe #{id}</span>
          </div>
          <div className="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(progress)}>
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </Card>

        <Card>
          <h2 className="section-title">Current Step</h2>
          <p>{currentStep}</p>
        </Card>

        <div className="button-row">
          <Button variant="secondary" onClick={handleRepeat}>Repeat</Button>
          <Button onClick={handleNext}>{stepIndex < demoSteps.length - 1 ? 'Next' : 'Finish'}</Button>
        </div>
      </div>
    </AppShell>
  )
}

export default CookingSession