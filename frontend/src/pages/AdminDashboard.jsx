import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import AppShell from '../components/ui/AppShell'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

function openPdfPreview(recipes) {
  const rows = recipes
    .map((recipe, index) => `<li><strong>${index + 1}. ${recipe.title || 'Untitled'}</strong><br/><small>${(recipe.description || '').slice(0, 220)}</small></li>`)
    .join('')

  const html = `
    <html>
      <head><title>Recipe Book Preview</title></head>
      <body style="font-family: Inter, sans-serif; padding: 24px;">
        <h1>Indian Cooking Assistant - Recipe Book</h1>
        <p>Print this page to export PDF.</p>
        <ol>${rows}</ol>
      </body>
    </html>
  `

  const preview = window.open('', '_blank', 'width=900,height=700')
  if (preview) {
    preview.document.write(html)
    preview.document.close()
  }
}

function AdminDashboard() {
  const [recipes, setRecipes] = useState([])
  const [message, setMessage] = useState('')
  const [selected, setSelected] = useState([])
  const navigate = useNavigate()

  const loadAllRecipes = async () => {
    const { data, error } = await supabase
      .from('recipes')
      .select('id, title, description, created_by')

    if (error) {
      setMessage(`Error: ${error.message}`)
      return
    }

    setRecipes(data || [])
  }

  useEffect(() => {
    loadAllRecipes()
  }, [])

  const selectedRecipes = useMemo(
    () => selected.map((id) => recipes.find((recipe) => String(recipe.id) === String(id))).filter(Boolean),
    [selected, recipes]
  )

  const handleDelete = async (id) => {
    const { error } = await supabase.from('recipes').delete().eq('id', id)
    if (error) {
      setMessage(`Error: ${error.message}`)
      return
    }
    loadAllRecipes()
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const id = event.dataTransfer.getData('text/plain')
    if (!id) return
    setSelected((current) => (current.includes(id) ? current : [...current, id]))
  }

  return (
    <AppShell title="Admin Dashboard" subtitle="Review recipes and compile a recipe book by dragging selections.">
      <div className="stack-tight">
        {message && <p className="status status-error">{message}</p>}

        <div className="button-row">
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>Back</Button>
          <Button onClick={() => openPdfPreview(selectedRecipes.length ? selectedRecipes : recipes)}>
            PDF Preview
          </Button>
        </div>

        <Card onDragOver={(event) => event.preventDefault()} onDrop={handleDrop}>
          <h3 className="section-title">Recipe Book Compilation Tray (Drag recipes here)</h3>
          {selectedRecipes.length === 0 ? (
            <p className="empty-state">No recipes selected yet.</p>
          ) : (
            <ul className="list-clean">
              {selectedRecipes.map((recipe, index) => (
                <li key={recipe.id}>{index + 1}. {recipe.title}</li>
              ))}
            </ul>
          )}
        </Card>

        {recipes.length === 0 ? (
          <Card>
            <p className="empty-state">No recipes available for moderation.</p>
          </Card>
        ) : (
          recipes.map((recipe) => (
            <Card key={recipe.id} draggable onDragStart={(event) => event.dataTransfer.setData('text/plain', String(recipe.id))}>
              <h3 className="section-title">{recipe.title}</h3>
              <p className="helper-text">User ID: {recipe.created_by}</p>
              <div className="button-row">
                <Button variant="secondary" onClick={() => navigate(`/recipes/${recipe.id}`)}>Approve / Edit</Button>
                <Button variant="secondary" onClick={() => setSelected((current) => (current.includes(String(recipe.id)) ? current : [...current, String(recipe.id)]))}>Add to Book</Button>
                <Button onClick={() => handleDelete(recipe.id)}>Delete</Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </AppShell>
  )
}

export default AdminDashboard