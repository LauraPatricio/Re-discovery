//imagens
let imgBaryl, imgArpegius, imgOctave, imgStella;
let bgNave;

let personagensStatus = {
    baryl: true, // Inicialmente desbloqueado
    arpegius: false,
    octave: false,
    stella: false
};

//posição ecra.
const POS_CARDS = {
    y: 0.45, // Todos alinhados a meio (verticalmente)
    wh: 1, // Largura e Altura
    espacamento: 0.2 // Distância entre eles (horizontalmente)
};
function preloadMenuPerson(){
    imgBaryl = loadImage('imagens/baryl.png');
    imgArpegius = loadImage('imagens/arpegius.png');
    imgOctave = loadImage('imagens/octave.png');
    imgStella = loadImage('imagens/stella.png');
    bgNave = loadImage('imagens/nave.png');
}

function drawMenuPersonagens() {
    background(0);
    image(bgNave, 0, 0, width, height);

    //Camada Opacidade
    noStroke();
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);

    push();
    imageMode(CENTER);
    let cx = width / 2;
    let gap = width * POS_CARDS.espacamento;

    let xBaryl = cx - (gap * 1.5);
    let xArpegius = cx - (gap * 0.5);
    let xOctave = cx + (gap * 0.5);
    let xStella = cx + (gap * 1.5);

    let y = height * POS_CARDS.y;
    let w = imgArpegius.width * POS_CARDS.wh;
    let h = imgArpegius.height * POS_CARDS.wh;

    // Desenhar as 4 cartas
    drawCard(imgBaryl, xBaryl, y, w, h, personagensStatus.baryl);
    drawCard(imgArpegius, xArpegius, y, w, h, personagensStatus.arpegius);
    drawCard(imgOctave, xOctave, y, w, h, personagensStatus.octave);
    drawCard(imgStella, xStella, y, w, h, personagensStatus.stella);
    pop();

}

// Função auxiliar para desenhar a carta (normal ou escurecida se bloqueada)
function drawCard(img, x, y, w, h, isUnlocked) {
    if (img) {
        if (isUnlocked) {
            // Desenha normal e verifica se o rato está por cima para feedback
            let isHover = mouseX > x - w/2 && mouseX < x + w/2 && mouseY > y - h/2 && mouseY < y + h/2;

            if (isHover) {
                cursor(HAND);
                // Desenha uma borda de destaque (Brilho branco, como no mockup)
                push();
                rectMode(CENTER);
                stroke(255);
                strokeWeight(4);
                noFill();
                rect(x, y, w, h);
                pop();
            }
            image(img, x, y, w, h);
        } else {
            // Se estiver bloqueado, desenha a imagem mais escura
            push();
            tint(100); // Aplica um filtro escuro (valores menores que 255 escurecem)
            image(img, x, y, w, h);
            pop();
        }
    }
}



//PROVISORIO-------------------------------

// Lógica de clique (Chamar isto no mousePressed do menu.js)
// menu_personagens.js

function handlePersonagensClick() {
    let cx = width / 2;
    let gap = width * POS_CARDS.espacamento;

    let xBaryl = cx - (gap * 1.5);
    let xArpegius = cx - (gap * 0.5);
    let xOctave = cx + (gap * 0.5);
    let xStella = cx + (gap * 1.5);

    let y = height * POS_CARDS.y;
    let w = imgArpegius.width * POS_CARDS.wh;
    let h = imgArpegius.height * POS_CARDS.wh;

    function clickCard(x, y, w, h) {
        return mouseX > x - w/2 && mouseX < x + w/2 && mouseY > y - h/2 && mouseY < y + h/2;
    }

    // Clique no Baryl
    if (clickCard(xBaryl, y, w, h) && personagensStatus.baryl) {
        personagemAtual = "BARYL";
        configurarBotoesNave(); // Função que vamos criar a seguir
        goTo("NAVE");
    }
    // Clique no Arpegius
    else if (clickCard(xArpegius, y, w, h) && personagensStatus.arpegius) {
        personagemAtual = "ARPEGIUS";
        configurarBotoesNave();
        goTo("NAVE");
    }
    else if (clickCard(xOctave, y, w, h) && personagensStatus.octave) {
        personagemAtual = "OCTAVE";
        configurarBotoesNave();
        goTo("NAVE");
    }
    else if (clickCard(xStella, y, w, h) && personagensStatus.stella) {
        personagemAtual = "STELLA";
        configurarBotoesNave();
        goTo("NAVE");
    }
}