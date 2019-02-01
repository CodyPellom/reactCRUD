const mongoose = require('mongoose');
//Creates a connection to mongoose schemas
const Schema = mongoose.Schema;


let Todo = new Schema({
    todo_description: {
        type: String
    },
    todo_responsible: {
        type: String
    },
    todo_priority: {
        type: String
    },
    todo_completed: {
        type: Boolean
    }
});
//The schema has to be exported;
//We have now set up the database model (the same as the ones made withing React)
//now we create a reference for exporting. This will refer to Todo. It enables us to 
//add data to the DB and import data as well. 
//'Todo' refers to the Mongo DB. Todo refers to the schema we just created.  
module.exports = mongoose.model('Todo', Todo);