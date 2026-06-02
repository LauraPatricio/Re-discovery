// Mapa de tarefa → ficheiro de vídeo
const MEMORIA_VIDEOS = {
    aerodynamic:  'videos/memoria1.webm',
    harder:       'videos/memoria2.webm',
    crescendolls: 'videos/memoria3.webm',
    super:        'videos/memoria4.webm',
    some:         'videos/memoria5.webm',  
    veridis:      'videos/memoria6.webm',
    voyager:      'videos/memoria7.webm',
    one:          'videos/memoria8.webm',
};

let memoriaVideo = null;
let sonsExtraMemoria = {};
let currentMemoriaKey = "";

function preloadMemoria() {
    // Carrega sons para tarefas que não têm música própria em loop
    sonsExtraMemoria['aerodynamic'] = loadSound('sons/aerodynamic.mp3');
    sonsExtraMemoria['harder'] = loadSound('sons/harder better faster stronger.mp3');
    sonsExtraMemoria['veridis'] = loadSound('sons/veridisquo.mp3');
    sonsExtraMemoria['voyager'] = loadSound('sons/voyager.mp3');
}

function concluirComMemoria(tarefaKey) {
    gameState = "MEMORIA"; 

    //mostra video
    if (TarefaConcluida.some && TarefaConcluida.one) {
        isFinalVictory = true;
    }

    if (memoriaVideo) {
        memoriaVideo.stop();
        memoriaVideo.remove();
    }
    
    currentMemoriaKey = tarefaKey;
    let src = MEMORIA_VIDEOS[tarefaKey];
    if (!src) { goTo("NAVE"); return; }

    memoriaVideo = createVideo([src]);
    memoriaVideo.hide();
    memoriaVideo.elt.playsInline = true;
    
    let tarefasMusicais = ['crescendolls', 'super', 'some', 'one', 'voyager'];
    if (!tarefasMusicais.includes(tarefaKey) && sonsExtraMemoria[tarefaKey]) {
        sonsExtraMemoria[tarefaKey].play();
    }

    memoriaVideo.onended(() => {
        // Se isFinalVictory for tru esta função no menu.js não faz nada
        pararTodosSonsTarefas(); 
        
        if (sonsExtraMemoria[currentMemoriaKey]) {
            sonsExtraMemoria[currentMemoriaKey].stop();
        }
        
        goTo("NAVE", "FADE"); 
        setTimeout(() => {
            if (memoriaVideo) {
                memoriaVideo.remove();
                memoriaVideo = null;
            }
        }, 800);
    });

    memoriaVideo.play();
}

function drawMemoriaScreen() {
    // 1. Fundo da Nave
    push();
    imageMode(CENTER);
    image(bgNave, width / 2, height / 2, naveNewW, naveNewH);
    pop();

    // 2. Película escura
    noStroke();
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);

    // --- CÁLCULO LIVRE PARA O VÍDEO (MAIOR E EM 4:3) ---
    // O vídeo vai ocupar 85% da altura da tua janela
    let videoH = height * 0.75; 
    let videoW = videoH * (4 / 3); // Garante a proporção matemática 4:3

    // Prevenção: Se o ecrã for muito estreito, ajustamos pela largura em vez da altura
    if (videoW > width * 0.9) {
        videoW = width * 0.9;
        videoH = videoW * (3 / 4);
    }

    // Calcula as coordenadas exatas para centrar perfeitamente no ecrã
    let videoX = (width - videoW) / 2;
    let videoY = (height - videoH) / 2;

    // 3. Desenhar o Vídeo
    if (memoriaVideo && memoriaVideo.elt.readyState >= 2) {
        push();
        imageMode(CORNER);
        
        // Desenha o vídeo limpo, sem escalas restritivas e sem vignette
        image(memoriaVideo, videoX, videoY, videoW, videoH);
        pop();
    }
}

// Input do user
function handleMemoriaClick() {
    if (memoriaEnded) {
        pararMemoria();
        goTo(memoriaNextState);
    }
}

// para memoria
function pararMemoria() {
    if (memoriaVideo) {
        memoriaVideo.stop();
        memoriaVideo.remove(); 
        memoriaVideo = null;
    }
}