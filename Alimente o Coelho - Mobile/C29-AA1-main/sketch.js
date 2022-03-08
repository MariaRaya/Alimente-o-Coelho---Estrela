const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground;
var corda, corda_1, corda_2;
var fruta_con,fruta_con_1,fruta_con_2;
var fruta, frutaOptions;
var food, backgroundImg;
var rabbit, rabbitImg;
var button,button_1,button_2;
var blink, eat, sad;
var soundAir, soundCut, soundEat, soundSad, soundBk;
var blower, mute_btn;
var star, starImg, starEmpty, twoStar, oneStar;
var star_1, star_2;


function preload(){
  food = loadImage("melon.png");
  rabbitImg = loadImage("Rabbit-01.png");
  backgroundImg = loadImage("background.png");
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");
  eat = loadAnimation("eat_0.png","eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  starEmpty = loadImage("empty.png");
  oneStar = loadImage("one_star.png");
  twoStar = loadImage("stars.png");
  starImg = loadImage("star.png");


  blink.playing = true;
  eat.playing = true;
  sad.playing = true;

  eat.looping = false;
  sad.looping = false;

  soundCut = loadSound("rope_cut.mp3");
  soundBk = loadSound("sound1.mp3");
  soundEat = loadSound("eating_sound.mp3");
  soundSad = loadSound("sad.wav");
}

function setup() 
{
  createCanvas(600,700);

  frameRate(80);
  soundBk.play();
  soundBk.setVolume(0.5);

  engine = Engine.create();
  world = engine.world;
  ground = new Ground(200, height, width,20);

  //Cordas

  corda = new Rope(7,{x: 200,y: 90});
  corda_1 = new Rope(7,{x: 400,y: 90});
  //corda_2 = new Rope(4,{x: 400,y: 225});

  frutaOptions = {
    density: 0.001
  };

  fruta = Bodies.circle(300,300,15,frutaOptions);
  

  Matter.Composite.add(corda.body,fruta);

  fruta_con = new Link(corda,fruta);
  fruta_con_1 = new Link(corda_1,fruta);
  //fruta_con_2 = new Link(corda_2,fruta);

  rabbit = createSprite(250, height - 80,100,100);
  rabbit.addImage(rabbitImg);
  rabbit.scale = 0.25;

  star_1 = createSprite(50,370,20,20);
  star_1.addImage(starImg);
  star_1.scale = 0.02;

  star_2 = createSprite(320,50,20,20);
  star_2.addImage(starImg);
  star_2.scale = 0.02;


  // Botões de Corte
  button = createImg("cut_btn.png");
  button.position(180,90);
  button.size(50,50);
  button.mouseClicked(drop);

  button_1 = createImg("cut_btn.png");
  button_1.position(390,90);
  button_1.size(50,50);
  button_1.mouseClicked(drop_1);

  /*button_2 = createImg("cut_btn.png");
  button_2.position(360,200);
  button_2.size(50,50);
  button_2.mouseClicked(drop_2);*/


//Animação do Coelho

  blink.frameDelay = 20;
  eat.frameDelay = 20;
  sad.frameDelay = 20;

  rabbit.addAnimation("piscando", blink);
  rabbit.addAnimation("comendo", eat);
  rabbit.addAnimation("chorando", sad);

  rabbit.changeAnimation("piscando");

  // Vento

  blower = createImg("baloon2.png");
  blower.position(260,370);
  blower.size(120,120);
  blower.mouseClicked(air);

  mute_btn = createImg("mute.png");
  mute_btn.position(450,20);
  mute_btn.size(50,50);
  mute_btn.mouseClicked(mute);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
  imageMode(CENTER);
}

function draw() 
{
  background(51);

  image(backgroundImg,300,350, 600, 700);

  ground.show();
  corda.show();
  corda_1.show();
  //corda_2.show();

  // Condição para a fruta aparecer

  if(fruta != null){
  image(food,fruta.position.x,fruta.position.y,60,60);
  }

  if(collided(fruta,rabbit) == true){
    rabbit.changeAnimation("comendo");
    soundEat.play();
  }

  if(collided(fruta,star_1,20) == true){
    star_1.visible = false;
  }

  if(collided(fruta,star_2,40) == true){
    star_2.visible = false;
  }

  if(fruta != null && fruta.position.y >= 660){
    rabbit.changeAnimation("chorando");
    soundBk.stop();
    soundSad.play();
    fruta = null;
  }

  Engine.update(engine);
  drawSprites();
}

function drop(){
  corda.break();
  fruta_con.separar();
  soundCut.play();
}

function drop_1(){
  corda_1.break();
  fruta_con_1.separar();
  soundCut.play();
}

function drop_2(){
  corda_2.break();
  fruta_con_2.separar();
  soundCut.play();
}

function collided(body,sprite){
  if(body != null){
    var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);

        if(d <= 80){
          World.remove(engine.world,fruta);
          fruta = null;
          return true;
        } else{
          return false;
        }

  }
}

function air(){
  Matter.Body.applyForce(fruta,{x:0,y:0},{x:0,y:-0.03});
}

function mute(){
  if(soundBk.isPlaying()){
    soundBk.stop();
  } else{
    soundBk.play();
  }
}