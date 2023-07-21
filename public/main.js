// select everything
// select todo-form
const todoForm = document.querySelector('.todo-form');
// select the input box

const todoInput = document.querySelector('.todo-input');
//select the <ul> with class="todo-items"

const todoItemsList = document.querySelector('.todo-items');

//array which stores every todos
let todos=[];
getFromServer();

        //add an event listener on form and listen for submit event
todoForm.addEventListener('submit',(e)=>{
           //prevent the page from reload
        e.preventDefault();
            //call addTodo function with input box current value
        addToDo(todoInput.value);
        getFromServer();
});

//function to add Todo
function addToDo(item){
    //if item is not empty
    if(item!==''){
        //making a todo object having id, name, and completed status
        const todo ={
            id: Date.now(),
            name: item,
            completed: false
            };
        //then adding it to todos array
        todos.push(todo);
        addToServer(todos);
        //************************************************************************ 
        // addToLocalStorage(todos); 

        // finally clearing the input 
        todoInput.value = '';
    }
}

//function to render given todos to screen
function renderToDo(todos){
    todoItemsList.innerHTML = '';

    //running through each item inside todos array
    todos.forEach((item) => {
        //checking if the item is completed
        const checked = item.completed? 'checked' : null;

        const li = document.createElement('li');

        //<li class="item">
        li.setAttribute('class','item');

        //<li class="item" date-key="Date.now()">
        li.setAttribute('data-key',item.id);

        //if item is completed then adding a class to li called checked
        if(item.completed == true){
            li.classList.add('checked');
        }
        li.innerHTML= `<span class="li-text">${item.name}</span><input type="checkbox" class="checkbox" ${checked}><button class="delete-button">X</button>`;

        todoItemsList.append(li);
    });
}
// ***********************************************
function addToServer(todos){
    fetch('/todo',{
        method: "POST",
        headers: {
            "Content-Type":"application/json",
        },
        body: JSON.stringify(todos)
    }).then((res)=>{
        if(res.status === 200){
           return res.json();
        }
        else{
            alert("Something went Wrong!!!");
        }
    }).then((data)=>{
        todos = data;
        renderToDo(todos);
    })
}
// ***********************************************
function addToLocalStorage(todos){
    //convert the array to string then store it
    localStorage.setItem('todos',JSON.stringify(todos));
    //render them to screen
    renderToDo(todos);
}



// **************************************************
function getFromServer(){
    fetch('/todo-data')
        .then((res)=>{
            if(res.status === 200){
                return res.json();
            }
            else{
                alert("Something weird happened!!!");
            }
        }).then((data)=>{
            todos=data;
            renderToDo(todos);
        })
}
//************************************************ */

//get everything from local storage
function getFormLocalStorage(){
    const reference = localStorage.getItem('todos');

    //if reference exists
    if(reference){
        //convert back to array and store it in todos array
        todos = JSON.parse(reference);
        renderToDo(todos);
    }
}

//toggle the value to completed and not completed

function toggle(id){
    todos.forEach((item)=>{
        if(item.id==id){
            //toggle the value
            item.completed = !item.completed;
        }
    })
    // ********************************************
    // addToLocalStorage(todos);
    addToServer(todos);
}

//delete todo from todos array
function deleteToDo(id){
    todos = todos.filter((item)=>{
        return item.id != id;
    })

    //update the local storage
    // ******************************************
    // addToLocalStorage(todos);
    addToServer(todos);
}

//initially get everything from local storage
//******************************************************************* */
// getFormLocalStorage();


todoItemsList.addEventListener('click',(event)=>{
    //click if the event is on checkbox
    if(event.target.type === 'checkbox'){
        //toggling the state
        toggle(event.target.parentElement.getAttribute('data-key'));
    }

    //check if event is on delete
    if(event.target.classList.contains('delete-button')){
        deleteToDo(event.target.parentElement.getAttribute('data-key'));
    }
});








