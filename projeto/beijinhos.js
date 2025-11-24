// beijinhos.js
// Aba "Beijinhos & Abraços" 💌

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// mesma config do resto do site
const firebaseConfig = {
  apiKey: "AIzaSyAk2kjNZksbciSRilYEuYIkZazc2v5Wcrk",
  authDomain: "intercambio-thamy.firebaseapp.com",
  projectId: "intercambio-thamy",
  storageBucket: "intercambio-thamy.appspot.com",
  messagingSenderId: "1043744996774",
  appId: "1:1043744996774:web:71aa9f347392ff855aa367"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ===== elementos da página =====
const quemSouSelect   = document.getElementById("quemSouSelect");
const botoesBeijinho  = document.querySelectorAll(".btn-beijinho");
const statusBeijinho  = document.getElementById("status-beijinho");
const feedBeijinhos   = document.getElementById("feed-beijinhos");
const pingAudio       = document.getElementById("ping-audio");

// ===== identificação de quem está usando =====
// salva no sessionStorage pra não precisar escolher sempre
let quemSou = sessionStorage.getItem("quemSou") || "thamy";

quemSouSelect.value = quemSou;
quemSouSelect.addEventListener("change", () => {
    quemSou = quemSouSelect.value;
    sessionStorage.setItem("quemSou", quemSou);
    iniciarListener(); // recarrega o feed com base em quemSou
});

// ===== enviar beijinho =====

botoesBeijinho.forEach(btn => {
    btn.addEventListener("click", async () => {
        const tipo = btn.dataset.tipo;
        const mensagem = btn.dataset.msg;

        const to = (quemSou === "thamy") ? "augusto" : "thamy";

        try {
            await addDoc(collection(db, "beijinhos"), {
                from: quemSou,
                to: to,
                tipo: tipo,
                mensagem: mensagem,
                criadoEm: serverTimestamp()
            });

            statusBeijinho.textContent = "Carinho enviado 💌";
            statusBeijinho.style.color = "green";
            setTimeout(() => statusBeijinho.textContent = "", 2000);
        } catch (err) {
            console.error(err);
            statusBeijinho.textContent = "Erro ao enviar :(";
            statusBeijinho.style.color = "red";
        }
    });
});

// ===== feed em tempo real =====

let unsubscribe = null;

function iniciarListener() {
    // se já tiver um listener ativo, remove
    if (typeof unsubscribe === "function") {
        unsubscribe();
    }

    const colRef = collection(db, "beijinhos");
    const q = query(colRef, orderBy("criadoEm", "asc"));

    unsubscribe = onSnapshot(q, snapshot => {
        feedBeijinhos.innerHTML = "";

        snapshot.forEach(docSnap => {
            const item = docSnap.data();

            const ehMeu  = (item.from === quemSou);
            const quemEnviou = ehMeu
                ? (quemSou === "thamy" ? "Você (Thamyres)" : "Você (Augusto)")
                : (item.from === "thamy" ? "Thamyres" : "Augusto");

            const dataHora = item.criadoEm?.toDate
                ? item.criadoEm.toDate().toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit"
                })
                : "";

            const bolha = document.createElement("div");
            bolha.classList.add("beijinho-msg");
            bolha.classList.add(ehMeu ? "msg-eu" : "msg-ela");

            // animação de entrada
            bolha.classList.add("msg-animada");

            bolha.innerHTML = `
                <div class="beijinho-header">
                    <span class="beijinho-quemde">${quemEnviou}</span>
                    <span class="beijinho-hora">${dataHora}</span>
                </div>
                <div class="beijinho-texto">${item.mensagem}</div>
            `;

            feedBeijinhos.appendChild(bolha);

            // se a mensagem não é minha, toca o som (se existir)
            if (!ehMeu && pingAudio) {
                try { pingAudio.currentTime = 0; pingAudio.play(); } catch(e) {}
            }

            // rolar pro fim
            feedBeijinhos.scrollTop = feedBeijinhos.scrollHeight;
        });
    });
}

iniciarListener();
