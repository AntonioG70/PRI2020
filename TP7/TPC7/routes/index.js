var express = require('express');
var router = express.Router();

const Aluno = require('../controllers/aluno')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Turma PRI de 2020' });
});

// Ligar à database dos alunos
router.get('/alunos', (req,res) => {  
  Aluno.listar()
    .then(dados => res.render('alunos', {lista: dados}))
    .catch(e => res.render('error', {error: e}))
})

router.get('/alunos/registar', (req, res) => {
  res.render('registo')
})

router.get('/alunos/:num', (req,res) => {  
  var num = req.params.num
  Aluno.consultar(num)
    .then(dados => res.render('aluno', {lista: dados}))
    .catch(e => res.render('error', {error: e}))
})

router.post('/alunos', (req, res) => {
  if(req.body.numero != null){
    var numero = req.body.numero
    var nome = req.body.nome
    var git = req.body.git
    if(req.body.tp1 != null) var tp1 = 1; else var tp1 = null
    if(req.body.tp2 != null) var tp2 = 1; else var tp2 = null
    if(req.body.tp3 != null) var tp3 = 1; else var tp3 = null
    if(req.body.tp4 != null) var tp4 = 1; else var tp4 = null
    if(req.body.tp5 != null) var tp5 = 1; else var tp5 = null
    if(req.body.tp6 != null) var tp6 = 1; else var tp6 = null
    if(req.body.tp7 != null) var tp7 = 1; else var tp7 = null
    if(req.body.tp8 != null) var tp8 = 1; else var tp8 = null

    var data = 
      {
        "Número": numero,
        "Nome": nome,
        "Git": git,
        "tpc": [tp1,tp2,tp3,tp4,tp5,tp6,tp7,tp8]
      }
  
    Aluno.inserir(data)
    res.render('certificadoRegisto', {numero: numero})
  }
  else if(req.body.metodo != null){
    var id = req.body.id
    Aluno.delete(id)
    res.render('certificadoDelete', {numero: id})
  }
  else{
    var numero = req.body.id
    var nome = req.body.nome
    var git = req.body.git
    if(req.body.tp1 != null) var tp1 = 1; else var tp1 = null
    if(req.body.tp2 != null) var tp2 = 1; else var tp2 = null
    if(req.body.tp3 != null) var tp3 = 1; else var tp3 = null
    if(req.body.tp4 != null) var tp4 = 1; else var tp4 = null
    if(req.body.tp5 != null) var tp5 = 1; else var tp5 = null
    if(req.body.tp6 != null) var tp6 = 1; else var tp6 = null
    if(req.body.tp7 != null) var tp7 = 1; else var tp7 = null
    if(req.body.tp8 != null) var tp8 = 1; else var tp8 = null
    var data = 
      {
        "Número": numero,
        "Nome": nome,
        "Git": git,
        "tpc": [tp1,tp2,tp3,tp4,tp5,tp6,tp7,tp8]
      }
    
    Aluno.update(data)
    res.render('certificadoUpdate', {numero: numero})  
  }
})

router.get('/alunos/editar/:num', (req, res) => {
  var num = req.params.num
  Aluno.consultar(num)
  .then(dados => res.render('editar', {info: dados}))
  .catch(e => res.render('error', {error: e}))
})

router.delete('/alunos/:num', (req, res) => {
  var num = req.params.num
  Aluno.delete(num)
  res.render('certificadoDelete', {numero: num})
})

module.exports = router;
