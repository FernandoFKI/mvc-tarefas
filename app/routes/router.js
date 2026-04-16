const express = require("express");
const router = express.Router();
const moment = require("moment");
moment.locale('pt-br');


const { body, validationResult } = require("express-validator");

// Requisição do Model
const { tarefasModel } = require("../models/tarefasModel");


const regrasTarefa = [
    body("tarefa")
        .trim()
        .isLength({ min: 5, max: 45 })
        .withMessage("O nome da tarefa deve ter entre 5 e 45 caracteres."),

    body("prazo")
        .notEmpty().withMessage("O prazo é obrigatório.")
        .isDate().withMessage("Prazo inválido.")
        .custom((valor) => {
            const hoje = moment().startOf("day");
            const prazo = moment(valor, "YYYY-MM-DD", true);
            if (!prazo.isValid()) throw new Error("Data inválida.");
            if (prazo.isBefore(hoje)) throw new Error("O prazo deve ser hoje ou uma data futura.");
            return true;
        }),

    body("situacao")
        .isInt({ min: 0, max: 4 })
        .withMessage("A situação deve ser um valor inteiro entre 0 e 4.")
];


router.get("/", async (req, res) => {
    res.locals.moment = moment;
    try {
        const lista = await tarefasModel.findAll();
        res.render("pages/index", { linhasTabela: lista });
    } catch (error) {
        console.log(error);
    }
});


router.get("/nova-tarefa", (req, res) => {
    res.locals.moment = moment;
    res.render("pages/cadastro", {
        tarefa: { id_tarefa: "", nome_tarefa: "", prazo_tarefa: "", situacao_tarefa: 1, status: 1 },
        tituloAba: "Nova Tarefa",
        tituloPagina: "Inserção de Tarefa",
        id_tarefa: "0",
        erros: []
    });
});


router.get("/editar", async (req, res) => {
    res.locals.moment = moment;
    const id = req.query.id;
    try {
        const dadosTarefa = await tarefasModel.findById(id);
        res.render("pages/cadastro", {
            tarefa: dadosTarefa[0],
            tituloAba: "Edição de Tarefa",
            tituloPagina: "Alteração de Tarefa",
            id_tarefa: id,
            erros: []
        });
    } catch (erro) {
        console.log(erro);
    }
});


router.post("/nova-tarefa", regrasTarefa, async (req, res) => {
    res.locals.moment = moment;

    const erros = validationResult(req);

    if (!erros.isEmpty()) {

        const tarefaForm = {
            id_tarefa:     req.body.id_tarefa   || "",
            nome_tarefa:   req.body.tarefa       || "",
            prazo_tarefa:  req.body.prazo        || "",
            situacao_tarefa: req.body.situacao   || 1
        };
        const ehEdicao = req.body.id_tarefa && req.body.id_tarefa !== "0";
        return res.render("pages/cadastro", {
            tarefa:       tarefaForm,
            tituloAba:    ehEdicao ? "Edição de Tarefa"   : "Nova Tarefa",
            tituloPagina: ehEdicao ? "Alteração de Tarefa" : "Inserção de Tarefa",
            id_tarefa:    req.body.id_tarefa || "0",
            erros:        erros.array()
        });
    }

    const campos = {
        nome:     req.body.tarefa,
        prazo:    req.body.prazo,
        situacao: req.body.situacao,
        id:       req.body.id_tarefa
    };

    try {
        if (campos.id && campos.id !== "0") {
            // UPDATE
            await tarefasModel.update(campos);
        } else {
            // INSERT
            await tarefasModel.create(campos);
        }
        res.redirect("/");
    } catch (erro) {
        console.log(erro);
    }
});


router.get("/excluir-logico", async (req, res) => {
    const id = req.query.id;
    try {
        await tarefasModel.deleteLogical(id);
        res.redirect("/");
    } catch (erro) {
        console.log(erro);
    }
});


router.get("/teste-delete", async (req, res) => {
    const id = 4;
    try {
        const resultado = await tarefasModel.deletePhysical(id);
        console.log(resultado);
        res.send(`Delete físico realizado. Linhas afetadas: ${resultado.affectedRows}`);
    } catch (erro) {
        console.log(erro);
        res.send("Erro ao realizar delete físico.");
    }
});


router.get("/teste-delete-logico", async (req, res) => {
    const id = 3;
    try {
        const resultado = await tarefasModel.deleteLogical(id);
        console.log(resultado);
        res.send(`Delete lógico realizado. Linhas afetadas: ${resultado.affectedRows}`);
    } catch (erro) {
        console.log(erro);
        res.send("Erro ao realizar delete lógico.");
    }
});


router.get("/teste-create", async (req, res) => {
    let dadosInsert = {
        nome: "remover virus do PC 2 do 2B",
        prazo: "2026-04-10",
        situacao: 1
    };
    try {
        const resultInsert = await tarefasModel.create(dadosInsert);
        console.log(resultInsert);
        res.send("Insert realizado.");
    } catch (erro) {
        console.log(erro);
    }
});

module.exports = router;
