document.addEventListener('DOMContentLoaded', () => {
    // Função para validar o cadastro
    function validateRegister() {
        const name = document.getElementById('name').value;
        const companyId = document.getElementById('company-id').value;
        const errorMessage = document.querySelector('.error-message');

        if (name && companyId) {
            // Salva o nome e o companyId no localStorage para usar no quiz
            localStorage.setItem('name', name);
            localStorage.setItem('companyId', companyId);

            // Esconde a seção de registro e mostra o quiz
            document.getElementById('register').classList.add('hidden');
            document.getElementById('quiz').classList.remove('hidden');
        } else {
            // Se não, mostrar mensagem de erro
            errorMessage.classList.remove('hidden');
        }
    }

    // Adiciona o evento de clique ao botão de cadastro
    const registerButton = document.getElementById('register-btn');
    if (registerButton) {
        registerButton.addEventListener('click', validateRegister);
    }
});
