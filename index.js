const express = require('express')
const connection = require('./database/index')
const security = require('./security/index.json')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const PORT = process.env.PORT || 80

const app = express()


app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//==================Database============================
const gamesModel = require('./database/models/games')
const usersModel = require('./database/models/users')
connection.authenticate().then(()=>{console.log('(MYSQL)Connected With Success !')}).catch((err)=>{console.error(err)})

//==================Routes============================

async function auth(req,res,next) {
    try{
        const tokenBearer = req.headers["authorization"];

        if(tokenBearer == null || tokenBearer == undefined){ //estudar 
            res.status(401)
            res.json({ "msg":"The token is undefined or Null" })
            return
        }
    
        const token = String(tokenBearer).split(" ")[1]
        const resToken = await jwt.verify(token,security.jwt)
        const {id,email,iat,exp} = resToken

        req.user = {id,email,iat,exp}

        next()
    } catch(err){
        res.sendStatus(401)
        err["name"] = "Token Not Authorizated !"
        res.json(err)
    }
}

app.post('/auth', async (req,res) => { // Gera o token
    try{

        const {email,password} = req.body,
            HATEOS = [
                {
                    "Href": "http://localhost/games",
                    "Method": "GET",
                    "Rel":"get_games"
                },
                {
                    "Href": "http://localhost/game",
                    "Method": "POST",
                    "Rel":"post_games"
                }
            ]

        if(email == undefined || password == undefined || email == null || password == null){return res.sendStatus(400)}

        const emailFound = await usersModel.findOne({ where: { email } }) //aqui

        if(emailFound == undefined || emailFound == null){
            res.status(404)
            res.json({ "msg":"Email not found" })
            return
        }
        if(emailFound.password != password){
            res.status(400)
            res.json({ "msg":"Credentials not Valid" })
            return
        }

        const token = await jwt.sign({ id:emailFound["id"], email:emailFound["email"] },security.jwt,{ expiresIn:'120h' }) // Gera o token
        // informacao dentro do token: "Payload"

        res.status(200)
        res.json({user: {
            "name": emailFound.name,
            "email": emailFound.email,
            "token": token,
        },
        _links: HATEOS
        })


    } catch(err){
        console.error(err)
        res.sendStatus(500)
    }
})

app.get('/games', auth, async (req,res) => {
    try{
        const HATEOS = [
            {
                "Href": "http://localhost/game",
                "Method": "POST",
                "Rel":"post_games"
            },
            {
                "Href": "http://localhost/auth",
                "Method": "POST",
                "Rel":"post_auth"
            }
        ]
        const games = await gamesModel.findAll()
        res.json({ games, _links: HATEOS })
    } catch(err){console.error(err)}
})

app.get('/game/:id', auth, async (req,res) => {
    try{

        const {id} = req.params,
            HATEOS = [
                {
                    "Href": `http://localhost/game/${id}`,
                    "Method": "DELETE",
                    "Rel":"delete_game"
                },
                {
                    "Href": `http://localhost/game/${id}`,
                    "Method": "PUT",
                    "Rel":"put_game"
                }
            ]         

        if(isNaN(id)){return res.sendStatus(400)}
    
        const search = await gamesModel.findOne({ where: {id} })
    
        if(search == undefined){return res.sendStatus(404)}
    
        res.status(200).json({ search, _links: HATEOS })

    } catch(err){console.error(err)}
})

app.delete('/game/:id', auth, async (req,res) => {
    try{
        const {id} = req.params,
            HATEOS = [
                {
                    "Href": `http://localhost/game/${id}`,
                    "Method": "GET",
                    "Rel":"get_game"
                },
                {
                    "Href": `http://localhost/game/${id}`,
                    "Method": "PUT",
                    "Rel":"put_game"
                }
            ]

        if(isNaN(id)){return res.sendStatus(400)}
    
        const game = await gamesModel.findOne({ where:{ id } })
        if(game == undefined){return res.sendStatus(404)}
    
        await gamesModel.destroy({ where:{ id } })
        const games = await gamesModel.findAll()
    
        res.json({ games, _links: HATEOS })
    } catch(err){console.error(err)}
})

app.post('/game', auth, async (req,res) => {
    try{

        const {title,year,price} = req.body,
            HATEOS = [
                {
                    "Href": "http://localhost/games",
                    "Method": "GET",
                    "Rel":"get_games"
                },
                {
                    "Href": "http://localhost/game",
                    "Method": "POST",
                    "Rel":"post_auth"
                }
            ]

        if(isNaN(year) || isNaN(price)){return res.sendStatus(400)}

        await gamesModel.create({ title,year,price })

        const game = await gamesModel.findOne({ where:{ title } })
        res.json({ game, _links: HATEOS })

    } catch(err){console.error(err)}
})

app.put('/game/:id', auth, async (req,res) => {
    try{

        const { id } = req.params;
        const { title,year,price } = req.body;

        const HATEOS = [
            {
                "Href": `http://localhost/game/${id}`,
                "Method": "DELETE",
                "Rel":"delete_game"
            },
            {
                "Href": `http://localhost/game/${id}`,
                "Method": "GET",
                "Rel":"get_game"
            }
        ]

        if(isNaN(id)){return res.sendStatus(400)}

        const accepts = () => {
            let col = [{type:"title",content: title},{type:"year",content: year},{type:"price",content: price}]
            const res = {}

            const noNull = col.map(a => {if(a.content == undefined || a.content.length == 0){return ''}else{return a}}).filter(b => b != '')

            for(let i=0;i<noNull.length;i++){
                if(res[noNull[i].type]){}
                res[noNull[i].type] = noNull[i].content
            }
            return res
        }

        await gamesModel.update(
            accepts(),
            {where:{ id }}
        )

        const game = await gamesModel.findOne({ where:{ id } })

        res.json({ game, _links: HATEOS })

    } catch(err){console.error(err)}
})

//==================Listen============================
app.listen(PORT,(err) => {
    err ? console.error() : console.log(`Server Runnig at Port: ${PORT}`)
})
