const pool = require("../../config/pool_conexoes");

const tarefasModel = {

    findAll: async () => {
        try {
            const [resultado] = await pool.query("select * from tarefas where status_tarefa = 1 ");
            return resultado;
        } catch (erro) {
            return erro;
        }
    },

    findAllInativos: async () => {
        try {
            const [resultado] = await pool.query("select * from tarefas where status_tarefa = 0 ");
            return resultado;
        } catch (erro) {
            return erro;
        }
    },

    findById: async (id) => {
        try {
            const [resultado] = await
                pool.query("select * from tarefas where status_tarefa = 1 and id_tarefa = ?",
                    [id]
                );
            return resultado;
        } catch (erro) {
            return erro;
        }
    },

    create: async (campos) => {
        // campos é um json no seguinte formato
        // { 
        // nome:"ONONON", 
        // prazo:"9999-99-99"
        // situacao:9
        // }
        try {
            const [resultado] = await
                pool.query("insert into tarefas(`nome_tarefa`,`prazo_tarefa`,`situacao_tarefa`) "
                    +" values(?,?,?)",
                    [campos.nome, campos.prazo, campos.situacao]
                )
                return resultado;
        } catch (erro) {
            return erro;
        }
    },

    update: async (campos) => {
        // campos é um json no seguinte formato
        // {
        // id: 9    
        // nome:"ONONON", 
        // prazo:"9999-99-99"
        // situacao:9
        // } 
        try {
            const [resultado] = await
                pool.query("update tarefas set `nome_tarefa`= ?, " +
                    "`prazo_tarefa`= ?,`situacao_tarefa`= ? " +
                    " where id_tarefa = ? ",
                    [campos.nome, campos.prazo, campos.situacao, campos.id]
                )
                return resultado;
        } catch (erro) {
            return erro;
        }
    },

    // Delete físico: remove permanentemente o registro do banco de dados
    deletePhysical: async (id) => {
        try {
            const [resultado] = await
                pool.query("DELETE FROM tarefas WHERE id_tarefa = ?", [id]);
            return resultado;
        } catch (erro) {
            return erro;
        }
    },

    // Delete lógico: inativa o registro alterando status_tarefa para 0
    deleteLogical: async (id) => {
        try {
            const [resultado] = await
                pool.query("UPDATE tarefas SET status_tarefa = 0 WHERE id_tarefa = ?", [id]);
            return resultado;
        } catch (erro) {
            return erro;
        }
    }

}

module.exports = { tarefasModel };
