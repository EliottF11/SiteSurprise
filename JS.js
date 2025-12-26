// CONFIGURATION
const SECRET_PASSWORD = "27122007"; 
// On pré-charge la musique
const music = new Audio('Musique.mp3');
music.loop = true;

// --- ANTI-BLOCAGE AUDIO ---
// Dès le premier clic sur la page, on débloque le son silencieusement
function unlockAudio() {
    music.play().then(() => {
        music.pause();
        music.currentTime = 0;
    }).catch((e) => {});
}

document.body.addEventListener('click', unlockAudio, { once: true });
document.body.addEventListener('touchstart', unlockAudio, { once: true });
document.body.addEventListener('keydown', unlockAudio, { once: true });

// --- VÉRIFICATION DU MOT DE PASSE ---
function checkPassword() {
    const input = document.getElementById('password-input').value;
    const errorMsg = document.getElementById('error-msg');
    const loginScreen = document.getElementById('login-screen');
    const partyScreen = document.getElementById('party-screen');

    if (input === SECRET_PASSWORD) {
        
        // 1. Lancer la musique
        music.play().catch((e) => console.log("Erreur son:", e));

        // 2. Animation de transition
        loginScreen.style.opacity = '0';
        
        setTimeout(() => {
            loginScreen.classList.add('hidden');
            partyScreen.style.display = 'block';
            startConfetti(); 
        }, 500);

    } else {
        // Erreur
        errorMsg.style.opacity = '1';
        loginScreen.style.transform = 'translateX(10px)';
        setTimeout(() => { loginScreen.style.transform = 'translateX(-10px)'; }, 100);
        setTimeout(() => { loginScreen.style.transform = 'translateX(0)'; }, 200);
    }
}

// Valider avec Entrée
document.getElementById("password-input").addEventListener("keyup", function(event) {
    if (event.key === "Enter") checkPassword();
});

/* --- GESTION DE LA VIDÉO SURPRISE --- */
function showVideo() {
    const overlay = document.getElementById('video-overlay');
    const video = document.getElementById('meme-video');

    music.pause(); // On coupe la musique de fond
    overlay.classList.remove('hidden');
    overlay.style.display = 'flex'; 
    video.play(); // On lance la vidéo
}

function closeVideo() {
    const overlay = document.getElementById('video-overlay');
    const video = document.getElementById('meme-video');

    overlay.classList.add('hidden');
    overlay.style.display = 'none';
    
    video.pause();
    video.currentTime = 0;
    // Optionnel : relancer la musique de fond si tu veux
    // music.play(); 
}

/* --- MOTEUR DE CONFETTIS CŒURS --- */
const canvas = document.getElementById("confetti-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let confetti = [];
const confettiCount = 300;
const gravity = 0.5;
const terminalVelocity = 5;
const drag = 0.075;

// Couleurs : Rouge, Blanc, Rose
const colors = [
    { front: 'red', back: 'darkred' },         
    { front: 'white', back: '#e6e6e6' },       
    { front: 'hotpink', back: 'deeppink' },    
    { front: '#ffb6c1', back: '#ff69b4' }      
];

resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

randomRange = (min, max) => Math.random() * (max - min) + min;

initConfetti = () => {
    for (let i = 0; i < confettiCount; i++) {
        confetti.push({
            color: colors[Math.floor(randomRange(0, colors.length))],
            dimensions: { x: randomRange(20, 40), y: randomRange(20, 40) }, 
            position: { x: randomRange(0, canvas.width), y: canvas.height - 1 },
            rotation: randomRange(0, 2 * Math.PI),
            scale: { x: 1, y: 1 },
            velocity: { x: randomRange(-25, 25), y: randomRange(0, -50) }
        });
    }
};

render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confetti.forEach((confetto, index) => {
        let width = confetto.dimensions.x * confetto.scale.x;
        let height = confetto.dimensions.y * confetto.scale.y;

        ctx.translate(confetto.position.x, confetto.position.y);
        ctx.rotate(confetto.rotation);

        confetto.velocity.x -= confetto.velocity.x * drag;
        confetto.velocity.y = Math.min(confetto.velocity.y + gravity, terminalVelocity);
        confetto.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

        confetto.position.x += confetto.velocity.x;
        confetto.position.y += confetto.velocity.y;

        if (confetto.position.y >= canvas.height) confetti.splice(index, 1);
        if (confetto.position.x > canvas.width) confetto.position.x = 0;
        if (confetto.position.x < 0) confetto.position.x = canvas.width;

        confetto.scale.y = Math.cos(confetto.position.y * 0.1);
        ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

        // DESSIN CŒUR
        let h = height;
        let w = width;
        ctx.beginPath();
        ctx.moveTo(0, -h / 4);
        ctx.bezierCurveTo(w / 2, -h / 1.5, w, 0, 0, h / 2);
        ctx.bezierCurveTo(-w, 0, -w / 2, -h / 1.5, 0, -h / 4);
        ctx.fill();
        ctx.closePath();

        ctx.setTransform(1, 0, 0, 1, 0, 0);
    });

    if (confetti.length > 0) window.requestAnimationFrame(render);
};

function startConfetti() {
    initConfetti();
    render();
}

window.addEventListener('resize', resizeCanvas);