import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './pages/AdminDashboard'
import CompletionScreen from './pages/CompletionScreen'
import CookingSession from './pages/CookingSession'
import Dashboard from './pages/Dashboard'
import GuidedCookingStart from './pages/GuidedCookingStart'
import LanguageSelect from './pages/LanguageSelect'
import Login from './pages/Login'
import Recipe from './pages/Recipe'
import RecipeDetail from './pages/RecipeDetail'
import RecipeList from './pages/RecipeList'
import SavedRecipes from './pages/SavedRecipes'
import VoiceMemoFlow from './pages/VoiceMemoFlow'
import './App.css'

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
          path="/voice-memo"
          element={
            <ProtectedRoute>
              <VoiceMemoFlow />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guided-cooking"
          element={
            <ProtectedRoute>
              <GuidedCookingStart />
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
          path="/complete/:id"
          element={
            <ProtectedRoute>
              <CompletionScreen />
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
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App