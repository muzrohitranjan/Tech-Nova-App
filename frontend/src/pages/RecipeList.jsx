import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import AppShell from '../components/ui/AppShell'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import RecipeCard from '../components/ui/RecipeCard'

function RecipeList() {
  const [recipes, setRecipes] = useState([])
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const loadRecipes = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        setMessage(`Error: ${sessionError.message}`)
        return
      }

      const userId = sessionData?.session?.user?.id
      if (!userId) {
        setMessage('No authenticated user found.')
        return
      }

      const { data, error } = await supabase
        .from('recipes')
        .select('id, title, ingredients')
        .eq('user_id', userId)

      if (error) {
        setMessage(`Error: ${error.message}`)
        return
      }

      setRecipes(data || [])
    }

    loadRecipes()
  }, [])

  return (
    <AppShell title="Recipe Library" subtitle="Select a recipe to view details, edit, or start guided cooking.">
      <div className="stack-tight">
        <Button onClick={() => navigate('/recipe')}>Create New Recipe</Button>
        {message && <p className="status status-error">{message}</p>}

        {recipes.length === 0 ? (
          <Card>
            <p className="empty-state">No saved recipes yet. Start by creating your first one.</p>
          </Card>
        ) : (
          recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              title={recipe.title}
              ingredients={recipe.ingredients}
              onClick={() => navigate(`/recipes/${recipe.id}`)}
            />
          ))
        )}
      </div>
    </AppShell>
  )
}

export default RecipeList