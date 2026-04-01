import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Row, Col, Avatar } from 'antd';
import { 
  SettingOutlined, LogoutOutlined, UserOutlined, CrownFilled, MailOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export const Profile = () => {
  const navigate = useNavigate();
  
  // State to hold the current user's data
  const [user, setUser] = useState({
    name: "Guest",
    email: "guest@example.com",
    isAdmin: false
  });

  useEffect(() => {
    // Retrieve the user identity stored during login
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    // Clear storage and send user back to login
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <div style={{ backgroundColor: '#FCF4F1', minHeight: '100vh', paddingBottom: '40px' }}>
      {/* --- Dynamic Header Gradient --- */}
      <div style={{ 
        background: 'linear-gradient(135deg, #FF7E27 0%, #F83A3A 100%)', 
        padding: '60px 24px 80px 24px', 
        borderBottomLeftRadius: '30px',
        borderBottomRightRadius: '30px',
        color: 'white' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <Avatar size={70} icon={<UserOutlined style={{ color: '#FF7E27' }} />} style={{ backgroundColor: 'white' }} />
          <div>
            <Title level={2} style={{ color: 'white', margin: 0, fontWeight: 800 }}>{user.name}</Title>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MailOutlined /> {user.email}
            </Text>
          </div>
        </div>
        
        {/* Only show the Administrator badge if the user is an admin */}
        {user.isAdmin && (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '6px 16px', borderRadius: '20px', display: 'inline-block' }}>
            <Text style={{ color: 'white', fontWeight: 600, fontSize: '13px' }}>
              <CrownFilled style={{ color: '#FAAD14', marginRight: '6px' }} /> Administrator
            </Text>
          </div>
        )}
      </div>

      <div style={{ padding: '0 24px', marginTop: '-40px' }}>
        {/* --- Dynamic Floating Stats Row --- */}
        <Row gutter={12}>
          <Col span={8}>
            <Card style={{ borderRadius: '16px', border: 'none', textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }} bodyStyle={{ padding: '16px 8px' }}>
              <Title level={3} style={{ margin: 0, fontWeight: 800 }}>1</Title>
              <Text type="secondary" style={{ fontSize: '11px', fontWeight: 600 }}>Submitted</Text>
            </Card>
          </Col>
          <Col span={8}>
            <Card style={{ borderRadius: '16px', border: 'none', textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }} bodyStyle={{ padding: '16px 8px' }}>
              <Title level={3} style={{ margin: 0, fontWeight: 800 }}>1</Title>
              <Text type="secondary" style={{ fontSize: '11px', fontWeight: 600 }}>Approved</Text>
            </Card>
          </Col>
          <Col span={8}>
            <Card style={{ borderRadius: '16px', border: 'none', textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }} bodyStyle={{ padding: '16px 8px' }}>
              <Title level={3} style={{ margin: 0, fontWeight: 800 }}>0</Title>
              <Text type="secondary" style={{ fontSize: '11px', fontWeight: 600 }}>Pending</Text>
            </Card>
          </Col>
        </Row>

        {/* --- Admin Dashboard Access Button (CONDITIONAL) --- */}
        {user.isAdmin && (
          <Card 
            onClick={() => navigate('/admin-dashboard')}
            style={{ 
              marginTop: '20px', 
              borderRadius: '20px', 
              border: 'none', 
              background: 'linear-gradient(135deg, #9b00ff 0%, #ff007b 100%)', 
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(255,0,123,0.2)'
            }} 
            bodyStyle={{ padding: '24px' }}
          >
            <Title level={4} style={{ color: 'white', margin: 0, fontWeight: 700 }}>Admin Dashboard</Title>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px' }}>Manage and moderate recipes</Text>
          </Card>
        )}

        {/* --- My Submitted Recipes Section --- */}
        <Title level={4} style={{ margin: '24px 0 16px 0', fontWeight: 800 }}>My Submitted Recipes</Title>
        <Card style={{ borderRadius: '24px', border: 'none', marginBottom: '20px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }} bodyStyle={{ padding: '16px', display: 'flex', gap: '16px' }}>
            <img src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=100&q=80" style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover' }} alt="recipe" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Title level={5} style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 700 }}>Grandmother's Special...</Title>
              <div style={{ backgroundColor: '#E6F7F0', color: '#52C41A', borderRadius: '8px', fontWeight: 700, padding: '4px 10px', fontSize: '11px', display: 'inline-block', width: 'fit-content' }}>
                 <CheckCircleOutlined /> Approved
              </div>
            </div>
        </Card>

        {/* --- Settings & Logout --- */}
        <Card style={{ borderRadius: '20px', border: 'none', marginTop: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }} bodyStyle={{ padding: '8px' }}>
          <Button type="text" block onClick={() => navigate('/settings')} icon={<SettingOutlined style={{ fontSize: '18px' }} />} style={{ height: '56px', textAlign: 'left', padding: '0 16px', fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #F0F0F0' }}>
            <span style={{flex: 1}}>Settings</span>
            <span style={{color: '#CCC'}}>→</span>
          </Button>
          <Button type="text" block onClick={handleLogout} icon={<LogoutOutlined style={{ fontSize: '18px', color: '#F83A3A' }} />} style={{ height: '56px', textAlign: 'left', padding: '0 16px', fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '12px', color: '#F83A3A' }}>
            Logout
          </Button>
        </Card>
      </div>
    </div>
  );
};