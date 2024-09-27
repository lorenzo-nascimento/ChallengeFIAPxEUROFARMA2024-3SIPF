document.addEventListener('DOMContentLoaded', () => {
    const questions = [
        { question: "Qual é o objetivo principal do processo de onboarding na Eurofarma?", answers: { a: "Ensinar sobre os produtos da empresa", b: "Integrar o novo colaborador à cultura da empresa", c: "Oferecer um treinamento técnico específico", d: "Realizar uma avaliação de desempenho" }, correctAnswer: "b" },
        { question: "O que é o EurON na Eurofarma?", answers: { a: "Uma plataforma de comunicação interna", b: "Um sistema de gestão de RH", c: "Uma iniciativa de transformação digital", d: "Um programa de treinamento contínuo" }, correctAnswer: "c" },
        { question: "Quanto tempo, em média, dura o processo de onboarding na Eurofarma?", answers: { a: "1 mês", b: "3 meses", c: "6 meses", d: "1 ano" }, correctAnswer: "b" },
        { question: "Qual é uma das principais vantagens do EurON para novos colaboradores?", answers: { a: "Acesso fácil a documentos e informações", b: "Descontos em produtos Eurofarma", c: "Sessões de mentoria com diretores", d: "Viagens de integração" }, correctAnswer: "a" },
        { question: "Como o onboarding influencia a retenção de novos colaboradores?", answers: { a: "Aumentando a satisfação e engajamento", b: "Reduzindo o tempo de adaptação", c: "Facilitando a socialização", d: "Todas as alternativas anteriores" }, correctAnswer: "d" }
    ];

    let currentQuestionIndex = 0;
    let score = 0;
    let answers = [];
    let totalTime = 120; // 2 minutes in seconds
    let timerInterval;

    function startQuiz() {
        document.getElementById('start-btn').classList.add('hidden');
        document.getElementById('timer').classList.remove('hidden');
        document.getElementById('question-container').classList.remove('hidden');
        document.getElementById('submit-btn').classList.remove('hidden');
        showQuestion(questions[currentQuestionIndex]);
        startTimer(totalTime); // Start the timer
    }

    function showQuestion(question) {
        document.getElementById('question-container').innerHTML = generateQuestionHTML(question);
    }

    function generateQuestionHTML(question) {
        return `
            <h3>${question.question}</h3>
            <label><input type="radio" name="answer" value="a"> ${question.answers.a}</label><br>
            <label><input type="radio" name="answer" value="b"> ${question.answers.b}</label><br>
            <label><input type="radio" name="answer" value="c"> ${question.answers.c}</label><br>
            <label><input type="radio" name="answer" value="d"> ${question.answers.d}</label><br>
        `;
    }

    function submitQuiz() {
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        if (selectedAnswer) {
            const selectedValue = selectedAnswer.value;
            const selectedText = questions[currentQuestionIndex].answers[selectedValue];

            // Armazena a pergunta e a resposta
            answers.push({
                pergunta: questions[currentQuestionIndex].question,
                resposta: selectedText
            });

            // Checa se a resposta está correta
            if (selectedValue === questions[currentQuestionIndex].correctAnswer) {
                score++;
            }
        }

        currentQuestionIndex++;

        if (currentQuestionIndex < questions.length) {
            showQuestion(questions[currentQuestionIndex]);
        } else {
            submitResults();
        }
    }

    function submitResults() {
        const name = localStorage.getItem('name');
        const companyId = localStorage.getItem('companyId');

        // Envia os dados para o backend
        fetch('http://localhost:3000/submit-quiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                companyId,
                answers,
                score,
                totalQuestions: questions.length
            })
        }).then(response => response.json())
            .then(data => {
                if (data.success) {
                    showResult();
                } else {
                    console.error('Erro ao enviar o quiz:', data.error);
                }
            });
    }

    function startTimer(seconds) {
        const timerElement = document.getElementById('timer');
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (seconds <= 0) {
                clearInterval(timerInterval);
                submitResults(); // Envia automaticamente quando o tempo acabar
            } else {
                seconds--;
                const minutes = Math.floor(seconds / 60);
                const secondsLeft = seconds % 60;
                timerElement.innerText = `Tempo restante: ${minutes}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
            }
        }, 1000);
    }

    function showResult() {
        document.getElementById('question-container').classList.add('hidden');
        document.getElementById('result-container').classList.remove('hidden');
        document.getElementById('result-text').innerText = `Você acertou ${score} de ${questions.length} perguntas. ${score > (questions.length / 2) ? 'Parabéns!' : 'Tente novamente!'}`;
        document.getElementById('thank-you-container').classList.remove('hidden');
    }

    document.getElementById('start-btn').addEventListener('click', startQuiz);
    document.getElementById('submit-btn').addEventListener('click', submitQuiz);

    // Função para voltar ao cadastro
    document.getElementById('back-to-register-btn').addEventListener('click', () => {
        // Remove ou oculta a tela de agradecimento e exibe a tela de cadastro
        document.getElementById('thank-you-container').classList.add('hidden');
        document.getElementById('start-btn').classList.remove('hidden'); // Exibe o botão de iniciar
        // Adicione aqui a lógica para mostrar a tela de cadastro, se necessário
    });
});
