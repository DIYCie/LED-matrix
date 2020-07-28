import { MatrixApplication } from '../MatrixApplication';
import Button from "../Button";
class BouncingBall extends MatrixApplication {
    constructor(matrix) {
        super(matrix, "Bauncing Ball Programm by Stijn", "And colours");
    }

    setup() {
        super.setup();
        this.colors = [0xFF0000, 0x00FF00, 0x0000FF];
        this.colorIndex = 0;
        this.interval = 1000;
        this.prevTime = 0;
	//this.location = 10;
	this.ballx = this.randomInt(5,this.matrix.width()-5);
	this.bally = this.randomInt(5, this.matrix.height()-5);
	this.location = this.randomInt(10,40);
	this.xdir = true;
	this.ydir = true;
	this.speed = 1;
    }

    draw(deltaTime, time) {
        super.draw();
        if (time > this.prevTime+this.interval) {
            this.prevTime = time;
        }
	this.bounceMechanic();
	this.moveMechanic();
	this.keepBallInside();

	this.matrix.fgColor({ r:0, g:0, b:80 }).fill(0,0,this.ballx,this.bally);
	this.matrix.fgColor({ r:50, g:80, b:0 }).fill(this.ballx,this.bally,this.matrix.width(),this.matrix.height());
	this.matrix.fgColor({ r:50, g:0, b:0 }).fill(this.ballx+1,0,this.matrix.width(),this.bally);
	this.matrix.fgColor({ r:50, g:0, b:0 }).fill(0,this.bally+1,this.ballx,this.matrix.height());
	this.matrix.fgColor({ r:0, g:0, b:0 }).drawCircle(this.ballx,this.bally,this.bally/2);
        //this.matrix.brightness(20).fgColor(this.colors[this.colorIndex]).fill();
    }

    onButtonPressed(button) {
        if(button === Button.UP) {
          this.bally += 5; 
	// this.colorIndex = (this.colorIndex+1)%this.colors.length;
        }
	if(button === Button.DOWN){
	this.bally -= 5;
	}
	if(button === Button.LEFT){
	this.ballx += 5;
	}
	if(button === Button.RIGHT){
	this.ballx -= 5;
	}
	if(button === Button.A){
	this.xdir = !this.xdir;
	}
    }


    onButtonReleased(button) {
        if(button === Button.DOWN) {
            this.colorIndex = (this.colorIndex+1)%this.colors.length;
        }
    }
    randomInt(low, high) {
     return Math.floor(Math.random() * (high - low) + low)
	}
    bounceMechanic(){
	if(this.ballx >= this.matrix.width() || this.ballx <= 0){
	this.xdir = !this.xdir;
	}
	if(this.bally >= this.matrix.height() || this.bally <= 0){
	this.ydir = !this.ydir;
	}
    }
    moveMechanic(){
	if(this.xdir){
	this.ballx += this.speed;
	}else{
	this.ballx -= this.speed;
	}
	if(this.ydir){
	this.bally += this.speed;
	}else{
	this.bally -= this.speed;
	}
    }
    keepBallInside(){
if(this.ballx < 0 || this.ballx > this.matrix.width() || this.bally < 0 || this.bally > this.matrix.height()){
this.ballx = this.matrix.width()/2;
this.bally = this.matrix.height()/2;
	}
	}
}

module.exports = ExampleApp;
