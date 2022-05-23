const express = require('express');
const listarCategorias = require('./controladores/categorias');
const login = require('./controladores/login');
const { listarTransacoes, detalharTransacao, cadastrarTransacoes, editarTransacoes, deletarTransacoes, extratoDeTransacoes } = require('./controladores/transacoes');
const { cadastrarUsuario, detalharUsuario, editarUsuario } = require('./controladores/usuarios');

const rotas = express();

rotas.post('/login', login);

rotas.post('/usuario', cadastrarUsuario);
rotas.get('/usuario', detalharUsuario);
rotas.put('/usuario', editarUsuario);

rotas.get('/categoria', listarCategorias);

rotas.get('/transacao', listarTransacoes);
rotas.get('/transacao/:id', detalharTransacao);
rotas.post('/transacao', cadastrarTransacoes);
rotas.put('/transacao/:id', editarTransacoes);
rotas.delete('/transacao/:id', deletarTransacoes);
rotas.get('/transacao/extrato', extratoDeTransacoes);

module.exports = rotas;










module.exports = rotas;