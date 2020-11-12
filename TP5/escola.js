var http = require('http')
const axios = require('axios')

var servidor = http.createServer(function (req, res) {

    if(req.method='GET'){

        if(req.url == '/'){
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        res.write("<h2>Escola de Música</h2>")
        res.write("<ul>")
        res.write('<li><a href="http://localhost:3001/alunos">Lista de Alunos</li></a>')
        res.write('<li><a href="http://localhost:3001/cursos">Lista de Cursos</li></a>')
        res.write('<li><a href="http://localhost:3001/instrumentos">Lista de Instrumentos</li></a>')
        res.write("</ul>")
        res.end()
        }

        else if(req.url == '/alunos'){
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            axios.get('http://localhost:3000/alunos')
                .then(resp => {
                    alunos = resp.data;
                    res.write('<h2>Lista de Alunos</h2>')
                    res.write('<ul>')
                    alunos.forEach(a => {
                        res.write('<a href="http://localhost:3001/alunos/' + a.id + '"><li>ID: ' + a.id + ' Nome: ' + a.nome + '</li></a>')
                    });
                    res.write('</ul>')
                    res.write('<a href="http://localhost:3001"><h2><b>Voltar ao índice</b></h2></a>')
                    res.end()
                })
                .catch(error => {
                    res.writeHead(200, {
                        "Content-Type": "text/html"
                    })
                    res.write('<p>Lista de Alunos não encontrada</p>')
                    res.end()
                });
        }

        else if(req.url.match(/\/alunos\/[A-Za-z0-9]+$/)){
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            var num = req.url.split("/")[2]
            axios.get('http://localhost:3000/alunos/' + num)
            .then(resp => {
                alunos = resp.data;
                res.write('<h2>Informação do Aluno</h2>')
                res.write('<p>ID: ' + alunos.id + '</p>')
                res.write('<p>Nome: ' + alunos.nome + '</p>')
                res.write('<p>Data de Nascimento: ' + alunos.dataNasc + '</p>')
                res.write('<p>Curso: ' + alunos.curso + '</p>')
                res.write('<p>Anop de curso: ' + alunos.anoCurso + '</p>')
                res.write('<p>Instrumento: ' + alunos.instrumento + '</p>')
                res.write('<a href="http://localhost:3001/alunos"><h2><b>Voltar ao índice</b></h2></a>')
                res.end()
            })
            .catch(error => {
                res.writeHead(200, {
                    "Content-Type": "text/html"
                })
                res.write('<p>Aluno não encontrado</p>')
                res.end()
            });
        }

        else if(req.url == '/instrumentos'){
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            axios.get('http://localhost:3000/instrumentos')
                .then(resp => {
                    cursos = resp.data;
                    res.write('<h2>Lista de Instrumentos</h2>')
                    res.write('<ul>')
                    cursos.forEach(i => {
                        res.write('<a href="http://localhost:3001/instrumentos/' + i.id + '"><li>ID: ' + i.id +'</li></a>')
                    });
                    res.write('</ul>')
                    res.write('<a href="http://localhost:3001"><h2>Voltar ao índice</h2></a>')
                    res.end()
                })
                .catch(error => {
                    res.writeHead(200, {
                        "Content-Type": "text/html"
                    })
                    res.write('<p>Lista de cursos não encontrada</p>')
                    res.end()
                }); 
        }

        else if(req.url.match(/\/instrumentos\/[A-Za-z0-9]+$/)){
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            var id = req.url.split("/")[2]
            axios.get('http://localhost:3000/instrumentos/' + id)
            .then(resp => {
                instrumentos = resp.data;
                res.write('<h2>Informação do Instrumento</h2>')
                res.write('<p>ID: ' + instrumentos.id + '</p>')
                res.write('<a href="http://localhost:3001/instrumentos"><h2><b>Voltar ao índice</b></h2></a>')
                res.end()
            })
            .catch(error => {
                res.writeHead(200, {
                    "Content-Type": "text/html"
                })
                res.write('<p>Instrumento não encontrado</p>')
                res.end()
            });
        }

        else if(req.url == '/cursos'){
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            axios.get('http://localhost:3000/cursos')
                .then(resp => {
                    cursos = resp.data;
                    res.write('<h2>Lista de Cursos</h2>')
                    res.write('<ul>')
                    cursos.forEach(c => {
                        res.write('<a href="http://localhost:3001/cursos/' + c.id + '"><li>ID: ' + c.id +'</li></a>')
                    });
                    res.write('</ul>')
                    res.write('<a href="http://localhost:3001"><h2>Voltar ao índice</h2></a>')
                    res.end()
                })
                .catch(error => {
                    res.writeHead(200, {
                        "Content-Type": "text/html"
                    })
                    res.write('<p>Lista de cursos não encontrada</p>')
                    res.end()
                });
        }

        else if(req.url.match(/\/cursos\/[A-Za-z0-9]+$/)){
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            var num = req.url.split("/")[2]
            axios.get('http://localhost:3000/cursos/' + num)
            .then(resp => {
                curso = resp.data;
                res.write('<h2>Informação do Curso</h2>')
                res.write('<p>ID: ' + curso.id + '</p>')
                res.write('<p>Designação: ' + curso.designacao + '</p>')
                res.write('<p>Duração: ' + curso.duracao + '</p>')
                res.write('<p>Instrumento ID: ' + curso.instrumento.id + '</p>')
                res.write('<a href="http://localhost:3001/cursos"><h2><b>Voltar ao índice</b></h2></a>')
                res.end()
            })
            .catch(error => {
                res.writeHead(200, {
                    "Content-Type": "text/html"
                })
                res.write('<p>Curso não encontrado</p>')
                res.end()
            });
        }

    }  
    else{
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        res.write("<p>Pedido não suportado: " + req.method + "</p>")
        res.end()
    }


})

servidor.listen(3001)
console.log("Servidor á escuta na porta 3001...")    
