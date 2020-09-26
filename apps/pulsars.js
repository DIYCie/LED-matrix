import MatrixApplication from '../MatrixApplication';
import Button from "../Button";

class Pulsar {
    constructor(x, y, f) {
        this.x = x;
        this.y = y;
        this.f = f;
    }

    nextColor(time, color) {
        const brightness = 0xFF & Math.max(0, 255 * (Math.sin(this.f * time)));

        return color & ( (brightness << 16) | (brightness << 8) | brightness );
    }
}

module.exports = class Pulsars extends MatrixApplication {
    static get name() { return 'Pulsars'; }
    static get description() { return 'Displays dots that randomly pulse. Color, speed and size can be controlled with te buttons.'; }

    constructor(matrix) {
        super(matrix);
        this.pulsars = [];
        this.size = 1;
        this.speed = 10000;
        this.colors = [0xFFFFFF, 0xFF00000, 0x00FF00, 0x0000FF, 0xFFFF00, 0x00FFFF, 0xFF00FF];
        this.color = 0;

        this.createPulsars(matrix);
    }

    setup() {
        super.setup();
    }

    draw(deltaTime, time) {
        super.draw();
        this.pulsars.forEach(pulsar => {
            let color = pulsar.nextColor(time/this.speed, this.colors[this.color]);
            for (let i = 0; i < this.size; i++) {
                for (let j = 0; j < this.size; j++) {
                    this.matrix.fgColor(color).setPixel(pulsar.x + i, pulsar.y + j);
                }
            }
        });
    }

    onButtonPressed(button) {
        if(button === Button.UP && this.size < 8) {
            this.size++;
            this.pulsars = [];
            this.createPulsars(this.matrix);
        } else if(button === Button.DOWN && this.size > 1) {
            this.size--;
            this.pulsars = [];
            this.createPulsars(this.matrix);
        } else if(button === Button.LEFT && this.speed < 100000) {
            this.speed += 1000;
        } else if(button === Button.RIGHT && this.speed > 1000) {
            this.speed -= 1000;
        } else if(button === Button.A) {
            if (this.color++ > this.colors.length-1) {
                this.color = 0;
            }
        } else if(button === Button.B) {
            if (this.color-- < 0) {
                this.color = this.colors.length-1;
            }
        }
    }

    onButtonReleased(button) {
    }

    createPulsars(matrix) {
        for (let x = 0; x < matrix.width()/this.size; x++) {
            for (let y = 0; y < matrix.height()/this.size; y++) {
                this.pulsars.push(new Pulsar(x*this.size, y*this.size, 5 * Math.random()));
            }
        }
    }
}
