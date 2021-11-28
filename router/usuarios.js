const express = require('express')
const router = express.Router();
const mysql = require('../mysql').pool
const bcrypt = require('bcrypt')

router.post('/cadastro',(req,res, next)=>{
   
    mysql.getConnection((err,conn)=>{
        if(err){return res.status(500).send({error:err})}
        conn.query('SELECT * FROM usuarios WHERE email = ?',
        [req.body.email], (erro, results)=>{
            if(err){return res.status(500).send({error:err})}
            if(results.length > 0){
                res.status(409).send({
                    mensagem:"email ja cadastrado",
                    email:req.body.email
                })
            }
            else{
                bcrypt.hash(req.body.password,0,(errBcrypt, hash) => {
                    if(errBcrypt){return res.status(500).send({error:errBcrypt})}
                    conn.query(
                        'INSERT INTO usuarios (email, nome, password) VALUES (?,?,?)',
                        [req.body.email,req.body.nome, hash],
                        (error,results) => {
                            conn.release();
                            if (error) {return res.status(500).send({error: error})}
                           return res.status(201).send({
                                mensagem:'usuario criado com sucesso!!!',
                                usuario:{
                                    email:req.body.email,
                                    nome:req.body.nome
                                }
                               
                            })
                        }
                    )
                });

            }
        })
    })
})

module.exports = router;