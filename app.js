const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const port = 3000; // atau port yang kamu inginkan

app.use(bodyParser.json());

const uri = "mongodb+srv://studiosdn6:EN9peFymlFsqIzgQ@cluster0.bfzkt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
}

connectToDatabase();

// POST Exam
app.post('/api/newbie', async (req, res) => {
  const { key, action } = req.query;
  if (key !== 'inikey123' || action !== 'post') {
    return res.status(403).send('Forbidden');
  }
  
  const { status, nama, password } = req.body;
  if (status === undefined || !nama || !password) {
    return res.status(400).send('Bad Request');
  }

  const collection = client.db("examDB").collection("newbies");
  try {
    await collection.insertOne({ status, nama, password });
    res.status(201).send('Data inserted successfully');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// GET Exam
app.get('/api/newbie', async (req, res) => {
  const { key, action } = req.query;
  if (key !== 'inikey123' || action !== 'get') {
    return res.status(403).send('Forbidden');
  }
  
  const collection = client.db("examDB").collection("newbies");
  try {
    const newbies = await collection.find({}).toArray();
    res.json(newbies);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// DELETE Exam
app.delete('/api/newbie-del', async (req, res) => {
  const { key, user } = req.query;
  if (key !== 'inikey123' || !user) {
    return res.status(403).send('Forbidden');
  }

  const collection = client.db("examDB").collection("newbies");
  try {
    await collection.deleteMany({ nama: user });
    res.send('User deleted successfully');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
    
