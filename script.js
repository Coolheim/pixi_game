const app = new PIXI.Application({ width: 800, height: 800 });
document.body.appendChild(app.view); // Oprava: přidání na konec těla dokumentu

// Nastavení pozadí
const background = PIXI.Sprite.from('images/backgroud.png'); // Relativní cesta k obrázku
background.width = app.renderer.width;
background.height = app.renderer.height;
app.stage.addChild(background);

const texture = PIXI.Texture.from('images/postavickaRobot.png'); // Relativní cesta k obrázku
const character = new PIXI.Sprite(texture);
character.anchor.set(0.5);
character.width = 50;
character.height = 50;
character.x = app.renderer.width / 2; // Oprava: app.renderer.width místo app.screen.width
character.y = app.renderer.height - character.height / 2 - 50;
app.stage.addChild(character);

const speed = 8;
const keys = {};

window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);

function onKeyDown(e) {
    keys[e.key] = true;
}

function onKeyUp(e) {
    keys[e.key] = false;
}

function moveCharacter() {
    if (keys["ArrowLeft"] && character.x > character.width / 2) {
        character.x -= speed;
    }
    if (keys["ArrowRight"] && character.x < app.renderer.width - character.width / 2) {
        character.x += speed;
    }
}

app.ticker.add(moveCharacter);

const scoreText = document.getElementById('score-value');
const livesText = document.getElementById('lives-value');
let score = 0;
let lives = 3;
let fallingSpeed = 2;

function updateScore() {
    scoreText.textContent = score;
    livesText.textContent = lives;
}

const objectTexture = PIXI.Texture.from('images/blesk.png'); // Relativní cesta k obrázku
const object = new PIXI.Sprite(objectTexture);
object.anchor.set(0.5);
object.width = 50;
object.height = 50;
object.x = Math.random() * (app.renderer.width - object.width) + object.width / 2;
object.y = 0;
app.stage.addChild(object);

function moveObject() {
    object.y += fallingSpeed;
    if (object.y > app.renderer.height + object.height / 2) {
        object.x = Math.random() * (app.renderer.width - object.width) + object.width / 2;
        object.y = 0;
    }
    if (object.y + object.height / 2 > character.y - character.height / 2 &&
        object.y - object.height / 2 < character.y + character.height / 2 &&
        object.x + object.width / 2 > character.x - character.width / 2 &&
        object.x - object.width / 2 < character.x + character.width / 2) {
        score++;
        updateScore();
        object.x = Math.random() * (app.renderer.width - object.width) + object.width / 2;
        object.y = 0;
        fallingSpeed += 0.2;
    }
    if (object.y + object.height / 2 > app.renderer.height) {
        lives--;
        updateScore();
        object.x = Math.random() * (app.renderer.width - object.width) + object.width / 2;
        object.y = 0;
    }
    if (lives <= 0) {
        document.getElementById('restart-btn').style.display = 'block';
    }
}

app.ticker.add(moveObject);

document.getElementById('restart-btn').addEventListener('click', () => {
    // Resetování hry
    score = 0;
    lives = 3;
    fallingSpeed = 2;
    updateScore();
    document.getElementById('restart-btn').style.display = 'none';
});