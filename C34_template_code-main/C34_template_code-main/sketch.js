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
var rope,fruit,ground;
var fruit_con;
var fruit_con_2;
var fruit_con_3;
var rope3;

var bg_img;
var food;
var rabbit;

var button,button2,button3;
var bunny;
var blink,eat,sad;
var mute_btn;

var fr;

var bk_song;
var cut_sound;
var sad_sound;
var eating_sound;

var showstar;
var star1,star2;
var nostarimg,starimg;
var blower;
var emptystar,onestar,twostar;

var star1touch = false;
var star2touch = false;

var starcount = 0;

function preload()
{
  bg_img = loadImage('background.png');
  food = loadImage('melon.png');
  rabbit = loadImage('Rabbit-01.png');
  nostarimg = loadImage('g_star1.png');
  starimg = loadImage('star.png');
  
  bk_song = loadSound('sound1.mp3');
  sad_sound = loadSound("sad.wav")
  cut_sound = loadSound('rope_cut.mp3');
  eating_sound = loadSound('eating_sound.mp3');
  air = loadSound('air.wav');

  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  eat = loadAnimation("eat_0.png" , "eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");

  emptystar = loadAnimation('empty.png');
  onestar = loadAnimation('one_star.png');
  twostar = loadAnimation('stars.png');

  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping= false;
  eat.looping = false; 
}

function setup() 
{
  createCanvas(600,700);
  frameRate(80);

  bk_song.play();
  bk_song.setVolume(0);

  engine = Engine.create();
  world = engine.world;

  //btn 1
  button = createImg('cut_btn.png');
  button.position(80,90);
  button.size(50,50);
  button.mouseClicked(drop);

   //btn 2
   button2 = createImg('cut_btn.png');
   button2.position(390,90);
   button2.size(50,50);
   button2.mouseClicked(drop2);
 
   rope = new Rope(7,{x:100,y:90});
   rope2 = new Rope(7,{x:420,y:90});


  mute_btn = createImg('mute.png');
  mute_btn.position(width-80,20);
  mute_btn.size(50,50);
  mute_btn.mouseClicked(mute);

  showstar = createSprite(70,40,120,70);
  showstar.scale = 0.2;
  showstar.addAnimation('none', emptystar);
  showstar.addAnimation('1star', onestar);
  showstar.addAnimation('2stars', twostar);
  showstar.changeAnimation('none');
  
  blower = createImg('baloon2.png');
  blower.position(230, 350);
  blower.size(100, 120);
  blower.mouseClicked(blow);

  ground = new Ground(300,height,width,20);
  blink.frameDelay = 20;
  eat.frameDelay = 20;

  bunny = createSprite(120,620,100,100);
  bunny.scale = 0.2;

  bunny.addAnimation('blinking',blink);
  bunny.addAnimation('eating',eat);
  bunny.addAnimation('crying',sad);
  bunny.changeAnimation('blinking');

  star1 = createSprite(280, 80, 50, 50);
  star1.scale = 0.02;
  star1.addImage(starimg);

  star2 = createSprite(50, 300, 50, 50);
  star2.scale = 0.02;
  star2.addImage(starimg);
  
  fruit = Bodies.circle(300,300,20);
  Matter.Composite.add(rope.body,fruit);

  fruit_con = new Link(rope,fruit);
  fruit_con_2 = new Link(rope2,fruit);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
  
}

function draw() 
{
  background(51);
  image(bg_img,0,0,width,height);

  push();
  imageMode(CENTER);
  if(fruit!=null){
    image(food,fruit.position.x,fruit.position.y,70,70);
  }
  pop();

  rope.show();
  rope2.show();

  Engine.update(engine);
  ground.show();

  drawSprites();

  if (starcount == 1) {
    showstar.changeAnimation('1star');
  } else if (starcount == 2) {
    showstar.changeAnimation('2stars');
  }

  if(collide(fruit,star1,20)) {
    star1.visible = false;
    star1.remove();
    setTimeout(() => {
      starcount = starcount+1;
    }, 500);
    console.log(starcount);
  }

  if(collide(fruit, star2, 20)) {
    star2.visible = false;
    star2.remove();
    setTimeout(() => {
      starcount = starcount+1;
    }, 500);
    console.log(starcount);
  }

  if(collide(fruit,bunny,80)==true)
  {
    World.remove(engine.world,fruit);
    fruit = null;
    bunny.changeAnimation('eating');
    eating_sound.play();
  }

  if(fruit!=null && fruit.position.y>=650)
  {
    bunny.changeAnimation('crying');
    bk_song.stop();
    sad_sound.play();
    fruit=null;
   }
  
}

function drop()
{
  cut_sound.play();
  rope.break();
  fruit_con.dettach();
  fruit_con = null; 
}

function drop2()
{
  cut_sound.play();
  rope2.break();
  fruit_con_2.dettach();
  fruit_con_2 = null;
}

function collide(body,sprite,x)
{
  if(body!=null)
        {
         var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
          if(d<=x)
            {
               return true; 
            }
            else{
              return false;
            }
         }
}


function mute()
{
  if(bk_song.isPlaying())
     {
      bk_song.stop();
     }
     else{
      bk_song.play();
     }
}

function blow() {
  Matter.Body.applyForce(fruit, {x:0, y:0}, {x:0,y:-0.05});
  air.play();
}