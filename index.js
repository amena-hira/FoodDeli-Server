const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cwbwt8c.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const bookedTableCollection = client.db('foodDeli').collection('bookedTable');
        app.get('/tableBooked', async (req, res) => {
            const query = {};
            const bookedTables = await bookedTableCollection.find(query).toArray();
            res.send(bookedTables);
        })
        app.get('/tableBooked/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            console.log(query)
            const bookedTables = await bookedTableCollection.findOne(query);
            res.send(bookedTables);
        })
        app.post('/tableBooked', async (req, res) => {
            const tablesBooked = req.body;
            console.log(tablesBooked);
            const result = await bookedTableCollection.insertOne(tablesBooked);
            res.send(result);
        })
        app.patch('/tableBooked/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: {
                    name: req.body.name,
                    email: req.body.email,
                    date: req.body.date,
                    mobile: req.body.mobile,
                    restaurantName: req.body.restaurantName,
                    personList: req.body.personList
                }
            }
            console.log(updatedDoc, query)
            const result = await bookedTableCollection.updateOne(query, updatedDoc);
            console.log(result)
            res.send(result);
        })
        app.delete('/tableBooked/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const result = await bookedTableCollection.deleteOne(filter);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(error => console.log(error))

app.get('/', async (req, res) => {
    res.send('FoodDeli server is running')
})

app.listen(port, () => console.log(`FoodDeli portal running on ${port}`))