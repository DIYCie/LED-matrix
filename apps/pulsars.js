import MatrixApplication from '../MatrixApplication';
import Button from "../Button";

module.exports = class Pulsars extends MatrixApplication {
    static get name() { return 'Pulsars'; }
    static get description() { return 'Displays dots that randomly pulse. Color, speed and size can be controlled with te buttons.'; }

    constructor(matrix) {
        super(matrix);
        this.size = 8;
        this.speed = 10;
        this.colors = [0xFFFFFF, 0xFF00000, 0x00FF00, 0x0000FF, 0xFFFF00, 0x00FFFF, 0xFF00FF];
        this.color = 0;
    }

    setup() {
        super.setup();
    }

    draw(deltaTime, time) {
        super.draw();
        const timestep = time/100000*this.speed;
        for (let x = 0; x < this.matrix.width()/this.size; x++) {
            for (let y = 0; y < this.matrix.height()/this.size; y++) {
                this.matrix.fgColor(this.pixelColor(timestep, x, y, this.colors[this.color]))
                  .fill(x*this.size, y*this.size, x*this.size + this.size, y*this.size + this.size);
            }
        }
    }

    onButtonPressed(button) {
        if(button === Button.UP && this.size < 16) {
            this.size++;
        } else if(button === Button.DOWN && this.size > 2) {
            this.size--;
        } else if(button === Button.LEFT && this.speed < 100) {
            this.speed++;
        } else if(button === Button.RIGHT && this.speed > 1) {
            this.speed--;
        } else if(button === Button.A) {
            if (this.color++ >= this.colors.length-1) {
                this.color = 0;
            }
        } else if(button === Button.B) {
            if (this.color-- <= 0) {
                this.color = this.colors.length-1;
            }
        }
    }

    onButtonReleased(button) {
    }

    pixelColor(time, x, y, color) {
        const offset = (x*x*x*23)%61 + ((x+1)*y*y*43)%73
        const brightness = 0xFF & Math.max(0, 255 * (Math.sin(((time + offset) * offset/5))));

        return color & ( (brightness << 16) | (brightness << 8) | brightness );
    }
}
