const bcrypt = require('bcrypt');
const conexao = require('../conexao');
const { autenticarUsuario } = require('../validacao/autenticacao');


const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {

        const { rowCount: buscarUsuario } = await conexao.query('select * from usuarios where email = $1', [email]);

        if (buscarUsuario > 0) {
            return res.status(400).json({ mensagem: "Já existe usuário cadastrado com o e-mail fornecido." });
        }

        const senhaNova = await bcrypt.hash(senha, 10);

        const queryUsuario = 'insert into usuarios(nome, email, senha) values($1,$2,$3)';
        const novoUsuario = await conexao.query(queryUsuario, [nome, email, senhaNova]);

        if (novoUsuario.rowCount === 0) {
            return res.status(400).json('Ocorreu um erro ao cadastrar o usuário. Tente novamente!');
        }

        return res.status(201).json({ mensagem: "Usuário cadastrado com sucesso" });
    } catch (error) {
        return res.status(500).json({ mensagem: "Ocorreu um erro desconhecido. - " + error.message });
    }
};


const detalharUsuario = async (req, res) => {
    const id = autenticarUsuario(req);

    if (!id) {
        return;
    }
    try {
        const querydetalharUsuario = 'select * from usuarios where id=$1';
        const { rowCount, rows } = await conexao.query(querydetalharUsuario, [id]);

        if (rowCount === 0) {
            return res.status(400).json({ mensagem: 'Usuário não identificado.' });
        }

        const usuario = rows[0];

        const { senha, ...propriedades } = usuario;

        return res.status(200).json({ ...propriedades });

    } catch (error) {
        return res.status(400).json({ mensagem: `Erro ao tentar obter detalhes do usuário. Detalhes: ${error.message}` });
    }
};


const editarUsuario = async (req, res) => {
    const { usuario } = req;

    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ mensagem: "Um id numérico deve ser informado" });
    }

    if (id !== usuario.id) {
        return res.status(403).json({ mensagem: "Erro! Id não pertence ao usuário logado" });
    }

    const { nome, email, senha } = req.body;

    const erro = verificarBodyUsuario(req.body);

    if (erro) {
        return res.status(400).json({ mensagem: erro });
    }

    try {
        if (email !== usuario.email) {
            const buscarUsuario = await conexao.query('select * from usuarios where email = $1', [email]);

            if (buscarUsuario.rowCount > 0) {
                return res.status(400).json({ "mensagem": "Já existe usuário cadastrado para o e-mail fornecido." });
            }
        }
        const novaSenha = await bcrypt.hash(senha, 10);

        const queryUsuario = 'update usuarios set nome = $1, email = $2, senha = $3, where id = $4';

        const novoUsuario = await conexao.query(queryUsuario, [nome, email, novaSenha, id]);

        if (novoUsuario.rowCount === 0) {
            return res.status(500).json({ mensagem: "Ocorreu um erro. Favor tentar novamente." });
        }

        return res.status(200).json({ mensagem: "Usuário atualizado com sucesso" });
    } catch (error) {
        return res.status(500).json({ mensagem: "Ocorreu um erro desconhecido. - " + error.message })
    }
}

module.exports = {
    cadastrarUsuario,
    detalharUsuario,
    editarUsuario
};