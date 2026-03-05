import { useNavigate } from 'react-router-dom'
import AppShell from '../components/ui/AppShell'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import RecipeCard from '../components/ui/RecipeCard'

function RecipeList({ recipes = [] }) {
  const navigate = useNavigate()

  return (
    <AppShell title="Your Recipes" subtitle="Browse and reopen your saved cooking ideas.">
      <div className="stack-tight">
        <Button onClick={() => navigate('/recipe')}>Create New Recipe</Button>

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