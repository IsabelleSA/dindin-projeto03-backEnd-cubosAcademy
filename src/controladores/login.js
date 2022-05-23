const conexao = require('../conexao')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const segredo = require('../segredo');

const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: "E-mail e senha são obrigatórios." });
    }
    try {
        const queryEmailUsuario = 'select * from usuarios where email = $1';
        const { rows } = await conexao.query(queryEmailUsuario, [email]);
        const usuario = rows[0];
        const senha = await bcrypt.compare(senha, usuario.senha);

        if (!usuario) {
            return res.status(400).json({ mensagem: "E-mail ou senha incorretos." });
        }

        if (!senha) {
            return res.status(400).json({ mensagem: "E-mail ou senha incorretos." });
        }
        const token = jwt.sign({ id: usuario.id });

        return res.status(200).json(token);

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro desconhecido. - ' + error.message });
    }
}

module.exports = login;