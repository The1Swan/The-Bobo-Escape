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
    "= =     =                    =",
    "= = === =                    =",
    "= =a=                        =",
    "= ========                   =",
    "=        a                   =",
    "=                            =",
    "=                            =",
    "=                            =",
    "=                            =",
    "=                            =",
    "=                            =",
    "=                            =",
    "=                            =",
    "=                            =",
    "=                            =",
    "=                            =",
    "=                            =",
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
            body({ isObstacle: true }), 
            "wall",
        ],
        "a": () => [
            sprite("apple"),
            area(),
            "apple",
        ],
    }
};

addLevel(levelMap, levelConf);

// --- The Player Character ---
const player = add([
    sprite("bobo"),
    pos(60, 60), // Starting position
    area(),
    anchor("center"),
]);

const SPEED = 200;

// --- Movement Controls ---
onKeyDown("left", () => { player.move(-SPEED, 0); });
onKeyDown("right", () => { player.move(SPEED, 0); });
onKeyDown("up", () => { player.move(0, -SPEED); });
onKeyDown("down", () => { player.move(0, SPEED); });

// --- Collection Logic ---
player.onCollide("apple", (apple) => {
    destroy(apple);
});
player.onCollide("wall", (wall) => {
    player.stop()
});
