kaboom({
    width: 1200,
    height: 900,
    background: [73, 183, 242], // Black background for a maze
});

loadSprite("apple", "https://kaboomjs.com/sprites/apple.png");
loadSprite("bobo", "https://kaboomjs.com/sprites/bobo.png");
loadSprite("dino", "https://kaboomjs.com/sprites/dino.png");
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

scene("main", ({ level } = { level: 0 }) => {

    // Array of all level layouts
    const LEVELS = [
    [
        "==============================",
        "=  =  = =  a=   = = =     =a =",
        "= ===a= == === == =   ==  == =",
        "=   =   =  !       = ==  ==  =",
        "= === = === = =a= = a=  ! == =",
        "=   =a=   = = = =   =  ==    =",
        "=== === === = = === = = =a= ==",
        "=  !  =  a= = = =   =   = =a =",
        "= === = === = === === = ======",
        "= = = =     =   ! =a  =   = a=",
        "= = = =a=== ===a=== === === ==",
        "=a=    !  =   =   = =a=    ! =",
        "=== === === ===== === = === ==",
        "=   = =  a= =   =   = = =   ==",
        "= === === === === === === ====",
        "= a   =    !=  a= =   =      =",
        "=== === = = = === = === === ==",
        "=    a=   =   =  !  =   =a  D=",
        "==============================",
        ],
    [
        "==============================",
        "=  =a   = =    =  !=   =    a=",
        "= === === = === === === === ==",
        "= =     = =a=   =   = =     !=",
        "= = === = === = = === = === ==",
        "=     =a=   = =a=   = = =   a=",
        "=== === === === === === = ====",
        "=   = =   = =     =   = =    =",
        "= === = === === === = = === ==",
        "=a=   =   !=   =a=   = =   = =",
        "= === === === === === === = ==",
        "=   =   =   =    !=   =   = a=",
        "=== = === === === === = === ==",
        "=   =a   =   = =   = = =    ==",
        "= === === === === === ===  ===",
        "=     =    ! =   a= =   =   a=",
        "=== === = = === = === === ====",
        "=  a=    =    =   !  =  =a  D=",
        "==============================",
        ],
    ];

    const currentLevel = level;

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
            "D": () => [
                sprite("door"),
                area(),
                scale(0.6),
                "door",
            ],
            "!": () => [
                sprite("dino"),
                area(),
                body(),
                scale(0.5),
                patrol(),
                "dino",
            ],
        }
    }


    addLevel(LEVELS[currentLevel], levelConf);

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

    onKeyDown("left", () => { player.move(-SPEED, 0); });
    onKeyDown("right", () => { player.move(SPEED, 0); });
    onKeyDown("up", () => { player.move(0, -SPEED); });
    onKeyDown("down", () => { player.move(0, SPEED); });

    player.onCollide("door", (door) => {
        if (currentLevel + 1 < LEVELS.length) {
                go("main", { level: currentLevel + 1 });
            } else {
                go("win");
            }
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
});
scene("lose", () => {
    add([ text("Game Over"), pos(center()), anchor("center") ]);
    wait(2, () => { go("main", { level: 0 }); });
});

// --- Win Scene ---
scene("win", () => {
    add([ text("You Win!"), pos(center()), anchor("center") ]);
    wait(2, () => { go("main", { level: 0 }); });
});

go("main");