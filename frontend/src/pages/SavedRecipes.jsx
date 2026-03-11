import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import AppShell from '../components/ui/AppShell'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { languageFontClass, t } from '../utils/i18n'

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}


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

function SavedRecipes() {
  const [recipes, setRecipes] = useState([])
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

  const loadRecipes = useCallback(async () => {
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
      .select('id, title, description, created_by')
      .eq('created_by', userId)

    if (error) {
      setMessage(formatQueryError(error.message))
      return
    }

    setMessage('')
    setRecipes(data || [])
  }, [selectedLanguage, formatQueryError])

  useEffect(() => {
    loadRecipes()
  }, [loadRecipes])

  const handleDelete = async (id) => {
    const { error } = await supabase.from('recipes').delete().eq('id', id)

    if (error) {
      setMessage(formatQueryError(error.message))
      return
    }

    loadRecipes()
  }

  return (
    <AppShell title={t(selectedLanguage, 'savedRecipesTitle')} subtitle={t(selectedLanguage, 'savedRecipesSubtitle')}>
      <div className={`stack-tight ${languageFontClass[selectedLanguage] || ''}`}>
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>
          {t(selectedLanguage, 'backToDashboard')}
        </Button>
        {message && <p className="status status-error">{message}</p>}

        {recipes.length === 0 ? (
          <Card>
            <p className="empty-state">{t(selectedLanguage, 'noSavedRecipes')}</p>
          </Card>
        ) : (
          recipes.map((recipe) => (
            <Card key={recipe.id}>
              <h3 className="section-title">{recipe.title}</h3>
              <p className="helper-text">{(recipe.description || '').slice(0, 120)}...</p>
              <div className="button-row">
                <Button variant="secondary" onClick={() => navigate(`/recipes/${recipe.id}`)}>
                  {t(selectedLanguage, 'editRecipe')}
                </Button>
                <Button variant="secondary" onClick={() => handleDelete(recipe.id)}>
                  {t(selectedLanguage, 'deleteRecipe')}
                </Button>
              </div>
              <Button onClick={() => downloadJson(`${recipe.title || 'recipe'}.json`, recipe)}>
                {t(selectedLanguage, 'exportRecipeJson')}
              </Button>
            </Card>
          ))
        )}
      </div>
    </AppShell>
  )
}

export default SavedRecipes