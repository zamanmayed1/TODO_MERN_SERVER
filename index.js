const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config()
const bodyParser = require('body-parser')
const port = process.env.PORT || 5000;
const app = express()

// middleware
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())

const uri = "mongodb+srv://mayed:QPXJpiKkKI1bPxqJ@cluster0.vddfm.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const TodoCollection = client.db("TodoCollection").collection("ToDo");

        app.post('/addtodo', async (req, res) => {
            const item = req.body
            const result = await TodoCollection.insertOne(item);
            res.send(result)

        })
        app.get('/alltodo', async (req, res) => {
            const query = {};
            const cursor = TodoCollection.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })
        app.put('/todo/:id', async (req, res) => {
            const id = req.params.id
            const updatedTodo = req.body
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDocument = {
                $set: updatedTodo
            };
            const result = await TodoCollection.updateOne(filter, updateDocument, options)

            res.send(result)

        })
        app.delete('/todo/:id', async (req, res) => {
            const id = req.params.id
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await TodoCollection.deleteOne(query);
            res.send(result)

        })


    } finally {

    }
}



app.get('/', (req, res) => {
    res.send('To Do List is running')
})

app.listen(port, () => {
    console.log("server is  running on ", port);
})

run().catch(console.dir);