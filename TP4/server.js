var http = require('http')
var url = require('url')
var fs = require('fs')

var servidor = http.createServer(function (req, res) {
    if(req.url.match(/\/arqs\/[0-9]+$/)){
        var num = req.url.split("/")[2]
        fs.readFile("arqsite/arq" + num + ".html", function(err, data){
            if(err){
                console.log("ERRO: na leitura do ficheiro " + err)
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.write("<p>Ficheiro Inexistente</p>")
                res.end()
         }
            else{
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.write(data)
                res.end()
            }
        })
    }
    else if(req.url.match(/\/arqs\/\*/)){
        fs.readFile("arqsite/index.html", function(err, data){
            if(err){
                console.log("ERRO: na leitura do ficheiro " + err)
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.write("<p>Ficheiro Inexistente</p>")
                res.end()
            }
            else{
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.write(data)
                res.end()
            }
        })
    }
    else{
        console.log("ERRO: foi pedido um ficheiro não encontrado")
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        res.write("<p>Ficheiro Inexistente</p>")
        res.end()
    }


})

servidor.listen(7777)
console.log("Servidor á escuta na porta 7777...")    
