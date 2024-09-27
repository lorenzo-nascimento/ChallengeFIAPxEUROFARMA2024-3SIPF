const Datastore = require('nedb');
const path = require('path');
const fs = require('fs');

// Banco de dados local usando NeDB
const db = {
    users: new Datastore({ filename: path.join(__dirname, 'users.db'), autoload: true }),
    quizResults: new Datastore({ filename: path.join(__dirname, 'quizData.db'), autoload: true }),  // Nome do arquivo quizData.db
};

// Função para salvar usuário
function saveUser(name, companyId) {
    return new Promise((resolve, reject) => {
        const user = { name, companyId };
        db.users.insert(user, (err, newUser) => {
            if (err) return reject(err);
            resolve(newUser);
        });
    });
}

// Função para salvar resultados do quiz
function saveQuizResult(name, companyId, answers, score, totalQuestions) {
    return new Promise((resolve, reject) => {
        const result = {
            name,
            companyId,
            answers,
            score,
            totalQuestions,
            date: new Date()  // Salvando a data de envio
        };

        db.quizResults.insert(result, (err, newResult) => {
            if (err) return reject(err);

            // Agora, formatamos o arquivo quizData.db para que seja mais legível
            formatDatabaseFile();  // Chama a função para reformatar o arquivo após a inserção

            resolve(newResult);
        });
    });
}

// Função para deletar resultados do quiz
function deleteQuizResult(id) {
    return new Promise((resolve, reject) => {
        db.quizResults.remove({ _id: id }, {}, (err, numRemoved) => {
            if (err) return reject(err);
            resolve(numRemoved);  // Retorna quantos documentos foram removidos
        });
    });
}

// Função para obter todos os resultados do quiz
function getAllQuizResults() {
    return new Promise((resolve, reject) => {
        db.quizResults.find({}, (err, docs) => {
            if (err) return reject(err);
            resolve(docs);
        });
    });
}

// Função para formatar o conteúdo do arquivo de banco de dados
function formatDatabaseFile() {
    const dbFilePath = path.join(__dirname, 'quizData.db');

    fs.readFile(dbFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo do banco de dados:', err);
            return;
        }

        // Cada entrada no arquivo é separada por uma nova linha, então precisamos tratar cada uma
        const entries = data.split('\n').filter(line => line.trim() !== '');  // Remove linhas vazias
        const formattedEntries = entries.map(entry => JSON.stringify(JSON.parse(entry), null, 4));  // Formata o JSON com indentação

        // Salva o arquivo formatado
        fs.writeFile(dbFilePath, formattedEntries.join('\n'), 'utf8', (err) => {
            if (err) {
                console.error('Erro ao salvar o arquivo formatado:', err);
            } else {
                console.log('Arquivo formatado com sucesso.');
            }
        });
    });
}

// Função para formatar e exibir os resultados do quiz no terminal
function formatAndPrintQuizResults() {
    db.quizResults.find({}, (err, docs) => {
        if (err) {
            console.error('Erro ao buscar dados:', err);
            return;
        }

        docs.forEach((doc) => {
            console.log("=========================================");
            console.log(`Nome: ${doc.name}`);
            console.log(`ID da Empresa: ${doc.companyId}`);
            console.log("Respostas:");

            doc.answers.forEach((answer, index) => {
                console.log(`Pergunta ${index + 1}: ${answer.pergunta}`);
                console.log(`Resposta: ${answer.resposta ? answer.resposta : "Sem resposta"}`);
                console.log("-----------------------------------------");
            });

            console.log(`Pontuação: ${doc.score}/${doc.totalQuestions}`);
            console.log(`Data: ${new Date(doc.date).toLocaleString()}`);
            console.log("=========================================\n");
        });
    });
}

module.exports = { saveUser, saveQuizResult, formatAndPrintQuizResults, deleteQuizResult, getAllQuizResults };
