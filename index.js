const express = require('express'); 
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// middleware 
app.use(cors());
app.use(express.json());

// mongoDB place
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6rjh1tl.mongodb.net/?retryWrites=true&w=majority`;

// console.log(process.env.DB_USER);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const database = client.db("userCollection");
    const users = database.collection("users");

    // post operation 
    app.post('/users', async(req, res) => {
        const user = req.body;
        console.log(user);
        const result = await users.insertOne(user)
        res.send(result);
    })

    // get operations 
    app.get('/users', async(req, res) => {
        const cursor = users.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/users/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await users.findOne(query);
        res.send(result)
    })

    // put operations 
    app.put('/users/:id', async(req, res) => {
        const id = req.params.id;
        const user = req.body;
        const updatedUser = {
            $set: {name:user.name, email: user.email, gender: user.gender, status: user.status}
        }
        const query = {_id: new ObjectId(id)};
        const result = await users.updateOne(query, updatedUser);
        res.send(result)
    })

    // delete operations 
    app.delete('/users/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await users.deleteOne(query);
        res.send(result);
    })
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
// mongoDB place

app.get('/', (req, res) => {
    res.send('user server is running')
});

app.listen(port, () => {
    console.log(`user management server running on port ${port}`);
})