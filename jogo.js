// MoonLader - Um jogo de Alunissagem.
//Júlia Polycarpo (https://github.com/JuliaPolycarpo)
//20.03.2025
//Versão 0.1.0


/** @type {HTMLCanvasElement}*/

//Seção de Modelagem de dados 
let canvas = document.querySelector('#jogo');
let contexto = canvas.getContext('2d');

let lancamentoEsquerda = (Math.round(Math.random()) == 0)

let moduloLunar = {
    posicao: {
        x:lancamentoEsquerda ? 100: 700,
        y:100
    },
    angulo: lancamentoEsquerda ? -Math.PI/2 : Math.PI/2,
    largura: 20,
    altura:20,
    cor: 'lightpink',
    motorLigado: false,
    velocidade: {
        x: lancamentoEsquerda ? 2 : -2,
        y: 0
    },
    combustivel: 1000,
    rotacaoEsquerda: false,
    rotacaoDireita: false
}

let estrelas = [];

for(let i = 0; i < 500; i++){
    estrelas[i] = {  
        x: Math.random() * canvas.width,
        y: Math.random()* canvas.height,
        raio: Math.sqrt(2 * Math.random()),
        brilho: 1.0,
        apagando: true,
        cintilacao: 0.05 * Math.random()

    }
}


//Seção de Visualização
function desenharModuloLunar(){
    contexto.save();
    contexto.beginPath();
    contexto.translate (moduloLunar.posicao.x, moduloLunar.posicao.y);
    contexto.rotate(moduloLunar.angulo);
    contexto.rect(moduloLunar.largura * -0.5, moduloLunar.altura * -0.5, moduloLunar.largura, moduloLunar.altura);
    contexto.fillStyle = moduloLunar.cor;
    contexto.fill();
    contexto.closePath();
    if (moduloLunar.motorLigado){
        desenharChama();
    }
    contexto.restore();   
}

function desenharChama(){
    contexto.beginPath();
    contexto.moveTo(moduloLunar.largura * -0.5, moduloLunar.altura * 0.5);
    contexto.lineTo(moduloLunar.largura * 0.5, moduloLunar.altura * 0.5)
    contexto.lineTo(0, moduloLunar.altura * 0.5 + Math.random ()* 15);
    //contexto.lineTo(moduloLunar.largura * -0.5, moduloLunar.altura*0.5);
    contexto.closePath()
    contexto.fillStyle = 'orange';
    contexto.fill()
}

function mostrarTexto(mensagem, x, y){
    contexto.font = 'bold 18px Arial'
    contexto.textAlign = 'center'
    contexto.textBaseline = 'middle'
    contexto.fillStyle = 'lightgray'
    contexto.fillText(mensagem, x, y);
}

function mostrarvelocidade(){
    let velocidadeH = `Velocidade Horizontal: ${(10*moduloLunar.velocidade.y).toFixed(1)}`;
    mostrarTexto(velocidadeH, 125, 60);
    let velocidadeV = `Velocidade Vertical: ${(10*moduloLunar.velocidade.x).toFixed(1)}`;
    mostrarTexto(velocidadeV, 115 ,90);
}

function mostrarCombustivel(){
    let combustivel = `Combustível: ${((moduloLunar.combustivel /1000)*100).toFixed(0)}%`;
    mostrarTexto(combustivel, 90, 120);
}

function mostrarangulo(){
    let angulo = `Ângulo: ${(moduloLunar.angulo * 180/Math.PI).toFixed(0)}°`;
    mostrarTexto(angulo, 350, 60);
}
function mostraraltitude(){
    let latitude = `Altitude: ${(canvas.height - moduloLunar.posicao.y).toFixed(2)}`;
    mostrarTexto(latitude, 361, 90);
}

function desenharEstrelas(){
    contexto.save();
    for (let i = 0; i < estrelas.length; i++){
        let estrela = estrelas[i];
        contexto.beginPath();
        contexto.arc(estrela.x, estrela.y, estrela.raio, 0, 2*Math.PI);
        contexto.closePath();
        contexto.fillStyle = `rgba(157, 26, 238, ${estrela.brilho} )`;
        contexto.fill();
        if (estrela.apagando){
            estrela.brilho -= estrela.cintilacao/2;
            if (estrela.brilho <= 0.1){
                estrela.apagando = false;
        }
    }else {
        estrela.brilho += estrela.cintilacao/2;
        if (estrela.brilho >= 0.95){
            estrela.apagando = true 
        }
    }    
    }
    contexto.restore();
}

function gastarCombustivel(){
    if (moduloLunar.combustivel > 0){
        moduloLunar.combustivel --
    }else{
        moduloLunar.combustivel = 0
        moduloLunar.motorLigado = false
    }
}

function desenhar(){
    contexto.clearRect(0,0,canvas.width, canvas.height);
    //Essa função atualiza o posição do modulo lunar em função da gravidade 
     atracaoGravitacional();
     desenharEstrelas();
     desenharModuloLunar();
     mostrarvelocidade();
     mostrarangulo();
     mostraraltitude();
     mostrarCombustivel();
     
     //Essa função repete a execução de desenhar a cada atualização de tela (ou a cada quadro)
     if (moduloLunar.posicao.y >= (canvas.height - 0.5 * moduloLunar.altura )) {
        if (moduloLunar.velocidade.y <= 0.5 || Math.abs(moduloLunar.velocidade.x) >= 0.5 || 5 < Math.abs(moduloLunar.angulo)){;
            contexto.font = 'bold 50px Georgia'
            contexto.textAlign = 'center'
            contexto.textBaseline = 'middle'
            contexto.fillStyle = 'red'
            return contexto.fillText('GAME OVER', 360, 320);
              
        }else {
            contexto.font = 'bold 50px Georgia'
            contexto.textAlign = 'center'
            contexto.textBaseline = 'middle'
            contexto.fillStyle = 'green'
            return contexto.fillText('VOCÊ CONSEGUIU POUSAR!', 400, 320);   
        }
    }
     requestAnimationFrame (desenhar);     
}

   //Seção de controle
document.addEventListener('keydown', teclaPressionada);
function teclaPressionada(evento){
    if(evento.keyCode == 38 && moduloLunar.combustivel > 0){
        moduloLunar.motorLigado = true;
        gastarCombustivel()
    }
     else if(evento.keyCode == 39){
       moduloLunar.rotacaoEsquerda = true;
       
    }
     else if(evento.keyCode == 37){
        moduloLunar.rotacaoDireita = true;
    
    }
}
    //soltando a tecla
document.addEventListener('keyup', teclaSolta);
function teclaSolta(evento){
    if(evento.keyCode == 38){
        moduloLunar.motorLigado = false;
        
    }else if(evento.keyCode == 39){
        moduloLunar.rotacaoEsquerda = false;
        
    }
     else if(evento.keyCode == 37){
        moduloLunar.rotacaoDireita = false;
        
    }
    
}

let gravidade = 0.02;
function atracaoGravitacional(){
    moduloLunar.posicao.x += moduloLunar.velocidade.x;
    moduloLunar.posicao.y += moduloLunar.velocidade.y;

    if(moduloLunar.rotacaoEsquerda){
        moduloLunar.angulo += Math.PI / 180; 
    } else if(moduloLunar.rotacaoDireita){
        moduloLunar.angulo -= Math.PI / 180;
    }
    if(moduloLunar.motorLigado){
        moduloLunar.velocidade.y -= 0.08 * Math.cos(moduloLunar.angulo);
        moduloLunar.velocidade.x += 0.08 * Math.sin(moduloLunar.angulo);
    }
    moduloLunar.velocidade.y += gravidade; 
}
desenhar();

