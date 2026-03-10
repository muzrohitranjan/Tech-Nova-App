import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import AppShell from '../components/ui/AppShell'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { languageFontClass, t } from '../utils/i18n'


function resolveSelectedLanguage() {
  const value = String(localStorage.getItem('app-language') || '').trim()
  const normalized = value.toLowerCase()

  if (normalized === 'kannada' || value === 'ಕನ್ನಡ') return 'Kannada'
  if (normalized === 'hindi' || value === 'हिन्दी') return 'Hindi'
  if (normalized === 'tamil' || value === 'தமிழ்') return 'Tamil'
  if (normalized === 'telugu' || value === 'తెలుగు') return 'Telugu'
  if (normalized === 'malayalam' || value === 'മലയാളം') return 'Malayalam'
  if (normalized === 'marathi' || value === 'मराठी') return 'Marathi'
  if (normalized === 'gujarati' || value === 'ગુજરાતી') return 'Gujarati'
  if (normalized === 'bengali' || value === 'বাংলা') return 'Bengali'
  if (normalized === 'punjabi' || value === 'ਪੰਜਾਬੀ') return 'Punjabi'

  return 'English'
}

function GuidedCookingStart() {
  const [recipes, setRecipes] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const selectedLanguage = resolveSelectedLanguage()

  const formatQueryError = useCallback((errorMessage) => {
    if (
      errorMessage?.includes('recipes.user_id')
      || errorMessage?.includes('recipes.ingredients')
    ) {
      return t(selectedLanguage, 'recipesSchemaMismatch')
    }

    return `Error: ${errorMessage}`
  }, [selectedLanguage])

  useEffect(() => {
    const loadRecipes = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        setMessage(`Error: ${sessionError.message}`)
        return
      }

      const userId = sessionData?.session?.user?.id
      if (!userId) {
        setMessage(t(selectedLanguage, 'noAuthUser'))
        return
      }

      const { data, error } = await supabase
        .from('recipes')
        .select('id, title')
        .eq('created_by', userId)

      if (error) {
        setMessage(formatQueryError(error.message))
        return
      }

      setMessage('')
      setRecipes(data || [])
      if (data?.length) setSelectedId(String(data[0].id))
    }

    loadRecipes()
  }, [selectedLanguage, formatQueryError])

  return (
    <AppShell title={t(selectedLanguage, 'guidedCookingTitle')} subtitle={t(selectedLanguage, 'guidedCookingSubtitle')}>
      <div className={`stack-tight ${languageFontClass[selectedLanguage] || ''}`}>
        {message && <p className="status status-error">{message}</p>}

        <Card>
          {recipes.length === 0 ? (
            <p className="empty-state">{t(selectedLanguage, 'noSavedRecipes')}</p>
          ) : (
            <div className="stack-tight">
              <label className="field" htmlFor="guided-recipe-select">
                <span className="field-label">{t(selectedLanguage, 'selectRecipeLabel')}</span>
                <select
                  id="guided-recipe-select"
                  className="field-input"
                  value={selectedId}
                  onChange={(event) => setSelectedId(event.target.value)}
                >
                  {recipes.map((recipe) => (
                    <option key={recipe.id} value={recipe.id}>
                      {recipe.title}
                    </option>
                  ))}
                </select>
              </label>

              <Button onClick={() => navigate(`/cook/${selectedId}`)} disabled={!selectedId}>
                {t(selectedLanguage, 'startGuidedCooking')}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  )
}

export default GuidedCookingStart