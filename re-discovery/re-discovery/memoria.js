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
        // se isFinalVictory for tru esta função no menu.js não faz nada
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
    push();
    image(bgMenu, 0, 0, menuNewW, menuNewH);
    imageMode(CENTER);
    image(bgNave, width / 2, height / 2, naveNewW, naveNewH);
    pop();

   
    noStroke();
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);

    //calc para manter o ratio

    let videoH = height * 0.75; 
    let videoW = videoH * (4 / 3); 

    // se o ecrã for muito estreito, ajusta pela largura em vez da altura
    if (videoW > width * 0.9) {
        videoW = width * 0.9;
        videoH = videoW * (3 / 4);
    }

    let videoX = (width - videoW) / 2;
    let videoY = (height - videoH) / 2;

   
    if (memoriaVideo && memoriaVideo.elt.readyState >= 2) {
        push();
        imageMode(CORNER);
        
        image(memoriaVideo, videoX, videoY, videoW, videoH);
        pop();
    }
}

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