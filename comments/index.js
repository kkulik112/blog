const express = require('express')
const bodyParser = require('body-parser')
const {randomBytes} = require('crypto')
const cors = require('cors')


const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  })

const commentsByPostId = {}

app.get('/posts/:id/comments', (req, res) => {
    const id = req.params.id

    res.status(200).send(commentsByPostId[id] || [])
})

app.post('/posts/:id/comments', (req, res) => {
    const commentId = randomBytes(4).toString('hex')
    const {content} = req.body
    const postId = req.params.id
    const comment = {id: commentId, content}
    commentsByPostId[postId] ? commentsByPostId[postId].push(comment) : commentsByPostId[postId] = [comment]

    res.status(201).send(commentsByPostId[postId])
})

app.listen(4001, () => {
    console.log('server listening on port 4001')
})

module.exports = app
