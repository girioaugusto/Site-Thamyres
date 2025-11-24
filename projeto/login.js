import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById("btnLogin").addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    signInWithEmailAndPassword(auth, email, senha)
    .then(() => {
        sessionStorage.setItem("auth", "true");
        window.location.href = "index.html";
    })
    .catch(error => {
        document.getElementById("erro").innerText = "E-mail ou senha incorretos.";
        console.log("ERRO LOGIN:", error);
    });
});
