import { GpioMapping, LedMatrix, LedMatrixUtils, MatrixOptions, PixelMapperType, RuntimeOptions, Font }  from 'rpi-led-matrix';
import { MatrixApplication } from "./MatrixApplication";

const rpio = require('rpio');
const fs = require('fs');

import Button from "./Button";

let buttonStates = {};
for(const key in Button) {
	buttonStates[Button[key]] = false;
}

let applications = [];

fs.readdirSync(__dirname+'/apps').forEach((file) => {
	let app = require('./apps/'+file);
	if(app.prototype instanceof MatrixApplication) {
		applications.push(app);
	}
});

let currentApp;

console.log('Initialising matrix');

const matrix = new LedMatrix(
	{
		...LedMatrix.defaultMatrixOptions(),
		rows: 64,
		cols: 64,
		chainLength: 1,
		hardwareMapping: GpioMapping.Regular,
		pixelMapperConfig: LedMatrixUtils.encodeMappers({
			type: PixelMapperType.ChainLink
		})
	},
	{
		...LedMatrix.defaultRuntimeOptions(),
		gpioSlowdown: 4,
	}
);

console.log('Intialised matrix');

// Initialise buttons
console.log('Intialising buttons')
rpio.init({ gpiomem: true });

for(const key in Button) {
	rpio.open(Button[key], rpio.INPUT, rpio.PULL_UP);
}

//const nameFont = new Font('4x6',`${process.cwd()}/fonts/4x6.bdf`)

matrix.afterSync((mat, dt, t) => {
	//mat.clear().brightness(10).fgColor(colors[matrixColor]).fill();
	if(currentApp) {
		buttonCheck();
		currentApp.draw(dt, t);
	} else {
		applications.forEach(app => {
			//matrix.font(nameFont);
			//matrix.fgColor(0xFF).drawText(app.name, 0, 0);
		})
	}
	setTimeout(() => mat.sync(), 0);
});

matrix.sync();

function loadApp(app) {
	currentApp = new app(matrix);
	currentApp.setup();
}

function buttonCheck() {
	for(const key in Button) {
		const button = Button[key];
		const reading = rpio.read(button);
		if(reading !== buttonStates[button]) {
			if(reading) currentApp.onButtonReleased(button);
			else currentApp.onButtonPressed(button);
			buttonStates[button] = reading;
		}
	}
}

function isPressed(button) {
	return !rpio.read(button);
}

loadApp(applications[0]);

