let personagemAtual = "";
let mostrarHolograma = false;

let TarefaConcluida = {
    aerodynamic: false, crescendolls: false, some: false, super: false,
    veridis: false, voyager: false, harder: false, one: false
};

let btnNave = {
    btnAerodynamic: false, btnCrescendolls: false, btnSome: false, btnSuper: false,
    btnVeridis: false, btnVoyager: false, btnHarder: false, btnOne: false
};

let _missaoConcluida = false;

let buttonLine = {};
let buttonHover = {};
let buttonConc = {};
let imgVidros = {};

let svgNames = ["Aerodynamic", "Crescendolls", "Some", "Super", "Veridis", "Voyager", "Harder", "One"];

// variáveis para guardar os vídeos dos monitores
let videoVoyagerNave = null;
let videoHarderNave = null;

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

let nivelVidroAnterior = 0; 

function drawNave() {
    background(0);
    let larguraEscalada = bgNave.width * scaleRatioNave;
    let centroX = (width - larguraEscalada) / 2;

    image(bgMenu, 0, 0, menuNewW, menuNewH);
    
    push(); 
    translate(centroX, 0); 
    scale(scaleRatioNave);
    
    imageMode(CORNER);
    image(bgNave, 0, 0);

    drawCockpitLife();

    let nivelVidroAtual = 0;

    if (personagensStatus.arpegius) nivelVidroAtual = 1; 
    if (personagensStatus.octave) nivelVidroAtual = 2;   
    if (personagensStatus.stella) nivelVidroAtual = 3;   

    if (nivelVidroAtual > nivelVidroAnterior) {
        tocarSomRacha(); 
        nivelVidroAnterior = nivelVidroAtual; 
    }

    if (nivelVidroAtual > 0 && imgVidros[nivelVidroAtual]) {
        blendMode(SCREEN); 
        image(imgVidros[nivelVidroAtual], 0, 0, bgNave.width, bgNave.height);
        blendMode(BLEND);  
    }

    drawBtnImagem(699, 805, btnNave.btnVoyager, TarefaConcluida.voyager, buttonLine["Voyager"], buttonHover["Voyager"], buttonConc["Voyager"]);
    drawBtnImagem(1090, 906, btnNave.btnCrescendolls, TarefaConcluida.crescendolls, buttonLine["Crescendolls"], buttonHover["Crescendolls"], buttonConc["Crescendolls"]);
    drawBtnImagem(1180, 909, btnNave.btnAerodynamic, TarefaConcluida.aerodynamic, buttonLine["Aerodynamic"], buttonHover["Aerodynamic"], buttonConc["Aerodynamic"]);
    drawBtnImagem(946, 830, btnNave.btnHarder, TarefaConcluida.harder, buttonLine["Harder"], buttonHover["Harder"], buttonConc["Harder"]);
    drawBtnImagem(1180, 767, btnNave.btnSuper, TarefaConcluida.super, buttonLine["Super"], buttonHover["Super"], buttonConc["Super"]);
    drawBtnImagem(1292, 837, btnNave.btnVeridis, TarefaConcluida.veridis, buttonLine["Veridis"], buttonHover["Veridis"], buttonConc["Veridis"]);
    drawBtnImagem(1184, 839, btnNave.btnSome, TarefaConcluida.some, buttonLine["Some"], buttonHover["Some"], buttonConc["Some"]);
    drawBtnImagem(522, 850, btnNave.btnOne, TarefaConcluida.one, buttonLine["One"], buttonHover["One"], buttonConc["One"]);

    drawNaveHolograma();

    pop(); 

    verificarProgressoNave();
}

function drawCockpitLife() {
    push();

    // partículas de poeira/vida no cockpit
    for(let i = 0; i < 30; i++) {
        let sx = noise(i, 0) * 1400 + 250; 
        let sy = noise(0, i) * 600 + 50;   
        let alpha = noise(i, frameCount * 0.03) * 255;
        fill(255, 255, 255, alpha);
        noStroke();
        ellipse(sx, sy, random(1, 3));
    }

    // memoria tarefa 6
    if (TarefaConcluida.voyager) {
        if (!videoVoyagerNave) {
            videoVoyagerNave = createVideo(['videos/memoria7.webm']);
            videoVoyagerNave.elt.muted = true; // Sem som
            videoVoyagerNave.elt.playsInline = true;
            videoVoyagerNave.loop();
            videoVoyagerNave.hide();
        }
        drawVideoScreen(698, 805, 130, 100, videoVoyagerNave);
    } else {
        drawStaticScreen(698, 805, 130, 100);
    }

    // memoria tarefa 2
    if (TarefaConcluida.harder) {
        if (!videoHarderNave) {
            videoHarderNave = createVideo(['videos/memoria2.webm']);
            videoHarderNave.elt.muted = true; // Sem som
            videoHarderNave.elt.playsInline = true;
            videoHarderNave.loop();
            videoHarderNave.hide();
        }
        drawVideoScreen(935, 830, 115, 85, videoHarderNave);
    } else {
        drawStaticScreen(935, 830, 115, 85);
    }

    // luzes apos fim das tareafas
    drawColoredLight(1179, 765, "circle", color(255, 0, 0), TarefaConcluida.super);  
    drawColoredLight(178, 775, "circle", color(150, 0, 255), TarefaConcluida.one); 
    drawColoredLight(260, 833, "circle", color(255, 255, 0), TarefaConcluida.veridis); 
    drawColoredLight(1090, 900, "circle", color(0, 255, 0), TarefaConcluida.crescendolls ,40, 17);  
    drawColoredLight(1183, 840, "circle", color(0, 100, 255), TarefaConcluida.some,35,35);
    
    pop();
}

function drawStaticScreen(cx, cy, w, h) {
    push();
    noStroke();
    rectMode(CENTER);
    
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.roundRect(cx - w/2, cy - h/2, w, h, 15); 
    drawingContext.clip(); 

    fill(20, 20, 20, 240);
    rect(cx, cy, w, h); 
    
    // efeito estatica
    for (let i = 0; i < 200; i++) {
        fill(255, 255, 255, random(50, 200));
        rect(cx + random(-w/2, w/2), cy + random(-h/2, h/2), random(3, 7), random(3, 7));
    }

    drawingContext.restore();
    pop();
}

function drawVideoScreen(cx, cy, w, h, vid) {
    if (vid && vid.elt.readyState >= 2) {
        push();
        imageMode(CENTER);
        noStroke();
        
        // Máscara
        drawingContext.save();
        drawingContext.beginPath();
        drawingContext.roundRect(cx - w/2, cy - h/2, w, h, 15);
        drawingContext.clip();

        image(vid, cx, cy, w, h);

        drawingContext.restore();
        pop();
    }
}

// Atualizada para receber o isBlinkingGreen
function drawColoredLight(cx, cy, shapeType, c, isBlinkingGreen = false, tamanhoX = 32,tamanhoY =32 ) {
    push();
    rectMode(CENTER);
    
    let finalColor = c;
    let pulseAlpha = sin(frameCount * 0.1 + cx * 0.05) * 100 + 100;
    
    // Se a tarefa foi concluída, a luz fica verde
    if (isBlinkingGreen) {
        finalColor = color(62, 255, 81); 
        pulseAlpha = map(sin(frameCount * 0.2), -1, 1, 50, 255); 
    }
    
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = color(red(finalColor), green(finalColor), blue(finalColor), pulseAlpha); 
    fill(red(finalColor), green(finalColor), blue(finalColor), pulseAlpha * 0.8);
    noStroke();
    
    if (shapeType === "circle") {
        ellipse(cx, cy, tamanhoX, tamanhoY); 
    } else {
        rect(cx, cy, tamanho, tamanho, 5); 
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

    let over = virtualMouseX > x - w / 2 && virtualMouseX < x + w / 2 && virtualMouseY > y - h / 2 && virtualMouseY < y + h / 2;

    push();
    imageMode(CENTER);

    if (isConcluded) {
    }
    else if (isUnlocked) {
        if (over) {
            cursor(HAND);
            image(imgHover, x, y, w, h);
        }
    }
    pop();
}

function drawNaveHolograma() {
    let nivelDisco = 0;
    if (TarefaConcluida.veridis && TarefaConcluida.one) nivelDisco = 4;
    else if (personagensStatus.stella) nivelDisco = 3;
    else if (personagensStatus.octave) nivelDisco = 2;
    else if (personagensStatus.arpegius) nivelDisco = 1;

    if (nivelDisco === 0) return; 

    let discoX = bgNave.width - 250;
    let discoY = 180;
    let discoSize = 130; 
    let imgD = disco[nivelDisco];
    let proporcao = imgD.height / imgD.width;

    push();
    imageMode(CENTER);
    
    let larguraEscalada = bgNave.width * scaleRatioNave;
    let centroX = (width - larguraEscalada) / 2;
    let virtualMouseX = (mouseX - centroX) / scaleRatioNave;
    let virtualMouseY = mouseY / scaleRatioNave;
    
    let hoverDisco = dist(virtualMouseX, virtualMouseY, discoX, discoY) < discoSize / 2;
    
    if (hoverDisco && !mostrarHolograma) {
        cursor(HAND);
        discoSize *= 1.1; 
        drawingContext.shadowBlur = 20;
        drawingContext.shadowColor = color(255, 215, 0);
    }

    image(imgD, discoX, discoY, discoSize, discoSize * proporcao);
    pop();

    if (mostrarHolograma) {
        push();
        noStroke();
        fill(0, 0, 0, 175); 
        rect(0, 0, bgNave.width, bgNave.height);

        drawingContext.shadowBlur = 25;
        drawingContext.shadowColor = color(0, 255, 255);

        imageMode(CENTER);
        let cx = bgNave.width / 2;
        let cy = bgNave.height / 2; 
        
        let w = bgNave.width * 0.15;
        let h = w * (imgBaryl.height / imgBaryl.width);
        let gap = bgNave.width * 0.18;


        function drawHoloCard(img, x, isUnlocked) {
            if (isUnlocked) {
                image(img, x, cy, w, h);
            } else {
                push();
                tint(0, 100, 100, 80); 
                image(img, x, cy, w, h);
                pop();
            }
        }

        drawHoloCard(imgBaryl, cx - (gap * 1.5), personagensStatus.baryl);
        drawHoloCard(imgArpegius, cx - (gap * 0.5), personagensStatus.arpegius);
        drawHoloCard(imgOctave, cx + (gap * 0.5), personagensStatus.octave);
        drawHoloCard(imgStella, cx + (gap * 1.5), personagensStatus.stella);

        textAlign(CENTER, CENTER);
        textFont('Impact');
        fill(0, 255, 255);
        textSize(bgNave.width * 0.04);
        text("PROGRESS", cx, cy - h/2 - 80);
    }
}

function configurarBotoesNave() {
    for (let key in btnNave) { btnNave[key] = false; }
    _missaoConcluida = false; 

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
        isFinalVictory = true; 
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

    if (mostrarHolograma) {
        mostrarHolograma = false;
        return; 
    }

    let nivelDisco = 0;
    if (TarefaConcluida.veridis && TarefaConcluida.one) nivelDisco = 4;
    else if (personagensStatus.stella) nivelDisco = 3;
    else if (personagensStatus.octave) nivelDisco = 2;
    else if (personagensStatus.arpegius) nivelDisco = 1;

    if (nivelDisco > 0) {
        let discoX = bgNave.width - 250;
        let discoY = 180;
        let discoSize = 130;
        if (dist(virtualMouseX, virtualMouseY, discoX, discoY) < discoSize / 2) {
            mostrarHolograma = true; 
            return;
        }
    }

    function clickBtn(x, y, img) {
        let fatorAjuste = 1.22; 
        let w = img.width * fatorAjuste;
        let h = img.height * fatorAjuste;
        return virtualMouseX > x - w / 2 && virtualMouseX < x + w / 2 && virtualMouseY > y - h / 2 && virtualMouseY < y + h / 2;
    }

    if (btnNave.btnVoyager && !TarefaConcluida.voyager && clickBtn(699, 805, buttonLine["Voyager"])) goTo("TAREFA6");
    if (btnNave.btnCrescendolls && !TarefaConcluida.crescendolls && clickBtn(1090, 906, buttonLine["Crescendolls"])) goTo("TAREFA3");
    if (btnNave.btnAerodynamic && !TarefaConcluida.aerodynamic && clickBtn(1180, 909, buttonLine["Aerodynamic"])) goTo("TAREFA1");
    if (btnNave.btnHarder && !TarefaConcluida.harder && clickBtn(946, 830, buttonLine["Harder"])) goTo("TAREFA2");
    if (btnNave.btnSuper && !TarefaConcluida.super && clickBtn(1180, 767, buttonLine["Super"])) goTo("TAREFA4");
    if (btnNave.btnVeridis && !TarefaConcluida.veridis && clickBtn(1292, 837, buttonLine["Veridis"])) goTo("TAREFA7");
    if (btnNave.btnSome && !TarefaConcluida.some && clickBtn(1184, 839, buttonLine["Some"])) goTo("TAREFA5");
    if (btnNave.btnOne && !TarefaConcluida.one && clickBtn(522, 850, buttonLine["One"])) goTo("TAREFA8");
}