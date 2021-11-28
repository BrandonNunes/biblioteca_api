const express = require('express')
const app = express()
const router = require('./router/router')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const routerUsuario = require('./router/usuarios')

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use((req,res,next)=>{
    res.header('Acess-Control-Allow-Origin','*')
    res.header('Acess-Control-Allow-Header','Origin','X-Requested-With',
    'Content-Type','Accept','Authorization')
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT, POST, DELETE, GET')
        return res.status(200).send({
            "methods":"PUT, POST, DELETE, GET"
        })
    }
    next()
})

app.use('/api',router)
app.use('/api',routerUsuario)

app.use((req,res,next)=>{
    const erro = new Error("Não encontrado");
    erro.status = 404;
next(erro)
})
app.use((error,re,res,next)=>{
    res.status(error.status || 500);
    return res.send({
        erro:{
            mensagem:error.message
        }
    })
})



module.exports = app;