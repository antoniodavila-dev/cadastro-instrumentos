

const dns = require('node:dns');
dns.setServers(['1.1.1.1']);

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('node:path');

const Instrumento = require('./models/Instrumento');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurações do Express e do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views', 'instrumento'));

// Configurações para receber dados dos formulários
app.use(express.urlencoded({ extended: true }));

// Configuração dos arquivos públicos (CSS e imagens)
app.use(express.static(path.join(__dirname, 'public')));

// Página inicial: direciona para o formulário
app.get('/', (req, res) => {
    res.redirect('/instrumento/add');
});

// Exibe o formulário de cadastro
app.get('/instrumento/add', (req, res) => {
    res.render('add');
});

// Recebe e salva os dados do formulário
app.post('/instrumento/add', async (req, res) => {
    try {
       const novoInstrumento = new Instrumento({
    nome: req.body.nome,
    fabricante: req.body.fabricante,
    preco: Number(req.body.preco),
    tipo: req.body.tipo
});

        await novoInstrumento.save();

        res.render('addok');

    } catch (erro) {
        console.error('Erro ao cadastrar instrumento:', erro);
        res.status(500).send('Não foi possível cadastrar o instrumento.');
    }
});

// Consulta e exibe os instrumentos cadastrados
app.get('/instrumento/lst', async (req, res) => {
    try {
        const instrumentos = await Instrumento.find().sort({ nome: 1 });

        res.render('lst', { instrumentos });

    } catch (erro) {
        console.error('Erro ao consultar instrumentos:', erro);
        res.status(500).send('Não foi possível consultar os instrumentos.');
    }
});

// Conecta ao MongoDB e inicia o servidor
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB conectado com sucesso!');

        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });
    })
    .catch((erro) => {
        console.error('Erro ao conectar ao MongoDB:', erro.message);
    });
