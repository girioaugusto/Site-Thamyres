// Lista de frases de apoio 
const frases = [
    "Tenho tanto orgulho de você, meu amor 💙",
    "Você está vivendo um sonho — e eu estou torcendo por cada passo ✨",
    "Mesmo de longe, meu coração está sempre com você ❤️",
    "Saudade é a prova do quanto você é importante pra mim 💫",
    "Você é forte, corajosa e capaz de tudo o que quiser 🌎",
    "Cada conquista sua me enche de admiração e alegria 🌟",
    "Estou contigo em cada nova experiência ❤️",
    "O mundo é seu — continue brilhando ✨",
    "Sinto sua falta todos os dias, mas ver você crescendo me deixa feliz 💙",
    "Nunca esqueça: você é incrível, inteligente e especial 💛"
];

// Função para mostrar uma frase aleatória
function mostrarFrase() {
    const elemento = document.getElementById("mensagem-dia");
    const indice = Math.floor(Math.random() * frases.length);

    elemento.style.opacity = 0; // prepara para animação

    setTimeout(() => {
        elemento.innerText = frases[indice];
        elemento.style.animation = "none";
        void elemento.offsetWidth; // hack para reiniciar animação
        elemento.style.animation = "fadeIn 1.8s ease forwards";
    }, 200);
}

mostrarFrase();
