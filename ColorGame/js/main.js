$(document).keypress(keypress_handler);
function keypress_handler(e){
	if(e.keyCode==97){
		no();
		game.state=1;
	}else if(e.keyCode==108){
		yes();
		game.state=1;
	}
}
$(document).ready(function(){
	$("#Cname").hide();
	gameend();
	reinit();
	setInterval(function(){GameLoop();},10);
});

var colors = ['red','blue','yellow','green','gray']; // List of colors currently displayed. more colors can(should) be added :)
var bgcolor = ['white','white'];
var modifiers = [inv,alt];
var max=0;
//Game states -- 0 -> waiting for user input  1 -> Calculate and display result 
// user_inp -- 0 -> No 1-> Yes
// clr -- Color displayed on the screen
// txt -- Color text displayed on the screen
var game={
	score:0,
	state:0,
	user_inp:0,
	clr:0,
	txt:0
}
var t;    	//timer
var cw=700; //width of color
var invert=0; //Tracks the current control configurations
var alter=0;// Tracks the current type of input.. Yes/No or Name of Color
var c1,c2;
var counter=0; // Modifiers are applied whenever counter % range == 0
var range=300; // range variable for the above
// Helper functions for the game Loop

function reinit(){                     // Resets timer,displayed color.Displays updated game state
	
	clearInterval(t);
	cw=700;
	timer();
	game.state=0;
	game.clr=Math.floor(Math.random()*colors.length);//random
	game.txt=Math.floor(Math.random()*colors.length);
	var rnum=2;
	while (rnum==2) rnum = Math.floor((3)*Math.random());
	if(rnum){
		$("#c1").html("<strong>"+colors[game.clr]+'</strong>');
		$("#c2").html("<strong>"+colors[(game.clr+1)%colors.length]);
		c2=(game.clr+1)%colors.length;
		c1=game.clr;
	}
	else{
		$("#c2").html("<strong>"+colors[game.clr]+'</strong>');
		$("#c1").html("<strong>"+colors[(game.clr+1)%colors.length]);
		c1=(game.clr+1)%colors.length;
		c2=game.clr;
	}
	$('#outer').css("background",colors[game.clr]+'');
	$('#lower').html("<strong>"+colors[game.txt]+'</strong>');
	$("#score").html("<small>Score: </small>"+game.score);
	console.log(game.clr+","+game.txt);

}

function timer(){                               // Runs the game timer. A global var counter checks for application of any modifier
	t=setInterval(function(){					// like inverting controls etc.
		cw--;
		counter++;
		if(counter==range){
			var func = modifiers.length;
			while(func==modifiers.length)
				func = Math.floor((modifiers.length+1)*Math.random());
			console.log(func+' called');
			modifiers[func]();	// Calls a random modifier function defined in modifiers array
			if(alter){
				$("#lower").hide();
				$("#Cname").show();
			}else{
				$("#lower").show();
				$("#Cname").hide();
			}
			counter=0
			range=parseInt(Math.random()*100)+350;
		}
		if(cw==100){
			gameend();
			$("#outer").css("width",'500px');

			cw=700;
		}
		$("#outer").css("width",cw+'px');	
		$("#outer").html(cw-100+'');
	},10);
}

function gameend(){							// Called when game ends. Sets the new Best score if any
	if(game.score>max){
		max=game.score;
	}
	game.score=0;
	$("#max").html("<small>Best: </small>"+max);
	reinit();

}
// Yes/No functions
function no(){
	if(game.state==0){
		if(invert)
			game.user_inp=1;
		else
			game.user_inp=0;	
	}
}
function yes(){
	if(game.state==0){
		if(invert)
			game.user_inp=0;
		else
			game.user_inp=1;	
		}
	}

//Extra Features (functions that come under modifiers)
function inv(){

	invert=(invert+1)%2;
	if(invert){
		$("#a").html("L");
		$("#l").html("A");
	}else{
		$("#a").html("A");
		$("#l").html("L");
	}
	$("#legend").fadeOut(100).css("background",bgcolor[invert]).fadeIn(100).fadeOut(100).fadeIn(100);
}
function alt(){
	alter=(alter+1)%2;
}

//The Main GameLoop ..
function GameLoop(){
	if(game.state==1){
		var temp=0;
		if(!alter){
			if(game.clr == game.txt) temp=1;
			if(temp == game.user_inp){  //correct
				game.score=game.score+1;
				reinit();
			}else	gameend();
		}else{
			//alert(invert);
			if(game.clr==c1) temp=0;
			else temp=1;
			
			if(temp == game.user_inp){  //correct
				game.score=game.score+1;
				reinit();
			}else	gameend();
		}
		
	}
}