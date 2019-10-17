const express = require('express');

const server = express();

server.use(express.json());

// query params = ?test=1
// route params = /users/1
// request body = ?test=1

// CRUD

//middlewares
// tudo que manipula a resposta pro usuario
// função () = {}

//variaveis globais
const users = [];

//middleware de log
server.use((req, res, next) => {
  console.log(`Método: ${req.method} - URL: ${req.url}`);
  return next();
});

//middleware de benchmark GLOBAL
server.use((req, res, next) => {
  const mark = "marker";
  console.log(`Método: ${req.method} - URL: ${req.url}`);
  console.time(mark);  
  next();
  console.timeEnd(mark);
});

//middleware local
// pode ser usado para validação
function checkUserExists(req, res, next) {
  if(!req.body.name){
    return res.status(400).json('User name required');
  }
  return next();
};

//middleware local
// e pode ser usado para alterar os valores da req e res
function checkUserInArray(req, res, next) {
  const { index } = req.params;
  const user = users[index];
  if(!user){
    return res.status(400).json('User not found');
  }
  req.user = user;
  return next();
};

server.get('/users', (req, res) => {
  return res.json(users);
});

server.get('/users/:index', checkUserInArray, (req, res) => {  
  return res.json(req.user);
});

// chama um middleware local e podem ser chamados quantos quiser
// a propria  função já é um.
server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;
  users.push(name);
  return res.json(users);
});

server.put('/users/:index', checkUserInArray, checkUserExists, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;
  users[index] = name;

  return res.json(users);

}); 

server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;
  users.splice(index, 1);
  return res.json(users);
});

server.listen(3000);