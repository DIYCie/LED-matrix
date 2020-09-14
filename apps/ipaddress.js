import { Font } from 'rpi-led-matrix';
import MatrixApplication from '../MatrixApplication';
import Button from "../Button";
const { networkInterfaces } = require('os');
class IpAddress extends MatrixApplication {
    static get name() { return 'IP Address'; }
    static get description() { return 'View the IP address of the Pi'; }

    constructor(matrix) {
        super(matrix);
	this.matrix = matrix;
    }

    setup() {
	this.font = new Font('spleen-5x8', `${process.cwd()}/node_modules/rpi-led-matrix/fonts/spleen-5x8.bdf`);
        super.setup();
	const nets = networkInterfaces();
	for (const net of nets['wlan0']) {
		if (net.family === ' IPv4'  && !net.internal) {
			this.ipAddress = net.address;
		}
	}
    }

    draw(deltaTime, time) {
        super.draw();
	matrix.font(this.font).fgColor(0xFF).brightness(255).drawText(this.ipAddress, 0, 0);
    }

    onButtonPressed(button) {
    }

    onButtonReleased(button) {
    }
}
module.exports = IpAddress;
