const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lhtxa.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 5000


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("superMarket").collection("products");
  const boughtProducts = client.db("superMarket").collection("BuyProducts");
  

app.get('/products', (req, res) => {
    productsCollection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })

})



app.post('/addEvent', (req, res) => {
    const newEvent = req.body
    console.log('adding event', newEvent)
    productsCollection.insertOne(newEvent)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
})

app.post('/addToCart', (req, res) => {
    const newAddToCart = req.body
    boughtProducts.insertOne(newAddToCart)
        .then(result => {
            res.send(result.insertedCount > 0)
        })

})

app.get('/cart', (req, res) => {
    boughtProducts.find({ email: req.query.email })
        .toArray((err, documents) => {
            res.send(documents)
        })

})


app.delete('/delete/:id', (req, res) => {
    productsCollection.deleteOne({ _id: ObjectId(req.params.id) })
        .then(result => {
            res.send(result.deletedCount > 0)

        })
})

app.get('/',(req, res) => {
    res.send("It's Working !!!")
})


});

app.listen(process.env.PORT || port)