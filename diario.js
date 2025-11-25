// diario.js
// =====================================
// FIRESTORE + MOOD TRACKER + REAÇÕES
// =====================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    deleteDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// ===============================
// CONFIGURAÇÃO DO FIREBASE
// ===============================

const firebaseConfig = {
  apiKey: "AIzaSyAk2kjNZksbciSRilYEuYIkZazc2v5Wcrk",
  authDomain: "intercambio-thamy.firebaseapp.com",
  projectId: "intercambio-thamy",
  storageBucket: "intercambio-thamy.appspot.com",
  messagingSenderId: "1043744996774",
  appId: "1:1043744996774:web:71aa9f347392ff855aa367"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// ===============================
// ELEMENTOS DA PÁGINA
// ===============================

const inputData     = document.getElementById("data-relato");
const textoThamy    = document.getElementById("texto-thamy");
const textoAugusto  = document.getElementById("texto-augusto");
const btnSalvar     = document.getElementById("btnSalvarRelato");
const mensagem      = document.getElementById("msg-diario");
const listaRelatos  = document.getElementById("lista-relatos");


// ===============================
// MOOD TRACKER
// ===============================

let moodThamy = "";
let moodAugusto = "";

document.querySelectorAll(".mood-selector span").forEach(span => {
    span.addEventListener("click", () => {
        const mood = span.getAttribute("data-mood");
        const group = span.parentElement.getAttribute("data-for");

        span.parentElement.querySelectorAll("span").forEach(s => s.classList.remove("mood-selected"));
        span.classList.add("mood-selected");

        if (group === "thamy")   moodThamy = mood;
        if (group === "augusto") moodAugusto = mood;
    });
});


// ===============================
// SALVAR RELATO NO FIRESTORE
// ===============================

btnSalvar.addEventListener("click", async () => {
    const data = inputData.value;

    if (!data) {
        mensagem.textContent = "Escolha uma data antes de salvar!";
        mensagem.style.color = "red";
        return;
    }

    try {
        const docRef = doc(collection(db, "diario"), data);

        await setDoc(docRef, {
            data: data,
            thamyres: textoThamy.value.trim(),
            augusto: textoAugusto.value.trim(),
            moodThamy: moodThamy,
            moodAugusto: moodAugusto,
            atualizadoEm: serverTimestamp()
        });

        mensagem.textContent = "Relato salvo com sucesso!";
        mensagem.style.color = "green";
        setTimeout(() => mensagem.textContent = "", 2000);

    } catch (err) {
        console.error(err);
        mensagem.textContent = "Erro ao salvar.";
        mensagem.style.color = "red";
    }
});


// ===============================
// FORMATAR MÊS
// ===============================

function mesAbreviado(m) {
    const meses = ["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"];
    return meses[parseInt(m) - 1];
}


// ===============================
// LISTAR RELATOS EM TEMPO REAL
// ===============================

function carregarRelatos() {
    const colRef = collection(db, "diario");
    const q = query(colRef, orderBy("data", "desc"));

    onSnapshot(q, (snapshot) => {
        listaRelatos.innerHTML = "";

        if (snapshot.empty) {
            listaRelatos.innerHTML = "<p>Nenhum dia salvo ainda.</p>";
            return;
        }

        snapshot.forEach((docSnap) => {
            const item = docSnap.data();
            const data = item.data;

            const ano = data.substring(0, 4);
            const mes = data.substring(5, 7);
            const dia = data.substring(8, 10);

            const bloco = document.createElement("div");
            bloco.classList.add("dia-relato");

            // NOVO HTML COMPLETO (para os dois + discreto)
            bloco.innerHTML = `
                <div class="dia-relato-data-box">
                    <div class="dia-relato-mes">${mesAbreviado(mes)}</div>
                    <div class="dia-relato-dia">${dia}</div>
                    <small>${ano}</small>
                </div>

                <div class="dia-relato-corpos">

                    <div class="coluna-relato coluna-thamy">
                        <h4>Thamyres 💖 ${item.moodThamy || ""}</h4>
                        <p>${item.thamyres || "—"}</p>

                        <div class="reacoes">
                            <button class="reagir-btn" data-re="amei">Li e amei</button>
                            <button class="reagir-btn" data-re="responder">Responder depois</button>
                            <button class="reagir-btn" data-re="saudade">Senti saudade</button>
                        </div>
                        <p class="reacao-label"></p>
                    </div>

                    <div class="coluna-relato coluna-augusto">
                        <h4>Augusto 💙 ${item.moodAugusto || ""}</h4>
                        <p>${item.augusto || "—"}</p>

                        <div class="reacoes">
                            <button class="reagir-btn" data-re="amei">Li e amei</button>
                            <button class="reagir-btn" data-re="responder">Responder depois</button>
                            <button class="reagir-btn" data-re="saudade">Senti saudade</button>
                        </div>
                        <p class="reacao-label"></p>
                    </div>

                </div>

                <button class="btn-excluir" data-id="${docSnap.id}">
                    Excluir
                </button>
            `;

            listaRelatos.appendChild(bloco);
        });

        ativarBotoesExcluir();
        ativarReacoes();
    });
}

carregarRelatos();


// ===============================
// REAÇÕES (para Thamy e Augusto)
// ===============================

function ativarReacoes() {
    document.querySelectorAll(".coluna-relato").forEach(coluna => {
        const label  = coluna.querySelector(".reacao-label");
        const botoes = coluna.querySelectorAll(".reagir-btn");

        if (!label || botoes.length === 0) return;

        botoes.forEach(btn => {
            btn.onclick = () => {

                botoes.forEach(b => b.classList.remove("reagir-ativo"));
                btn.classList.add("reagir-ativo");

                let texto = "";
                switch (btn.dataset.re) {
                    case "amei":
                        texto = "Marcado como: li e amei.";
                        break;
                    case "responder":
                        texto = "Marcado como: vou responder depois.";
                        break;
                    case "saudade":
                        texto = "Marcado como: senti saudade.";
                        break;
                }

                label.textContent = texto;
            };
        });
    });
}


// ===============================
// EXCLUIR RELATO
// ===============================

function ativarBotoesExcluir() {
    document.querySelectorAll(".btn-excluir").forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.getAttribute("data-id");
            if (!id) return;

            if (!confirm("Tem certeza que deseja excluir este dia?")) return;

            try {
                await deleteDoc(doc(db, "diario", id));
            } catch (err) {
                console.error(err);
                alert("Erro ao excluir.");
            }
        });
    });
}
