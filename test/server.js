import express from 'express'
import Chance from 'chance'

let chance = new Chance()
let range = Array.from(Array(100).keys())
let users = range.map((i) => {
  return {id: i, name: chance.name()}
})

let app = express()

app.use(express.static(__dirname + '/example'))
app.get('/api/users', (req, res) => res.json(users))

export default app.listen(9991, () => console.log('Server listening at http://127.0.0.1:9991'));
