const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname)));

// Add a route to serve main.html specifically
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/main.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'main.html'));
});

// Debug route to check if server is working
app.get('/test', (req, res) => {
    res.json({ message: 'Server is running!', timestamp: new Date().toISOString() });
});

// Get all schools
app.get('/api/schools', async (req, res) => {
    try {
        const schools = await db.getSchools();
        res.json(schools);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new school
app.post('/api/schools', async (req, res) => {
    try {
        await db.addSchool(req.body);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a school
app.put('/api/schools/:id', async (req, res) => {
    try {
        await db.updateSchool(req.params.id, req.body);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a school
app.delete('/api/schools/:id', async (req, res) => {
    try {
        await db.deleteSchool(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// =============================================
// SUBJECTS ENDPOINTS
// =============================================



// =============================================
// ITEMS ENDPOINTS
// =============================================

// SLM/SLAS Items endpoints
app.get('/api/items/slm', async (req, res) => {
    try {
        console.log('GET /api/items/slm - Fetching SLM items...');
        const items = await db.getAllSLMItems();
        console.log(`Found ${items.length} SLM items`);
        res.json(items);
    } catch (err) {
        console.error('Error fetching SLM items:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/items/slm', async (req, res) => {
    try {
        const { title, subject, gradeLevel, quarter, quantity, status, description } = req.body;
        const slmItemID = await db.addSLMItem(title, subject, gradeLevel, quarter, quantity, status, description);
        res.json({ success: true, slmItemID });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/items/slm/:id', async (req, res) => {
    try {
        const { title, subject, gradeLevel, quarter, quantity, status, description } = req.body;
        await db.updateSLMItem(req.params.id, title, subject, gradeLevel, quarter, quantity, status, description);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/items/slm/:id', async (req, res) => {
    try {
        console.log('Deleting SLMItemID:', req.params.id); // Add this line
        await db.deleteSLMItem(req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.error('Delete error:', err); // Add this line
        res.status(500).json({ error: err.message });
    }
});

// Equipment Items endpoints
app.get('/api/items/equipment', async (req, res) => {
    try {
        console.log('GET /api/items/equipment - Fetching Equipment items...');
        const items = await db.getAllEquipmentItems();
        console.log(`Found ${items.length} Equipment items`);
        res.json(items);
    } catch (err) {
        console.error('Error fetching Equipment items:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/items/equipment', async (req, res) => {
    try {
        const { equipmentName, equipmentType, quantity, status, description } = req.body;
        const equipmentID = await db.addEquipmentItem(equipmentName, equipmentType, quantity, status, description);
        res.json({ success: true, equipmentID });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/items/equipment/:id', async (req, res) => {
    try {
        const { equipmentName, equipmentType, quantity, status, description } = req.body;
        await db.updateEquipmentItem(req.params.id, equipmentName, equipmentType, quantity, status, description);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/items/equipment/:id', async (req, res) => {
    try {
        await db.deleteEquipmentItem(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// TVL Items endpoints
app.get('/api/items/tvl', async (req, res) => {
    try {
        console.log('GET /api/items/tvl - Fetching TVL items...');
        const items = await db.getAllTVLItems();
        console.log(`Found ${items.length} TVL items`);
        res.json(items);
    } catch (err) {
        console.error('Error fetching TVL items:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/items/tvl', async (req, res) => {
    try {
        const { itemName, track, strand, gradeLevel, quantity, status, description } = req.body;
        const tvlItemID = await db.addTVLItem(itemName, track, strand, gradeLevel, quantity, status, description);
        res.json({ success: true, tvlItemID });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/items/tvl/:id', async (req, res) => {
    try {
        const { itemName, track, strand, gradeLevel, quantity, status, description } = req.body;
        await db.updateTVLItem(req.params.id, itemName, track, strand, gradeLevel, quantity, status, description);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/items/tvl/:id', async (req, res) => {
    try {
        await db.deleteTVLItem(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Lesson Exemplar Items endpoints
app.get('/api/items/lesson', async (req, res) => {
    try {
        console.log('GET /api/items/lesson - Fetching Lesson Exemplar items...');
        const items = await db.getAllLessonExemplarItems();
        console.log(`Found ${items.length} Lesson Exemplar items`);
        res.json(items);
    } catch (err) {
        console.error('Error fetching Lesson Exemplar items:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/items/lesson', async (req, res) => {
    try {
        const { lessonTitle, subject, gradeLevel, quarter, week, status, description } = req.body;
        const lessonID = await db.addLessonExemplarItem(lessonTitle, subject, gradeLevel, quarter, week, status, description);
        res.json({ success: true, lessonID });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/items/lesson/:id', async (req, res) => {
    try {
        const { lessonTitle, subject, gradeLevel, quarter, week, status, description } = req.body;
        await db.updateLessonExemplarItem(req.params.id, lessonTitle, subject, gradeLevel, quarter, week, status, description);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/items/lesson/:id', async (req, res) => {
    try {
        await db.deleteLessonExemplarItem(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Distributed Resources Endpoints

// POST: Add a distributed resource
app.post('/api/distributed-resources', async (req, res) => {
    try {
        await db.addDistributedResource(req.body);
        res.status(201).json({ message: 'Distribution recorded.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: Fetch all distributed resources
app.get('/api/distributed-resources', async (req, res) => {
    try {
        const records = await db.getAllDistributedResources();
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/distributed-resources/by-school/:schoolId', async (req, res) => {
    try {
        const records = await db.getDistributedResourcesBySchoolID(req.params.schoolId);
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/test-endpoint', (req, res) => {
    res.send('Test endpoint is working!');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)); 
