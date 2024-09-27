const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { saveUser, saveQuizResult, formatAndPrintQuizResults, deleteQuizResult, getAllQuizResults } = require('./database');

const app = express();

// Configuração do CORS
app.use(cors({
    origin: 'http://127.0.0.1:5500'  // Substitua pelo endereço onde seu frontend está rodando
}));

app.use(bodyParser.json());

// Servir arquivos estáticos da pasta 'assets'
app.use(express.static(path.join(__dirname, 'assets')));

// Rota para cadastro
app.post('/register', (req, res) => {
    const { name, companyId } = req.body;
    saveUser(name, companyId)
        .then(user => res.json({ success: true, userId: user._id }))
        .catch(err => res.json({ success: false, error: err.message }));
});

// Rota para salvar respostas do quiz
app.post('/submit-quiz', (req, res) => {
    const { name, companyId, answers, score, totalQuestions } = req.body;

    // Validar se as respostas estão sendo recebidas corretamente
    console.log("Recebendo quiz submission:", { name, companyId, answers, score, totalQuestions });

    if (!answers || answers.length === 0 || answers.some(ans => ans.resposta === null)) {
        return res.json({ success: false, message: "Respostas incompletas" });
    }

    // Garantindo que estamos salvando no banco de dados local
    saveQuizResult(name, companyId, answers, score, totalQuestions)
        .then(() => res.json({ success: true }))
        .catch(err => res.json({ success: false, error: err.message }));
});

// Rota para listar quizzes e retornar como JSON
app.get('/list-quizzes', (req, res) => {
    getAllQuizResults()
        .then(quizzes => res.json(quizzes))
        .catch(err => res.status(500).json({ success: false, error: err.message }));
});

// Rota para deletar resultado de quiz pelo _id
app.delete('/delete-quiz/:id', (req, res) => {
    const { id } = req.params;

    deleteQuizResult(id)
        .then(numRemoved => res.json({ success: true, message: `${numRemoved} registro(s) removido(s)` }))
        .catch(err => res.json({ success: false, error: err.message }));
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
