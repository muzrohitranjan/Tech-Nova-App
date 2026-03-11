import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import AppShell from '../components/ui/AppShell'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import SearchBar from '../components/ui/SearchBar'
import RecipeCard from '../components/ui/RecipeCard'
import { languageFontClass, t } from '../utils/i18n'

const greetingByLanguage = {
  English: ['Hello', 'Welcome', 'Hi there'],
  Kannada: ['ನಮಸ್ಕಾರ', 'ಸ್ವಾಗತ', 'ನಮಸ್ತೆ'],
  Hindi: ['नमस्ते', 'स्वागत है', 'नमस्कार'],
  Tamil: ['வணக்கம்', 'நல்வரவு', 'அன்புடன் வரவேற்கிறோம்'],
  Telugu: ['నమస్కారం', 'స్వాగతం', 'నమస్తే'],
  Malayalam: ['നമസ്കാരം', 'സ്വാഗതം', 'സന്തോഷം'],
  Marathi: ['नमस्कार', 'स्वागत आहे', 'नमस्ते'],
  Gujarati: ['નમસ્તે', 'સ્વાગત છે', 'નમસ્કાર'],
  Bengali: ['নমস্কার', 'স্বাগতম', 'নমস্তে'],
  Punjabi: ['ਸਤ ਸ੍ਰੀ ਅਕਾਲ', 'ਜੀ ਆਇਆਂ ਨੂੰ', 'ਨਮਸਕਾਰ'],
}

function Dashboard() {
  const [email, setEmail] = useState('')
  const [recipes, setRecipes] = useState([])
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [greetingIndex, setGreetingIndex] = useState(0)
  const [selectedLanguage, setSelectedLanguage] = useState('English')
  const [isAdmin, setIsAdmin] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true)

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        setMessage(`Error: ${sessionError.message}`)
        setLoading(false)
        return
      }

      const user = sessionData?.session?.user
      if (!user) {
        setMessage('No authenticated user found.')
        setLoading(false)
        return
      }

      setEmail(user.email || '')
      setIsAdmin(user.app_metadata?.role === 'admin')

      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('id, title, description')
        .eq('created_by', user.id)

      if (recipesError) {
        setMessage(`Error: ${recipesError.message}`)
        setLoading(false)
        return
      }

      setRecipes(recipesData || [])
      const storedLanguage = localStorage.getItem('app-language') || 'English'
      setSelectedLanguage(storedLanguage)
      setLoading(false)
    }

    loadDashboardData()
  }, [])

  const selectedGreetings = greetingByLanguage[selectedLanguage] || greetingByLanguage.English

  useEffect(() => {
    const interval = setInterval(() => {
      setGreetingIndex((currentIndex) => (currentIndex + 1) % selectedGreetings.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [selectedGreetings.length])

  const filteredRecipes = useMemo(() => {
    if (!search.trim()) return recipes
    const query = search.toLowerCase()
    return recipes.filter((recipe) => {
      const title = recipe.title?.toLowerCase() || ''
      const description = recipe.description?.toLowerCase() || ''
      return title.includes(query) || description.includes(query)
    })
  }, [recipes, search])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const displayName = email?.split('@')[0] || 'chef'

  return (
    <AppShell
      title={t(selectedLanguage, 'dashboardTitle')}
      subtitle={t(selectedLanguage, 'dashboardSubtitle')}
      actions={<Button variant="secondary" onClick={handleLogout}>{t(selectedLanguage, 'logout')}</Button>}
    >
      <div className={`stack ${languageFontClass[selectedLanguage] || ""}`}>
        <Card className="greeting-card">
          <div className="greeting-hero">
            <p key={greetingIndex} className="greeting-line">{selectedGreetings[greetingIndex]}, {displayName} 👋</p>
            <h2 className="section-title greeting-title">{t(selectedLanguage, 'welcomeKitchen')}</h2>
            <p className="greeting-subtext">{t(selectedLanguage, 'followFlow')}</p>
          </div>
        </Card>

        <section className="action-grid">
          <Card className="action-card card-interactive" onClick={() => navigate('/voice-memo')}>
            <div>
              <strong>{t(selectedLanguage, 'recordMemo')}</strong>
              <p>{t(selectedLanguage, 'recordDesc')}</p>
            </div>
            <span aria-hidden="true">🎤</span>
          </Card>

          <Card className="action-card card-interactive" onClick={() => navigate('/guided-cooking')}>
            <div>
              <strong>{t(selectedLanguage, 'startGuided')}</strong>
              <p>{t(selectedLanguage, 'startGuidedDesc')}</p>
            </div>
            <span aria-hidden="true">🍳</span>
          </Card>

          <Card className="action-card card-interactive" onClick={() => navigate('/saved')}>
            <div>
              <strong>{t(selectedLanguage, 'viewSaved')}</strong>
              <p>{t(selectedLanguage, 'viewSavedDesc')}</p>
            </div>
            <span aria-hidden="true">📚</span>
          </Card>

          {isAdmin && (
            <Card className="action-card card-interactive" onClick={() => navigate('/admin')}>
              <div>
                <strong>{t(selectedLanguage, 'adminDashboard')}</strong>
                <p>{t(selectedLanguage, 'adminDesc')}</p>
              </div>
              <span aria-hidden="true">🛠️</span>
            </Card>
          )}
        </section>

        <SearchBar
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t(selectedLanguage, 'searchRecipes')}
        />

        {message && (
          <p className={`status ${message.startsWith('Error:') ? 'status-error' : 'status-success'}`}>
            {message}
          </p>
        )}

        <section className="stack-tight">
          <h2 className="section-title">{t(selectedLanguage, 'recentRecipes')}</h2>
          {loading ? (
            <Card>
              <p className="helper-text">{t(selectedLanguage, 'loadingRecipes')}</p>
            </Card>
          ) : filteredRecipes.length === 0 ? (
            <Card>
              <p className="empty-state">{t(selectedLanguage, 'noRecipes')}</p>
            </Card>
          ) : (
            filteredRecipes.map((recipe, index) => (
              <RecipeCard
                key={recipe.id || `${recipe.title}-${index}`}
                title={recipe.title}
                ingredients={recipe.description}
                onClick={() => navigate(recipe.id ? `/recipes/${recipe.id}` : '/recipe')}
              />
            ))
          )}
        </section>
      </div>
    </AppShell>
  )
}

export default Dashboard