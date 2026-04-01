import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Button, Typography, Progress, Rate, Tag } from 'antd';
import { 
    LeftOutlined, RightOutlined, AudioOutlined, ReloadOutlined, 
    HomeOutlined, BookOutlined, TrophyFilled
  } from '@ant-design/icons';
const { Title, Text } = Typography;

export const CookingMode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const recipe = location.state?.recipe || { title: "Recipe", steps: ["Step 1"] };
  
  const [currentStep, setCurrentStep] = useState(0);
  const progress = Math.round(((currentStep + 1) / recipe.steps.length) * 100);

  // --- Real Voice Text-to-Speech Functionality ---
  const handleVoiceHint = () => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      window.speechSynthesis.cancel();
      // Create new speech utterance for current step
      const speech = new SpeechSynthesisUtterance(recipe.steps[currentStep]);
      speech.rate = 0.9; // Speak slightly slower so it's easy to hear in kitchen
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, your browser doesn't support voice synthesis.");
    }
  };

  // Stop speaking if they leave the page
  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const handleNext = () => {
    if (currentStep < recipe.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/cooking-completed', { state: { recipe } });
    }
  };

  return (
    <div style={{ backgroundColor: '#FCF4F1', minHeight: '100vh', paddingBottom: '40px' }}>
      {/* Header with Progress */}
      <div style={{ background: 'linear-gradient(135deg, #FF7E27 0%, #F83A3A 100%)', padding: '40px 24px 24px 24px', borderBottomLeftRadius: '32px', borderBottomRightRadius: '32px' }}>
        <Title level={4} style={{ color: '#FFF', margin: 0 }}>{recipe.title}</Title>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#FFF', marginTop: '12px', fontSize: '12px', fontWeight: 600 }}>
          <span>Step {currentStep + 1} of {recipe.steps.length}</span>
          <span>{progress}% Complete</span>
        </div>
        <Progress percent={progress} showInfo={false} strokeColor="#FFF" trailColor="rgba(255,255,255,0.3)" strokeWidth={6} style={{ marginTop: '8px' }} />
      </div>

      <div style={{ padding: '24px' }}>
        {/* Step Card */}
        <Card style={{ borderRadius: '24px', border: 'none', boxShadow: '0 12px 32px rgba(0,0,0,0.06)', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
          <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #FFB75E 0%, #F83A3A 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', fontWeight: 800, margin: '0 auto 32px auto' }}>
            {currentStep + 1}
          </div>
          <Title level={3} style={{ fontWeight: 700, lineHeight: 1.4 }}>{recipe.steps[currentStep]}</Title>
        </Card>

        {/* Action Buttons */}
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Button 
            onClick={handleVoiceHint} 
            icon={<AudioOutlined />} 
            size="large" 
            style={{ height: '50px', borderRadius: '12px', backgroundColor: '#1890FF', color: '#FFF', border: 'none', fontWeight: 600 }}
          >
            Voice Hint
          </Button>
          <Button 
            onClick={handleVoiceHint} 
            icon={<ReloadOutlined />} 
            size="large" 
            style={{ height: '50px', borderRadius: '12px', fontWeight: 600 }}
          >
            Repeat Step
          </Button>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <Button 
              disabled={currentStep === 0} 
              onClick={() => setCurrentStep(currentStep - 1)} 
              icon={<LeftOutlined />} 
              style={{ width: '40%', height: '50px', borderRadius: '12px', fontWeight: 600 }}
            >
              Previous
            </Button>
            <Button 
              onClick={handleNext} 
              style={{ width: '60%', height: '50px', borderRadius: '12px', backgroundColor: '#F83A3A', color: '#FFF', border: 'none', fontWeight: 700 }}
            >
              {currentStep === recipe.steps.length - 1 ? 'Complete' : 'Next Step'} <RightOutlined />
            </Button>
          </div>
        </div>

        {/* Quick Jump Dots */}
        <div style={{ marginTop: '32px', backgroundColor: '#FFF', borderRadius: '16px', padding: '16px', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
           {recipe.steps.map((_, i) => (
             <div key={i} onClick={() => setCurrentStep(i)} style={{ 
               width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
               backgroundColor: i === currentStep ? '#F83A3A' : (i < currentStep ? '#E6F4EA' : '#F5F5F5'),
               color: i === currentStep ? '#FFF' : (i < currentStep ? '#52C41A' : '#999'),
               transition: 'all 0.3s'
             }}>{i + 1}</div>
           ))}
        </div>
      </div>
    </div>
  );
};

export const CookingCompleted = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const recipe = location.state?.recipe || { title: "Recipe" };

  return (
    <div style={{ backgroundColor: '#FCF4F1', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '24px', textAlign: 'center' }}>
      <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #FFB75E 0%, #F83A3A 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', marginBottom: '24px' }}>🎉</div>
      <Title level={2} style={{ fontWeight: 800, margin: 0 }}>Congratulations!</Title>
      <Text style={{ fontSize: '16px', color: '#666', display: 'block', marginTop: '8px' }}>You've successfully completed</Text>
      <Text style={{ fontSize: '18px', fontWeight: 800, color: '#FF5238' }}>{recipe.title}</Text>

      <Card style={{ width: '100%', borderRadius: '20px', border: 'none', marginTop: '32px', padding: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
        <Text strong style={{ display: 'block', marginBottom: '16px' }}>How did it turn out?</Text>
        <Rate defaultValue={5} style={{ fontSize: '32px', color: '#FFB75E' }} />
      </Card>

      <Card style={{ width: '100%', borderRadius: '20px', border: 'none', background: 'linear-gradient(135deg, #9C27B0 0%, #E91E63 100%)', marginTop: '20px', color: '#FFF', boxShadow: '0 8px 24px rgba(233, 30, 99, 0.25)' }}>
        <TrophyFilled style={{ fontSize: '24px', marginBottom: '8px' }} />
        <Title level={4} style={{ color: '#FFF', margin: 0 }}>Achievement Unlocked!</Title>
        <Text style={{ color: 'rgba(255,255,255,0.8)' }}>You've completed your 10th recipe</Text>
        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <Tag color="rgba(255,255,255,0.2)" style={{ border: 'none', color: '#FFF', borderRadius: '10px' }}>Master Chef</Tag>
          <Tag color="rgba(255,255,255,0.2)" style={{ border: 'none', color: '#FFF', borderRadius: '10px' }}>Quick Cook</Tag>
        </div>
      </Card>

      <div style={{ marginTop: '32px', display: 'flex', gap: '12px', width: '100%' }}>
        <Button onClick={() => navigate('/recipes')} icon={<BookOutlined />} size="large" style={{ flex: 1, borderRadius: '12px', height: '50px', fontWeight: 600 }}>More Recipes</Button>
        <Button onClick={() => navigate('/dashboard')} icon={<HomeOutlined />} size="large" style={{ flex: 1, borderRadius: '12px', height: '50px', backgroundColor: '#F83A3A', color: '#FFF', border: 'none', fontWeight: 700 }}>Home</Button>
      </div>
    </div>
  );
};