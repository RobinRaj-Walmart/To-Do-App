const Express = require("express");
const app = Express();
const cors = require("cors")
const {v1 : uuidv1} = require("uuid")

app.use(cors());
app.use(Express.json());



let taskArr = [];
app.post('/tasks', (req, res) => {

    const task = req.body.nameOfTask;
    console.log(task);
    
    let uniqueID = uuidv1();
    let taskObj = {
        id: uniqueID,
        name: task,
    }
    taskArr.push(taskObj); 
    res.json(taskArr);
})

app.delete('/tasks/:id', (req, res) => {
    let newTasks = [];
    const { id } = req.params;
    for(let task of taskArr) {
        if(id===task.id) {
            continue;
        }
        newTasks.push(task);
    }
    taskArr = newTasks;
    res.json(taskArr);
})

const port = process.env.PORT || 3000;

app.listen((port), () => {
    console.log("Listening on port " + port);
});
