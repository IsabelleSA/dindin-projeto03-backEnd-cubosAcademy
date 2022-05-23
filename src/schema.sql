CREATE DATABASE dindin;

CREATE TABLE IF NOT EXISTS usuarios(
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha text NOT NULL
);

CREATE TABLE IF NOT EXISTS categorias(
  id SERIAL PRIMARY KEY,
  descricao TEXT NOT NULL 
);

CREATE TABLE IF NOT EXISTS transacoes(
  id SERIAL PRIMARY KEY,
  descricao TEXT NOT NULL,
  valor INTEGER NOT NULL,
  data TIMESTAMP,
  categoria_id INT REFERENCES categorias(id),
  usuario_id INT REFERENCES usuarios(id),
  tipo TEXT NOT NULL
);

INSERT INTO categorias(descricao) VALUES
('Alimentação'),
('Assinaturas e Serviços'),
('Casa'),
('Mercado'),
('Cuidados Pessoais'),
('Educação'),
('Família'),
('Lazer'),
('Pets'),
('Presentes'),
('Roupas'),
('Saúde'),
('Transporte'),
('Salário'),
('Vendas'),
('Outras receitas'),
('Outras despesas');

