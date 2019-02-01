// here we are simply creating the instances of the middleware and backend tech to be used 
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
//bring in Mongoose after setting up and running the mongoDB shell and have it running n bg
const mongoose = require('mongoose');
//Accessing the router through express
const todoRoutes = express.Router();
const PORT = 4000;
//this links the Todo model built in todo.model.js
let Todo = require('./todo.model');

//here we are calling express and telling it to begin using the middleware functionality
app.use(cors());
app.use(bodyParser.json());
//this creates the connection to mongoDB  'todos' (the database itself)
mongoose.connect('mongodb://127.0.0.1:27017/todos', {
    useNewUrlParser: true
});
//reference to the connection to mongo
const connection = mongoose.connection;

//this will log whether or not our backend has made the connection to mongo
connection.once('open', function () {
    console.log("MongoDB database connection is established successfully");
})
//This handles get requests. Retrived will be returned as a json or error. res=response req=request here. 
todoRoutes.route('/').get(function (req, res) {
    Todo.find(function (err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});
//accepting parameters
todoRoutes.route('/:id').get(function (req, res) {
    //this accepts parameters from the URL
    let id = req.params.id
    Todo.findById(id, function (err, todo) {
        res.json(todo);
    });
});


//endpoint for http posts which ADD items to the DB. this accepts POST req not GET.
todoRoutes.route('/add').post(function (req, res) {
    let todo = new Todo(req.body);
    //this will save the object to the DB
    todo.save()
        .then(todo => {
            //output the http status indicates insert has been completed.
            res.status(200).json({
                    'todo': 'todo added successfully'
                })
                //this will 'catch' any errors and send the notice of failure
                .catch(err => {
                    res.status(400).send('adding todo failed!');
                });
        });
});

//this is the route for todo updating,
todoRoutes.route('/update/:id').post(function (req, res) {
    Todo.findById(req.params.id, function (err, todo) {
        //if todo was not set or not successful
        if (!todo) {
            res.status(404).send('data not found');
        } else {
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;
        }
        todo.save().then(todo => {
                res.json('todo updated');
            })
            .catch(err => {
                res.status(400).send("update not possible");
            });
    });
});
//this is telling express to use the routes we set up through the model (todo.model.js)
app.use('/todos', todoRoutes);


//When the backend is active, it will be logged with the active port number
app.listen(PORT, function () {
    console.log("Server is running, Port: " + PORT);
});