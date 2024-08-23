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
    let timerInterval;

    function startQuiz() {
        document.getElementById('start-btn').classList.add('hidden');
        document.getElementById('timer').classList.remove('hidden');
        document.getElementById('question-container').classList.remove('hidden');
        document.getElementById('submit-btn').classList.remove('hidden');
        document.getElementById('question-container').innerHTML = generateQuestionHTML(questions[currentQuestionIndex]);
        startTimer(120); // 2 minutes in seconds
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
        clearInterval(timerInterval);
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        if (selectedAnswer && selectedAnswer.value === questions[currentQuestionIndex].correctAnswer) {
            score++;
        }
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            document.getElementById('question-container').innerHTML = generateQuestionHTML(questions[currentQuestionIndex]);
        } else {
            showResult();
        }
    }

    function startTimer(seconds) {
        const timerElement = document.getElementById('timer');
        timerInterval = setInterval(() => {
            if (seconds <= 0) {
                clearInterval(timerInterval);
                showResult();
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
    }

    // Adiciona os eventos aos botões
    document.getElementById('start-btn').addEventListener('click', startQuiz);
    document.getElementById('submit-btn').addEventListener('click', submitQuiz);
});