import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Switch, Button, Divider, Input, message, Modal } from 'antd';
import { 
  UserOutlined, BellOutlined, BgColorsOutlined, EyeOutlined, SoundOutlined,
  RightOutlined, DeleteOutlined, MailOutlined, LockOutlined, LeftOutlined, 
  SaveOutlined, CheckCircleOutlined, CloseCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

// --- Custom Hook for Task 5: Local Storage Persistence ---
function usePersistedState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn("Error reading localStorage", error);
      return defaultValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

export const Settings = () => {
  const navigate = useNavigate();

  // --- Dynamic States ---
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = usePersistedState('app_user_name', 'Admin User');
  const [userEmail, setUserEmail] = usePersistedState('app_user_email', 'admin@test.com');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // --- Task 6: Secure Password States ---
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  // --- Task 5: Persisted Toggle States ---
  const [pushNotif, setPushNotif] = usePersistedState('app_push', true);
  const [emailNotif, setEmailNotif] = usePersistedState('app_email_notif', true);
  const [statusUpdates, setStatusUpdates] = usePersistedState('app_status_update', true);
  const [weeklyDigest, setWeeklyDigest] = usePersistedState('app_weekly_digest', false);
  const [darkMode, setDarkMode] = usePersistedState('app_dark_mode', false);
  const [showEmail, setShowEmail] = usePersistedState('app_show_email', false);
  const [dataCollection, setDataCollection] = usePersistedState('app_data_collection', true);
  const [voiceGuidance, setVoiceGuidance] = usePersistedState('app_voice_guide', true);
  const [autoAdvance, setAutoAdvance] = usePersistedState('app_auto_advance', false);
  const [keepScreenOn, setKeepScreenOn] = usePersistedState('app_wake_lock', true);
  const [fontSize, setFontSize] = usePersistedState('app_font_size', 'medium');
  const [visibility, setVisibility] = usePersistedState('app_visibility', 'public');

  // --- Task 5: Wake Lock API Implementation ---
  useEffect(() => {
    let wakeLock = null;
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await navigator.wakeLock.request('screen');
        }
      } catch (err) {
        console.log(`Wake Lock Error: ${err.name}, ${err.message}`);
      }
    };

    if (keepScreenOn) {
      requestWakeLock();
    } else if (wakeLock) {
      wakeLock.release().then(() => { wakeLock = null; });
    }

    return () => {
      if (wakeLock) wakeLock.release();
    };
  }, [keepScreenOn]);

  // --- Task 5: Dynamic Appearance Logic ---
  const fontScale = fontSize === 'small' ? 0.9 : fontSize === 'large' ? 1.1 : 1.0;
  const pageBg = darkMode ? '#121212' : '#FCF4F1';
  const cardBg = darkMode ? '#1E1E1E' : '#FFFFFF';
  const textColor = darkMode ? '#F0F0F0' : '#000000';
  const textSecColor = darkMode ? '#AAAAAA' : '#555555';

  const pageStyle = { backgroundColor: pageBg, minHeight: '100vh', paddingBottom: '40px', transition: 'all 0.3s ease' };
  const cardStyle = { borderRadius: '24px', border: 'none', marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', backgroundColor: cardBg, transition: 'all 0.3s ease' };
  const iconBoxStyle = { width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' };
  const rowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' };

  const customSwitch = (checked, setter) => (
    <Switch checked={checked} onChange={setter} style={{ backgroundColor: checked ? '#FF7E27' : '#D9D9D9' }} />
  );

  // --- Handlers ---
  const handleSaveProfile = () => {
    setIsEditing(false);
    message.success('Profile updated successfully!');
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    navigate('/login');
  };

  // --- Task 6: Password Validation Logic ---
  const hasMinLength = passwords.new.length >= 8;
  const hasUpperAndLower = /(?=.*[a-z])(?=.*[A-Z])/.test(passwords.new);
  const hasNumber = /(?=.*\d)/.test(passwords.new);
  const isPasswordValid = hasMinLength && hasUpperAndLower && hasNumber;
  const doPasswordsMatch = passwords.new === passwords.confirm && passwords.new !== '';

  const handlePasswordSubmit = () => {
    if (!passwords.current) return message.error('Please enter your current password');
    if (!isPasswordValid) return message.error('New password does not meet security requirements');
    if (!doPasswordsMatch) return message.error('New passwords do not match');

    // Simulate API Call
    message.success('Password securely updated!');
    setShowPasswordModal(false);
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div style={pageStyle}>
      
      {/* --- Delete Account Modal --- */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: cardBg, borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '340px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <Title level={4} style={{ margin: '0 0 12px 0', fontWeight: 800, color: textColor }}>Delete Account?</Title>
            <Text style={{ color: textSecColor, fontSize: `${15 * fontScale}px`, display: 'block', marginBottom: '24px', lineHeight: '1.5' }}>
              This action cannot be undone. All your recipes and data will be permanently deleted.
            </Text>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button style={{ flex: 1, height: '48px', borderRadius: '12px', backgroundColor: darkMode ? '#333' : '#E2E8F0', border: 'none', color: textColor, fontWeight: 700 }} onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button type="primary" danger style={{ flex: 1, height: '48px', borderRadius: '12px', backgroundColor: '#E00000', border: 'none', fontWeight: 700 }} onClick={handleDeleteAccount}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- Change Password Modal (Task 6) --- */}
      <Modal 
        title={<span style={{ color: textColor, fontWeight: 800 }}>Update Password</span>} 
        open={showPasswordModal} 
        onCancel={() => setShowPasswordModal(false)} 
        footer={null} 
        centered
        styles={{ content: { backgroundColor: cardBg, borderRadius: '24px' }, header: { backgroundColor: cardBg } }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: '8px', color: textColor }}>Current Password</Text>
            <Input.Password size="large" value={passwords.current} onChange={(e) => setPasswords({...passwords, current: e.target.value})} />
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: '8px', color: textColor }}>New Password</Text>
            <Input.Password size="large" value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} />
            
            {/* Real-Time Regex Validation Checklist */}
            <div style={{ marginTop: '12px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px', backgroundColor: darkMode ? '#2A2A2A' : '#F8F9FA', padding: '12px', borderRadius: '12px' }}>
              <span style={{ color: hasMinLength ? '#52C41A' : textSecColor }}>
                {hasMinLength ? <CheckCircleOutlined /> : <CloseCircleOutlined />} Minimum 8 characters
              </span>
              <span style={{ color: hasUpperAndLower ? '#52C41A' : textSecColor }}>
                {hasUpperAndLower ? <CheckCircleOutlined /> : <CloseCircleOutlined />} One uppercase & one lowercase
              </span>
              <span style={{ color: hasNumber ? '#52C41A' : textSecColor }}>
                {hasNumber ? <CheckCircleOutlined /> : <CloseCircleOutlined />} At least one number
              </span>
            </div>
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: '8px', color: textColor }}>Confirm New Password</Text>
            <Input.Password 
              size="large" 
              status={passwords.confirm.length > 0 && !doPasswordsMatch ? "error" : ""} 
              value={passwords.confirm} 
              onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} 
            />
          </div>
          <Button type="primary" onClick={handlePasswordSubmit} style={{ height: '48px', marginTop: '16px', background: 'linear-gradient(90deg, #FF7E27 0%, #F83A3A 100%)', border: 'none', fontWeight: 700, borderRadius: '12px' }}>
            Securely Update Password
          </Button>
        </div>
      </Modal>

      {/* --- Header --- */}
      <div style={{ background: 'linear-gradient(135deg, #FF7E27 0%, #F83A3A 100%)', padding: '50px 24px 60px 24px', borderBottomLeftRadius: '30px', borderBottomRightRadius: '30px', color: 'white' }}>
        <Button type="link" icon={<LeftOutlined />} onClick={() => navigate(-1)} style={{ color: 'white', padding: 0, marginBottom: '16px', fontWeight: 600 }}>Back</Button>
        <Title level={1} style={{ color: 'white', margin: 0, fontWeight: 800 }}>Settings</Title>
        <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: `${15 * fontScale}px` }}>Customize your experience</Text>
      </div>

      <div style={{ padding: '0 24px', marginTop: '-30px' }}>
        
        {/* --- 1. Account Section --- */}
        <Card style={cardStyle} bodyStyle={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{...iconBoxStyle, backgroundColor: '#FFF0E6', color: '#FF7E27'}}><UserOutlined /></div>
              <Title level={4} style={{ margin: 0, fontWeight: 800, color: textColor }}>Account</Title>
            </div>
            {isEditing ? (
              <Text onClick={() => setIsEditing(false)} style={{ color: '#F83A3A', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>Cancel</Text>
            ) : (
              <Text onClick={() => setIsEditing(true)} style={{ color: '#F83A3A', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>Edit</Text>
            )}
          </div>
          
          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <Text strong style={{ fontSize: '13px', display: 'block', marginBottom: '8px', color: textSecColor }}>Name</Text>
                <Input size="large" value={userName} onChange={(e) => setUserName(e.target.value)} style={{ borderRadius: '12px', padding: '10px 14px', fontWeight: 500, backgroundColor: darkMode ? '#333' : '#FFF', color: textColor }} />
              </div>
              <div>
                <Text strong style={{ fontSize: '13px', display: 'block', marginBottom: '8px', color: textSecColor }}>Email</Text>
                <Input size="large" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} style={{ borderRadius: '12px', padding: '10px 14px', fontWeight: 500, backgroundColor: darkMode ? '#333' : '#FFF', color: textColor }} />
              </div>
              <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveProfile} style={{ height: '48px', borderRadius: '12px', fontWeight: 700, background: 'linear-gradient(90deg, #FF7E27 0%, #F83A3A 100%)', border: 'none', marginTop: '4px', boxShadow: '0 4px 12px rgba(248, 58, 58, 0.25)' }}>
                Save Changes
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Text style={{ fontSize: `${15 * fontScale}px`, color: textColor, fontWeight: 500 }}><UserOutlined style={{ color: textSecColor, marginRight: '16px', fontSize: '16px' }}/> {userName}</Text>
              <Text style={{ fontSize: `${15 * fontScale}px`, color: textColor, fontWeight: 500 }}><MailOutlined style={{ color: textSecColor, marginRight: '16px', fontSize: '16px' }}/> {userEmail}</Text>
              
              {/* Trigger Password Modal */}
              <div onClick={() => setShowPasswordModal(true)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <LockOutlined style={{ color: textSecColor, marginRight: '16px', fontSize: '16px' }}/>
                <Text style={{ fontSize: `${15 * fontScale}px`, color: textColor, fontWeight: 500 }}>Change Password</Text>
              </div>
            </div>
          )}
        </Card>

        {/* --- 2. Notifications --- */}
        <Card style={cardStyle} bodyStyle={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{...iconBoxStyle, backgroundColor: '#E6F4FF', color: '#1677FF'}}><BellOutlined /></div>
            <Title level={4} style={{ margin: 0, fontWeight: 800, color: textColor }}>Notifications</Title>
          </div>
          <div style={rowStyle}>
            <div><Text strong style={{ display: 'block', fontSize: `${15 * fontScale}px`, color: textColor }}>Push Notifications</Text><Text style={{ fontSize: '12px', color: textSecColor }}>Receive alerts on your device</Text></div>
            {customSwitch(pushNotif, setPushNotif)}
          </div>
          <Divider style={{ margin: '8px 0', borderColor: darkMode ? '#333' : '#F0F0F0' }} />
          <div style={rowStyle}>
            <div><Text strong style={{ display: 'block', fontSize: `${15 * fontScale}px`, color: textColor }}>Email Notifications</Text><Text style={{ fontSize: '12px', color: textSecColor }}>Get updates via email</Text></div>
            {customSwitch(emailNotif, setEmailNotif)}
          </div>
          <Divider style={{ margin: '8px 0', borderColor: darkMode ? '#333' : '#F0F0F0' }} />
          <div style={rowStyle}>
            <div><Text strong style={{ display: 'block', fontSize: `${15 * fontScale}px`, color: textColor }}>Recipe Status Updates</Text><Text style={{ fontSize: '12px', color: textSecColor }}>When your recipes are reviewed</Text></div>
            {customSwitch(statusUpdates, setStatusUpdates)}
          </div>
          <Divider style={{ margin: '8px 0', borderColor: darkMode ? '#333' : '#F0F0F0' }} />
          <div style={rowStyle}>
            <div><Text strong style={{ display: 'block', fontSize: `${15 * fontScale}px`, color: textColor }}>Weekly Digest</Text><Text style={{ fontSize: '12px', color: textSecColor }}>Summary of new recipes</Text></div>
            {customSwitch(weeklyDigest, setWeeklyDigest)}
          </div>
        </Card>

        {/* --- 3. Appearance (Task 5) --- */}
        <Card style={cardStyle} bodyStyle={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{...iconBoxStyle, backgroundColor: '#F9F0FF', color: '#B37FEB'}}><BgColorsOutlined /></div>
            <Title level={4} style={{ margin: '0', fontWeight: 800, color: textColor }}>Appearance</Title>
          </div>
          
          <div style={rowStyle}>
            <div><Text strong style={{ display: 'block', fontSize: `${15 * fontScale}px`, color: textColor }}>Dark Mode</Text><Text style={{ fontSize: '12px', color: textSecColor }}>Switch to dark theme</Text></div>
            {customSwitch(darkMode, setDarkMode)}
          </div>
          <Divider style={{ margin: '8px 0', borderColor: darkMode ? '#333' : '#F0F0F0' }} />
          
          <div style={{ marginTop: '16px', marginBottom: '24px' }}>
            <Text strong style={{ display: 'block', fontSize: `${15 * fontScale}px`, marginBottom: '12px', color: textColor }}>Font Size</Text>
            <div style={{ display: 'flex', border: `1px solid ${darkMode ? '#444' : '#E2E8F0'}`, borderRadius: '12px', padding: '4px' }}>
              {['Small', 'Medium', 'Large'].map(size => {
                const isActive = fontSize === size.toLowerCase();
                return (
                  <div 
                    key={size}
                    onClick={() => setFontSize(size.toLowerCase())}
                    style={{ flex: 1, textAlign: 'center', padding: '10px 0', borderRadius: '8px', cursor: 'pointer', backgroundColor: isActive ? '#FF7E27' : 'transparent', color: isActive ? 'white' : textSecColor, fontWeight: isActive ? 700 : 500 }}
                  >{size}</div>
                )
              })}
            </div>
          </div>
        </Card>

        {/* --- 4. Privacy --- */}
        <Card style={cardStyle} bodyStyle={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{...iconBoxStyle, backgroundColor: '#E6F7F0', color: '#52C41A'}}><EyeOutlined /></div>
            <Title level={4} style={{ margin: '0', fontWeight: 800, color: textColor }}>Privacy</Title>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <Text strong style={{ display: 'block', fontSize: `${15 * fontScale}px`, marginBottom: '12px', color: textColor }}>Profile Visibility</Text>
            <div style={{ display: 'flex', border: `1px solid ${darkMode ? '#444' : '#E2E8F0'}`, borderRadius: '12px', padding: '4px' }}>
              {['Public', 'Private'].map(vis => {
                const isActive = visibility === vis.toLowerCase();
                return (
                  <div 
                    key={vis}
                    onClick={() => setVisibility(vis.toLowerCase())}
                    style={{ flex: 1, textAlign: 'center', padding: '10px 0', borderRadius: '8px', cursor: 'pointer', backgroundColor: isActive ? '#FF7E27' : 'transparent', color: isActive ? 'white' : textSecColor, fontWeight: isActive ? 700 : 500 }}
                  >{vis}</div>
                )
              })}
            </div>
          </div>
          <div style={rowStyle}>
            <div><Text strong style={{ display: 'block', fontSize: `${15 * fontScale}px`, color: textColor }}>Show Email on Profile</Text><Text style={{ fontSize: '12px', color: textSecColor }}>Let others see your email</Text></div>
            {customSwitch(showEmail, setShowEmail)}
          </div>
          <Divider style={{ margin: '8px 0', borderColor: darkMode ? '#333' : '#F0F0F0' }} />
          <div style={rowStyle}>
            <div><Text strong style={{ display: 'block', fontSize: `${15 * fontScale}px`, color: textColor }}>Data Collection</Text><Text style={{ fontSize: '12px', color: textSecColor }}>Help improve the app</Text></div>
            {customSwitch(dataCollection, setDataCollection)}
          </div>
        </Card>

        {/* --- 5. Cooking Mode --- */}
        <Card style={cardStyle} bodyStyle={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{...iconBoxStyle, backgroundColor: '#FFF1F0', color: '#FF4D4F'}}><SoundOutlined /></div>
            <Title level={4} style={{ margin: '0', fontWeight: 800, color: textColor }}>Cooking Mode</Title>
          </div>
          <div style={rowStyle}>
            <div><Text strong style={{ display: 'block', fontSize: `${15 * fontScale}px`, color: textColor }}>Voice Guidance</Text><Text style={{ fontSize: '12px', color: textSecColor }}>Read steps aloud</Text></div>
            {customSwitch(voiceGuidance, setVoiceGuidance)}
          </div>
          <Divider style={{ margin: '8px 0', borderColor: darkMode ? '#333' : '#F0F0F0' }} />
          <div style={rowStyle}>
            <div><Text strong style={{ display: 'block', fontSize: `${15 * fontScale}px`, color: textColor }}>Auto-Advance Steps</Text><Text style={{ fontSize: '12px', color: textSecColor }}>Move to next step automatically</Text></div>
            {customSwitch(autoAdvance, setAutoAdvance)}
          </div>
          <Divider style={{ margin: '8px 0', borderColor: darkMode ? '#333' : '#F0F0F0' }} />
          <div style={rowStyle}>
            <div><Text strong style={{ display: 'block', fontSize: `${15 * fontScale}px`, color: textColor }}>Keep Screen On</Text><Text style={{ fontSize: '12px', color: textSecColor }}>Prevent screen from sleeping</Text></div>
            {customSwitch(keepScreenOn, setKeepScreenOn)}
          </div>
        </Card>

        {/* --- 6. About --- */}
        <Card style={cardStyle} bodyStyle={{ padding: '24px' }}>
          <Title level={4} style={{ margin: '0 0 20px 0', fontWeight: 800, color: textColor }}>About</Title>
          <div style={rowStyle}><Text strong style={{ fontSize: `${15 * fontScale}px`, color: textColor }}>Version</Text><Text style={{ color: textSecColor }}>1.0.0</Text></div>
          <Divider style={{ margin: '12px 0', borderColor: darkMode ? '#333' : '#F0F0F0' }} />
          <div style={rowStyle}><Text strong style={{ fontSize: `${15 * fontScale}px`, color: textColor }}>Terms of Service</Text><RightOutlined style={{ color: textSecColor }} /></div>
          <Divider style={{ margin: '12px 0', borderColor: darkMode ? '#333' : '#F0F0F0' }} />
          <div style={rowStyle}><Text strong style={{ fontSize: `${15 * fontScale}px`, color: textColor }}>Privacy Policy</Text><RightOutlined style={{ color: textSecColor }} /></div>
          <Divider style={{ margin: '12px 0', borderColor: darkMode ? '#333' : '#F0F0F0' }} />
          <div style={rowStyle}><Text strong style={{ fontSize: `${15 * fontScale}px`, color: textColor }}>Help & Support</Text><RightOutlined style={{ color: textSecColor }} /></div>
        </Card>

        {/* --- 7. Danger Zone --- */}
        <Card style={{...cardStyle, border: `1px solid ${darkMode ? '#701010' : '#FFA39E'}`, backgroundColor: darkMode ? '#2A1010' : '#FFF1F0'}} bodyStyle={{ padding: '24px' }}>
          <Title level={5} style={{ margin: '0 0 16px 0', color: '#CF1322', fontWeight: 800 }}>Danger Zone</Title>
          <Button 
            block danger type="primary" icon={<DeleteOutlined />} 
            onClick={() => setShowDeleteModal(true)} 
            style={{ height: '48px', borderRadius: '12px', fontWeight: 700, backgroundColor: darkMode ? '#333' : '#FFF', color: '#CF1322', borderColor: '#FFA39E' }}
          >
            Delete Account
          </Button>
        </Card>
      </div>
    </div>
  );
};