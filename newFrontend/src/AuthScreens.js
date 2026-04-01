import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Button, Typography, Spin, message } from 'antd'; 
import { 
  MailOutlined, LockOutlined, UserOutlined, 
  LeftOutlined, CheckCircleFilled, CheckCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Link } = Typography;

// --- High-Fidelity Styles ---
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: '#FCF4F1', 
  padding: '24px',
  textAlign: 'center'
};

const splashStyle = {
  background: 'linear-gradient(180deg, #FF7E27 0%, #F83A3A 50%, #ED0B80 100%)',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  color: 'white'
};

const cardStyle = {
  width: '100%',
  maxWidth: '380px',
  borderRadius: '24px', 
  border: 'none', 
  boxShadow: '0 8px 24px rgba(0,0,0,0.05)', 
  textAlign: 'center',
  padding: '20px 10px' 
};

const primaryBtnStyle = {
  width: '100%', 
  height: '50px', 
  background: 'linear-gradient(90deg, #FF7E27 0%, #F83A3A 100%)', 
  color: 'white',
  borderRadius: '12px', 
  border: 'none',
  fontSize: '16px',
  fontWeight: 700, 
  marginTop: '20px',
  boxShadow: '0 4px 12px rgba(248, 58, 58, 0.25)' 
};

const iconCircleStyle = {
  width: '70px',
  height: '70px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 24px auto',
};

const inputStyle = { borderRadius: '10px', padding: '10px 14px' };
const labelStyle = { fontSize: '13px', color: '#000', fontWeight: 700, display: 'block', textAlign: 'left', marginBottom: '8px' };

const ChefHatIcon = ({ size = 32, color = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path>
    <line x1="6" y1="17" x2="18" y2="17"></line>
  </svg>
);

// 1. SPLASH SCREEN
export const SplashScreen = () => {
  return (
    <div style={splashStyle}>
      <ChefHatIcon size={80} />
      <Title level={1} style={{ color: 'white', margin: '16px 0 0 0', fontWeight: 800, fontSize: '32px' }}>
        CulinaryHeritage
      </Title>
      <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
        Preserving recipes, one story at a time
      </Text>
    </div>
  );
};

// 2. LOGIN SCREEN (Updated with Identity Storage Logic)
export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const userEmail = email.toLowerCase().trim();
    
    // Admin Role Logic
    if (userEmail === 'admin@test.com' && password === 'admin') {
      // Store Admin Identity in Local Storage
      localStorage.setItem('currentUser', JSON.stringify({ 
        name: 'Admin User', 
        email: 'admin@test.com', 
        isAdmin: true 
      }));
      message.success("Welcome Admin!");
      navigate('/admin-dashboard');
    } 
    // Regular User Role Logic
    else if (userEmail === 'user@test.com' && password === 'user') {
      // Store Regular User Identity in Local Storage
      localStorage.setItem('currentUser', JSON.stringify({ 
        name: 'John Doe', 
        email: 'user@test.com', 
        isAdmin: false 
      }));
      message.success("Welcome Chef!");
      navigate('/role-verification');
    } 
    else {
      message.error("Invalid email or password. Please use admin@test.com/admin or user@test.com/user.");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={{...iconCircleStyle, background: 'linear-gradient(90deg, #FF7E27 0%, #F83A3A 100%)'}}>
        <ChefHatIcon />
      </div>
      <Title level={2} style={{ margin: 0, color: '#000', fontWeight: 800 }}>Welcome Back</Title>
      <Text style={{ color: '#555', fontSize: '15px', marginTop: '4px' }}>Sign in to continue cooking</Text>

      <Card style={{...cardStyle, marginTop: '24px', textAlign: 'left'}}>
        <div style={{ marginBottom: 16 }}>
          <Text style={labelStyle}>Email</Text>
          <Input 
            size="large" 
            prefix={<MailOutlined style={{ color: '#BFBFBF' }}/>} 
            placeholder="user@test.com" 
            style={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <Text style={labelStyle}>Password</Text>
          <Input.Password 
            size="large" 
            prefix={<LockOutlined style={{ color: '#BFBFBF' }}/>} 
            placeholder="........" 
            style={inputStyle} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div style={{ textAlign: 'right', marginBottom: 20 }}>
          <Link onClick={() => navigate('/forgot-password')} style={{ color: '#F83A3A', fontWeight: 600, fontSize: '13px' }}>Forgot Password?</Link>
        </div>
        
        <Button style={primaryBtnStyle} onClick={handleLogin}>
          Login
        </Button>
        
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: '14px' }}>
          <Text style={{ color: '#555' }}>Don't have an account? </Text>
          <Link onClick={() => navigate('/signup')} style={{ color: '#F83A3A', fontWeight: 700 }}>Sign up</Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
             <Text style={{ color: '#999', fontSize: '11px', display: 'block' }}>Admin: admin@test.com / admin</Text>
             <Text style={{ color: '#999', fontSize: '11px', display: 'block' }}>User: user@test.com / user</Text>
        </div>
      </Card>
    </div>
  );
};

// 3. SIGNUP SCREEN
export const Signup = () => {
  const navigate = useNavigate();
  return (
    <div style={containerStyle}>
      <div style={{...iconCircleStyle, background: 'linear-gradient(90deg, #FF7E27 0%, #F83A3A 100%)'}}>
        <ChefHatIcon />
      </div>
      <Title level={2} style={{ margin: 0, color: '#000', fontWeight: 800 }}>Create Account</Title>
      <Text style={{ color: '#555', fontSize: '15px', marginTop: '4px' }}>Join our cooking community</Text>

      <Card style={{...cardStyle, marginTop: '24px', textAlign: 'left'}}>
        <div style={{ marginBottom: 16 }}>
          <Text style={labelStyle}>Name</Text>
          <Input size="large" prefix={<UserOutlined style={{ color: '#BFBFBF' }}/>} placeholder="Your name" style={inputStyle} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <Text style={labelStyle}>Email</Text>
          <Input size="large" prefix={<MailOutlined style={{ color: '#BFBFBF' }}/>} placeholder="your@email.com" style={inputStyle} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <Text style={labelStyle}>Password</Text>
          <Input.Password size="large" prefix={<LockOutlined style={{ color: '#BFBFBF' }}/>} placeholder="........" style={inputStyle} />
        </div>
        
        <Button style={primaryBtnStyle} onClick={() => navigate('/email-verification')}>
          Create Account
        </Button>
        
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: '14px' }}>
          <Text style={{ color: '#555' }}>Already have an account? </Text>
          <Link onClick={() => navigate('/login')} style={{ color: '#F83A3A', fontWeight: 700 }}>Login</Link>
        </div>
      </Card>
    </div>
  );
};

// 4. EMAIL VERIFICATION
export const EmailVerification = () => {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const simulateEmailLinkClick = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerified(true);
      message.success("Email verified successfully!");
      setTimeout(() => navigate('/role-verification'), 1500);
    }, 2000);
  };

  return (
    <div style={containerStyle}>
      <Card style={cardStyle}>
        <div style={{...iconCircleStyle, background: verified ? '#E6F7F0' : '#F0F0F0'}}>
          <MailOutlined style={{ fontSize: '32px', color: verified ? '#52C41A' : '#999' }} />
        </div>
        <Title level={2} style={{ fontWeight: 800, marginBottom: '16px' }}>Verify Your Email</Title>
        <Text style={{ color: '#666', fontSize: '15px', display: 'block', marginBottom: '24px', lineHeight: '1.5' }}>
          We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
        </Text>
        
        {verified ? (
          <div style={{ backgroundColor: '#F6FFED', border: '1px solid #B7EB8F', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
            <CheckCircleOutlined style={{ color: '#52C41A' }} />
            <Text style={{ color: '#52C41A', fontWeight: 600 }}>Email verified!</Text>
          </div>
        ) : (
          <Button style={primaryBtnStyle} onClick={simulateEmailLinkClick} loading={isVerifying}>
            {isVerifying ? "Checking status..." : "I have clicked the link"}
          </Button>
        )}

        <div style={{ marginTop: '24px' }}>
          <Text style={{ color: '#666' }}>Didn't receive the email? </Text>
          <Link style={{ color: '#FF7E27', fontWeight: 700 }}>Resend</Link>
        </div>
      </Card>
    </div>
  );
};

// 5. FORGOT PASSWORD
export const ForgotPassword = () => {
  const navigate = useNavigate();
  return (
    <div style={containerStyle}>
      <div style={{ width: '100%', maxWidth: '380px', textAlign: 'left', marginBottom: '16px' }}>
        <Link onClick={() => navigate('/login')} style={{ color: '#333', fontWeight: 600 }}><LeftOutlined /> Back to Login</Link>
      </div>
      <Card style={cardStyle}>
        <div style={{...iconCircleStyle, background: '#FFF0E6'}}>
          <MailOutlined style={{ fontSize: '32px', color: '#FF7E27' }} />
        </div>
        <Title level={3} style={{ color: '#000', fontWeight: 800 }}>Forgot Password?</Title>
        <Text style={{ color: '#555', display: 'block', marginBottom: '24px' }}>
          Enter your email to receive a reset link
        </Text>
        <div style={{ textAlign: 'left', marginBottom: '24px' }}>
          <Text style={labelStyle}>Email</Text>
          <Input size="large" placeholder="your@email.com" style={inputStyle} />
        </div>
        <Button style={primaryBtnStyle} onClick={() => navigate('/reset-password')}>
          Send Reset Link
        </Button>
      </Card>
    </div>
  );
};

// 6. RESET PASSWORD
export const ResetPassword = () => {
  const navigate = useNavigate();
  return (
    <div style={containerStyle}>
      <Card style={cardStyle}>
        <div style={{...iconCircleStyle, background: '#FFF0E6'}}>
          <LockOutlined style={{ fontSize: '32px', color: '#FF7E27' }} />
        </div>
        <Title level={3} style={{ color: '#000', fontWeight: 800 }}>Reset Password</Title>
        <Text style={{ color: '#555', display: 'block', marginBottom: '24px' }}>
          Enter your new password
        </Text>
        <div style={{ textAlign: 'left', marginBottom: '16px' }}>
          <Text style={labelStyle}>New Password</Text>
          <Input.Password size="large" placeholder="........" style={inputStyle} />
        </div>
        <div style={{ textAlign: 'left', marginBottom: '8px' }}>
          <Text style={labelStyle}>Confirm Password</Text>
          <Input.Password size="large" placeholder="........" style={inputStyle} />
        </div>
        <Button style={primaryBtnStyle} onClick={() => navigate('/password-updated')}>
          Reset Password
        </Button>
      </Card>
    </div>
  );
};

// 7. PASSWORD UPDATED
export const PasswordUpdated = () => {
  const navigate = useNavigate();
  return (
    <div style={containerStyle}>
      <Card style={cardStyle}>
        <div style={{...iconCircleStyle, background: '#E6F4EA'}}>
          <CheckCircleFilled style={{ fontSize: '40px', color: '#52C41A' }} />
        </div>
        <Title level={3} style={{ color: '#000', fontWeight: 800 }}>Password Updated!</Title>
        <Text style={{ color: '#555', display: 'block', marginBottom: '32px' }}>
          Your password has been successfully updated. You can now login with your new password.
        </Text>
        <Button style={primaryBtnStyle} onClick={() => navigate('/login')}>
          Back to Login
        </Button>
      </Card>
    </div>
  );
};

// 8. ROLE VERIFICATION
export const RoleVerification = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={containerStyle}>
      <Spin size="large" style={{ marginBottom: '32px' }} />
      <Title level={3} style={{ color: '#000', fontWeight: 800 }}>Verifying Your Account</Title>
      <Text style={{ color: '#555', marginBottom: '24px' }}>
        Please wait while we set up your profile...
      </Text>
      <div style={{ border: '1px solid #F83A3A', color: '#F83A3A', padding: '8px 20px', borderRadius: '20px', fontSize: '14px', fontWeight: 700, backgroundColor: '#FFF0E6' }}>
        <CheckCircleFilled style={{ marginRight: '8px'}}/> User Access Granted
      </div>
    </div>
  );
};