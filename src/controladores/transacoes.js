const conexao = require('../conexao');

const listarTransacoes = async (req, res) => {
    try {
        const queryTransacao = 'select * from transacoes';
        const { rows: transacoes } = await conexao.query(queryTransacao);
        return res.json(transacoes);
    } catch (error) {
        return res.status(500).json({ mensagem: "Ocorreu um erro desconhecido. - " + error.message });
    }
};

const cadastrarTransacoes = async (req, res) => {
    const { usuario } = req;
    const { descricao, categoria_id, tipo, data, valor } = req.body;

    try {
        const queryTransacao = "insert into transacoes (descricao, categoria_id, tipo, data, valor) values ($1, $2, $3, $4, $5, $6)";
        const cadastroTransacao = await conexao.query(queryTransacao, [descricao, categoria_id, tipo, data, valor, usuario.id]);

        if (cadastroTransacao.rowCount === 0) {
            return res.status(400).json({ mensagem: "Não foi possível completar o cadastramento." });
        }

        return res.status(201).json({ mensagem: "Cadastro realizado com sucesso." });
    } catch (error) {
        return res.status(500).json({ mensagem: "Ocorreu um erro desconhecido. " + error.message });
    }
};

const editarTransacoes = async (req, res) => {
    const { id } = req.params;
    const { descricao, categoria_id, tipo, data, valor } = req.body;

    try {
        const queryTransacao = "update transacoes set descricao = $1, categoria_id = $2, tipo = $3, data = $4, valor = $5  where id = $6";
        const transacaoEditada = await conexao.query(queryTransacao, [descricao, categoria_id, tipo, data, valor, id]);

        if (transacaoEditada.rowCount === 0) {
            return res.status(400).json({ mensagem: "Não foi possível editar os dados." });
        }

        return res.status(204).json();
    } catch (error) {
        return res.status(500).json({ mensagem: "Ocorreu um erro desconhecido. " + error.message });
    }
};

const deletarTransacoes = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const query = 'select * from transacoes where id=$1';
        const transacao = await conexao.query(query, [id]);

        if (transacao.rowCount === 0) {
            return res.status(404).json({ mensagem: "Não foi possivel encontrar transação." });
        }

        const queryDeletar = 'delete from transacoes where id = $1';
        const retornar = await conexao.query(queryDeletar, [id]);

        if (retornar.rowCount === 0) {
            return res.status(500).json({ mensagem: "Ocorreu um erro ao deletar a transação. Favor tentar novamente." });
        }

        return res.status(204).json();

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro desconhecido. - " + error.message })
    }
};

const extratoDeTransacoes = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const queryEntrada = "select sum(valor) as entrada from transacoes where usuario_id=$1 and tipo='entrada'";
        const retornoEntrada = await conexao.query(queryEntrada, [id]);

        if (retornoEntrada.rowCount === 0) {
            return res.status(400).json({ mensagem: "Extrato de entrada não encontrado." });
        }

        const querySaida = "select sum(valor) as saida from transacoes where usuario_id=$1 and tipo='saida'";
        const retornoSaida = await conexao.query(querySaida, [id]);

        if (retornoSaida.rowCount === 0) {
            return res.status(400).json({ mensagem: "Extrato de saída não encontrado." });
        }

        return res.status(200).json({
            entrada: retornoEntrada.rows[0].entrada,
            saida: retornoSaida.rows[0].saida
        });


    } catch (error) {
        return res.status(400).json({ mensagem: `Erro ao tentar obter extrato. Detalhes: ${error.message}` });
    }
};

const detalharTransacao = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const query = `select t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao as categoria_nome from transacoes t left join categorias c on c.id = t.categoria_id where t.usuario_id = $1 and t.id = $2 `;
        const transacao = await conexao.query(query, [id]);

        if (transacao.rowCount === 0) {
            return res.status(404).json({ mensagem: "Não foi possivel localizar a transação" });
        }

        return res.status(200).json(transacao.rows[0])
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro desconhecido" + error.message });
    }

};


module.exports = {
    listarTransacoes,
    cadastrarTransacoes,
    editarTransacoes,
    deletarTransacoes,
    extratoDeTransacoes,
    detalharTransacao
}












