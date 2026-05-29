// Saber qual personagem foi clicado no menu de personagens
let personagemAtual = "";

// Estado das Tarefas
let TarefaConcluida = {
    aerodynamic: false, crescendolls: false, some: false, super: false,
    veridis: false, voyager: false, harder: false, one: false
};

// Botões Ativos na Nave
let btnNave = {
    btnAerodynamic: false, btnCrescendolls: false, btnSome: false, btnSuper: false,
    btnVeridis: false, btnVoyager: false, btnHarder: false, btnOne: false
};

// antiloop debug
let _missaoConcluida = false;

// Dicionários para guardar as imagens carregadas
let buttonLine = {};
let buttonHover = {};
let buttonConc = {};
let imgVidros = {};

// Lista única com os nomes base dos ficheiros
let svgNames = ["Aerodynamic", "Crescendolls", "Some", "Super", "Veridis", "Voyager", "Harder", "One"];

function preloadNave() {
    for (let nome of svgNames) {
        buttonLine[nome] = loadImage('imagens/btn' + nome + 'Line.svg');
        buttonHover[nome] = loadImage('imagens/btn' + nome + 'Hover.svg');
        buttonConc[nome] = loadImage('imagens/btn' + nome + 'Conc.svg');
    }

   for (let i = 1; i <= 4; i++) {
        imgVidros[i] = loadImage('imagens/vidro' + i + '.png');
    }
}

let nivelVidroAnterior = 0; // Variável para monitorizar mudanças

function drawNave() {
    background(0);
    let larguraEscalada = bgNave.width * scaleRatioNave;
    let centroX = (width - larguraEscalada) / 2;
    push(); 
    translate(centroX, 0); 
    scale(scaleRatioNave);
    
    imageMode(CORNER);
    image(bgNave, 0, 0);

    // ── NOVO: Chama a vida da nave (Estrelas, Estática e Luzes) ──
    drawCockpitLife();
    mostrarCoordenadasRato();

    // logica vidro
    let nivelVidroAtual = 0;

    if (personagensStatus.arpegius) nivelVidroAtual = 1; 
    if (personagensStatus.octave) nivelVidroAtual = 2;   
    if (personagensStatus.stella) nivelVidroAtual = 3;   

    // toca som se aumenta racha
    if (nivelVidroAtual > nivelVidroAnterior) {
        tocarSomRacha(); 
        nivelVidroAnterior = nivelVidroAtual; // nao tocar em loop
    }

    if (nivelVidroAtual > 0 && imgVidros[nivelVidroAtual]) {
        blendMode(SCREEN); 
        image(imgVidros[nivelVidroAtual], 0, 0, bgNave.width, bgNave.height);
        blendMode(BLEND);  
    }

    // botoes
    drawBtnImagem(699, 805, btnNave.btnVoyager, TarefaConcluida.voyager, buttonLine["Voyager"], buttonHover["Voyager"], buttonConc["Voyager"]);
    drawBtnImagem(1090, 906, btnNave.btnCrescendolls, TarefaConcluida.crescendolls, buttonLine["Crescendolls"], buttonHover["Crescendolls"], buttonConc["Crescendolls"]);
    drawBtnImagem(1180, 909, btnNave.btnAerodynamic, TarefaConcluida.aerodynamic, buttonLine["Aerodynamic"], buttonHover["Aerodynamic"], buttonConc["Aerodynamic"]);
    drawBtnImagem(946, 830, btnNave.btnHarder, TarefaConcluida.harder, buttonLine["Harder"], buttonHover["Harder"], buttonConc["Harder"]);
    drawBtnImagem(1180, 767, btnNave.btnSuper, TarefaConcluida.super, buttonLine["Super"], buttonHover["Super"], buttonConc["Super"]);
    drawBtnImagem(1292, 837, btnNave.btnVeridis, TarefaConcluida.veridis, buttonLine["Veridis"], buttonHover["Veridis"], buttonConc["Veridis"]);
    drawBtnImagem(1184, 839, btnNave.btnSome, TarefaConcluida.some, buttonLine["Some"], buttonHover["Some"], buttonConc["Some"]);
    drawBtnImagem(522, 850, btnNave.btnOne, TarefaConcluida.one, buttonLine["One"], buttonHover["One"], buttonConc["One"]);

    pop(); 

    verificarProgressoNave();
}

// ── EFEITOS DE AMBIENTE E FEEDBACK ──
function drawCockpitLife() {
    push();

    // 1. ESTRELAS NA JANELA
    for(let i = 0; i < 30; i++) {
        let sx = noise(i, 0) * 1400 + 250; 
        let sy = noise(0, i) * 600 + 50;   
        let alpha = noise(i, frameCount * 0.03) * 255;
        fill(255, 255, 255, alpha);
        noStroke();
        ellipse(sx, sy, random(1, 3));
    }

    // 2. MONITORES DE ESTÁTICA (Preenchem a 100% e somem ao concluir)
    // Coordenadas centrais ajustadas para o ecrã esquerdo e central
    drawStaticScreen(698, 805, 130, 100, TarefaConcluida.voyager); 
    drawStaticScreen(935, 830, 115, 85, TarefaConcluida.harder);  


    // 4. LUZES AMBIENTE (Botões Coloridos Físicos - Piscam sempre)
    drawColoredLight(180, 770, "circle", color(150, 0, 255));  // Roxo (Esquerda)
    drawColoredLight(260, 830, "circle", color(255, 255, 0));  // Amarelo (Esquerda)
    drawColoredLight(1090, 900, "circle", color(0, 255, 0));   // Verde (Centro-direita)
    drawColoredLight(1180, 760, "circle", color(255, 0, 0));   // Vermelho (Direita)
    drawColoredLight(1180, 840, "circle", color(0, 100, 255)); // Azul (Direita)

    
    pop();
}

// --- ESTÁTICA PREENCHIDA A 100% ---
function drawStaticScreen(cx, cy, w, h, isFinished) {
    if (!isFinished) {
        push();
        noStroke();
        rectMode(CENTER);
        
        // Máscara com cantos arredondados (o Canvas API usa x, y do canto superior esquerdo para desenhar)
        drawingContext.save();
        drawingContext.beginPath();
        drawingContext.roundRect(cx - w/2, cy - h/2, w, h, 15); 
        drawingContext.clip(); 

        // Fundo do ecrã escuro
        fill(20, 20, 20, 240);
        rect(cx, cy, w, h); 
        
        // Estática densa
        for (let i = 0; i < 200; i++) {
            fill(255, 255, 255, random(50, 200));
            // Gera os quadrados de estática à volta do centro do ecrã
            rect(cx + random(-w/2, w/2), cy + random(-h/2, h/2), random(3, 7), random(3, 7));
        }

        drawingContext.restore();
        pop();
    }
}


// --- LUZES DOS BOTÕES COLORIDOS ---
function drawColoredLight(cx, cy, shapeType, c) {
    push();
    rectMode(CENTER);
    
    // ── NOVO: Adicionado '+ cx * 0.05' para desincronizar o piscar ──
    let pulseAlpha = sin(frameCount * 0.1 + cx * 0.05) * 100 + 100;
    
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = color(red(c), green(c), blue(c), pulseAlpha); 
    fill(red(c), green(c), blue(c), pulseAlpha * 0.8);
    noStroke();
    
    if (shapeType === "circle") {
        ellipse(cx, cy, 32, 32);
    } else {
        rect(cx, cy, 30, 30, 5);
    }
    pop();
}




function drawBtnImagem(x, y, isUnlocked, isConcluded, imgLine, imgHover, imgConc) {
    let fatorAjuste = 1.22;
    let w = imgLine.width * fatorAjuste;
    let h = imgLine.height * fatorAjuste;

    let larguraEscalada = bgNave.width * scaleRatioNave;
    let centroX = (width - larguraEscalada) / 2;

    let virtualMouseX = (mouseX - centroX) / scaleRatioNave;
    let virtualMouseY = mouseY / scaleRatioNave;
    // ------------------------------------------------------------------

    let over = virtualMouseX > x - w / 2 && virtualMouseX < x + w / 2 && virtualMouseY > y - h / 2 && virtualMouseY < y + h / 2;

    push();
    imageMode(CENTER);

    if (isConcluded) {
        // Tarefa concluída: Mantém o preenchimento verde (já existente)
        image(imgConc, x, y, w, h);
    }
    else if (isUnlocked) {
        if (over) {
            // Mouse por cima: Desenha o outline (SVGs azuis)
            cursor(HAND);
            image(imgHover, x, y, w, h);
        }
        // Se o rato não estiver por cima, não desenha nada (fica invisível)!
    }
    pop();
}

// Configura quais botões aparecem dependendo do personagem
function configurarBotoesNave() {
    for (let key in btnNave) { btnNave[key] = false; }
    _missaoConcluida = false; // reset ao entrar com novo personagem

    if (personagemAtual === "BARYL") {
        btnNave.btnVoyager = true;
        btnNave.btnCrescendolls = true;
    } else if (personagemAtual === "ARPEGIUS") {
        btnNave.btnHarder = true;
        btnNave.btnAerodynamic = true;
    } else if (personagemAtual === "OCTAVE") {
        btnNave.btnSuper = true;
        btnNave.btnVeridis = true;
    } else if (personagemAtual === "STELLA") {
        btnNave.btnSome = true;
        btnNave.btnOne = true;
    }
}


function verificarProgressoNave() {
    if (_missaoConcluida) return; 

    let concluiu = false;
    let destino  = "MENU_PERSONAGENS";

    if (personagemAtual === "BARYL" && TarefaConcluida.voyager && TarefaConcluida.crescendolls) {
        personagensStatus.arpegius = true;
        concluiu = true;
    }
    else if (personagemAtual === "ARPEGIUS" && TarefaConcluida.aerodynamic && TarefaConcluida.harder) {
        personagensStatus.octave = true;
        concluiu = true;
    }
    else if (personagemAtual === "OCTAVE" && TarefaConcluida.super && TarefaConcluida.veridis) {
        personagensStatus.stella = true;
        concluiu = true;
    }
    else if (personagemAtual === "STELLA" && TarefaConcluida.some && TarefaConcluida.one) {
        destino = "VITORIA";
        concluiu = true;
        isFinalVictory = true; // musica continua em loop pro fim
    }

    if (concluiu) {
        _missaoConcluida = true;
        personagemAtual  = "";
        if (destino === "VITORIA") {
            iniciarCenaFinal(); 
        } else {
            goTo(destino);
        }
    }
}

function handleNaveClick() {

    let larguraEscalada = bgNave.width * scaleRatioNave;
    let centroX = (width - larguraEscalada) / 2;

    let virtualMouseX = (mouseX - centroX) / scaleRatioNave;
    let virtualMouseY = mouseY / scaleRatioNave;

    function clickBtn(x, y, img) {
        let fatorAjuste = 1.22; 
        let w = img.width * fatorAjuste;
        let h = img.height * fatorAjuste;

        return virtualMouseX > x - w / 2 && virtualMouseX < x + w / 2 && virtualMouseY > y - h / 2 && virtualMouseY < y + h / 2;
    }

    // Verificações de clique
    if (btnNave.btnVoyager && !TarefaConcluida.voyager && clickBtn(699, 805, buttonLine["Voyager"])) goTo("TAREFA6");
    if (btnNave.btnCrescendolls && !TarefaConcluida.crescendolls && clickBtn(1090, 906, buttonLine["Crescendolls"])) goTo("TAREFA3");
    if (btnNave.btnAerodynamic && !TarefaConcluida.aerodynamic && clickBtn(1180, 909, buttonLine["Aerodynamic"])) goTo("TAREFA1");
    if (btnNave.btnHarder && !TarefaConcluida.harder && clickBtn(946, 830, buttonLine["Harder"])) goTo("TAREFA2");
    if (btnNave.btnSuper && !TarefaConcluida.super && clickBtn(1180, 767, buttonLine["Super"])) goTo("TAREFA4");
    if (btnNave.btnVeridis && !TarefaConcluida.veridis && clickBtn(1292, 837, buttonLine["Veridis"])) goTo("TAREFA7");
    if (btnNave.btnSome && !TarefaConcluida.some && clickBtn(1184, 839, buttonLine["Some"])) goTo("TAREFA5");
    if (btnNave.btnOne && !TarefaConcluida.one && clickBtn(522, 850, buttonLine["One"])) goTo("TAREFA8");
}

function mostrarCoordenadasRato() {
    let larguraEscalada = bgNave.width * scaleRatioNave;
    let centroX = (width - larguraEscalada) / 2;
    let vX = (mouseX - centroX) / scaleRatioNave;
    let vY = mouseY / scaleRatioNave;

    push();
    fill(255, 0, 0); 
    noStroke();
    textSize(20);
    textFont('Arial');
    textAlign(LEFT, TOP);
    // Desenha nas coordenadas virtuais para acompanhar o cursor na perfeição!
    text("X: " + floor(vX) + " | Y: " + floor(vY), vX + 15, vY + 15);
    pop();
}