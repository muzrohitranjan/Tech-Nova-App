import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import AppShell from '../components/ui/AppShell'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import InputField from '../components/ui/InputField'
import TextAreaField from '../components/ui/TextAreaField'
import { languageFontClass, t } from '../utils/i18n'

function parseIngredientLine(line) {
  const trimmed = line.trim()
  if (!trimmed) return null
  const hasQuantity = /^\d/.test(trimmed)
  return { value: trimmed, valid: hasQuantity }
}

function Recipe() {
  const [title, setTitle] = useState('')
  const [ingredients, setIngredients] = useState('2 cups rice\n1 onion')
  const [steps, setSteps] = useState('Wash rice\nCook for 15 minutes')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [images, setImages] = useState([])
  const navigate = useNavigate()
  const selectedLanguage = localStorage.getItem('app-language') || 'English'

  const parsedIngredients = useMemo(
    () => ingredients.split('\n').map(parseIngredientLine).filter(Boolean),
    [ingredients]
  )

  const validationIssues = parsedIngredients.filter((item) => !item.valid)

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files || [])
    const next = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }))
    setImages((current) => [...current, ...next])
  }

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

    const imageBlock = images.length
      ? `\n\nImages:\n${images.map((image) => image.url).join('\n')}`
      : ''

    const description = `Ingredients:\n${ingredients.trim() || 'N/A'}\n\nSteps:\n${steps.trim() || 'N/A'}${imageBlock}`

    const { error: insertError } = await supabase.from('recipes').insert([
      {
        title,
        description,
        created_by: userId,
      },
    ])

    if (insertError) {
      setMessage('Could not sync recipe right now. Please retry in a few seconds.')
      setLoading(false)
      return
    }

    setMessage('Recipe saved successfully.')
    setLoading(false)
    setTitle('')
    setIngredients('')
    setSteps('')
    setImages([])
  }

  return (
    <AppShell
      title={t(selectedLanguage, 'recipeCreation')}
      subtitle={t(selectedLanguage, 'recipeSubtitle')}
      actions={<Button variant="secondary" onClick={() => navigate('/dashboard')}>Back</Button>}
    >
      <Card>
        <div className={`stack-tight ${languageFontClass[selectedLanguage] || ''}`}>
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
          {!!validationIssues.length && (
            <div className="validation-alert">
              <strong>Validation alert:</strong> add quantity at line start (e.g., "2 tsp salt") for highlighted ingredients.
            </div>
          )}
          <div className="chip-list">
            {parsedIngredients.map((item, index) => (
              <button
                key={`ingredient-${index}`}
                type="button"
                className={`editable-chip ${item.valid ? '' : 'editable-chip-invalid'}`}
                onClick={() => {
                  const lines = ingredients.split('\n')
                  lines[index] = `1 ${lines[index]}`
                  setIngredients(lines.join('\n'))
                }}
              >
                {item.value}
              </button>
            ))}
          </div>
          <TextAreaField
            id="recipe-steps"
            label="Steps"
            value={steps}
            onChange={(event) => setSteps(event.target.value)}
            rows={6}
            placeholder="Number your steps or separate by new lines"
          />

          <label className="field" htmlFor="recipe-images">
            <span className="field-label">Recipe Images</span>
            <input id="recipe-images" type="file" multiple accept="image/*" onChange={handleImageUpload} />
          </label>
          <div className="image-gallery">
            {images.map((image, index) => (
              <img key={`${image.name}-${index}`} src={image.url} alt={image.name} className="image-thumb" />
            ))}
          </div>

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