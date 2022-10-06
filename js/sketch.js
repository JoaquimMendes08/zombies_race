var canvas;
var backgroundImage, car1_img, car2_img, track;
var fuelImage, powerCoinImage, lifeImage;
var obstacle1Image, obstacle2Image;
var database, gameState;
var form, player, playerCount;
var allPlayers, car1, car2, fuels, powerCoins, obstacles;
var cars = [];
var explosao;
var poças;
var zombie;
var zombies;
var zumbiMorto;


function preload() {
  backgroundImage = loadImage("planodefundo.png");
  car1_img = loadImage("car1.png");
  car2_img = loadImage("car2.png");
  track = loadImage("pista+alongada.jpg");
  fuelImage = loadImage("fuel.png");
  powerCoinImage = loadImage("goldCoin.png");
  obstacle1Image = loadImage("burned_car.png");
  obstacle2Image = loadImage("obstacle2.png");
  lifeImage = loadImage("life.png");
  explosao = loadImage("blast.png");
  poçaImage = loadImage("poça_d'água.png");
  zumbiMorto = loadAnimation("zumbiMorto.png");

  zombie = loadAnimation("./f/f0.png", "./f/f1.png", "./f/f2.png", "./f/f3.png", "./f/f4.png", "./f/f5.png",  "./f/f6.png",
  "./f/f7.png",  "./f/f8.png",  "./f/f9.png",  "./f/f10.png", "./f/f11.png",  "./f/f12.png",  "./f/f13.png",  "./f/f14.png", 
  "./f/f15.png", "./f/f16.png", "./f/f17.png",  "./f/f18.png",  "./f/f19.png", "./f/f20.png", "./f/f21.png", "./f/f22.png",
  "./f/f23.png", "./f/f24.png",  "./f/f25.png", "./f/f26.png", "./f/f27.png", "./f/f28.png", "./f/f29.png", "./f/f30.png",
  "./f/f31.png", "./f/f32.png", "./f/f33.png",  "./f/f34.png", "./f/f35.png", "./f/f36.png",  "./f/f37.png", "./f/f38.png",
  "./f/f39.png", "./f/f40.png",  "./f/f41.png");

  carSound = loadSound("car_sound.mp3");
  explosion = loadSound("explosao.mp3");
  victory = loadSound("victory.mp3");
  lose = loadSound("lose.mp3");
  zombieSound = loadSound("zombie_sound.mp3");
  coinSound = loadSound("coins.mp3");
  music = loadSound("music.mp3")
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
}

function draw() {
  background(backgroundImage);
  if (playerCount === 2) {
    game.update(1);
  }

  if (gameState === 1) {
    game.play();
  }

  if(zombieSound.isPlaying() == false & victory.isPlaying() == false & lose.isPlaying() == false){
    if(music.isPlaying() == false){
      music.play()
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
