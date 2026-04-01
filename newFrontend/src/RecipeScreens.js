import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Typography, message } from 'antd';
import { 
  LeftOutlined, ClockCircleOutlined, UserOutlined, 
  CheckCircleFilled, EyeOutlined, HomeOutlined, EditOutlined, CheckOutlined
} from '@ant-design/icons';

const { Title, Text, Link } = Typography;

// --- Shared Styles ---
const pageStyle = {
  backgroundColor: '#FCF4F1',
  minHeight: '100vh',
  padding: '24px',
  paddingBottom: '80px',
};

const cardStyle = {
  width: '100%', borderRadius: '20px', border: 'none', 
  boxShadow: '0 8px 24px rgba(0,0,0,0.05)', marginBottom: '24px', overflow: 'hidden'
};

const ChefHatSmall = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px', verticalAlign: 'middle' }}>
    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path>
    <line x1="6" y1="17" x2="18" y2="17"></line>
  </svg>
);

// 1. RECIPE PREVIEW SCREEN
export const RecipePreview = () => {
  const navigate = useNavigate();

  const ingredients = [
    "2 cups Basmati rice", "500g Chicken", "2 Onions (sliced)", "4 Tomatoes", 
    "Yogurt - 1 cup", "Biryani masala - 2 tbsp", "Saffron strands", 
    "Ghee - 3 tbsp", "Fresh mint and cilantro"
  ];

  const steps = [
    "Wash and soak rice for 30 minutes",
    "Marinate chicken with yogurt and spices for 1 hour",
    "Fry onions until golden brown, set aside half for garnish",
    "Cook marinated chicken with tomatoes",
    "Boil rice until 70% cooked, drain",
    "Layer rice and chicken in a heavy-bottomed pot",
    "Add saffron milk, fried onions, and ghee on top",
    "Cover and cook on low heat for 20 minutes",
    "Let it rest for 5 minutes before serving"
  ];

  // --- Logic to fix the "Moderate Pending" visibility ---
  const handleFinalSubmit = () => {
    // 1. Get current data from local storage
    const storedData = localStorage.getItem('adminPrototypeData');
    
    // 2. Initialize or parse existing admin data
    let adminData = storedData ? JSON.parse(storedData) : {
      stats: { total: 0, pending: 0, approved: 0, rejected: 0 },
      recipes: []
    };

    // 3. Create the real recipe object
    const newRecipe = {
      id: Date.now(), // Generate unique ID
      title: "Grandmother's Special Biryani",
      img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80",
      time: "2 hours",
      servings: "6 servings",
      diff: "Medium",
      status: "pending"
    };

    // 4. Update the admin state
    adminData.recipes.push(newRecipe);
    adminData.stats.total += 1;
    adminData.stats.pending = adminData.recipes.length;

    // 5. Save back to storage
    localStorage.setItem('adminPrototypeData', JSON.stringify(adminData));
    
    // Clean up old temporary counter
    localStorage.removeItem('admin_pending_count');

    message.success("Recipe submitted for review!");
    navigate('/submission-success');
  };

  return (
    <div style={pageStyle}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <Link onClick={() => navigate('/cultural-questions')} style={{ color: '#555', fontWeight: 600 }}><LeftOutlined /> Back</Link>
      </div>

      <Title level={2} style={{ color: '#000', fontWeight: 800, margin: 0 }}>Review Your Recipe</Title>
      <Text style={{ color: '#555', fontSize: '15px', display: 'block', marginBottom: '24px' }}>Check the details before submitting</Text>

      <Card style={cardStyle} bodyStyle={{ padding: 0 }}>
        <img src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80" alt="Biryani" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <div style={{ padding: '20px' }}>
          <Title level={3} style={{ margin: '0 0 16px 0', fontWeight: 800 }}>Grandmother's Special Biryani</Title>
          <div style={{ display: 'flex', gap: '16px', color: '#FF5238', fontSize: '13px', fontWeight: 600, marginBottom: '20px' }}>
            <span style={{ color: '#666' }}><ClockCircleOutlined style={{ color: '#FF5238', marginRight: '4px' }}/> 2 hours</span>
            <span style={{ color: '#666' }}><UserOutlined style={{ color: '#FF5238', marginRight: '4px' }}/> 6 servings</span>
            <span style={{ color: '#666' }}><ChefHatSmall /> Medium</span>
          </div>

          <div style={{ backgroundColor: '#FFFBF5', borderRadius: '12px', padding: '16px', border: '1px solid #FFE4C4' }}>
            <Text style={{ color: '#8B4513', fontSize: '13px', lineHeight: '1.5' }}>
              <strong>Cultural Context:</strong> A traditional recipe from Hyderabad, India, passed down through three generations. Typically made for family celebrations and Eid.
            </Text>
          </div>
        </div>
      </Card>

      <Card style={{...cardStyle, padding: '20px'}}>
        <Title level={4} style={{ fontWeight: 800, marginTop: 0 }}>Ingredients</Title>
        <ul style={{ paddingLeft: '20px', margin: 0, color: '#000', fontWeight: 500, lineHeight: '2' }}>
          {ingredients.map((item, i) => (
            <li key={i} style={{ marker: '•', color: '#FF5238' }}><span style={{ color: '#000' }}>{item}</span></li>
          ))}
        </ul>
      </Card>

      <Card style={{...cardStyle, padding: '20px'}}>
        <Title level={4} style={{ fontWeight: 800, marginTop: 0 }}>Cooking Steps</Title>
        {steps.map((step, i) => (
          <div key={i} style={{ display: 'flex', marginBottom: '16px' }}>
            <div style={{ width: '28px', height: '28px', backgroundColor: '#FFF0E6', color: '#FF5238', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', marginRight: '16px', flexShrink: 0 }}>
              {i + 1}
            </div>
            <Text style={{ color: '#000', fontWeight: 500, fontSize: '14px', paddingTop: '4px' }}>{step}</Text>
          </div>
        ))}
        
        <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
          <Button style={{ height: '48px', width: '30%', borderRadius: '8px', fontWeight: 600, borderColor: '#E2E8F0', color: '#333' }}>
            <EditOutlined /> Edit
          </Button>
          <Button 
            style={{ height: '48px', width: '70%', borderRadius: '8px', fontWeight: 700, background: 'linear-gradient(90deg, #FF7E27 0%, #F83A3A 100%)', color: 'white', border: 'none', boxShadow: '0 4px 12px rgba(248, 58, 58, 0.25)' }}
            onClick={handleFinalSubmit}
          >
            <CheckOutlined /> Submit Recipe
          </Button>
        </div>
      </Card>
    </div>
  );
};

// 2. SUBMISSION SUCCESS SCREEN
export const SubmissionSuccess = () => {
  const navigate = useNavigate();

  return (
    <div style={{...pageStyle, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center'}}>
      <div style={{
        width: '80px', height: '80px', backgroundColor: '#24E19C',
        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto',
        color: 'white', fontSize: '40px', boxShadow: '0 8px 24px rgba(36, 225, 156, 0.3)'
      }}>
        <CheckCircleFilled />
      </div>
      <Title level={2} style={{ color: '#000', fontWeight: 800 }}>Recipe Submitted!</Title>
      <Text style={{ color: '#555', fontSize: '15px', display: 'block', marginBottom: '32px', padding: '0 16px' }}>
        Your recipe has been successfully submitted and is now pending review by our moderators. You'll be notified once it's approved.
      </Text>

      <Card style={{...cardStyle, padding: '24px', textAlign: 'left'}}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#FFFBF5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginRight: '16px' }}>
            ⏳
          </div>
          <div>
            <Text style={{ display: 'block', fontWeight: 800, fontSize: '15px' }}>Status: Pending Review</Text>
            <Text style={{ color: '#666', fontSize: '13px' }}>Track your submission status in your profile</Text>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Button onClick={() => navigate('/profile')} style={{ height: '44px', width: '50%', borderRadius: '8px', fontWeight: 600, borderColor: '#E2E8F0', color: '#333' }}>
            <EyeOutlined /> View Status
          </Button>
          <Button 
            style={{ height: '44px', width: '50%', borderRadius: '8px', fontWeight: 700, backgroundColor: '#FF5238', color: 'white', border: 'none' }}
            onClick={() => navigate('/dashboard')}
          >
            <HomeOutlined /> Go Home
          </Button>
        </div>
      </Card>

      <Link onClick={() => navigate('/add-recipe')} style={{ color: '#FF5238', fontWeight: 700, marginTop: '16px' }}>
        Submit Another Recipe
      </Link>
    </div>
  );
};