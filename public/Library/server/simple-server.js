import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 8787;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());

// Simple rate limiting
const rateLimitMap = new Map();

app.use('/api', (req, res, next) => {
  const clientId = req.ip || 'anonymous';
  const now = Date.now();
  const windowMs = 1000; // 1 second
  const limit = 1;
  
  const clientData = rateLimitMap.get(clientId);
  
  if (!clientData || now > clientData.resetTime) {
    rateLimitMap.set(clientId, { count: 1, resetTime: now + windowMs });
    next();
  } else if (clientData.count < limit) {
    clientData.count++;
    next();
  } else {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }
});

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI Plan endpoint
app.post('/api/ai/plan', async (req, res) => {
  try {
    console.log('📝 AI Plan request received:', req.body);
    console.log('📝 Request headers:', req.headers);
    
    // Validate request body
    if (!req.body) {
      console.error('❌ No request body received');
      return res.status(400).json({ 
        success: false, 
        error: 'No request body received' 
      });
    }
    
    // For now, return a simple mock response
    const mockResponse = {
      success: true,
      pageConfig: {
        brand: {
          name: req.body.userSpeech?.split(' ')[0] || 'Your Business',
          tagline: 'Professional solutions for your needs',
          industry: 'Business',
          targetAudience: 'Professionals',
          tone: 'professional'
        },
        sections: [
          { id: 'navbar', variant: 1, props: {} },
          { id: 'hero', variant: 1, props: {} },
          { id: 'features', variant: 1, props: {} },
          { id: 'pricing', variant: 1, props: {} },
          { id: 'footer', variant: 1, props: {} }
        ]
      },
      warnings: ['Generated using mock AI response']
    };
    
    console.log('📝 Sending response:', mockResponse);
    res.json(mockResponse);
  } catch (error) {
    console.error('❌ AI Plan error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
