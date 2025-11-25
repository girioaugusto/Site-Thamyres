// galeria.js
// Lista de passeios em Toronto com filtros por categoria
// Categorias: turismo, parques, brechos, restaurantes, cultura

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("passeios-grid");
    const botoesFiltro = document.querySelectorAll(".filtro-btn");
    let filtroAtual = "todos";

    // Guarda quais passeios já foram marcados como "feito"
    const feitos = new Set();

    const passeios = [
        // --- TURISMO ---
        {
            id: "cn-tower",
            categoria: "turismo",
            titulo: "CN Tower & Ripley’s Aquarium",
            local: "Downtown",
            descricao: "Dia turistão clássico: vista 360° da cidade e aquário gigante logo ao lado."
        },
        {
            id: "toronto-islands",
            categoria: "turismo",
            titulo: "Toronto Islands",
            local: "Toronto Bay",
            descricao: "Pega o ferry, faz piquenique, anda de bike e vê o skyline mais lindo da cidade."
        },
        {
            id: "distillery",
            categoria: "turismo",
            titulo: "Distillery District",
            local: "Distrito histórico",
            descricao: "Ruas de tijolinho, cafés, lojinhas e luzinhas – perfeito pra fotos e fim de tarde."
        },
        {
            id: "st-lawrence",
            categoria: "turismo",
            titulo: "St. Lawrence Market",
            local: "Old Town",
            descricao: "Mercado tradicional com bancas de comida, queijos, pães e delícias locais."
        },
        {
            id: "harbourfront",
            categoria: "turismo",
            titulo: "Harbourfront & Waterfront",
            local: "Lakeshore",
            descricao: "Caminhada à beira do lago, pôr do sol e clima de cartão postal."
        },
        {
            id: "niagara-falls",
            categoria: "turismo",
            titulo: "Niagara Falls (bate-volta)",
            local: "Fora de Toronto",
            descricao: "Bate-volta pra ver as cataratas de perto. Natureza nível épico."
        },

        // --- PARQUES ---
        {
            id: "high-park",
            categoria: "parques",
            titulo: "High Park",
            local: "West End",
            descricao: "Parque enorme com trilhas, lago, esquilos e cherry blossoms na época certa."
        },
        {
            id: "trinity-bellwoods",
            categoria: "parques",
            titulo: "Trinity Bellwoods",
            local: "Queen West",
            descricao: "Parque queridinho da galera jovem, perfeito pra sentar na grama e observar a vida."
        },
        {
            id: "riverdale-park",
            categoria: "parques",
            titulo: "Riverdale Park",
            local: "East End",
            descricao: "Vista linda do skyline de Toronto, ótimo pra ver o pôr do sol."
        },
        {
            id: "kew-gardens",
            categoria: "parques",
            titulo: "Kew Gardens & Beaches",
            local: "The Beaches",
            descricao: "Combina parque com praia de lago e um bairro super charmoso."
        },
        {
            id: "rouge-park",
            categoria: "parques",
            titulo: "Rouge National Urban Park",
            local: "North-East",
            descricao: "Parque nacional dentro da cidade, com trilhas maiores e natureza mais “selvagem”."
        },

        // --- BRECHÓS ---
        {
            id: "kensington-thrift",
            categoria: "brechos",
            titulo: "Brechós em Kensington Market",
            local: "Kensington",
            descricao: "Vários brechós e lojinhas vintage um do lado do outro, pra garimpar com calma."
        },
        {
            id: "black-market",
            categoria: "brechos",
            titulo: "Black Market",
            local: "Downtown",
            descricao: "Ícone dos brechós em Toronto: muita roupa alternativa e preços amigos."
        },
        {
            id: "common-sort",
            categoria: "brechos",
            titulo: "Common Sort",
            local: "Queen / Annex",
            descricao: "Brechó curado, estilo Tumblr, com peças bem selecionadas."
        },
        {
            id: "value-village",
            categoria: "brechos",
            titulo: "Value Village",
            local: "Vários bairros",
            descricao: "Brechó grandão, cheio de achados pra quem tem paciência de garimpar."
        },
        {
            id: "courage-my-love",
            categoria: "brechos",
            titulo: "Courage My Love",
            local: "Kensington",
            descricao: "Brechó clássico cheio de peças diferentonas e clima de filme antigo."
        },

        // --- RESTAURANTES ---
        {
            id: "st-lawrence-food",
            categoria: "restaurantes",
            titulo: "Comer dentro do St. Lawrence Market",
            local: "Old Town",
            descricao: "Sanduíches, peixes, queijos e doces – um mini tour gastronômico num lugar só."
        },
        {
            id: "tim-hortons",
            categoria: "restaurantes",
            titulo: "Tim Hortons",
            local: "Vários locais",
            descricao: "Clássico canadense: café, timbits, donuts e pausa rápida no dia."
        },
        {
            id: "piano-piano",
            categoria: "restaurantes",
            titulo: "Piano Piano",
            local: "Downtown / Midtown",
            descricao: "Restaurante italiano fofinho, com massas e pizzas incríveis."
        },
        {
            id: "canoe",
            categoria: "restaurantes",
            titulo: "Canoe",
            local: "Financial District",
            descricao: "Restaurante chique com vista da cidade – pra um dia mais especial."
        },
        {
            id: "rasa",
            categoria: "restaurantes",
            titulo: "Rasa",
            local: "Harbord Village",
            descricao: "Comida criativa, ambiente intimista e vibe de date night."
        },

        // --- CULTURA ---
        {
            id: "rom",
            categoria: "cultura",
            titulo: "Royal Ontario Museum (ROM)",
            local: "Yorkville",
            descricao: "Museu gigantesco com história natural, cultura e exposições especiais."
        },
        {
            id: "ago",
            categoria: "cultura",
            titulo: "Art Gallery of Ontario (AGO)",
            local: "Dundas",
            descricao: "Galeria de arte com coleções clássicas e exposições modernas."
        },
        {
            id: "graffiti-alley",
            categoria: "cultura",
            titulo: "Graffiti Alley",
            local: "Queen West",
            descricao: "Várias quadras cheias de murais e grafites – passeio perfeito pra tirar fotos."
        },
        {
            id: "distillery-cultural",
            categoria: "cultura",
            titulo: "Distillery District (lado cultural)",
            local: "Distrito histórico",
            descricao: "Além de passeio turístico, tem galerias, eventos e feirinhas temáticas."
        },
        {
            id: "theatre-king",
            categoria: "cultura",
            titulo: "Teatros na King Street",
            local: "Entertainment District",
            descricao: "Musicais, peças e espetáculos pra uma noite mais cultural."
        }
    ];

    function criarCard(p) {
        const card = document.createElement("article");
        card.className = "passeio-card";
        card.dataset.cat = p.categoria;
        card.dataset.id = p.id;

        if (feitos.has(p.id)) {
            card.classList.add("feito");
        }

        const btnTexto = feitos.has(p.id) ? "Já fomos 💛" : "Marcar como já fomos";

        card.innerHTML = `
            <h3>${p.titulo}</h3>
            <p class="passeio-local">${p.local}</p>
            <p class="passeio-descricao">${p.descricao}</p>
            <button class="btn-status">${btnTexto}</button>
        `;

        const btn = card.querySelector(".btn-status");
        btn.addEventListener("click", () => {
            if (feitos.has(p.id)) {
                feitos.delete(p.id);
                card.classList.remove("feito");
                btn.textContent = "Marcar como já fomos";
            } else {
                feitos.add(p.id);
                card.classList.add("feito");
                btn.textContent = "Já fomos 💛";
            }
        });

        return card;
    }

    function renderPasseios() {
        grid.innerHTML = "";
        passeios.forEach(p => {
            if (filtroAtual === "todos" || p.categoria === filtroAtual) {
                const card = criarCard(p);
                grid.appendChild(card);
            }
        });
    }

    // Filtros
    botoesFiltro.forEach(btn => {
        btn.addEventListener("click", () => {
            botoesFiltro.forEach(b => b.classList.remove("ativo"));
            btn.classList.add("ativo");
            filtroAtual = btn.dataset.categoria;
            renderPasseios();
        });
    });

    // Render inicial
    renderPasseios();
});
