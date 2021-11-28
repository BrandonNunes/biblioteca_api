const express = require('express')
const router = express.Router();
const mysql = require('../mysql').pool

router.get('/',(req,res)=>{
    res.status(200).send({
        "mensagem":"rotas funcionando"
    })
});
router.get('/alunos',(req,res)=>{
    mysql.getConnection((error,conn)=>{
        conn.query(
            'SELECT * FROM alunos',
            (error,resultado,fields)=>{
                conn.release();
                if(error){return res.status(500).send({error:error})}
                res.status(200).send({response : resultado})
            }
        )
    })
})
router.post('/add/alunos',(req,res)=>{
   
    mysql.getConnection((error,conn)=>{
        if(error){return res.status(500).send({error:error})}
        conn.query(
            'INSERT INTO alunos (name,turma, pendente) VALUES (?,?,?)',
            [req.body.name,req.body.turma,req.body.pendente],
            (error,resultado, fields)=>{
                conn.release();
                if(error){return res.status(500).send({error:error})}
                res.status(201).send({
                    mensagem:"Aluno inserido com sucesso!",
                    id:resultado.insertId
                })
            }
        )
    })
})
router.get('/alunos/:id',(req,res)=>{
    mysql.getConnection((error,conn)=>{
        conn.query(
            'SELECT * FROM alunos WHERE id = ?',
            [req.params.id],
            (error,resultado,fields)=>{
                conn.release();
                if(error){return res.status(500).send({error:error})}
                res.status(200).send({response : resultado})
            }
        )
    })
})
router.put('/alunos/edit',(req,res)=>{
    mysql.getConnection((error,conn)=>{
        conn.query(
            'UPDATE alunos SET name = ?, turma = ?, pendente = ?, livros = ? WHERE id = ?',
            [req.body.name, req.body.turma, req.body.pendente, req.body.livros, req.body.id],
            (error,resultado,fields)=>{
                conn.release();
                if(error){return res.status(500).send({error:error})}
                res.status(202).send({
                    mensagem:"Aluno alterado com sucesso!",
                    response : resultado})
            }
        )
    })
})
router.delete('/alunos/del',(req,res)=>{
    mysql.getConnection((error,conn)=>{
        conn.query(
            'DELETE FROM alunos WHERE id = ?',
            [ req.body.id],
            (error,resultado,fields)=>{
                conn.release();
                if(error){return res.status(500).send({error:error})}
                res.status(202).send({
                    mensagem:"Aluno excluído com sucesso!",
                    })
            }
        )
    })
})



module.exports = router;