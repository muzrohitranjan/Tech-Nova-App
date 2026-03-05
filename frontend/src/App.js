import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Recipe from "./pages/Recipe";
import RecipeList from "./pages/RecipeList";
import RecipeDetail from "./pages/RecipeDetail";
import CookingSession from "./pages/CookingSession";
import Completion from "./pages/Completion";
import SavedRecipes from "./pages/SavedRecipes";
import LanguageSelect from "./pages/LanguageSelect";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/language"
          element={
            <ProtectedRoute>
              <LanguageSelect />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recipe"
          element={
            <ProtectedRoute>
              <Recipe />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recipes"
          element={
            <ProtectedRoute>
              <RecipeList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recipes/:id"
          element={
            <ProtectedRoute>
              <RecipeDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cook/:id"
          element={
            <ProtectedRoute>
              <CookingSession />
            </ProtectedRoute>
          }
        />
       
        <Route
  path="/completion"
  element={
    <ProtectedRoute>
      <Completion />
    </ProtectedRoute>
  }
/>
<Route
  path="/saved"
  element={
    <ProtectedRoute>
      <SavedRecipes />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;