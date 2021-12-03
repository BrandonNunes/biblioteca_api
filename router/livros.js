const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;


router.get('/livros',(req,res) => {
    mysql.getConnection((erro,conn) => {
        if (erro){return res.status(500).send({error:erro})}
        conn.query(
            'SELECT * FROM livros',
            (erro,result) => {
                conn.release();
                if (erro){return res.status(500).send({error:erro})}
                res.status(200).send({response:result})
            }
        )
    })
});

router.post('/add/livro',(req,res) => {
    mysql.getConnection((erro, conn) => {
        if (erro){return res.status(500).send({error:erro})}
        conn.query(
            'INSERT INTO livros (titulo,nome_autor,exemplares,qtd_disponivel,genero,estante,prateleira) VALUES (?,?,?,?,?,?,?)',
            [req.body.titulo,req.body.nome_autor,req.body.exemplares,req.body.qtd_disponivel,req.body.genero,req.body.estante,req.body.prateleira],
            (erro,result) => {
                conn.release();
                if(erro){return res.status(500).send({error:erro})}
                res.status(201).send({
                    mensagem:"Novo livro adicionado com sucesso!",
                    livro_ID:result.insertId,
                    nome:req.body.titulo
                })
            }
        )
    });
    
});
router.put('/livro/edit', (req, res) => {
    mysql.getConnection((erro, conn)=>{
        if(erro){return res.status(500).send({error:erro})}
        conn.query(
            'UPDATE livros SET titulo = ?, nome_autor = ?, exemplares = ?, qtd_disponivel = ?, genero = ? WHERE id_livros = ?',
            [req.body.titulo, req.body.nome_autor, req.body.exemplares, req.body.qtd_disponivel, req.body.genero, req.body.id_livros],
            (erro,result)=>{    
                console.log(req.body.titulo, req.body.nome_autor, req.body.exemplares, req.body.qtd_disponivel, req.body.genero, req.body.id_livros)          
                conn.release();
                if(erro){return res.status(500).send({error:erro})}
                res.status(202).send({
                    mensagem:"Livro atualizado com sucesso!",
                    livro:req.body.titulo,
                    id:req.body.id_livros
                })
            }
        )
    })
});
router.delete('/livro/del',(req,res) => {
    mysql.getConnection((erro,conn) => {
        if(erro){return res.status(500).send({error:erro})}
        conn.query(
            'DELETE FROM livros WHERE id_livros = ?',
            [req.body.id_livros],
            (erro,result)=>{
                conn.release();
                if(erro){return res.status(500).send({error:erro})}
                res.status(202).send({
                    mensagem:"Livro excluído com sucesso!"
                })
            }
        )
    })
});
router.get('/livro/:id',(req,res)=>{
    mysql.getConnection((erro,conn) => {
        if(erro){return res.status(500).send({error:erro})}
        conn.query(
            'SELECT * FROM livros WHERE id_livros = ?',
            [req.params.id],
            (erro,result) => {
                if(erro){res.status(500).send({error:erro})}
                res.status(200).send({response:result})
            }
        )
    })
})



module.exports = router