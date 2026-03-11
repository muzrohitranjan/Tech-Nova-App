import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/ui/AppShell'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { languageFontClass, t } from '../utils/i18n'

function VoiceMemoFlow() {
  const navigate = useNavigate()
  const selectedLanguage = localStorage.getItem('app-language') || 'English'
  const [micEnabled, setMicEnabled] = useState(false)
  const [bars, setBars] = useState([10, 25, 40, 20, 15, 30, 18, 28])

  useEffect(() => {
    if (!micEnabled) {
      setBars([8, 10, 12, 9, 7, 11, 8, 10])
      return
    }

    const interval = setInterval(() => {
      setBars((current) => current.map(() => Math.max(8, Math.floor(Math.random() * 56))))
    }, 180)

    return () => clearInterval(interval)
  }, [micEnabled])

  const aiFeedback = useMemo(() => {
    if (micEnabled) {
      return {
        transcript: 'Listening... Add ingredients and steps naturally.',
        prompt: 'I will organize your recipe after you stop recording.',
      }
    }

    return {
      transcript: 'Tap the mic and say your recipe in one flow.',
      prompt: 'Tip: include ingredients, quantities, and cooking times.',
    }
  }, [micEnabled])

  return (
    <AppShell
      title={t(selectedLanguage, 'recordMemo')}
      subtitle={t(selectedLanguage, 'voiceSubtitle')}
    >
      <div className={`stack-tight ${languageFontClass[selectedLanguage] || ''}`}>
        <Card>
          <p className={`status ${micEnabled ? 'status-success' : ''}`}>
            {micEnabled ? '🎤 Recording now' : t(selectedLanguage, 'idle')}
          </p>
          <div className="voice-wave" aria-label="Live audio visualizer">
            {bars.map((height, index) => (
              <span key={`bar-${index}`} style={{ height: `${height}px` }} />
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="section-title">{t(selectedLanguage, 'aiFeedback')}</h3>
          <p className="helper-text">{aiFeedback.transcript}</p>
          <p className="status status-success">{aiFeedback.prompt}</p>
        </Card>

        <div className="button-row">
          <Button variant="secondary" onClick={() => setMicEnabled((current) => !current)}>
            {micEnabled ? 'Stop Recording' : 'Start Recording'}
          </Button>
          <Button onClick={() => navigate('/recipe')}>{t(selectedLanguage, 'openPreview')}</Button>
        </div>
      </div>
    </AppShell>
  )
}

export default VoiceMemoFlow