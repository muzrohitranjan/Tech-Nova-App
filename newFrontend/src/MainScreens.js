import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Card } from 'antd';
import { 
  LeftOutlined, AudioOutlined, 
  UploadOutlined, FilePdfOutlined, ClockCircleOutlined, UserOutlined, BulbFilled
} from '@ant-design/icons';

const { Title, Text, Link } = Typography;

// --- Custom Icons for PERFECT Match ---
const ChefHatOutline = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path>
    <line x1="6" y1="17" x2="18" y2="17"></line>
  </svg>
);

// The exact Open Book outline from Figma
const OpenBookOutline = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);

const TrendUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF5238" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

// --- Shared Styles ---
const pageStyle = {
  backgroundColor: '#FCF4F1',
  minHeight: '100vh',
  paddingBottom: '80px', 
};

const actionCardStyle = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#FFF',
  borderRadius: '20px',
  padding: '16px 20px',
  marginBottom: '14px', 
  boxShadow: '0 8px 24px rgba(0,0,0,0.05)', 
  cursor: 'pointer',
  border: 'none',
  position: 'relative',
  zIndex: 10
};

const IconBox = ({ gradient, children }) => (
  <div style={{
    width: '56px', height: '56px', borderRadius: '16px',
    background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#FFF', fontSize: '28px', marginRight: '16px', flexShrink: 0
  }}>
    {children}
  </div>
);

// 1. DASHBOARD (HOME) SCREEN
export const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={pageStyle}>
      {/* Top Red Gradient Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #FF7E27 0%, #F83A3A 100%)', 
        padding: '56px 24px 88px 24px', 
        borderBottomLeftRadius: '32px', 
        borderBottomRightRadius: '32px',
      }}>
        <Title level={2} style={{ color: '#FFF', margin: 0, fontWeight: 800 }}>Hello, Chef! 👋</Title>
        <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '15px' }}>What would you like to cook today?</Text>
      </div>

      {/* Overlapping Action Cards */}
      <div style={{ marginTop: '-56px', padding: '0 24px' }}>
        
        <div style={actionCardStyle} onClick={() => navigate('/cooking-prep')}>
          <IconBox gradient="linear-gradient(135deg, #FF8952 0%, #FF5A5F 100%)">
            <ChefHatOutline />
          </IconBox>
          <div>
            <Text style={{ display: 'block', fontSize: '16px', fontWeight: 800, color: '#000' }}>Start Guided Cooking</Text>
            <Text style={{ fontSize: '13px', color: '#555', fontWeight: 500 }}>Step-by-step instructions</Text>
          </div>
        </div>

        <div style={actionCardStyle} onClick={() => navigate('/add-recipe')}>
          <IconBox gradient="linear-gradient(135deg, #81A4FF 0%, #5B86FF 100%)">
            <span style={{ fontSize: '32px', fontWeight: 300 }}>+</span>
          </IconBox>
          <div>
            <Text style={{ display: 'block', fontSize: '16px', fontWeight: 800, color: '#000' }}>Add / Record Recipe</Text>
            <Text style={{ fontSize: '13px', color: '#555', fontWeight: 500 }}>Document your family recipes</Text>
          </div>
        </div>

        <div style={actionCardStyle} onClick={() => navigate('/recipes')}>
          <IconBox gradient="linear-gradient(135deg, #24E19C 0%, #00C67D 100%)">
            <OpenBookOutline />
          </IconBox>
          <div>
            <Text style={{ display: 'block', fontSize: '16px', fontWeight: 800, color: '#000' }}>Browse Recipes</Text>
            <Text style={{ fontSize: '13px', color: '#555', fontWeight: 500 }}>Explore cultural dishes</Text>
          </div>
        </div>

        {/* Popular Recipes Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TrendUpIcon />
            <Title level={4} style={{ margin: 0, fontWeight: 800, color: '#000' }}>Popular Recipes</Title>
          </div>
          <Link style={{ color: '#F83A3A', fontWeight: 600 }}>See All</Link>
        </div>

        {/* Recipe List Cards */}
        {[
          { title: "Traditional Italian Pasta...", time: "20 mins", servings: "4 servings", img: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=200&q=80" },
          { title: "Grandmother's Chicken...", time: "45 mins", servings: "6 servings", img: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=200&q=80" }
        ].map((recipe, idx) => (
          <Card key={idx} style={{ borderRadius: '20px', border: 'none', marginBottom: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', overflow: 'hidden' }} bodyStyle={{ padding: 0, display: 'flex' }}>
            <img src={recipe.img} alt={recipe.title} style={{ width: '90px', height: '90px', objectFit: 'cover' }} />
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Text style={{ fontWeight: 800, fontSize: '15px', color: '#000', marginBottom: '6px' }}>{recipe.title}</Text>
              <div style={{ display: 'flex', gap: '16px', color: '#666', fontSize: '12px', fontWeight: 500 }}>
                <span><ClockCircleOutlined style={{ marginRight: '4px' }}/>{recipe.time}</span>
                <span><UserOutlined style={{ marginRight: '4px' }}/>{recipe.servings}</span>
              </div>
            </div>
          </Card>
        ))}

      </div>
    </div>
  );
};

// 2. ADD RECIPE SCREEN
export const AddRecipe = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...pageStyle, padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link onClick={() => navigate('/dashboard')} style={{ color: '#555', fontWeight: 600, fontSize: '15px' }}>
          <LeftOutlined /> Back
        </Link>
      </div>
      <Title level={2} style={{ color: '#000', fontWeight: 800, margin: 0 }}>Add Your Recipe</Title>
      <Text style={{ color: '#555', fontSize: '15px', display: 'block', marginBottom: '32px' }}>Choose how you'd like to document your recipe</Text>

      <div style={actionCardStyle} onClick={() => navigate('/voice-recording')}>
        <IconBox gradient="linear-gradient(135deg, #FF6B8B 0%, #FF416C 100%)">
          <AudioOutlined />
        </IconBox>
        <div>
          <Text style={{ display: 'block', fontSize: '16px', fontWeight: 700, color: '#000' }}>Record Voice</Text>
          <Text style={{ fontSize: '13px', color: '#666', display: 'block', lineHeight: '1.3' }}>Share your recipe by speaking. Perfect for capturing family stories and cooking tips.</Text>
        </div>
      </div>

      <div style={actionCardStyle} onClick={() => navigate('/upload-audio')}>
        <IconBox gradient="linear-gradient(135deg, #FFB75E 0%, #ED8F03 100%)">
          <UploadOutlined />
        </IconBox>
        <div>
          <Text style={{ display: 'block', fontSize: '16px', fontWeight: 700, color: '#000' }}>Upload Audio</Text>
          <Text style={{ fontSize: '13px', color: '#666', display: 'block', lineHeight: '1.3' }}>Already have an audio recording? Upload it here for AI processing.</Text>
        </div>
      </div>

      <div style={actionCardStyle} onClick={() => navigate('/upload-pdf')}>
        <IconBox gradient="linear-gradient(135deg, #6FA6FF 0%, #4A83FF 100%)">
          <FilePdfOutlined />
        </IconBox>
        <div>
          <Text style={{ display: 'block', fontSize: '16px', fontWeight: 700, color: '#000' }}>Upload PDF</Text>
          <Text style={{ fontSize: '13px', color: '#666', display: 'block', lineHeight: '1.3' }}>Have a written recipe? Upload a PDF and let AI extract the details.</Text>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#EBF3FF', borderRadius: '16px', padding: '16px', marginTop: '32px', border: '1px solid #D6E6FF'
      }}>
        <Text style={{ color: '#1A5DAB', fontSize: '13px', fontWeight: 500, lineHeight: '1.5', display: 'block' }}>
          <BulbFilled style={{ color: '#FFB75E', marginRight: '6px' }} />
          <strong style={{ color: '#0D3D78'}}>Tip:</strong> Our AI will analyze your recipe and ask questions to capture cultural context and family traditions.
        </Text>
      </div>
    </div>
  );
};