const express = require('express')
const app = express()
const port = 3000


// app.use(express.static('1.jpeg','styles.css'))
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/index.html', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/contact.html', (req, res) => {
  res.sendFile(__dirname + '/contact.html')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
