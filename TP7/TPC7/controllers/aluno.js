var Aluno = require('../models/aluno')

//Devolve a lista de alunos
module.exports.listar = () => {
    return Aluno
        .find()
        .exec()
}

module.exports.consultar = num => {
    return Aluno
        .find({Número: num})
        .exec()
}

module.exports.inserir = a => {
    var novo = new Aluno(a)
    return novo.save()
}

module.exports.update = a => {
    return Aluno.findOne({ Número: a.Número }, function (err, doc) {
        doc.Nome = a.Nome;
        doc.Git = a.Git;
        doc.tpc = a.tpc;
        doc.save();
    });
}

module.exports.delete = num => {
    Aluno
    .find({Número: num})
    .remove()
    .exec()
}