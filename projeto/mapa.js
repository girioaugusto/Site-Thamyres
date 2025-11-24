import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, collection, addDoc, getDocs 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";


// ============================
// 🔥 INICIALIZA FIREBASE
// ============================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// ============================
// 🌍 INICIAR MAPA (SEM REPETIR)
// ============================
const map = L.map('map', {
    maxBounds: [
        [-85, -180],   // limite inferior esquerdo
        [85, 180]      // limite superior direito
    ],
    maxBoundsViscosity: 1.0 // impede arrastar fora do planeta
}).setView([20, 0], 2);


// ============================
// 🗺️ MAPA BASE (OpenStreetMap)
// ============================
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    noWrap: true,  // impede repetição horizontal
    bounds: [
        [-85, -180],
        [85, 180]
    ]
}).addTo(map);


// ============================
// 🚩 CRIAR ÍCONE DE BANDEIRA
// ============================
function criarIconeBandeira(bandeira, tipo) {
    return L.divIcon({
        className: `flag-marker ${tipo}`,
        html: `<div style="
            font-size: 26px;
            width: 32px;
            height: 32px;
            line-height: 32px;
            border-radius: 50%;
            background: rgba(255,255,255,0.9);
            box-shadow: 0 0 6px rgba(0,0,0,0.4);
            text-align: center;
            border: 2px solid ${tipo === "visitado" ? "#2ecc71" : "#f1c40f"};
        ">${bandeira}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
    });
}


// ============================
// ➕ ADICIONAR MARCADOR AO CLICAR
// ============================
map.on('click', async (e) => {
    const bandeira = document.getElementById("emoji-bandeira").value;

    if (!bandeira) {
        alert("Escolha uma bandeira antes de clicar no mapa! 🇨🇦");
        return;
    }

    const tipo = prompt("Digite 'visitado' ou 'desejo visitar':");
    if (!tipo) return;

    const tipoLimpo = tipo.toLowerCase() === "visitado" ? "visitado" : "desejo";

    const icon = criarIconeBandeira(bandeira, tipoLimpo);

    const marker = L.marker([e.latlng.lat, e.latlng.lng], { icon }).addTo(map);

    marker.bindPopup(
        tipoLimpo === "visitado"
            ? `${bandeira} ✔ Visitado`
            : `${bandeira} ⭐ Quero visitar`
    );

    // Salvar no Firebase
    await addDoc(collection(db, "lugares"), {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        tipo: tipoLimpo,
        bandeira: bandeira
    });
});


// ============================
// 🔄 CARREGAR MARCADORES DO FIRESTORE
// ============================
async function carregarMarcadores() {
    const snap = await getDocs(collection(db, "lugares"));

    snap.forEach(doc => {
        const lugar = doc.data();

        const icon = criarIconeBandeira(lugar.bandeira, lugar.tipo);

        const marker = L.marker([lugar.lat, lugar.lng], { icon }).addTo(map);

        marker.bindPopup(
            lugar.tipo === "visitado"
                ? `${lugar.bandeira} ✔ Visitado`
                : `${lugar.bandeira} ⭐ Quero visitar`
        );
    });
}

carregarMarcadores();
