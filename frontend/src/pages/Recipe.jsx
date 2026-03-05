import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import AppShell from '../components/ui/AppShell'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import InputField from '../components/ui/InputField'
import TextAreaField from '../components/ui/TextAreaField'

function Recipe() {
  const [title, setTitle] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [steps, setSteps] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleSaveRecipe = async () => {
    setLoading(true)
    setMessage('')

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      setMessage(`Error: ${sessionError.message}`)
      setLoading(false)
      return
    }

    const userId = sessionData?.session?.user?.id

    if (!userId) {
      setMessage('Error: No authenticated user found.')
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase.from('recipes').insert([
      {
        title,
        ingredients,
        steps,
        user_id: userId,
      },
    ])

    if (insertError) {
      setMessage(`Error: ${insertError.message}`)
      setLoading(false)
      return
    }

    setMessage('Recipe saved successfully.')
    setLoading(false)
    setTitle('')
    setIngredients('')
    setSteps('')
  }

  return (
    <AppShell
      title="Recipe Creation"
      subtitle="Write ingredients and steps clearly so voice guidance can follow your structure."
      actions={<Button variant="secondary" onClick={() => navigate('/dashboard')}>Back</Button>}
    >
      <Card>
        <div className="stack-tight">
          <InputField
            id="recipe-title"
            type="text"
            label="Recipe Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Creamy Mushroom Pasta"
          />
          <TextAreaField
            id="recipe-ingredients"
            label="Ingredients"
            value={ingredients}
            onChange={(event) => setIngredients(event.target.value)}
            rows={5}
            placeholder="One ingredient per line for better readability"
          />
          <TextAreaField
            id="recipe-steps"
            label="Steps"
            value={steps}
            onChange={(event) => setSteps(event.target.value)}
            rows={6}
            placeholder="Number your steps or separate by new lines"
          />
          <Button onClick={handleSaveRecipe} disabled={loading}>
            {loading ? 'Saving...' : 'Save Recipe'}
          </Button>
          {message && (
            <p className={`status ${message.startsWith('Error:') ? 'status-error' : 'status-success'}`}>
              {message}
            </p>
          )}
        </div>
      </Card>
    </AppShell>
  )
}

export default Recipe