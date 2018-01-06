

function Block (x,y,img) {
	this.x = x+5;
	this.y = y+5;
	this.width = WIDTH/4-10;
	this.height  = HEIGHT/4-10;
	this.img = img;
}

Block.prototype.drawFaceDown = function(){

	context.drawImage(coverImage,this.x,this.y,this.width,this.height);
	this.isFaceUp = false;
	
}

Block.prototype.drawImage = function(){
	
	context.drawImage(this.img,this.x,this.y,this.width,this.height);
	this.isFaceUp = true;
}

Block.prototype.blockIsClicked = function(x,y) {
	
	return x >= this.x && x <= this.x + this.width  &&
        y >= this.y && y <= this.y + this.height;
}


function shuffleArray(a) {
    var j, x, i;
    for (i = a.length; i>=1; i--) {
        j = Math.floor(Math.random() * i); //Change variables
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
	return a
}

function shuffleImages(context,myImages) {
	coverImage = myImages[0];
	myImages.splice(0,1);
	
	for (var i=0; i<8 ; ++i){
		myImages.push(myImages[i]);  // double the array
	}
	myImages = shuffleArray(myImages); // shuffle the array

	var blocks = [];
	counter = 0;
	for (var i=0; i < NUM_ROWS; i++) {  //add the images to the blocks
		for (var j=0; j < NUM_COLS; j++) {
			blocks.push(new Block(j*(WIDTH/4),i*(HEIGHT/4),myImages[counter]));
			++counter;
		}
	}
	
	finalBlocks = blocks;
	gameStart();

}

function  gameStart() {
	
	for (var i = 0; i < finalBlocks.length; i++) {
		finalBlocks[i].drawFaceDown();
	}
	
}

function uncoverBlock(block){
	block.drawFaceDown();
	flippedBlocks = 0;
}

function sleep(miliseconds) {
   var currentTime = new Date().getTime();

   while (currentTime + miliseconds >= new Date().getTime()) {
   }
}

function mouseClicked (evt) {	
	
	var rect = canvas.getBoundingClientRect();
    var x = evt.clientX - rect.left;
    var y = evt.clientY - rect.top;

	for (var i=0; i<finalBlocks.length; ++i) {
		if (finalBlocks[i].blockIsClicked (x,y) == true) {
			if(flippedBlocks < 2 && !finalBlocks[i].isFaceUp) {
				finalBlocks[i].drawImage();
				previousBlock = currentBlock;
				currentBlock = finalBlocks[i];
				++flippedBlocks;
				
				if (flippedBlocks == 2 && previousBlock.img != currentBlock.img){
					
					setTimeout(uncoverBlock,500,previousBlock);
					setTimeout(uncoverBlock,500,currentBlock);
				}
			
				if (flippedBlocks == 2 && previousBlock.img == currentBlock.img){
					flippedBlocks = 0;
				}
				
				if (puzzleFinished()) {
					setTimeout(animation,100);
					
					
					
				}
			}
		}
	}
}


function loadImages(context,filenames,callback) {
	var myImages = new Array(filenames.length);
	var imageCount = 0;
	for (var i=0; i< filenames.length;++i) {
		myImages[i] = new Image();
		myImages[i].onload = function() {
			imageCount++;
			if (imageCount==filenames.length) callback(context,myImages);
		}
		myImages[i].src = filenames[i];
	}
}

function initAndStart(context) {
	var names = ["./images/logo-with-background.jpg","./images/sky.jpg", "./images/cat2.jpg","./images/cat.jpg", "./images/build2.jpg", 
			"./images/towncentre.jpg", "./images/toy.jpg", 
			"./images/flower.jpg", "./images/pavement.jpg"];
	
	loadImages(context, names, shuffleImages);
}

function resetGame() {
	context.clearRect(0, 0, WIDTH, HEIGHT);
	gameStarted = false;
	
	
}

function puzzleFinished(){
	var finished = true;
	for(var i=0; i< finalBlocks.length; ++i){
		if (!finalBlocks[i].isFaceUp)
			finished = false;
	}
	return finished;
}

/******************************************************/

function nextFrame() {
	timeOut = setTimeout(function() {
		requestId = requestAnimationFrame(nextFrame);
		update();
		draw();
		
	}, 100);
}

function animation() {
	
	x = 40;
	y = 80;
	
	dx = 10;
	dy = 3;
	draw();
	nextFrame();
}

function draw() {


	context.clearRect(0, 0, WIDTH, HEIGHT);
	var r = Math.floor(Math.random()*255);
	var g = Math.floor(Math.random()*255);
	var b = Math.floor(Math.random()*255);
	context.fillStyle = "rgb("+r+","+g+","+b+")";

	context.font = "40px Verdana";
	context.fillText("COMPLETED!", x, y);

}

function stop() {
	
	
	if (requestId) {
		cancelAnimationFrame(requestId);
		
		
	}

	if(timeOut) {
		 clearTimeout(timeOut);
	}
	
}

function update() {
  if (x + dx > WIDTH || x + dx < 0)
    dx = -dx;
  if (y + dy > HEIGHT || y + dy < 0)
    dy = -dy;
    
  x += dx;
  y += dy;
}

var x, y, dx, dy;

var requestId;
var timeOut;
/////////////////////////////////
var canvas = document.getElementById("puzzle_canvas");
var context = canvas.getContext("2d"); // Check for context
//******************************************************
var WIDTH = canvas.width;
var HEIGHT = canvas.height;

var NUM_COLS = 4;
var NUM_ROWS = 4;

var restartButton = document.getElementById("restartgame");

var flippedBlocks = 0;
var previousBlock;
var currentBlock;
var finalBlocks;
var gameStarted = false;
var coverImage;


restartButton.addEventListener("click", function() {
	if (gameStarted){
		stop();
		resetGame();
		initAndStart(context);
		gameStarted = true;
	}
		
});
	
canvas.addEventListener("click", function(evt) { 
	if (gameStarted){
		mouseClicked(evt);
	}
} );

initAndStart(context);
gameStarted = true;
