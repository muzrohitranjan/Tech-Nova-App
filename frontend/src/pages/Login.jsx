import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import AppShell from '../components/ui/AppShell'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import InputField from '../components/ui/InputField'

function Login() {
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

  return (
    <AppShell title="Welcome back" subtitle="Sign in to continue your cooking assistant journey.">
      <Card>
        <div className="stack-tight">
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
            <Button onClick={handleLogin} disabled={loading}>
              {loading ? 'Please wait...' : 'Login'}
            </Button>
            <Button variant="secondary" onClick={handleSignup} disabled={loading}>
              Sign Up
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