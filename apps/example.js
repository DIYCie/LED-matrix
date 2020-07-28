import { MatrixApplication } from '../MatrixApplication';
import Button from "../Button";
class ExampleApp extends MatrixApplication {
    constructor(matrix) {
        super(matrix, "Example App", "An example application to help you get started");
    }

    setup() {
        super.setup();
        this.colors = [0xFF0000, 0x00FF00, 0x0000FF];
        this.colorIndex = 0;
        this.interval = 1000;
        this.prevTime = 0;
    }

    draw(deltaTime, time) {
        super.draw();
        if (time > this.prevTime+this.interval) {
            this.prevTime = time;
        }
        this.matrix.brightness(20).fgColor(this.colors[this.colorIndex]).fill();
    }

    onButtonPressed(button) {
        if(button === Button.UP) {
            this.colorIndex = (this.colorIndex+1)%this.colors.length;
        }
    }

    onButtonReleased(button) {
        if(button === Button.DOWN) {
            this.colorIndex = (this.colorIndex+1)%this.colors.length;
        }
    }
}

module.exports = ExampleApp;