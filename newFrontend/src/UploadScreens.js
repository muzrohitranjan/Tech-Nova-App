import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Typography, Input, message } from 'antd';
import { 
  LeftOutlined, AudioOutlined, UploadOutlined, FilePdfOutlined,
  BulbFilled, RightOutlined, PauseCircleOutlined, CheckCircleOutlined 
} from '@ant-design/icons';

const { Title, Text, Link } = Typography;
const { TextArea } = Input;

// --- Shared Styles ---
const pageStyle = {
  backgroundColor: '#FCF4F1',
  minHeight: '100vh',
  padding: '24px',
  paddingBottom: '80px',
};

const cardStyle = {
  width: '100%',
  borderRadius: '20px', 
  border: 'none', 
  boxShadow: '0 8px 24px rgba(0,0,0,0.05)', 
  marginTop: '24px',
  textAlign: 'center',
  padding: '16px 8px' 
};

const primaryBtnStyle = {
  width: '100%', 
  height: '48px', 
  background: 'linear-gradient(90deg, #FF7E27 0%, #F83A3A 100%)', 
  color: 'white',
  borderRadius: '8px', 
  border: 'none',
  fontSize: '16px',
  fontWeight: 700,
  boxShadow: '0 4px 12px rgba(248, 58, 58, 0.25)' 
};

const secondaryBtnStyle = {
  height: '48px',
  backgroundColor: '#FFF',
  color: '#333',
  borderColor: '#E2E8F0',
  borderRadius: '8px',
  fontWeight: 600,
  fontSize: '15px'
};

const Header = ({ title, subtitle, onBack }) => (
  <div style={{ marginBottom: '16px' }}>
    <Link onClick={onBack} style={{ color: '#555', fontWeight: 600, fontSize: '15px', display: 'inline-block', marginBottom: '16px' }}>
      <LeftOutlined /> Back
    </Link>
    <Title level={2} style={{ color: '#000', fontWeight: 800, margin: 0 }}>{title}</Title>
    {subtitle && <Text style={{ color: '#555', fontSize: '15px', display: 'block', marginTop: '4px' }}>{subtitle}</Text>}
  </div>
);

const InfoBox = ({ children, icon = <BulbFilled style={{ color: '#FFB75E', marginRight: '6px' }} /> }) => (
  <div style={{ backgroundColor: '#F0F5FF', borderRadius: '16px', padding: '16px', marginTop: '24px', border: '1px solid #D6E4FF', textAlign: 'left' }}>
    <Text style={{ color: '#1D39C4', fontSize: '13px', fontWeight: 500, lineHeight: '1.6', display: 'block' }}>
      {icon} {children}
    </Text>
  </div>
);

// ==========================================
// 1. RECORD VOICE
// ==========================================
export const RecordVoice = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [time, setTime] = useState(0);
  const timerRef = useRef(null);

  const handleRecordToggle = () => {
    if (isRecording) {
      clearInterval(timerRef.current);
      setIsRecording(false);
      setHasRecorded(true);
      message.success("Recording saved!");
    } else {
      setIsRecording(true);
      setHasRecorded(false);
      setTime(0);
      timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
    }
  };

  const handleExtract = () => {
    if (!hasRecorded) return message.error("Please record audio first!");
    navigate('/ai-processing');
  };

  return (
    <div style={pageStyle}>
      <Header title="Record Your Recipe" subtitle="Speak naturally about your recipe and cooking process" onBack={() => navigate('/add-recipe')} />
      <Card style={{...cardStyle, padding: '32px 16px'}}>
        
        <Title level={1} style={{ fontSize: '48px', fontWeight: 800, margin: '0 0 32px 0', color: isRecording ? '#F83A3A' : '#333' }}>
          {String(Math.floor(time / 60)).padStart(2, '0')}:{String(time % 60).padStart(2, '0')}
        </Title>

        <div 
          onClick={handleRecordToggle}
          style={{
            width: '110px', height: '110px', 
            background: isRecording ? '#FFF1F0' : 'linear-gradient(135deg, #FFB75E 0%, #F83A3A 100%)',
            border: isRecording ? '4px solid #F83A3A' : 'none',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto',
            color: isRecording ? '#F83A3A' : 'white', fontSize: '40px', boxShadow: '0 8px 24px rgba(248, 58, 58, 0.3)', cursor: 'pointer', transition: 'all 0.3s'
          }}
        >
          {isRecording ? <PauseCircleOutlined style={{ fontSize: '48px' }}/> : <AudioOutlined />}
        </div>
        
        <Text style={{ color: isRecording ? '#F83A3A' : '#666', fontSize: '16px', fontWeight: 600, display: 'block', marginBottom: '32px' }}>
          {isRecording ? 'Tap to Stop' : (hasRecorded ? 'Tap to Re-record' : 'Tap to Start')}
        </Text>

        <Button 
          disabled={!hasRecorded}
          style={{ width: '100%', height: '56px', borderRadius: '12px', fontWeight: 700, fontSize: '16px', background: hasRecorded ? 'linear-gradient(90deg, #FF7E27 0%, #F83A3A 100%)' : '#E2E8F0', color: hasRecorded ? 'white' : '#94A3B8', border: 'none' }}
          onClick={handleExtract}
        >
          Extract Recipe using AI
        </Button>
      </Card>
      
      <InfoBox>
        <strong style={{ color: '#030852'}}>Recording Tips:</strong><br/>
        • Speak clearly and at a steady pace<br/>
        • Include ingredients, quantities, and steps<br/>
        • Share any special techniques or family stories
      </InfoBox>
    </div>
  );
};

// ==========================================
// 2. UPLOAD AUDIO
// ==========================================
export const UploadAudio = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      message.success(`${uploadedFile.name} uploaded successfully!`);
    }
  };

  const handleExtract = () => {
    if (!file) return message.error("Please upload a file first!");
    navigate('/ai-processing');
  };

  return (
    <div style={pageStyle}>
      <Header title="Upload Audio File" subtitle="Upload your recipe recording for AI analysis" onBack={() => navigate('/add-recipe')} />
      
      <input type="file" id="audio-upload" accept="audio/*" style={{ display: 'none' }} onChange={handleFileUpload} />
      
      <label htmlFor="audio-upload">
        <Card style={{...cardStyle, cursor: 'pointer', backgroundColor: file ? '#F6FFED' : '#FFF'}}>
          <div style={{ border: `2px dashed ${file ? '#52C41A' : '#CBD5E1'}`, borderRadius: '16px', padding: '40px 16px', backgroundColor: file ? '#E6F7F0' : '#F8FAFC', transition: 'all 0.3s' }}>
            {file ? <CheckCircleOutlined style={{ fontSize: '48px', color: '#52C41A', marginBottom: '16px' }} /> : <UploadOutlined style={{ fontSize: '48px', color: '#64748B', marginBottom: '16px' }} />}
            <Text style={{ display: 'block', fontWeight: 700, fontSize: '16px', color: file ? '#52C41A' : '#334155' }}>
              {file ? 'Audio Ready!' : 'Click to upload audio file'}
            </Text>
            <Text style={{ color: '#64748B', fontSize: '13px' }}>{file ? file.name : 'MP3, WAV, M4A, or other formats'}</Text>
          </div>
        </Card>
      </label>

      <Button 
        disabled={!file}
        style={{ width: '100%', height: '56px', borderRadius: '12px', fontWeight: 700, fontSize: '16px', background: file ? 'linear-gradient(90deg, #FF7E27 0%, #F83A3A 100%)' : '#E2E8F0', color: file ? 'white' : '#94A3B8', border: 'none', marginTop: '16px' }}
        onClick={handleExtract}
      >
        Extract Recipe using AI
      </Button>

      <InfoBox icon={null}>
        <strong style={{ color: '#030852'}}>📁 Supported formats:</strong> MP3, WAV, M4A, AAC<br/>
        <strong style={{ color: '#030852'}}>📏 Max file size:</strong> 50MB
      </InfoBox>
    </div>
  );
};

// ==========================================
// 3. UPLOAD PDF / IMAGE
// ==========================================
export const UploadPDF = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      message.success(`${uploadedFile.name} uploaded successfully!`);
    }
  };

  const handleExtract = () => {
    if (!file) return message.error("Please upload a file first!");
    navigate('/ai-processing');
  };

  return (
    <div style={pageStyle}>
      <Header title="Upload Document" subtitle="Upload your written recipe for AI extraction" onBack={() => navigate('/add-recipe')} />
      
      <input type="file" id="pdf-upload" accept=".pdf,image/*" style={{ display: 'none' }} onChange={handleFileUpload} />
      
      <label htmlFor="pdf-upload">
        <Card style={{...cardStyle, cursor: 'pointer', backgroundColor: file ? '#F6FFED' : '#FFF'}}>
          <div style={{ border: `2px dashed ${file ? '#52C41A' : '#FFB75E'}`, borderRadius: '16px', padding: '40px 16px', backgroundColor: file ? '#E6F7F0' : '#FFFBF5', transition: 'all 0.3s' }}>
            {file ? <CheckCircleOutlined style={{ fontSize: '48px', color: '#52C41A', marginBottom: '16px' }} /> : <FilePdfOutlined style={{ fontSize: '48px', color: '#94A3B8', marginBottom: '16px' }} />}
            <Text style={{ display: 'block', fontWeight: 700, fontSize: '16px', color: file ? '#52C41A' : '#334155' }}>
              {file ? 'Document Ready!' : 'Click to upload PDF or Image'}
            </Text>
            <Text style={{ color: '#64748B', fontSize: '13px' }}>{file ? file.name : 'Supports PDF, JPG, PNG'}</Text>
          </div>
        </Card>
      </label>

      <Button 
        disabled={!file}
        style={{ width: '100%', height: '56px', borderRadius: '12px', fontWeight: 700, fontSize: '16px', background: file ? 'linear-gradient(90deg, #FF7E27 0%, #F83A3A 100%)' : '#E2E8F0', color: file ? 'white' : '#94A3B8', border: 'none', marginTop: '16px' }}
        onClick={handleExtract}
      >
        Extract Recipe using AI
      </Button>

      <InfoBox icon={null}>
        <strong style={{ color: '#030852'}}>📄 What to include:</strong><br/>
        • Recipe name and description<br/>
        • Complete ingredients list<br/>
        • Step-by-step instructions<br/>
        • Any cultural context or stories
      </InfoBox>
    </div>
  );
};

// ==========================================
// 4. AI PROCESSING
// ==========================================
export const AiProcessing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/cultural-questions'), 3000); 
    return () => clearTimeout(timer);
  }, [navigate]);

  const loadingItem = (text, color) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', textAlign: 'left' }}>
      <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: `2px solid ${color}`, borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
      <Text style={{ fontWeight: 500, color: '#333' }}>{text}</Text>
    </div>
  );

  return (
    <div style={{...pageStyle, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center'}}>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      
      <div style={{
        width: '80px', height: '80px', background: 'linear-gradient(135deg, #FF7E27 0%, #F83A3A 100%)',
        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto',
        color: 'white', fontSize: '40px', boxShadow: '0 8px 24px rgba(248, 58, 58, 0.3)'
      }}>
        ✨
      </div>
      <Title level={2} style={{ color: '#000', fontWeight: 800 }}>Analyzing Your Recipe</Title>
      <Text style={{ color: '#555', fontSize: '15px', display: 'block', marginBottom: '32px', padding: '0 16px' }}>
        Our AI is extracting structured data from your recipe, including ingredients, steps, and cooking techniques...
      </Text>

      <Card style={{...cardStyle, padding: '24px', marginTop: 0}}>
        {loadingItem("Transcribing audio/text...", "#52C41A")}
        {loadingItem("Extracting ingredients...", "#1890FF")}
        {loadingItem("Identifying cooking steps...", "#FA8C16")}
        {loadingItem("Preparing cultural questions...", "#722ED1")}
      </Card>
    </div>
  );
};

// ==========================================
// 5. CULTURAL QUESTIONS FLOW
// ==========================================
export const CulturalQuestions = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const questions = [
    { q: "What is the cultural origin or region of this recipe?", placeholder: "e.g., Southern Italy, Kerala India, Mexico City..." },
    { q: "Are there any family traditions or stories associated with this dish?", placeholder: "Share any special memories or occasions..." },
    { q: "Are there any special techniques or tips passed down in your family?", placeholder: "e.g., specific cooking methods, ingredient choices..." },
    { q: "What occasions or celebrations is this recipe typically made for?", placeholder: "e.g., holidays, family gatherings, everyday meals..." }
  ];

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else navigate('/recipe-preview'); 
  };

  const progress = ((step + 1) / 4) * 100;

  return (
    <div style={{...pageStyle, padding: '24px'}}>
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        {step === 0 ? (
          <Link onClick={() => navigate('/add-recipe')} style={{ color: '#555', fontWeight: 600 }}><LeftOutlined /> Back</Link>
        ) : (
          <Link onClick={() => setStep(step - 1)} style={{ color: '#555', fontWeight: 600 }}><LeftOutlined /> Previous</Link>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <Text style={{ color: '#555', fontWeight: 500, fontSize: '13px' }}>Question {step + 1} of 4</Text>
        <Text style={{ color: '#F83A3A', fontWeight: 700, fontSize: '13px' }}>{progress}% Complete</Text>
      </div>
      <div style={{ width: '100%', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '4px', marginBottom: '32px' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #FF7E27 0%, #F83A3A 100%)', borderRadius: '4px', transition: 'width 0.3s ease' }} />
      </div>

      <Card style={{...cardStyle, marginTop: 0, padding: '24px 16px', border: '1px solid #F0F0F0'}}>
        <div style={{ 
          width: '48px', height: '48px', backgroundColor: '#FFF0E6', color: '#F83A3A', 
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
          fontWeight: 800, fontSize: '20px', margin: '0 auto 16px auto' 
        }}>
          {step + 1}
        </div>
        <Title level={3} style={{ fontWeight: 800, margin: '0 0 24px 0', textAlign: 'center', lineHeight: '1.3' }}>
          {questions[step].q}
        </Title>
        <TextArea 
          rows={5} 
          placeholder={questions[step].placeholder} 
          style={{ borderRadius: '12px', padding: '16px', fontSize: '15px', backgroundColor: '#FAFAFA', border: '1px solid #E2E8F0' }} 
        />
      </Card>

      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <Button style={{...secondaryBtnStyle, width: '30%'}} onClick={handleNext}>Skip</Button>
        <Button style={{...primaryBtnStyle, width: '70%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'}} onClick={handleNext}>
          {step === 3 ? "Review Recipe" : "Next Question"} <RightOutlined />
        </Button>
      </div>

    </div>
  );
};