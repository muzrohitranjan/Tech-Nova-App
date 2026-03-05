import Card from './Card'

function RecipeCard({ title, ingredients, onClick }) {
  const ingredientsPreview = ingredients?.trim() || 'No ingredients yet'

  return (
    <Card interactive className="recipe-card" onClick={onClick}>
      <h3>{title || 'Untitled Recipe'}</h3>
      <p>{ingredientsPreview.slice(0, 120)}{ingredientsPreview.length > 120 ? '...' : ''}</p>
    </Card>
  )
}

export default RecipeCard