import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/ui/AppShell'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const languageOptions = [
  { label: 'English', native: 'English' },
  { label: 'Kannada', native: 'ಕನ್ನಡ' },
  { label: 'Hindi', native: 'हिन्दी' },
  { label: 'Tamil', native: 'தமிழ்' },
  { label: 'Telugu', native: 'తెలుగు' },
  { label: 'Malayalam', native: 'മലയാളം' },
  { label: 'Marathi', native: 'मराठी' },
  { label: 'Gujarati', native: 'ગુજરાતી' },
  { label: 'Bengali', native: 'বাংলা' },
  { label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
]

function LanguageSelect() {
  const [selectedLanguage, setSelectedLanguage] = useState('English')
  const navigate = useNavigate()

  const handleContinue = () => {
    localStorage.setItem('app-language', selectedLanguage)
    navigate('/dashboard')
  }

  return (
    <AppShell title="Choose Your Language" subtitle="Pick your preferred language for cooking guidance.">
      <div className="stack-tight">
        {languageOptions.map((language) => (
          <Card
            key={language.label}
            className={`language-card card-interactive ${selectedLanguage === language.label ? 'language-card-selected' : ''}`}
            onClick={() => setSelectedLanguage(language.label)}
          >
            <p className="language-label">{language.label}</p>
            <p className="language-native">{language.native}</p>
          </Card>
        ))}

        <Button onClick={handleContinue}>Continue</Button>
      </div>
    </AppShell>
  )
}

export default LanguageSelect
