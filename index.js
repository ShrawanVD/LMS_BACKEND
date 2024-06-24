
import connectToMongo from './database/db.js';
import express from 'express';
import cors from 'cors';
import payment1 from './routes/demo.js';
// import payment from './routes/payment.js';
import course from './routes/course.js';
import lead from "./routes/leads.js";

connectToMongo();
const app = express()
const port = 4000

// middleware
app.use(express.json());
app.use(cors());

// Available routes    
app.get('/', (req, res) => {
    res.send('S Buying the course')
})

app.use('/api/payment', payment1)
app.use('/api',course);
app.use('/api/lead',lead);
    
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})