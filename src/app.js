const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


//Rota get, que retorna todos os repositórios

app.get("/repositories", (request, response) => {
  
  return response.json(repositories);

});

//Rota post, que adiciona um novo repositório usando as informações passadas no body

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title, 
    url, 
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.json(repository)
});

//Rota put, que altera certos dados de um repositório com base no ID passado como parâmetro na rota
/* Para manter o conceito de imutabilidade, um novo objeto de repositório é criado, e nele são passados 
os valores do repositório antigo que não foram alterados, através de um spread operator, e os valores novos.*/
//O novo objeto é adicionado no índice do objeto anterior, fazendo assim a substituição 

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({error: 'Repository not found.'});
  }

  const repository = {
    ...repositories[repositoryIndex],
    title,
    url,
    techs
  }

  repositories[repositoryIndex] = repository;

  
  return response.json(repository);

});

//Rota delete, que remove da lista o repositório que tenha o ID igual ao passado como parâmetro de rota, caso exista

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({error: 'Repository not found.'});
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

//Rota post, que adiciona um like ao repositório que tenha o ID igual ao passado como parâmetro de rota, caso exista

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({error: 'Repository not found.'});
  }

  const repository = repositories[repositoryIndex];
  
  repository.likes +=1;

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

module.exports = app;
