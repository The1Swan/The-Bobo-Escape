kaboom({
    width: 1200,
    height: 900,
    background: [73, 183, 242], // Black background for a maze
});

loadSprite("apple", "https://kaboomjs.com/sprites/apple.png");
loadSprite("bobo", "https://kaboomjs.com/sprites/bobo.png");
loadSprite("door", "https://kaboomjs.com/sprites/door.png");

function patrol() {
    return {
        id: "patrol",
        require: [ "pos", "area" ],
        dir: -1,
        add() {
            this.onCollide((obj, col) => {
                if (col.isLeft() || col.isRight()) {
                    this.dir = -this.dir;
                }
            });
        },
        update() {
            this.move(60 * this.dir, 0);
        },
    };
}

// --- The Level Design ---
const levelMap = [
    "==============================",
    "=  =  = =  a=   = = =     =a =",
    "= ===a= == === == =   ==  == =",
    "=   =   =      a   = ==  ==  =",
    "= === = === = = = = a=    == =",
    "=   =a=   = = = =   =  ==a   =",
    "=== === === = = === = = = = ==",
    "=     =  a= = = =   =   = =a =",
    "= === = === = === === = ======",
    "= = = =     =   = =a  =   =  =",
    "= = = =a=== ===a=== === === ==",
    "=a=       =   =   = =a=     a=",
    "=== === === ===== === = === ==",
    "=   = =  a= =   =   = = =   ==",
    "= === === === === === === ====",
    "= a   =     =  a= =   =      =",
    "=== === = = = === = === === ==",
    "=    a=   =   =     =   =   a=",
    "==============================",
];

// --- Level Configuration ---
const levelConf = {
    tileWidth: 40,
    tileHeight: 40,
    tiles: {
        "=": () => [
            rect(40, 40),
            color(0, 0, 255), // Blue walls
            area(),
            body({ isStatic: true }), // Walls are solid
            "wall",
        ],
        "a": () => [
            sprite("apple"),
            area(),
            scale(0.5),
            "apple",
        ],
    }
};

addLevel(levelMap, levelConf);

// --- The Player Character ---
const player = add([
    sprite("bobo"),
    pos(60, 60), // Starting position
    scale(0.5),
    area(),
    body(),
    anchor("center"),
]);

let score = 0;
    const scoreLabel =add([
        text("Score:" + score),
        pos(24,24),
        fixed(),
    ]);

const SPEED = 200;

// --- Movement Controls ---
onKeyDown("left", () => { player.move(-SPEED, 0); });
onKeyDown("right", () => { player.move(SPEED, 0); });
onKeyDown("up", () => { player.move(0, -SPEED); });
onKeyDown("down", () => { player.move(0, SPEED); });

// --- Collection Logic ---

player.onCollide("wall", (wall) => {
    player.stop()
});
player.onCollide("apple", (apple) =>{
    destroy(apple);
    score+= 10;
    scoreLabel.text ="Score: " + score;
});
player.onCollide("dino", (dino) => {
    destroy(player);
    go("lose");
});

// --- Lose Scene ---
scene("lose", () => {
    add([ text("Game Over"), pos(center()), anchor("center") ]);
    wait(2, () => { go("main", { level: 0 }); });
});

// --- Win Scene ---
scene("win", () => {
    add([ text("You Win!"), pos(center()), anchor("center") ]);
    wait(2, () => { go("main", { level: 0 }); });
});