import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import AppShell from '../components/ui/AppShell'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

function toLines(value) {
  return (value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function RecipeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true)
      setError('')

      const { data, error: fetchError } = await supabase
        .from('recipes')
        .select('id, title, ingredients, steps')
        .eq('id', id)
        .single()

      if (fetchError) {
        setError(fetchError.message)
        setRecipe(null)
        setLoading(false)
        return
      }

      setRecipe(data)
      setLoading(false)
    }

    fetchRecipe()
  }, [id])

  const ingredientsList = useMemo(() => toLines(recipe?.ingredients), [recipe])
  const stepList = useMemo(() => toLines(recipe?.steps), [recipe])

  if (loading) {
    return (
      <AppShell title="Recipe detail">
        <Card><p className="helper-text">Loading recipe...</p></Card>
      </AppShell>
    )
  }

  if (error) {
    return (
      <AppShell title="Recipe detail">
        <Card><p className="status status-error">Error: {error}</p></Card>
      </AppShell>
    )
  }

  if (!recipe) {
    return (
      <AppShell title="Recipe detail">
        <Card><p className="empty-state">Recipe not found.</p></Card>
      </AppShell>
    )
  }

  return (
    <AppShell title={recipe.title} subtitle="Review ingredients and follow each step confidently.">
      <div className="stack-tight">
        <Card>
          <h2 className="section-title">Ingredients</h2>
          {ingredientsList.length ? (
            <ul className="list-clean">
              {ingredientsList.map((ingredient, index) => (
                <li key={`ingredient-${index}`}>{ingredient}</li>
              ))}
            </ul>
          ) : (
            <p className="helper-text">No ingredients listed.</p>
          )}
        </Card>

        <Card>
          <h2 className="section-title">Steps</h2>
          {stepList.length ? (
            <ol className="list-clean">
              {stepList.map((step, index) => (
                <li key={`step-${index}`}>{step}</li>
              ))}
            </ol>
          ) : (
            <p className="helper-text">No steps listed.</p>
          )}
        </Card>

        <Button onClick={() => navigate(`/cook/${id}`)}>Start Cooking</Button>
      </div>
    </AppShell>
  )
}

export default RecipeDetail