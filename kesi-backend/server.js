const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const { User, Case, Evidence } = require('./models');
const { auth, generateToken } = require('./middleware/auth');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize database and create tables
async function initializeDatabase() {
  try {
    await sequelize.sync();
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
}

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = generateToken(user);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isValid = await user.validatePassword(password);
    if (!isValid) {
      console.log('Invalid password for:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    console.log('Login successful for:', email);
    res.json({ 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }, 
      token 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Protected routes
app.use('/api/evidence', auth);
app.use('/api/cases', auth);

// Evidence routes
app.post('/api/evidence', async (req, res) => {
  try {
    const evidence = await Evidence.create({
      ...req.body,
      uploadedById: req.user.id
    });
    res.status(201).json(evidence);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/evidence', async (req, res) => {
  try {
    const evidence = await Evidence.findAll({
      include: [
        { model: User, as: 'uploadedBy', attributes: ['id', 'username', 'email'] },
        { model: Case, attributes: ['id', 'title'] }
      ]
    });
    res.json(evidence);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/evidence/:id', async (req, res) => {
  try {
    const evidence = await Evidence.findByPk(req.params.id, {
      include: [
        { model: User, as: 'uploadedBy', attributes: ['id', 'username', 'email'] },
        { model: Case, attributes: ['id', 'title'] }
      ]
    });
    if (!evidence) {
      return res.status(404).json({ error: 'Evidence not found' });
    }
    res.json(evidence);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Case routes
app.post('/api/cases', async (req, res) => {
  try {
    const case_ = await Case.create({
      ...req.body,
      assignedToId: req.user.id
    });
    res.status(201).json(case_);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/cases', async (req, res) => {
  try {
    const cases = await Case.findAll({
      include: [
        { model: User, as: 'assignedTo', attributes: ['id', 'username', 'email'] },
        { model: Evidence }
      ]
    });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}); 