var http = require('http')
var axios = require('axios')
var fs = require('fs')
var { parse } = require('querystring')

function geraPag(tarefas){
    let pagHTML =  `
    <html>
        <head>
            <title>To Do List</title>
            <meta charset="utf-8"/>
            <link rel="stylesheet" href="../w3.css"/>
        </head>
        </body>
            <div class="w3-container w3-teal">
                <h2>To Do List</h2>
            </div>

            <form class="w3-container" action="/" method="POST">
                <label class="w3-text-teal"><b>Descrição da tarefa</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="descricao">

                <label class="w3-text-teal"><b>Responsável</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="responsavel">
          
                <label class="w3-text-teal"><b>Data Limite</b></label>
                <input class="w3-input w3-border w3-light-grey" type="date" name="data">

                <input type="hidden" name="resolvido" value=""/>
                <input type="hidden" name="cancelado" value=""/>

                <input class="w3-btn w3-blue-grey" type="submit" value="Registar"/>
                <input class="w3-btn w3-blue-grey" type="reset" value="Limpar valores"/> 
            </form>
            <div class="w3-container w3-teal">
                <h2>Lista de tarefas pendentes</h2>
            </div>
            <table class="w3-table w3-bordered">
                <tr>
                    <th>Descrição</th>
                    <th>Responsável</th>
                    <th>Data Limite</th>
                    <th>Estado</th>
                </tr>
   
    `
    
    tarefas.forEach(tarefa => {
        if(tarefa.resolvido == false && tarefa.cancelado == false){
            pagHTML +=
            `<tr>
                <td>${tarefa.descricao}</td>
                <td>${tarefa.responsavel}</td>
                <td>${tarefa.data}</td>
                <td>
                <form action="/" method="POST">
                <input type=hidden name="id" value="${tarefa.id}"/>
                        <select name="estado">
                            <option></option>
                            <option>Resolvida</option>
                            <option>Cancelada</option>
                        </select>
                        <input class="w3-btn w3-blue-grey" type="submit" value="Alterar Estado"/>
                </form>
                </td>
            </tr>`
        }
    });

    pagHTML += `
    </table>
        <header class="w3-container w3-teal">
            <h2>Lista de Tarefas Resolvidas ou Canceladas</h2>
        </header>
    <table class="w3-table w3-bordered">
    <tr>
        <th>Descrição</th>
        <th>Responsável</th>
        <th>Data Limite</th>
        <th>Estado</th>
    </tr>
    `
    return pagHTML

}

function geraListaEstado(tarefas, d){
    let pagHTML = `
    `

    tarefas.forEach(tarefa=> {
        if (tarefa.resolvido == true) pagHTML+=`
            <tr>
                <td>${tarefa.descricao}</td>
                <td>${tarefa.responsavel}</td>
                <td>${tarefa.data}</td>
                <td>Resolvida</td>
            </tr>
        `
        else if (tarefa.cancelado == true) pagHTML+=`
            <tr>
                <td>${tarefa.descricao}</td>
                <td>${tarefa.responsavel}</td>
                <td>${tarefa.data}</td>
                <td>Cancelada</td>
            </tr>
        `
    })

    pagHTML+= `
        </table>
        <footer class="w3-container w3-teal">
            <address>Gerado por antonio::PRI2020 em ${d}</address>
        </footer>
    </body>
    </html>
    `
    return pagHTML
}

function recuperaInfo(request,callback){
    if(request.headers['content-type'] == 'application/x-www-form-urlencoded'){
        let body = ''
        request.on('data', bloco => {
            body+=bloco.toString()
        })
        request.on('end',()=>{
            console.log(body)
            callback(parse(body))
        })
    }
}

var listaServer = http.createServer(function (req, res) {
    // Logger: que pedido chegou e quando
    var d = new Date().toISOString().substr(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Tratamento do pedido
    switch(req.method){
        case "GET": 
            // GET /alunos --------------------------------------------------------------------
            if(req.url == "/"){
                axios.get("http://localhost:3000/tarefas?_sort=data,responsavel&_order=ASC,ASC")
                    .then(response => {
                        var tarefas = response.data
                        res.writeHead(200, {'Content-Type': 'text/html'})
                        res.write(geraPag(tarefas))

                        axios.get("http://localhost:3000/tarefas?_sort=resolvido&_order=desc")
                                    .then(response => {
                                        var tarefasR = response.data

                                        res.write(geraListaEstado(tarefasR, d))
                                        res.end()

                                })
                                .catch(function (erro) {
                                    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                                    res.write("<p>Não foi possível obter a lista de tarefas...")
                                    res.end()
                                })
                    })
                    .catch(function(erro){
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write("<p>Não foi possível obter a To Do List...")
                        res.end()
                    })
            }
           
            // GET /w3.css ------------------------------------------------------------------------
            else if(req.url == "w3.css" || req.url.match(/w3.css/)){
                fs.readFile("w3.css", function(erro, dados){
                    if(!erro){
                        res.writeHead(200, {'Content-Type': 'text/css;charset=utf-8'})
                        res.write(dados)
                        res.end()
                    }
                })
            }
            else{
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<p>" + req.method + " " + req.url + " não suportado neste serviço.</p>")
                res.end()
            }
            break
        
        case "POST":
            if(req.url == "/"){
                recuperaInfo(req, body => {
                    if(body.descricao != null){
                        body.resolvido = false
                        body.cancelado = false
                        console.log("[registo]" + JSON.stringify(body))
                        axios.post('http://localhost:3000/tarefas', body)
                        .then(resp =>{
                            axios.get("http://localhost:3000/tarefas?_sort=data,responsavel&_order=ASC,ASC")
                                .then(response => {
                                    var tarefas = response.data

                                    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                                    res.write(geraPag(tarefas))
                                    axios.get("http://localhost:3000/tarefas?_sort=resolvido&_order=desc")
                                    .then(response => {
                                        var tarefasR = response.data

                                    res.write(geraListaEstado(tarefasR, d))
                                    res.end()

                                })
                                .catch(function (erro) {
                                    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                                    res.write("<p>Não foi possível obter a lista de tarefas...")
                                    res.end()
                                })
                        })
                        .catch(function (erro) {
                            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                            res.write("<p>Não foi possível obter a lista de tarefas...")
                            res.end()
                        })
                    })
                        .catch(erro => {
                            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                            res.write('<p>Erro no POST ' + erro + '</p>')
                            res.write('<p><a href="/">Voltar</a></p>')
                            res.end()
                        })
                    }
                    else{
                        axios.get("http://localhost:3000/tarefas")
                            .then(response => {
                                var tarefas = response.data
                                if(body.estado == "Resolvida") {estadoR = true; estadoC = false}
                                else if(body.estado == "Cancelada") {estadoC = true; estadoR = false}
                                tarefas.forEach(tarefa => {
                                    if(tarefa.id == body.id) {
                                        axios.put('http://localhost:3000/tarefas/' + body.id, {
                                            "descricao": tarefa.descricao,
                                            "responsavel": tarefa.responsavel,
                                            "data": tarefa.data,
                                            "resolvido": estadoR,
                                            "cancelado": estadoC,
                                            "id": tarefa.id
                                        }).then(resp => {
                                            console.log(resp.data);
                                        })
                                        .catch(error => {
                                            console.log("ERRO: " + error)
                                        });
                                }
                            })
                            axios.get("http://localhost:3000/tarefas?_sort=datalimite,responsavel&_order=asc,asc")
                                        .then(response => {
                                            var tarefas = response.data
                                            
                                            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                                            res.write(geraPag(tarefas))
                                            axios.get("http://localhost:3000/tarefas?_sort=resolvido&_order=desc")
                                            .then(resp => {
                                                var tarefasE = resp.data

                                                res.write(geraListaEstado(tarefasE,d))
                                                res.end()
                                            })
                                            .catch(function (erro) {
                                                res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                                                res.write("<p>Não foi possível obter a lista de tarefas...")
                                                res.end()
                                            })  
                                        })
                                        .catch(function (erro) {
                                            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                                            res.write("<p>Não foi possível obter a lista de tarefas...")
                                            res.end()
                                        })
                                    })
                            .catch(function (erro) {
                                    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                                    res.write("<p>Não foi possível obter a lista de tarefas...")
                                    res.end()
                                })
                            }
                        
                        })
                    } 
                    else {
                        res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                        res.write("<p>" + req.method + " " + req.url + " não suportado neste serviço.</p>")
                        res.end()
                    }
                    break
                default:
                    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                    res.write("<p>" + req.method + " não suportado neste serviço.</p>")
                    res.end()                                
                }
            })

listaServer.listen(7777)
console.log('Servidor à escuta na porta 7777...')
