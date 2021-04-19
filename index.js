const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('This is server side of Book Byte Library')
})

//--------Mongodb--------

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ier7s.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('Connection error',err);

    // ------------- Service Collection --------------------

  const serviceCollection = client.db("BookByteLibrary").collection("services");

  app.post('/admin', (req, res) => {
    const newProduct = req.body;
    console.log('Adding new product',newProduct);
    serviceCollection.insertOne(newProduct)
    .then(result => {
        console.log('Inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
    })
  })

  app.get('/services', (req, res) => {
    serviceCollection.find()
    .toArray((err, items) => {
        res.send(items);
    })
  })

  app.get('/services/:id', (req, res) => {
    serviceCollection.find()
      .toArray((err, items) => {
        const id = req.params.id;
        const service = items.find(i=> {
          return i._id == id
      })
        if (!service){
          return res.status(404).send({message:"not found"})
        } else {
          return res.status(200).send(service)
        }
      })
    })
  
// ------------- Review Collection --------------------

  const reviewCollection = client.db("BookByteLibrary").collection("reviews");

  app.post('/addReview', (req, res) => {
    const newReview = req.body;
    console.log('Adding new Review',newReview);
    reviewCollection.insertOne(newReview)
    .then(result => {
        console.log('Inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
    })
  })

  app.get('/reviews', (req, res) => {
    reviewCollection.find()
    .toArray((err, items) => {
        res.send(items);
    })
  })

// ----------- Order Collection --------------------
  const orderCollection = client.db("BookByteLibrary").collection("order");

  app.post('/addOrder', (req, res) => {
    const newOrder = req.body;
    orderCollection.insertOne(newOrder)
    .then (result => {
      console.log(result);
    })
    console.log(newOrder);
  })

  app.get('/order', (req, res) => {
    console.log(req.query.email);
    orderCollection.find({email: req.query.email})
    .toArray((err , documents) => {
      res.send(documents)
    })
  })

//   client.close();
});

// ---------- app listen ----------

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })