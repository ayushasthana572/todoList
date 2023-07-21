const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/public/index.html');
});

app.post('/todo',(req,res)=>{
    saveToDo(req.body,(err)=>{
        if(err){
            res.status(500);
            return;
        }
        res.status(200).send(req.body);
    });
});

app.get('/todo-data',(req,res)=>{
    readToDo((err,todos)=>{
        if(err){
            res.status(500);
            return;
        }

        res.status(200).json(todos);
    });
});

app.listen(4000,()=>{
    console.log('Server is running at 4000...');
});

function readToDo(callback){
    fs.readFile("./data.txt","utf-8",(err,todos)=>{
        if(err){
            callback(err);
            return;
        }

        if(todos.length === 0){
            todos = "[]";
        }

        try{
            todos = JSON.parse(todos);
            callback(null,todos);
        }catch(err){
            callback(err);
        }
    });
}

function saveToDo(todos,callback){
    fs.writeFile('./data.txt',JSON.stringify(todos),(err)=>{
        if(err){
            callback(err);
            return;
        }
        callback(null);
    })
}

