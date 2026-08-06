// --- 1. CONTROLE DE BRILHO (OVERLAY) ---
let brightnessPercent = 100;

function adjustBrightness(step) {
    brightnessPercent += step;
    
    // Limita entre 20% e 150%
    if (brightnessPercent < 20) brightnessPercent = 20;
    if (brightnessPercent > 150) brightnessPercent = 150;

    document.getElementById('bright-val').innerText = brightnessPercent + '%';

    const overlay = document.getElementById('brightness-overlay');
    
    // Ajusta a opacidade da máscara preta para escurecer ou clarear a tela
    if (brightnessPercent < 100) {
        overlay.style.backgroundColor = 'black';
        overlay.style.opacity = (100 - brightnessPercent) / 100;
    } else {
        overlay.style.backgroundColor = 'white';
        overlay.style.opacity = (brightnessPercent - 100) / 200;
    }
}

// --- 2. SELEÇÃO DE VOZ DO GOOGLE ---
const synth = window.speechSynthesis;
let selectedVoice = null;

function initVoices() {
    const voices = synth.getVoices();

    // Prioriza vozes do Google em português do Brasil
    selectedVoice = voices.find(v => v.name.includes("Google") && v.lang.includes("pt"))
                 || voices.find(v => v.lang.includes("pt-BR"))
                 || voices.find(v => v.lang.includes("pt"));

    const status = document.getElementById('voice-status');
    if (selectedVoice) {
        status.innerText = `Voz: ${selectedVoice.name}`;
    } else {
        status.innerText = "Voz padrão do sistema";
    }
}

if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = initVoices;
}
initVoices();

// --- 3. DITAR APENAS O CARD CLICADO ---
function speakCard(cardElement) {
    synth.cancel(); // Interrompe qualquer fala anterior

    // Pega o título e o texto explicativo do card clicado
    const title = cardElement.querySelector('h3').innerText;
    const text = cardElement.querySelector('p').innerText;
    const fullText = `${title}. ${text}`;

    const utterance = new SpeechSynthesisUtterance(fullText);

    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;

    synth.speak(utterance);
}

function stopSpeech() {
    synth.cancel();
}

// --- 4. FILTROS DE VISÃO ---
function applyVisionFilter(condition) {
    const root = document.documentElement.style;

    // Reset dos filtros
    root.setProperty('--blur-val', '0px');
    root.setProperty('--shadow-val', 'none');
    root.setProperty('--hue-val', '0deg');
    root.setProperty('--opacity-val', '1');

    switch (condition) {
        case 'catarata':
            root.setProperty('--blur-val', '3px');
            root.setProperty('--opacity-val', '0.5');
            break;
        case 'astigmatismo':
            root.setProperty('--blur-val', '0.8px');
            root.setProperty('--shadow-val', '4px 2px 3px rgba(255, 255, 255, 0.8)');
            break;
        case 'miopia':
            root.setProperty('--blur-val', '4px');
            break;
        case 'hipermetropia':
            root.setProperty('--blur-val', '2px');
            break;
        case 'presbiopia':
            root.setProperty('--blur-val', '2.5px');
            break;
        case 'conjuntivite':
            root.setProperty('--hue-val', '-60deg');
            root.setProperty('--blur-val', '1.2px');
            break;
        default:
            break;
    }
}
