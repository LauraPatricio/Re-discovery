// cores personagens
let corA, corB, corO, corS;


// Saber qual personagem foi clicado no menu de personagens
let personagemAtual = "";

let TarefaConcluida = {
    aerodynamic: false,
    crescendolls: false,
    some: false,
    super: false,
    veridis: false,
    voyager: false,
    harder: false,
    one:false
}
let btnNave = {
    btnAerodynamic: false,
    btnCrescendolls: false,
    btnSome: false,
    btnSuper: false,
    btnVeridis: false,
    btnVoyager: false,
    btnHarder: false,
    btnOne: false,
}

function drawNave(){
    background(0);
    image(bgNave, 0, 0, width, height);

    corB = color(80, 229,255);
    corA = color (62,255,81);
    corO = color (255,75,180);
    corS = color (15,239,183);

    drawBtnTarefas(width, height/2, 20, 10,btnNave.btnVoyager,corB)
    drawBtnTarefas(width/2, height/2, 20, 10,btnNave.btnCrescendolls,corB);
    drawBtnTarefas(width/3, height/2, 20, 10,btnNave.btnAerodynamic,corA)
    drawBtnTarefas(width/4, height/2, 20, 10,btnNave.btnHarder,corA);
    drawBtnTarefas(width/5, height/2, 20, 10,btnNave.btnSuper,corO)
    drawBtnTarefas(width/6, height/2, 20, 10,btnNave.btnVeridis,corO);
    drawBtnTarefas(width/7, height/2, 20, 10,btnNave.btnSome,corS)
    drawBtnTarefas(width/8, height/2, 20, 10,btnNave.btnOne,corS);

    verificarProgressoNave()
}

function drawBtnTarefas(x, y, w, h, isUnlocked, cor) {
    // 1. Verificar se o mouse está sobre ESTE botão específico
    let over = mouseX > x - w/2 && mouseX < x + w/2 && mouseY > y - h/2 && mouseY < y + h/2;

    if (isUnlocked) {
        let c = color(cor);

        if (over) {
            cursor(HAND);
            push();
            rectMode(CENTER);
            fill(red(c), green(c), blue(c), 89);
            noStroke();
            rect(x, y, w, h);
            pop();
        }

        push();
        rectMode(CENTER);
        stroke(c);
        strokeWeight(2); // Diminuído para não "comer" o botão
        noFill();
        rect(x, y, w, h);
        pop();
    } else {
        // Botão bloqueado
        push();
        rectMode(CENTER);
        stroke(100); // Cinza para indicar bloqueado
        strokeWeight(1);
        noFill();
        rect(x, y, w, h);
        // Opcional: um X pequeno para indicar bloqueio
        line(x - 5, y - 5, x + 5, y + 5);
        pop();
    }
}

// nave.js

// Configura quais botões aparecem dependendo do personagem
function configurarBotoesNave() {
    // Desliga todos primeiro
    for (let key in btnNave) { btnNave[key] = false; }

    if (personagemAtual === "BARYL") {
        btnNave.btnAerodynamic = true;
        btnNave.btnHarder = true;
    } else if (personagemAtual === "ARPEGIUS") {
        btnNave.btnCrescendolls = true;
        btnNave.btnSuper = true;
    }
    // Continuar para os outros personagens...
}

// Verifica se o personagem terminou as suas duas tarefas
function verificarProgressoNave() {
    if (personagemAtual === "BARYL") {
        if (TarefaConcluida.aerodynamic && TarefaConcluida.harder) {
            // Desbloqueia próximo personagem
            personagensStatus.arpegius = true;
            // Volta ao menu de personagens
            goTo("MENU_PERSONAGENS");
            // Limpa o personagem atual para não repetir o loop
            personagemAtual = "";
        }
    }


    // Lógica futura para o ARPEGIUS desbloquear o OCTAVE, etc.
}

// Chamar esta função no mousePressed do menu.js quando gameState === "NAVE"
function handleNaveClick() {
    let w = 20; // Largura do botão no teu código
    let h = 10; // Altura do botão no teu código

    function clickBtn(x, y) {
        return mouseX > x - w/2 && mouseX < x + w/2 && mouseY > y - h/2 && mouseY < y + h/2;
    }

    // Se o botão Aerodynamic (Tarefa 1) está ativo, não foi concluído e foi clicado
    if (btnNave.btnAerodynamic && !TarefaConcluida.aerodynamic && clickBtn(width/3, height/2)) {
        goTo("TAREFA1");
    }

    // Se o botão Harder (Tarefa 2) está ativo, não foi concluído e foi clicado
    if (btnNave.btnHarder && !TarefaConcluida.harder && clickBtn(width/4, height/2)) {
        goTo("TAREFA2");
    }

    if (btnNave.btnHarder && !TarefaConcluida.crescendolls && clickBtn(width/4, height/2)) {
        goTo("TAREFA3");
    }
}