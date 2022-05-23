const conexao = require('../conexao');

const listarCategorias = async (req, res) => {
    try {
        const queryCategoria = 'select * from categorias';
        const { rows: categorias } = await conexao.query(queryCategoria);
        return res.json(categorias);
    } catch (error) {
        return res.status(400).json({ mensagem: "Erro desconhecido. - " + error.message })
    }
};

module.exports = listarCategorias;