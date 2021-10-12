const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const { getAsync, setAsync } = require('./../redis/index');

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  res.send(todo);
  const added_todos = await getAsync('added_todos');
  await setAsync('added_todos', added_todos === null ? 1 : Number(added_todos) + 1);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  if (req.todo) {
    res.status(200).send(req.todo);
  }
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const newTodo = {};
  if (req.body.text) newTodo.text = req.body.text;
  if (req.body.done) newTodo.done = req.body.done;
  const todo = await Todo.findByIdAndUpdate(req.todo.id, newTodo, {
    useFindAndModify: false,
    returnOriginal: false
  });
  res.send(todo);
});

router.use('/:id', findByIdMiddleware, singleRouter)




module.exports = router;
