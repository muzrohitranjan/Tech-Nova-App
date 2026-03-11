import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/ui/AppShell'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { languageFontClass, t } from '../utils/i18n'

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
    <AppShell
      title={t(selectedLanguage, 'languageTitle')}
      subtitle={t(selectedLanguage, 'languageSubtitle')}
    >
      <div className={`stack-tight ${languageFontClass[selectedLanguage] || ''}`}>
        {languageOptions.map((language) => (
          <Card
            key={language.label}
            className={`language-card card-interactive ${selectedLanguage === language.label ? 'language-card-selected' : ''}`}
            onClick={() => setSelectedLanguage(language.label)}
          >
            <div className="language-row">
              <span>{language.label}</span>
              <span className="language-native">{language.native}</span>
            </div>
          </Card>
        ))}

        <Button onClick={handleContinue}>{t(selectedLanguage, 'continue')}</Button>
      </div>
    </AppShell>
  )
}

export default LanguageSelect