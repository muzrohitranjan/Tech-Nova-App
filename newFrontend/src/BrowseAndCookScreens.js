import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Button, Typography, Input, Checkbox, Drawer, Select, Badge } from 'antd';
import { 
  ClockCircleOutlined, UserOutlined, 
  SearchOutlined, FilterOutlined, CheckCircleOutlined,
  ArrowLeftOutlined, LeftOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const pageStyle = { backgroundColor: '#FCF4F1', minHeight: '100vh', paddingBottom: '80px' };

const ChefHatSmall = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '4px' }}>
    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path>
    <line x1="6" y1="17" x2="18" y2="17"></line>
  </svg>
);

// --- MOCK DATABASE ---
const recipesData = [
  {
    id: 1,
    title: "Authentic Mexican Tacos",
    time: "30 mins",
    servings: "4 servings",
    diff: "Easy",
    diffColor: "#FF7E27",
    diffBg: "#FFF0E6",
    desc: "Street-style tacos from Mexico City, a staple of Mexican...",
    story: "A classic street food staple straight from the heart of Mexico City. These tacos are vibrant, zesty, and perfect for sharing.",
    img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=300&q=80",
    ingredients: ["12 Corn tortillas", "500g Flank steak", "1 Onion, diced", "Fresh cilantro", "2 Limes", "Salsa verde"],
    steps: ["Marinate the steak in citrus and spices", "Grill the steak over high heat until charred", "Warm the corn tortillas", "Chop the steak into small pieces", "Assemble tacos with meat, onions, and cilantro", "Serve with fresh lime wedges"]
  },
  {
    id: 2,
    title: "Grandmother's Chicken Curry",
    time: "45 mins",
    servings: "6 servings",
    diff: "Easy",
    diffColor: "#FF7E27",
    diffBg: "#FFF0E6",
    desc: "A family recipe passed down through generations in Kerala...",
    story: "A family recipe passed down through generations in Kerala, India. It brings back memories of Sunday family lunches and is best served with hot parottas.",
    img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=300&q=80",
    ingredients: ["1kg Chicken", "2 Onions", "4 Tomatoes", "Ginger-garlic paste", "Curry spices", "Coconut milk", "Curry leaves"],
    steps: ["Marinate chicken with turmeric and salt", "Sauté onions and ginger-garlic paste until golden", "Add tomatoes and curry spices, cook until oil separates", "Add the chicken and sear on all sides", "Pour in coconut milk and simmer for 25 minutes", "Garnish with fresh curry leaves and serve hot"]
  },
  {
    id: 3,
    title: "Grandmother's Special Biryani",
    time: "2 hours",
    servings: "6 servings",
    diff: "Medium",
    diffColor: "#D48806",
    diffBg: "#FFFBE6",
    desc: "A traditional recipe from Hyderabad, India, passed...",
    story: "This rich, aromatic biryani uses a slow-cooking 'dum' method to trap the steam, infusing the basmati rice with exotic spices and tender meat.",
    img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80",
    ingredients: ["2 cups Basmati Rice", "500g Mutton/Chicken", "Saffron strands", "Whole spices (cardamom, cloves, cinnamon)", "Crispy fried onions", "Ghee"],
    steps: ["Soak rice for 30 minutes", "Marinate meat in yogurt and spices overnight", "Parboil rice with whole spices", "Layer meat and rice in a heavy-bottomed pot", "Top with saffron milk and fried onions", "Seal pot and slow-cook on low heat for 45 mins"]
  },
  {
    id: 4,
    title: "Traditional Italian Pasta Carbonara",
    time: "20 mins",
    servings: "4 servings",
    diff: "Medium",
    diffColor: "#D48806",
    diffBg: "#FFFBE6",
    desc: "A classic Roman dish from the Lazio region, traditionally ma...",
    story: "A classic Roman dish from the Lazio region, traditionally made without cream. The rich sauce is created purely from egg yolks, cheese, and starchy pasta water.",
    img: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=300&q=80",
    ingredients: ["400g Spaghetti", "200g Guanciale", "4 Egg yolks", "100g Pecorino Romano", "Black pepper", "Salt"],
    steps: ["Boil water and cook spaghetti until al dente", "Cut guanciale into small pieces and cook until crispy", "Mix egg yolks with grated pecorino", "Combine hot pasta with guanciale", "Remove from heat and add egg mixture, stirring quickly", "Serve immediately with extra pecorino and black pepper"]
  }
];

// ==========================================
// 1. BROWSE RECIPES SCREEN (With Filters)
// ==========================================
export const RecipesList = () => {
  const navigate = useNavigate();
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [selectedCuisines, setSelectedCuisines] = useState([]);

  // Mock Categories
  const cuisineOptions = ["Mexican", "Indian", "Italian", "Asian"];

  // Advanced Filtering Logic
  const filteredRecipes = useMemo(() => {
    let result = recipesData;

    if (searchQuery) {
      result = result.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    if (selectedCuisines.length > 0) {
      result = result.filter(r => selectedCuisines.some(c => r.desc.includes(c) || r.story.includes(c) || r.title.includes(c)));
    }

    result.sort((a, b) => {
      if (sortBy === "name") return a.title.localeCompare(b.title);
      if (sortBy === "time") return parseInt(a.time) - parseInt(b.time);
      if (sortBy === "diff") return a.diff.localeCompare(b.diff);
      return 0;
    });

    return result;
  }, [searchQuery, sortBy, selectedCuisines]);

  return (
    <div style={pageStyle}>
      <div style={{ background: 'linear-gradient(135deg, #FF7E27 0%, #F83A3A 100%)', padding: '60px 24px 30px 24px', borderBottomLeftRadius: '30px', borderBottomRightRadius: '30px' }}>
        <Title level={2} style={{ color: 'white', margin: '0 0 24px 0', fontWeight: 800 }}>Browse Recipes</Title>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Input 
            size="large" 
            prefix={<SearchOutlined style={{ color: '#FF7E27', fontSize: '18px', marginRight: '4px' }}/>} 
            placeholder="Search recipes..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ borderRadius: '16px', border: 'none', flex: 1, height: '52px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
          />
          <Badge count={selectedCuisines.length} color="#FAAD14">
            <FilterOutlined onClick={() => setIsFilterOpen(true)} style={{ color: 'white', fontSize: '24px', marginLeft: '8px', cursor: 'pointer' }} />
          </Badge>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <Text strong style={{ fontSize: '15px' }}>Showing {filteredRecipes.length} Results</Text>
        </div>

        {filteredRecipes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Text type="secondary" style={{ display: 'block', marginBottom: '12px' }}>No recipes match your filters.</Text>
            <Button type="primary" style={{ backgroundColor: '#FF7E27', border: 'none' }} onClick={() => { setSearchQuery(""); setSelectedCuisines([]); }}>Clear Filters</Button>
          </div>
        ) : (
          filteredRecipes.map(recipe => (
            <Card key={recipe.id} onClick={() => navigate('/recipe-detail', { state: { recipe } })} style={{ borderRadius: '24px', border: 'none', marginBottom: '20px', overflow: 'hidden', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }} bodyStyle={{ padding: '16px', display: 'flex', gap: '16px' }}>
              <img src={recipe.img} style={{ width: '110px', height: '110px', borderRadius: '16px', objectFit: 'cover', flexShrink: 0 }} alt={recipe.title} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Title level={5} style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 800 }}>{recipe.title}</Title>
                <Text type="secondary" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <ClockCircleOutlined style={{ color: '#FF7E27', marginRight: '4px' }} /> {recipe.time} • {recipe.servings}
                </Text>
                <div style={{ display: 'inline-block', backgroundColor: recipe.diffBg, color: recipe.diffColor, borderRadius: '8px', fontWeight: 700, padding: '4px 10px', fontSize: '11px', alignSelf: 'flex-start' }}>{recipe.diff}</div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* --- ✅ FIXED FILTER DRAWER ONLY --- */}
      <Drawer
        title="Filter Recipes"
        placement="bottom"
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        height={420}
        getContainer={false}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          borderTopLeftRadius: "24px",
          borderTopRightRadius: "24px",
          overflow: "hidden"
        }}
        bodyStyle={{ padding: '20px' }}
        headerStyle={{ borderBottom: 'none' }}
      >

        {/* Sort By */}
        <div style={{ marginBottom: '24px' }}>
          <Text strong style={{ display: 'block', marginBottom: '8px' }}>Sort By</Text>
          <Select
            value={sortBy}
            onChange={setSortBy}
            style={{ width: '100%' }}
            options={[
              { value: 'name', label: 'Name (A-Z)' },
              { value: 'time', label: 'Cooking Time' },
              { value: 'diff', label: 'Difficulty' }
            ]}
          />
        </div>

        {/* Cuisine Chips (REPLACED CHECKBOX) */}
        <div style={{ marginBottom: '32px' }}>
          <Text strong style={{ display: 'block', marginBottom: '12px' }}>Cuisine Types</Text>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {cuisineOptions.map(cuisine => {
              const selected = selectedCuisines.includes(cuisine);

              return (
                <div
                  key={cuisine}
                  onClick={() => {
                    setSelectedCuisines(prev =>
                      prev.includes(cuisine)
                        ? prev.filter(c => c !== cuisine)
                        : [...prev, cuisine]
                    );
                  }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '20px',
                    background: selected ? '#FF7E27' : '#eee',
                    color: selected ? '#fff' : '#333',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  {cuisine}
                </div>
              );
            })}
          </div>
        </div>

        {/* Apply Button */}
        <Button
          type="primary"
          block
          size="large"
          onClick={() => setIsFilterOpen(false)}
          style={{
            background: '#FF7E27',
            fontWeight: 700,
            borderRadius: '12px',
            border: 'none'
          }}
        >
          Apply Filters
        </Button>

      </Drawer>
    </div>
  );
};

// ==========================================
// 2. RECIPE DETAIL VIEW 
// ==========================================
export const RecipeDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const recipe = location.state?.recipe || recipesData[0];

  return (
    // Increased paddingBottom so user can scroll past the bottom bar easily
    <div style={{ backgroundColor: '#FCF4F1', minHeight: '100vh', paddingBottom: '160px' }}>
      <div style={{ position: 'relative', width: '100%', height: '320px' }}>
        <img src={recipe.img} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ 
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '150px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
          display: 'flex', alignItems: 'flex-end', padding: '24px'
        }}>
          <Title level={2} style={{ color: '#FFF', margin: 0, fontWeight: 800, lineHeight: 1.2 }}>{recipe.title}</Title>
        </div>
        <Button shape="circle" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ position: 'absolute', top: '48px', left: '24px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
      </div>

      <div style={{ padding: '24px', marginTop: '-16px', position: 'relative', zIndex: 10 }}>
        <Card style={{ borderRadius: '24px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', marginBottom: '24px' }} bodyStyle={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
            <div>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#FFF0E6', color: '#FF5238', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto', fontSize: '18px' }}><ClockCircleOutlined /></div>
              <Text style={{ display: 'block', fontWeight: 700, fontSize: '12px' }}>Time</Text>
              <Text style={{ color: '#666', fontSize: '12px' }}>{recipe.time}</Text>
            </div>
            <div>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#EBF3FF', color: '#1A5DAB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto', fontSize: '18px' }}><UserOutlined /></div>
              <Text style={{ display: 'block', fontWeight: 700, fontSize: '12px' }}>Servings</Text>
              <Text style={{ color: '#666', fontSize: '12px' }}>{recipe.servings}</Text>
            </div>
            <div>
              <div style={{ width: '40px', height: '40px', backgroundColor: recipe.diffBg, color: recipe.diffColor, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto' }}><ChefHatSmall color={recipe.diffColor} /></div>
              <Text style={{ display: 'block', fontWeight: 700, fontSize: '12px' }}>Level</Text>
              <Text style={{ color: '#666', fontSize: '12px' }}>{recipe.diff}</Text>
            </div>
          </div>
          <div style={{ backgroundColor: '#FFFBF5', borderRadius: '16px', padding: '16px', marginTop: '24px', border: '1px solid #FFE4C4' }}>
            <Text style={{ color: '#8B4513', fontSize: '14px', fontWeight: 800, display: 'block', marginBottom: '8px' }}>Cultural Story</Text>
            <Text style={{ color: '#8B4513', fontSize: '13px', lineHeight: '1.6' }}>{recipe.story}</Text>
          </div>
        </Card>

        <Card style={{ borderRadius: '24px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', marginBottom: '24px' }} bodyStyle={{ padding: '24px' }}>
          <Title level={4} style={{ fontWeight: 800, marginTop: 0 }}>Ingredients</Title>
          <ul style={{ paddingLeft: '20px', margin: 0, color: '#000', fontWeight: 600, lineHeight: '2.2', fontSize: '14px' }}>
            {recipe.ingredients.map((item, i) => (
               <li key={i} style={{ marker: '•', color: '#FF5238' }}><span style={{ color: '#333' }}>{item}</span></li>
            ))}
          </ul>
        </Card>

        <Card style={{ borderRadius: '24px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }} bodyStyle={{ padding: '24px' }}>
          <Title level={4} style={{ fontWeight: 800, marginTop: 0, marginBottom: '24px' }}>Cooking Steps</Title>
          {recipe.steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', marginBottom: '20px' }}>
              <div style={{ width: '32px', height: '32px', backgroundColor: '#FFF0E6', color: '#FF5238', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', marginRight: '16px', flexShrink: 0 }}>{i + 1}</div>
              <Text style={{ color: '#333', fontWeight: 600, fontSize: '14px', paddingTop: '6px', lineHeight: '1.5' }}>{step}</Text>
            </div>
          ))}
        </Card>

        {/* This div is now lifted to bottom: 75px so it sits beautifully above the bottom navigation menu! */}
        <div style={{ 
  padding: '20px 24px',
  marginTop: '20px'
}}>
  <Button 
    style={{ 
      height: '56px', 
      width: '100%', 
      borderRadius: '16px', 
      fontWeight: 700, 
      fontSize: '16px', 
      background: 'linear-gradient(90deg, #FF7E27 0%, #F83A3A 100%)', 
      color: 'white', 
      border: 'none', 
      boxShadow: '0 4px 12px rgba(248, 58, 58, 0.25)' 
    }}
    onClick={() => navigate('/cooking-prep', { state: { recipe } })}
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
    Start Cooking
  </Button>
</div>
      </div>
    </div>
  );
};

// ==========================================
// 3. COOKING PREPARATION SCREEN 
// ==========================================
export const CookingPrep = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const recipe = location.state?.recipe || recipesData[0];

  return (
    <div style={{...pageStyle, padding: '24px'}}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', marginTop: '16px' }}>
        <Typography.Link onClick={() => navigate(-1)} style={{ color: '#555', fontWeight: 600, fontSize: '15px' }}><LeftOutlined /> Back</Typography.Link>
      </div>

      <Title level={2} style={{ color: '#000', fontWeight: 800, margin: 0 }}>Prepare to Cook</Title>
      <Text style={{ color: '#555', fontSize: '15px', display: 'block', marginBottom: '24px' }}>Get everything ready before you start</Text>

      <Card style={{ borderRadius: '24px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', marginBottom: '24px', overflow: 'hidden' }} bodyStyle={{ padding: 0 }}>
        <img src={recipe.img} alt={recipe.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
        <div style={{ padding: '20px' }}>
          <Title level={4} style={{ margin: '0 0 12px 0', fontWeight: 800 }}>{recipe.title}</Title>
          <div style={{ display: 'flex', gap: '16px', color: '#666', fontSize: '13px', fontWeight: 600 }}>
            <span><ClockCircleOutlined style={{ color: '#FF5238', marginRight: '4px' }}/> {recipe.time}</span>
            <span><UserOutlined style={{ color: '#FF5238', marginRight: '4px' }}/> {recipe.servings}</span>
            <span><ChefHatSmall color="#FF5238" /> {recipe.diff}</span>
          </div>
        </div>
      </Card>

      <Card style={{ borderRadius: '24px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', padding: '24px', marginBottom: '24px' }}>
        <Title level={4} style={{ fontWeight: 800, marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircleOutlined style={{ color: '#52C41A' }} /> Ingredients
        </Title>
        <Text style={{ color: '#666', display: 'block', marginBottom: '16px' }}>Make sure you have everything ready</Text>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {recipe.ingredients.map((item, i) => (
            <Checkbox key={i} style={{ fontWeight: 600, fontSize: '15px' }}><span style={{ marginLeft: '8px' }}>{item}</span></Checkbox>
          ))}
        </div>
      </Card>

      <Card style={{ borderRadius: '24px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', padding: '24px', marginBottom: '32px' }}>
        <Title level={4} style={{ fontWeight: 800, marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#000' }}>
          <ChefHatSmall color="#000" /> Tools Needed
        </Title>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
          {["Large pot or Dutch oven", "Cutting board and knife", "Mixing bowls", "Wooden spoon", "Measuring cups and spoons"].map((item, i) => (
            <Checkbox key={i} style={{ fontWeight: 600, fontSize: '15px' }}><span style={{ marginLeft: '8px' }}>{item}</span></Checkbox>
          ))}
        </div>
      </Card>

      <Button 
        style={{ height: '56px', width: '100%', borderRadius: '16px', fontWeight: 700, fontSize: '16px', background: 'linear-gradient(90deg, #FF7E27 0%, #F83A3A 100%)', color: 'white', border: 'none', boxShadow: '0 4px 12px rgba(248, 58, 58, 0.25)' }}
        onClick={() => navigate('/cooking-mode', { state: { recipe } })}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        Start Cooking
      </Button>
    </div>
  );
};