const express = require('express')
const bodyParser = require('body-parser')
const {randomBytes} = require('crypto')


const app = express()
app.use(bodyParser.json())

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
