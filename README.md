# API-de-Games
API utilizada para Salvar, Editar, Excluir e Obter Informacoes Salvas no banco de dados (MYSQL)

## Endpoints

### GET /games
Esta Rota e Responsavel por retornar todos o games no Banco de Dados.
#### Parametros
- Nenhum
#### Respostas
##### - OK ! | 200
Esta Resposta sera dada caso tudo ocorrer bem.,
Exemplos:
```
{
    "games": [
        {
            "id": 5,
            "title": "Fortnite",
            "year": "2017",
            "price": "0",
            "createdAt": "2021-06-06T14:24:02.000Z",
            "updatedAt": "2021-06-06T15:15:15.000Z"
        },
        {
            "id": 8,
            "title": "God of War",
            "year": "2018",
            "price": "120",
            "createdAt": "2021-06-06T20:44:49.000Z",
            "updatedAt": "2021-06-06T20:44:49.000Z"
        },
        {
            "id": 12,
            "title": "Resident evil 7",
            "year": "2017",
            "price": "120",
            "createdAt": "2021-06-06T20:48:38.000Z",
            "updatedAt": "2021-06-07T01:22:25.000Z"
        }
    ]
}
```

##### - Unauthorized | 401
Motivos: Token Invalido ou Expirado.

<br>

### POST /auth
Esta Rota e Responsavel por logar o usuario e gerar o token
#### Parametros
Email: o email do usuario.

Senha: Senha do usuario.

Exemplo:
```
{
    "email":"exam@gmaiasl.com",
    "password":"guigui123"
}
```
#### Respostas
##### - OK ! | 200
Se tudo ocorrer bem esta resposta sera retornada.,
Exemplos:
```
{
    "name": "Ex. Nome",
    "email": "Ex. Email",
    "token": "Ex. Token"
}
```
##### - Email not Found | 404
Caso o email nao exista no Banco de dados.,
Exemplo: 
```
{
    "msg": "Email not found"
}
```

##### - Bad Request | 400
Caso a Senha ou o Email estejam invalidos ou Nulos.

##### - Credentials not Valid | 400
Esta resposta acontece quando a Senha nao Condiz com a Senha do usuario em Questao.

##### - Internals Error | 500
Caso Haja algum Erro Interno na API

<br>

### GET /game/:id
Esta Rota e Responsavel por achar o Jogo com o Id passado
#### Parametros
id: o Id do jogo desejado.
Exemplo:
```
URL: http://localhost/game/123
```
#### Respostas
##### - OK ! | 200
Se tudo ocorrer bem esta resposta sera retornada.,
Exemplos:
```
{
    "search": {
        "id": 123,
        "title": "Ex. Nome do Jogo",
        "year": "Ex. Ano do Jogo",
        "price": "Ex. Preco do Jogo"
    }
}
```
##### - 400
Caso o Id nao seja um Numero.,

##### - 404
Caso a o Jogo nao seja encontrado.

##### - Unauthorized | 401
Motivos: Token Invalido ou Expirado.

<br>

### DELETE /game/:id
Esta Rota e Responsavel por Deletar o Jogo com o Id Informado
#### Parametros
id: o Id do jogo desejado.
Exemplo:
```
URL: http://localhost/game/123
```
#### Respostas
##### - OK ! | 200
Se tudo ocorrer bem ela retornara todos os jogos restantes.

Exemplos:
```
{
    "games": [
        {
            "id": 8,
            "title": "God of War",
            "year": "2018",
            "price": "120",
            "createdAt": "2021-06-06T20:44:49.000Z",
            "updatedAt": "2021-06-06T20:44:49.000Z"
        },
        {
            "id": 12,
            "title": "Resident evil 7",
            "year": "2017",
            "price": "120",
            "createdAt": "2021-06-06T20:48:38.000Z",
            "updatedAt": "2021-06-07T01:22:25.000Z"
        }
    ]
}
```
##### - Bad Request | 400
Caso o Id nao seja um Numero.,

##### - Not Found | 404
Caso a o Jogo nao seja encontrado.

##### - Unauthorized | 401
Motivos: Token Invalido ou Expirado.

<br>

### POST /game
Esta Rota e Responsavel por Criar um novo Jogo
#### Parametros
titulo: o titulo do jogo desejado.
ano: o ano do jogo desejado.
preco: o preco do jogo desejado.
Exemplo:
```
{
    "title": "God of War",
    "year": 2018,
    "price": 120
}
```
#### Respostas
##### - OK ! | 200
Se tudo ocorrer bem ela retornara as informacoes do jogo criado.

Exemplos:
```
{
    "game": {
        "id": 8,
        "title": "God of War",
        "year": "2018",
        "price": "120",
        "createdAt": "2021-06-06T20:44:49.000Z",
        "updatedAt": "2021-06-06T20:44:49.000Z"
    }
}
```
##### - Bad Request | 400
Caso o ano ou o preco nao sejam um numero

##### - Unauthorized | 401
Motivos: Token Invalido ou Expirado.

<br>

### PUT /game/:id
Esta Rota e Responsavel por Editar um Jogo
#### Parametros
Id: o Id do jogo desejado. (Obrigatorio)
titulo: o titulo do jogo desejado. (Opcional)
ano: o ano do jogo desejado. (Opcional)
preco: o preco do jogo desejado. (Opcional)
Exemplo:
```
URL: http://localhost/game/123

{
    "title": "God of War"
}
```
#### Respostas
##### - OK ! | 200
Se tudo ocorrer bem ela retornara as informacoes do jogo Editado.

Exemplos:
```
{
    "game": {
        "id": 8,
        "title": "God of War",
        "year": "2018",
        "price": "120",
        "createdAt": "2021-06-06T20:44:49.000Z",
        "updatedAt": "2021-06-06T20:44:49.000Z"
    }
}
```

##### - Unauthorized | 401
Motivos: Token Invalido ou Expirado.
