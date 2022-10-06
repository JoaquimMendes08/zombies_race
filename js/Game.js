class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leadeboardTitle = createElement("h2");

    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.movendo = false;
    this.esquerda = false;
    this.explodido = false;
    this.velocidade = 10

  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.addImage("boom", explosao);
    car1.scale = 0.07;
    car1.depth = 999

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.addImage("boom", explosao);
    car2.scale = 0.07;
    car2.depth = 999

    cars = [car1, car2];

    fuels = new Group();
    powerCoins = new Group();
    poças = new Group();
    obstacles = new Group();
    zombies = new Group();
    

    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];

    // Adicionar sprite de combustível no jogo
    this.addSprites(fuels, 5, fuelImage, 0.02);
    // Adicionar sprite de moeda no jogo
    this.addSprites(powerCoins, 50, powerCoinImage, 0.09);

    this.addSprites(poças, 5, poçaImage, 0.3);

    for (var i = 0; i < 5; i++) {
      var x, y;

      //C41 //SA
        x = random(width / 2 + 150, width / 2 - 150);
        y = random(-height * 4.5, height - 400);
      var sprite = createSprite(x, y);
      sprite.addAnimation("sprite", zombie);
      sprite.addAnimation("morto", zumbiMorto);
      sprite.scale = 0.2;
      cars[0].depth = sprite.depth+1
      cars[1].depth = sprite.depth+1
      zombies.add(sprite);
      
    }
    
    //Adicionar sprite de obstáculo no jogo
    this.addSprites(obstacles, 3, obstacle1Image, 0.2);
    this.addSprites(obstacles, 3, obstacle2Image, 0.04);
  }

  addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;

      //C41 //SA
      if (positions.length > 0) {
        x = positions[i].x;
        y = positions[i].y;
        spriteImage = positions[i].image;
      } else {
        x = random(width / 2 + 150, width / 2 - 150);
        y = random(-height * 4.5, height - 400);
      }
      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);

      sprite.scale = scale;
      spriteGroup.add(sprite);
    }


  }


  handleElements() {
    form.hide();
    form.titleImg.position(20, 30);
    form.titleImg.class("gameTitleAfterEffect");

    //C39
    this.resetTitle.html("Reiniciar");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);

    this.leadeboardTitle.html("Placar");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);
  }

  play() {
    this.handleElements();
    this.handleResetButton();

    Player.getPlayersInfo();
    player.getCarsAtEnd();

    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);

      //mostrar placar
      this.showLeaderboard();

      //mostrar combustível
      this.mostrarComb();

      //mostrar Vida
      this.mostrarVida();

      //índice da matriz
      var index = 0;
      for (var plr in allPlayers) {
        //adicione 1 ao índice para cada loop
        index = index + 1;

        //use os dados do banco de dados para exibir os carros nas direções x e y
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        //código para pegar a vida dos players do banco de dados
        var vida = allPlayers[plr].life
        //código que verifica se a vida é menor que 0
        if(vida <= 0){
          cars[index-1].changeImage("boom");
          cars[index-1].scale = 0.3;
          this.explodido = true;
          zombieSound.stop();
          carSound.stop()
          if(explosion.isPlaying() == false){
            explosion.play();
          }
        }

        

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        if (index === player.index) {
          stroke(10);
          
          //verifica se o carro passou pelo combustível
          this.pegarComb(index);
          //verifica se o carro passou pela moeda
          this.pegarMoeda(index);
          //verifica se o carro colidiu com os obstáculos
          this.colidiuComObs(index);

          this.passouNaPoça(index);
         
          //alterar a posição da câmera na direção y
          camera.position.y = cars[index - 1].position.y;
        }
      }

      

      //manipulando eventos de teclado
      this.handlePlayerControls();

      //Linha de chegada
      const finishLine = height * 6 - 100;

      if (player.positionY > finishLine){
        gameState = 2;
        player.rank += 1;
        Player.updateCarsAtEnd(player.rank);
        player.update();
        this.showRank();
        zombieSound.stop();
        if(victory.isPlaying() == false){
           victory.play();
        }
      }

      if(player.positionY < finishLine){
        if(zombieSound.isPlaying() == false){
          zombieSound.play();
        }
      }
       
      
        
    

      drawSprites();
    }
  }

  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {},
        carsAtEnd: 0
      });
      window.location.reload();
    });
  }





  mostrarComb() {
    push();
    image(fuelImage, width / 2 - 130, height - player.positionY - 300, 20, 20);
    fill("#ffc400");
    rect(width / 2 - 100, height - player.positionY - 300, player.fuel, 20);
    noStroke();
    pop();
  }

  mostrarVida() {
    push();
    image(lifeImage, width / 2 - 130, height - player.positionY - 250, 20, 20);
    fill("red");
    rect(width / 2 - 100, height - player.positionY - 250, player.life, 20);
    noStroke();
    pop();
  }

  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  handlePlayerControls() {
    
      if(this.explodido == false){
      if (keyIsDown(UP_ARROW)) {
        this.movendo = true;
        player.positionY += 20;
        player.update();
        if(!carSound.isPlaying()){
          carSound.play();
        }
      }

      if (keyIsDown(DOWN_ARROW)) {
        this.movendo = true;
        player.positionY -= 20;
        player.update();
        if(!carSound.isPlaying()){
          carSound.play();
        }
      }
  
      if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
        this.esquerda = true;
        player.positionX -= 5;
        player.update();
      }
  
      if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
        this.esquerda = false;
        player.positionX += 5;
        player.update();
      }
    }
    
  }
  
  pegarComb(index) {
    cars[index - 1].overlap(fuels, function(collector, collected) {
      player.fuel = 185;
      collected.remove();
    });
    if (player.fuel > 0 && this.movendo) {
      player.fuel -= 0.3;
    }

    if (player.fuel <= 0) {
      gameState = 2;
      this.gameOver();  
      if(lose.isPlaying() == false){
        lose.play();
      }
      zombieSound.stop()
    }
  }

  pegarMoeda(index) {
    cars[index - 1].overlap(powerCoins, function(collector, collected) {
      player.score += 10;
      player.update();
      collected.remove();
      if(coinSound.isPlaying() == false){
        coinSound.play()
      }
    });
  }

  colidiuComObs(index){
    if(cars[index-1].collide(obstacles)){
     this.perdeVida();
    }
    cars[index-1].overlap(zombies, function(collector, collected){
     //this.perdeVida();
     collected.changeAnimation("morto");
     player.score += 20
     if(this.esquerda == true){
      player.positionX +=100
     }else {
      player.positionX -=100
     }
     player.update();
    })
   }
 

  showRank() {
    swal({
      title: `Incrível!${"\n"}Rank${"\n"}${player.rank}`,
      text: "Você alcançou a linha de chegada com sucesso!",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }

  gameOver() {
    swal({
      title: `Fim de Jogo`,
      text: "Oops você perdeu a corrida!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Obrigado por jogar"
    });
  }

  


  passouNaPoça(index){
    cars[index-1].overlap(poças, function() {
    player.positionY -= 8
    player.update()
    })
  }

  perdeVida(){
    if(player.life> 0){
      player.life -= 10;  
    }
    if(this.esquerda == true){
      player.positionX += 100
    }else{
      player.positionX -= 100
    }
    player.update()
  }

 
}