const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;



router.get('/locacoes',(req,res) => {
    mysql.getConnection((erro, conn) => {
        if(erro){return res.status(500).send({error:erro})}
        conn.query(
            'SELECT * FROM locacoes',
            (erro, result) => {
                conn.release();
                if(erro){return res.status(500).send({error:erro})}
                res.status(200).send({response: result})
            }
        )
    })
});

router.post('/new/locacao', (req,res) => {
    mysql.getConnection((erro, conn) => {
        if(erro){return res.status(500).send({error:erro})}
        conn.query(
            'INSERT INTO locacoes (nome_aluno, ano_aluno, turma_aluno, nome_livro, genero_livro, data_locacao, data_devolucao,status) VALUES (?,?,?,?,?,?,?,?)',
            [req.body.nome_aluno, req.body.ano_aluno, req.body.turma_aluno,
                 req.body.nome_livro, req.body.genero_livro, req.body.data_locacao,
                  req.body.data_devolucao,req.body.status],
                  (erro,result) => {
                    conn.release();
                      if(erro){return res.status(500).send({error:erro})}
                      res.status(201).send({
                          response:result,
                          id:result.insertId
                      })
                  }
        )
    })
});

router.patch('/locacao/edit/:id/:status', (req, res) => {
    mysql.getConnection((erro, conn)=>{
        if(erro){return res.status(500).send({error:erro})}
        conn.query(
            'UPDATE locacoes SET status = ? WHERE id_locacao = ?',
            [req.params.status, req.params.id],
                 (erro, result)=>{
                    console.log(req.params.status,req.params.id)
                    conn.release();
                     if(erro) return res.status(500).send({error:erro})
                     res.status(202).send({
                         "mensagem":"Locação alterada ",
                         "id":req.body.id_locacao || "nao foi",
                        
                     })
                 }
        )
    })
});

// router.put('/locacao/edit', (req,res) => {
//     mysql.getConnection((erro, conn)=>{
//         if(erro){return res.status(500).send({error:erro})}
//         conn.query(
//             'UPDATE locacoes SET nome_aluno = ?, ano_aluno = ?, turma_aluno = ?, nome_livro = ?, genero_livro = ?, data_locacao = ?, data_devolucao = ?, status = ? WHERE id = ?',
//             [req.body.nome_aluno, req.body.ano_aluno, req.body.turma_aluno, req.body.nome_livro, req.body.genero_livro, req.body.data_locacao, req.body.data_devolucao, req.body.status, req.body.id],
//                  (erro, result)=>{
//                     console.log(req.body.nome_aluno, req.body.ano_aluno, req.body.turma_aluno, req.body.nome_livro, req.body.genero_livro, req.body.data_locacao, req.body.data_devolucao, req.body.status, req.body.id)
//                     conn.release();
//                      if(erro) return res.status(500).send({error:erro})
//                      res.status(202).send({
//                          "mensagem":"Locação alterada ",
//                          "id":req.body.id,
                        
//                      })
//                  }
//         )
//     })
// });




module.exports = router;