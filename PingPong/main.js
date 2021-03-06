var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50
var ballSpeedX = 10;
var ballSpeedY = 4;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;

var showingWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;



function calculateMousePosition(evt){
    //Check where is the mouse in canvas
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return{
        x:mouseX,
        y:mouseY
    };
}

function handleMouseClick(evt){
    if(showingWinScreen){
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
    }
}

window.onload = function(){
    //Canvas of the game
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    
    //Interval of action in fps
    var framePerSec = 30;
    setInterval(function(){
        moveEverythings();
        drawEverythings();
    }, 1000/framePerSec );
    canvas.addEventListener('mousedown', handleMouseClick);
    canvas.addEventListener('mousemove',
        function(evt){
            var mousePos = calculateMousePosition(evt);
            paddle1Y = mousePos.y-(PADDLE_HEIGHT/2);
        });
}


function ballReset(){
    if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE){
        showingWinScreen = true;
    }
    ballSpeedX = -ballSpeedX;
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}

function computerMov(){
    var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
    if (paddle2YCenter < ballY-35){
        paddle2Y += 6;
    }else if (paddle2YCenter > ballY+35){
        paddle2Y -= 6;
    }
}   

function moveEverythings(){
    if(showingWinScreen){
        return;
    }
    computerMov();
    //Set ball and speed
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    //if the ball hit the left(player) wall reset the ball and run in the right wall
    if(ballX < 0){
        if(ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT){
            ballSpeedX = -ballSpeedX;
            //Fix the speed and orientation in function where it hit the paddle
            var deltaY = ballY - (paddle1Y+PADDLE_HEIGHT/2); 
            ballSpeedY = deltaY *0.35;
        }else{
            player2Score++;
            ballReset();                    
        }                
    }//if the ball hit the right(computer) wall reset the ball and run in the left wall
    if(ballX > canvas.width){
        if(ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT){
            ballSpeedX = -ballSpeedX;
            //Fix the speed and orientation in function where it hit the paddle
            var deltaY = ballY - (paddle2Y+PADDLE_HEIGHT/2); 
            ballSpeedY = deltaY *0.35;
        }else{
            player1Score++;
            ballReset();                    
        } 
    }
    //If the ball hit the top
    if(ballY < 0){
        ballSpeedY = -ballSpeedY;
    }
    //If the ball hit the bottom
    if(ballY > canvas.height){
        ballSpeedY = -ballSpeedY;
    }
}

function drawNet(){
    for(var i = 0; i<=canvas.height; i+=32){
        colorRect(canvas.width/2-1, i, 2, 20, 'white')
    }
}

function drawEverythings(){  
    //Color canvas on black
    colorRect(0, 0, canvas.width, canvas.height, 'black');  
    if(showingWinScreen){
        canvasContext.fillStyle= 'white'; 
        if(player1Score >= WINNING_SCORE){
            canvasContext.fillText("Left Player Won !", 350,200);
        } 
        else if(player2Score >= WINNING_SCORE){
            canvasContext.fillText("Right Player Won !", 350,200);
        }
        canvasContext.fillText("Click to continue", 350,500);                
        return;
    }

    drawNet();
    //Create left paddle                   
    colorRect(0,paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white'); 
    //Creat right computer paddle        
    colorRect(canvas.width-PADDLE_WIDTH, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white'); 
    //Draw the balls
    colorCircle(ballX, ballY, 10, 'white');

    canvasContext.fillText(player1Score, 100,100);
    canvasContext.fillText(player2Score, canvas.width-100,100);
    
}

function colorCircle(centerX, centerY, radius, drawColor){
    //Create a ball
    canvasContext.fillStyle= drawColor;             
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor){
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX,topY, width, height); 
}