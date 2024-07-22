
import connectToMongo from './database/db.js';
import express from 'express';
import cors from 'cors';
import payment1 from './routes/demo.js';
import course from './routes/course.js';
import lead from "./routes/leads.js";

// import path from 'path';  // Import the path module

connectToMongo();
const app = express()
const port = 4000

// middleware
app.use(express.json());
app.use(cors());

// // Serve static files from the 'public' directory
// app.use(express.static(path.join(__dirname, 'public')));


// Available routes    
app.get('/', (req, res) => {
    res.send('S Buying the course')
})

// // Route to serve the AMP page
// app.get('/amp', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'amp.html'));
// });

app.use('/api/payment', payment1)
app.use('/api',course);
app.use('/lead',lead);
    
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

