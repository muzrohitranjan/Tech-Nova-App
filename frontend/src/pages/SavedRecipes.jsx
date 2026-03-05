import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient"

function SavedRecipes() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const navigate = useNavigate()

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true)
      setError("")

      const { data } = await supabase.auth.getSession()
      const user = data?.session?.user

      if (!user) {
        setError("Session expired. Please login again.")

        setTimeout(() => {
          navigate("/")
        }, 1500)

        setLoading(false)
        return
      }

      const { data: recipeData, error: recipeError } = await supabase
        .from("recipes")
.select("*")

      if (recipeError) {
        setError(recipeError.message)
        setLoading(false)
        return
      }

      setRecipes(recipeData || [])
      setLoading(false)
    }

    fetchRecipes()
  }, [navigate])

  if (loading) return <p>Loading saved recipes...</p>

  if (error) return <p>{error}</p>

  return (
    <main className="container">
      <button onClick={() => navigate(-1)}>← Back</button>

      <h1>Saved Recipes</h1>

      {recipes.length === 0 ? (
        <p>No saved recipes yet.</p>
      ) : (
        recipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => navigate(`/recipes/${recipe.id}`)}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "12px",
              marginBottom: "10px",
              cursor: "pointer",
            }}
          >
            <h3>{recipe.title}</h3>
          </div>
        ))
      )}
    </main>
  )
}

export default SavedRecipes