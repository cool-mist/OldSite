var height=500,width=800,margin=50;
var can=document.getElementById("can");
var ctx=can.getContext("2d");
var color='#D6D6D6';
var stars=[];
var box={};
var player={x:100, y:250, dir:1, curLoc:250};
var t=0;
var score=0,scoreupdate=0;
var scoreboard={top:10,left:10};
var gameover={top:250, left:250};
var running=0,canStart=1;
var numberOfStars=5;
var jumpSound=document.getElementById('jump');
//Game Logic////
window.addEventListener("keypress", listener, true);

function dispRight(){

	var sb=document.getElementById('game');
	var st=parseInt(sb.style.top);
	var sl=parseInt(sb.style.left);
	
	scoreboard={top:st+scoreboard.top,left:sl+scoreboard.left};
gameover={top:st+gameover.top,left:sl+gameover.left};
}

dispRight();
function listener(e) {
  if(e.keyCode==32) {
  	if(running)
  		player.dir*=-1;
  	else{
  		if(canStart){
  			resetVars();
  			running=1;
  		}
  	}
  }

}

function createBox(){

	this.y=Math.random()*400;
	this.x=850;
}
box=new createBox;
function createStar(){
	this.x=Math.random()*width;
	this.y=Math.random()*height+10;
	this.v=Math.random()*7+8;
	return this;
}
for (var i = 0; i < numberOfStars; i++) {
	stars.push(new createStar());
};

function update(){
	//Check for Game End
	if(running==1){
		if(player.y-8 <0 || player.y+8>500) resetVars();
		else{
			if(player.x+8>box.x && player.x-8<box.x+50  ){ 

				if(player.y+8>box.y+150 || player.y-8<box.y){
					resetVars();
				}
			}
		}
		if(player.x>box.x+50){
			if(!scoreupdate){
				score++;
				jumpSound.play();
				document.getElementById('scoreboard').innerHTML="Score: <span class='score'>"+score+"</span> ";
			}
			scoreupdate=1;
		}
	}	 
	//Update Background
	for (var i = 0; i < stars.length; i++) {
		if(stars[i].x<0) {
			stars[i].x=width;
			stars[i].y=Math.random()*height+10;
			stars[i].v=Math.random()*7+8;
		}

	};
	
	//update Box
	if(box.x<-50){
		box=new createBox();
		scoreupdate=0;
	}
	box.x-=7;
	//Update Player
	player.y=player.curLoc;
	player.curLoc+=player.dir*7;
	t+=1;

	
	//if(t%3==0) player.dir=1;
	//console.log(Math.sin(t));
}

function draw(){
	
	//Draw Background
	for (var i = 0; i < stars.length; i++) {
		ctx.fillStyle=color;
		ctx.beginPath();
		ctx.arc(stars[i].x,stars[i].y,2,0,2*Math.PI,false);
		ctx.fill();
		stars[i].x-=stars[i].v;
	};
	//Draw Box
	if(running){
		ctx.fillStyle='blue';
		ctx.fillRect(box.x,0,50,box.y);
		ctx.fillRect(box.x,box.y+150,50,500-(box.y+150));
		//Draw Player

		ctx.beginPath();
		ctx.fillStyle="red";
		ctx.arc(player.x,player.y,10,0,2*Math.PI,false);
		ctx.fill();
		ctx.beginPath();
		for(var j=0;j<10;++j){
			var factor=j*player.dir*-3;
			var  rad=10-j;
			ctx.fillStyle='brown';
			console.log(rad);
			ctx.arc(player.x,player.y+factor,rad,0,2*Math.PI,false);
			ctx.fill();
		}
		ctx.beginPath();
		ctx.arc(player.x-1,player.y,2,0,2*Math.PI,false);
		ctx.arc(player.x+1,player.y,2,0,2*Math.PI,false);
		ctx.fillStyle='black';
		ctx.fill();
	}
}


function resetVars(){
	canStart=0;
	running=0;
	player={x:100, y:250, dir:1, curLoc:250};
	t=0;
	scoreupdate=0;
	box=new createBox();
	document.getElementById('scoreboard').innerHTML="Score: <span class='score'>"+score+"</span> ";
	document.getElementById('gameover').innerHTML="Press <b>Space</b> to start Again !!!";
	score=0;
	setInterval(function(){canStart=1;},3000);
	
	

}
window.requestAnimFrame = (function(callback){
	return  window.requestAnimationFrame   ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();
//Game Loop //
function gameLoop(){
	update();
	/*ctx.fillStyle="rgba(0,0,0,0.3)";//'#121212';
	ctx.fillRect(0,0,width,height);*/
	ctx.clearRect(0,0,width,height);
	draw();
	requestAnimFrame(function(){
		gameLoop();
		if(!running) document.getElementById('gameover').style.visibility='visible';
		else document.getElementById('gameover').style.visibility='hidden';
	} );
	
}
gameLoop();

