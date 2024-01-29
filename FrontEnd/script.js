const inputBox = document.getElementById("input-box");
const taskContainer = document.getElementById("list-container");


var tasks = [];

function fillTaskContainer() {
    let count = 1;
    for(let {id, name} of tasks) {
        console.log(name);
        let l1 = document.createElement("li");
        l1.innerHTML = (count++)+ ": " + name;
        taskContainer.appendChild(l1);
        var span = document.createElement("span");
        span.innerHTML = '\u00d7';
        l1.appendChild(span);
    }
}

function emptyTaskContainer() {
    let list = document.querySelectorAll('li');
    list.forEach(item => item.remove());
}

function addTask() {
    var task = inputBox.value;
    if(task.length==0) {
        alert(
            "Please input something before adding it to your to do list"
        );
    }
    else {
        emptyTaskContainer();//empty the array tasks as well as taskContainer
        fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nameOfTask: task,
            }),
        })
        .then((response) => {
            // console.log(response);
            if(!response.ok)
                throw new Error('Network response was not ok');
            else
                return response.json();
        })
        .then((data) => {
            console.log(data[data.length-1].name);
            // console.log("This is the name of the data received " + data.name);
            tasks = data;
            console.log(tasks);
            // data.forEach(item => task.push(item));
            fillTaskContainer();
        } )
        .catch((error) => {
            console.log(error)
        });   //fill the task array as well as the taskContainer
    }
    inputBox.value = "";
}

var button = document.getElementById("btn");
inputBox.addEventListener("keypress", (event) => {
    if(event.key==="Enter")
        addTask();
});


taskContainer.addEventListener("click", function(e) {

    if(e.target.tagName==='LI') {
        e.target.classList.toggle("checked");
    } else if(e.target.tagName==='SPAN') {
        emptyTaskContainer();//empty the array tasks as well as taskContainer
        let taskToDelete = e.target.parentElement.innerHTML;
        let index = 0;
        for(let char of taskToDelete) {
            if(char=='<') {
                break;
            }
            index++;
        }
        taskToDelete = taskToDelete.substr(3, index-3);
        let deleteId = -1;
        // console.log("This is to be deleted : "+taskToDelete)
        for(let {id, name} of tasks) {
            if(name==taskToDelete) {
                // console.log("Found id");
                deleteId = id;
                break;
            }
        }
        // console.log(id);
        fetch(`http://localhost:3000/tasks/${deleteId}`, {
            method: 'DELETE',
        })
        .then((response) => {
            // console.log(response);
            if(!response.ok)
                throw new Error('Network response was not ok');
            else
                return response.json();
        })
        .then((data) => {
            console.log(data);
            tasks = data;
            // data.forEach(item => task.push(item));
            fillTaskContainer();
        } )
        .catch((error) => {
            console.log(error)
        });   //fill the task array as well as the taskContainer
        // e.target.parentElement.remove();
    }
}, false);