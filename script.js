
// import kaboom lib
import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";

// initialize kaboom context
kaboom();

loadSprite("greenMAN", "sprites/ghost.png");
loadSprite("TREE", "sprites/tree.png");
loadSprite("SKY", "sprites/skyy.png");

// Load the background music
const backgroundMusic = new Audio("sounds/music.mp3");

function playBackgroundMusic() {
  // Play the background music
  backgroundMusic.loop = true;
  backgroundMusic.play();

  // Remove the event listener to avoid playing multiple times
  
  window.removeEventListener("keydown", function(event) {
    // Check if the pressed key is the Space key
    if (event.key === " ") {
      playBackgroundMusic();
    }
  });
}

// Add a click event listener to the window
window.addEventListener("keydown", function(event) {
  // Check if the pressed key is the Space key
  if (event.key === " ") {
    playBackgroundMusic();
  }
});


scene("Game", () => {
  const FLOOR_HEIGHT = 78;
  const JUMP_FORCE = 750;
  const SPEED = 300;
  let minRange = 1.5;
  let maxRange = 2;

  // set layers
  const backgroundImage = add([
    sprite("SKY"),
    pos(0, 0),
    scale(1),
  ]);

  // scoring system
  let score = 0;
  const scoreLabel = add([
    text(score),
    pos(24, 24),
  ]);

  onUpdate(() => {
    score++;
    scoreLabel.text = score;
  });

  // add a piece of text at position (120, 80)

  setGravity(1600);
  const ghostBOY = add([
    sprite("greenMAN"),
    pos(100, 60),
    scale(5),
    area(),
    body(),
  ]);

  onKeyPress("space", () => {
    if (ghostBOY.isGrounded()) {
      ghostBOY.jump(JUMP_FORCE);
    }
  });

  // add platform
  add([
    rect(width(), FLOOR_HEIGHT),
    pos(0, height() - 48),
    outline(4),
    area(),
    body({ isStatic: true }),
    color(34, 139, 34),
  ]);

  // add object
  function spawnTree() {
    const Trees = add([
      sprite("TREE"),
      area(),
      scale(rand(4, 5)),
      outline(4),
      pos(width(), height() - 48),
      anchor("botleft"),
      color(255, 180, 255),
      move(LEFT, SPEED),
      "tile",
    ]);
    wait(rand(minRange, maxRange), () => {
      spawnTree();
    });
  }

  spawnTree();

  ghostBOY.onCollide("tile", () => {
    addKaboom(ghostBOY.pos);
    shake();
    go("lose");
  });
});

scene("lose", () => {

  kaboom({
    background: [212, 110, 179],
  })
  add([
    text("Game Over!!",{
      size:88
    }),
    pos(center()),
    anchor("center"),
    
  ]);
});

go("Game")