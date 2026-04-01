import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Row, Col, message } from 'antd'; 
import { 
  LeftOutlined, SafetyCertificateOutlined, BookOutlined, 
  FileTextOutlined, FileSearchOutlined, ContainerOutlined,
  CheckCircleOutlined, EditOutlined, CloseCircleOutlined, CheckOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const pageStyle = {
  backgroundColor: '#FCF4F1',
  minHeight: '100vh',
  paddingBottom: '40px'
};

// --- SINGLE SOURCE OF TRUTH (localStorage) ---
const getAdminData = () => {
  const storedData = localStorage.getItem('adminPrototypeData');
  
  if (storedData) {
    const data = JSON.parse(storedData);
    // Force the pending count to match the actual number of recipes in the list
    data.stats.pending = data.recipes.length;
    return data;
  }
  
  // Default Starting Data (Initial State)
  const defaultData = {
    stats: { total: 2, pending: 2, approved: 0, rejected: 0 },
    recipes: [
      { id: 1, title: "Authentic Mexican Tacos", img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=150&q=80", time: "30 mins", servings: "4 servings", diff: "Easy" },
      { id: 2, title: "Grandmother's Special Biryani", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=150&q=80", time: "2 hours", servings: "6 servings", diff: "Medium" }
    ]
  };
  localStorage.setItem('adminPrototypeData', JSON.stringify(defaultData));
  return defaultData;
};

const saveAdminData = (data) => {
  localStorage.setItem('adminPrototypeData', JSON.stringify(data));
};


// ==========================================
// 1. ADMIN DASHBOARD SCREEN
// ==========================================
export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(getAdminData());

  // Automatically refresh data whenever the Admin views the dashboard
  useEffect(() => {
    setData(getAdminData());
  }, []);

  const menuItems = [
    { title: "Moderate Recipes", desc: "Review and approve submitted recipes", icon: <FileSearchOutlined />, color: "#FAAD14", badge: `${data.stats.pending} pending` },
    { title: "View All Recipes", desc: "Browse and manage all recipes in the system", icon: <BookOutlined />, color: "#52C41A" },
    { title: "Generate Recipe Book", desc: "Create a downloadable recipe collection", icon: <ContainerOutlined />, color: "#4096FF", extra: "(Coming Soon)" },
  ];

  return (
    <div style={pageStyle}>
      <div style={{ 
        background: 'linear-gradient(135deg, #9b00ff 0%, #ff007b 100%)', 
        padding: '50px 24px 80px 24px', 
        borderBottomLeftRadius: '30px',
        borderBottomRightRadius: '30px',
        color: 'white' 
      }}>
        <Button type="link" icon={<LeftOutlined />} onClick={() => navigate('/dashboard')} style={{ color: 'white', padding: 0, marginBottom: '24px', fontWeight: 600 }}>Back to App</Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.2)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SafetyCertificateOutlined style={{ fontSize: '28px' }} />
          </div>
          <div>
            <Title level={2} style={{ color: 'white', margin: 0, fontWeight: 800 }}>Admin Dashboard</Title>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Manage and moderate recipes</Text>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 24px', marginTop: '-45px' }}>
        <Row gutter={16}>
          <Col span={12}>
            <Card style={{ borderRadius: '20px', border: 'none', textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} bodyStyle={{ padding: '20px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <Title level={2} style={{ margin: 0, fontWeight: 800 }}>{data.stats.total}</Title>
                <BookOutlined style={{ color: '#9b00ff', fontSize: '24px' }} />
              </div>
              <Text type="secondary" style={{ fontSize: '13px', fontWeight: 600 }}>Total Recipes</Text>
            </Card>
          </Col>
          <Col span={12}>
            <Card style={{ borderRadius: '20px', border: 'none', textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} bodyStyle={{ padding: '20px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <Title level={2} style={{ margin: 0, fontWeight: 800 }}>{data.stats.pending}</Title>
                <FileTextOutlined style={{ color: '#FAAD14', fontSize: '24px' }} />
              </div>
              <Text type="secondary" style={{ fontSize: '13px', fontWeight: 600 }}>Pending Review</Text>
            </Card>
          </Col>
        </Row>

        <div style={{ marginTop: '24px' }}>
          {menuItems.map((item, i) => (
            <Card 
              key={i} 
              onClick={() => item.title === "Moderate Recipes" && navigate('/recipe-moderation')}
              style={{ borderRadius: '20px', border: 'none', marginBottom: '16px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }} 
              bodyStyle={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}
            >
              <div style={{ width: '50px', height: '50px', backgroundColor: item.color, color: 'white', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: `0 4px 12px ${item.color}40` }}>
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <Text strong style={{ display: 'block', fontSize: '16px', color: '#000' }}>{item.title}</Text>
                <Text type="secondary" style={{ fontSize: '13px', display: 'block', lineHeight: '1.3', margin: '4px 0' }}>{item.desc}</Text>
                {data.stats.pending > 0 && item.badge && item.title === "Moderate Recipes" && (
                  <div style={{ marginTop: '6px', backgroundColor: '#FFFBE6', display: 'inline-block', padding: '2px 8px', borderRadius: '10px' }}>
                    <Text style={{fontSize: '11px', color: '#FAAD14', fontWeight: 700}}>{item.badge}</Text>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        <Card 
          style={{ marginTop: '24px', borderRadius: '24px', border: 'none', background: 'linear-gradient(135deg, #9b00ff 0%, #ff007b 100%)', color: 'white', boxShadow: '0 8px 24px rgba(255,0,123,0.3)' }}
          bodyStyle={{ padding: '24px' }}
        >
          <Title level={4} style={{ color: 'white', margin: '0 0 20px 0', fontSize: '16px', fontWeight: 700 }}>Platform Statistics</Title>
          <Row>
            <Col span={12}>
              <Title level={1} style={{ color: 'white', margin: 0, fontWeight: 800 }}>{data.stats.approved}</Title>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', fontWeight: 600 }}>Approved Recipes</Text>
            </Col>
            <Col span={12}>
              <Title level={1} style={{ color: 'white', margin: 0, fontWeight: 800 }}>{data.stats.rejected}</Title>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', fontWeight: 600 }}>Rejected Recipes</Text>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

// ==========================================
// 2. RECIPE MODERATION SCREEN
// ==========================================
export const RecipeModeration = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(getAdminData());

  const handleAction = (id, actionType) => {
    // 1. Filter out the recipe that was just acted upon
    const updatedRecipes = data.recipes.filter(r => r.id !== id);
    
    // 2. Update the numbers based on the action
    const updatedStats = { ...data.stats };
    updatedStats.pending = updatedRecipes.length; 

    if (actionType === 'approve') {
      updatedStats.approved += 1;
      message.success("Recipe Approved! Sent to platform.");
    } else if (actionType === 'reject') {
      updatedStats.rejected += 1;
      updatedStats.total -= 1; // Removed from total system count
      message.error("Recipe Rejected. User notified.");
    } else if (actionType === 'edit') {
      message.warning("Edit requested. Sent back to user.");
    }

    // 3. Save the new state globally
    const newData = { stats: updatedStats, recipes: updatedRecipes };
    setData(newData);
    saveAdminData(newData);
  };

  return (
    <div style={{...pageStyle, padding: '24px'}}>
      <Button type="link" icon={<LeftOutlined />} onClick={() => navigate('/admin-dashboard')} style={{ color: '#444', padding: 0, marginBottom: '20px', fontWeight: 600 }}>Back to Dashboard</Button>
      
      <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#000' }}>Recipe Moderation</Title>
      <Text style={{ color: '#666', fontSize: '15px', display: 'block', marginBottom: '24px' }}>
        {data.recipes.length} recipes pending review
      </Text>

      {data.recipes.length === 0 ? (
        // Empty State (Matches your screenshot requirements)
        <Card style={{ borderRadius: '24px', border: 'none', textAlign: 'center', padding: '40px 20px', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid #52C41A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
             <CheckOutlined style={{ fontSize: '40px', color: '#52C41A' }} />
          </div>
          <Title level={3} style={{ fontWeight: 800, margin: '0 0 12px 0' }}>All Caught Up!</Title>
          <Text style={{ color: '#666', fontSize: '15px' }}>No recipes pending review at the moment.</Text>
        </Card>
      ) : (
        // Moderation List populated with real recipe cards
        data.recipes.map(recipe => (
          <Card key={recipe.id} style={{ borderRadius: '24px', border: 'none', marginBottom: '20px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }} bodyStyle={{ padding: 0 }}>
            <div style={{ display: 'flex', padding: '16px', gap: '16px' }}>
              <img src={recipe.img} style={{ width: '100px', height: '100px', borderRadius: '16px', objectFit: 'cover' }} alt={recipe.title} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Title level={5} style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: 700 }}>{recipe.title}</Title>
                  <div style={{ backgroundColor: '#FFFBE6', padding: '2px 8px', borderRadius: '8px' }}>
                    <Text style={{ fontSize: '10px', color: '#FAAD14', fontWeight: 700 }}>◷ Pending</Text>
                  </div>
                </div>
                <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginBottom: '8px' }}>
                  {recipe.time} • {recipe.servings} • {recipe.diff}
                </Text>
                <Button type="link" style={{ padding: 0, color: '#9b00ff', fontWeight: 700, fontSize: '13px' }}>View Details</Button>
              </div>
            </div>
            
            {/* Functional Action Buttons */}
            <div style={{ borderTop: '1px solid #F0F0F0', padding: '16px', display: 'flex', gap: '12px' }}>
              <Button 
                type="primary" 
                icon={<CheckCircleOutlined />} 
                onClick={() => handleAction(recipe.id, 'approve')}
                style={{ flex: 2, height: '44px', borderRadius: '12px', background: '#52C41A', fontWeight: 600, border: 'none' }}
              >
                Approve
              </Button>
              <Button 
                type="primary" 
                icon={<EditOutlined />} 
                onClick={() => handleAction(recipe.id, 'edit')}
                style={{ flex: 1, height: '44px', borderRadius: '12px', background: '#FAAD14', border: 'none' }} 
              />
              <Button 
                type="primary" 
                icon={<CloseCircleOutlined />} 
                onClick={() => handleAction(recipe.id, 'reject')}
                style={{ flex: 1, height: '44px', borderRadius: '12px', background: '#FF4D4F', border: 'none' }} 
              />
            </div>
          </Card>
        ))
      )}
    </div>
  );
};