import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import AppShell from '../components/ui/AppShell'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import InputField from '../components/ui/InputField'

function Login() {
  const [authMode, setAuthMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(`Error: ${error.message}`)
      setLoading(false)
      return
    }

    setMessage('Login successful')
    setLoading(false)
    navigate('/language')
  }

  const handleSignup = async () => {
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage(`Error: ${error.message}`)
      setLoading(false)
      return
    }

    setMessage('Sign up successful. Check your email for confirmation if required.')
    setLoading(false)
  }

  const handleSubmit = async () => {
    if (authMode === 'signin') {
      await handleLogin()
      return
    }

    await handleSignup()
  }

  return (
    <AppShell
      title={authMode === 'signin' ? 'Welcome back' : 'Create your account'}
      subtitle={
        authMode === 'signin'
          ? 'Existing user? Sign in to continue your cooking assistant journey.'
          : 'New user? Sign up to save your recipes and continue across devices.'
      }
    >
      <div className="login-brand" aria-hidden="true">
        <div className="login-brand-mark">🍲</div>
        <div className="login-brand-text">
          <p className="login-brand-name">Tech Nova Kitchen</p>
          <p className="login-brand-tagline">Cook smarter, preserve culture.</p>
        </div>
      </div>
      <Card>
        <div className="stack-tight">
          <div className="auth-mode-toggle" role="tablist" aria-label="Authentication options">
            <button
              type="button"
              className={`auth-mode-tab ${authMode === 'signin' ? 'auth-mode-tab-active' : ''}`}
              onClick={() => {
                setAuthMode('signin')
                setMessage('')
              }}
              disabled={loading}
            >
              Existing user
            </button>
            <button
              type="button"
              className={`auth-mode-tab ${authMode === 'signup' ? 'auth-mode-tab-active' : ''}`}
              onClick={() => {
                setAuthMode('signup')
                setMessage('')
              }}
              disabled={loading}
            >
              New user
            </button>
          </div>
          <InputField
            id="email"
            type="email"
            label="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
          <InputField
            id="password"
            type="password"
            label="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
          />
          <div className="button-row">
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Please wait...' : authMode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setAuthMode(authMode === 'signin' ? 'signup' : 'signin')
                setMessage('')
              }}
              disabled={loading}
            >
              {authMode === 'signin' ? 'I am new here' : 'I already have an account'}
            </Button>
          </div>
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

export default Login
