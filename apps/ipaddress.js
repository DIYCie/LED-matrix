import { Font, LayoutUtils, HorizontalAlignment, VerticalAlignment } from 'rpi-led-matrix';
import MatrixApplication from '../MatrixApplication';
import Button from "../Button";
const { networkInterfaces } = require('os');
module.exports = class IpAddress extends MatrixApplication {
    static get name() { return 'IP Address'; }
    static get description() { return 'View the IP address of the Pi'; }

    constructor(matrix) {
        super(matrix);
    }

    setup() {
	super.setup();
	this.font = new Font('spleen-5x8', `${process.cwd()}/node_modules/rpi-led-matrix/fonts/spleen-5x8.bdf`);
	const wifiInterface = networkInterfaces()['wlan0'];
	if (wifiInterface) {
		const ipAddress = wifiInterface[0].address.split('.');
		this.status = `My IP address is: ${ipAddress[0]}.${ipAddress[1]}. ${ipAddress[2]}.${ipAddress[3]}`;
	} else {
		this.status = 'Not Connected';
	}
    }

    draw(deltaTime, time) {
        super.draw();
	this.matrix.font(this.font).fgColor(0xFF).brightness(255);
	const lines = LayoutUtils.textToLines(this.font, this.matrix.width(), this.status);
	LayoutUtils.linesToMappedGlyphs(lines, this.font.height(), this.matrix.width(), this.matrix.height(), HorizontalAlignment.Left, VerticalAlignment.Top).map(glyph => {
		this.matrix.drawText(glyph.char, glyph.x, glyph.y);
	});
    }

    onButtonPressed(button) {
    }

    onButtonReleased(button) {
    }
}
