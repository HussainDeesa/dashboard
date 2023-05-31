const connectToMongo = require('./db')
const express = require('express')
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000
const path =require('path')

app.use(cors())
app.use(express.json())
connectToMongo();
// app.get('/',(req,res)=>{
//     res.send('hello')
// })
app.use('/api/auth', require('./routes/auth'))
app.use('/api/order', require('./routes/order'))
// app.use('/api/menu', require('./routes/menu'))
// app.use('/api/cart', require('./routes/cart'))

app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function (_, res) {

  res.sendFile(
    path.join(__dirname, "./client/build/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  );
});

if (process.env.NODE_ENV === "production") {
    app.get('/', (req, res) => {
        app.use(express.static(path.resolve(__dirname,'client','build')));
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(port, () => {
    console.log('Listening to ', port);
})