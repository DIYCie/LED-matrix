import {Font, GpioMapping, LedMatrix, LedMatrixUtils, PixelMapperType} from 'rpi-led-matrix';
import MatrixApplication from "./MatrixApplication";
import Button from "./Button";

const rpio = require('rpio');
const fs = require('fs');

let buttonStates = {};
for(const key in Button) {
	buttonStates[Button[key]] = false;
}

console.log('Loading Applications');
let applications = [];

fs.readdirSync(__dirname+'/apps').forEach((file) => {
	let app = require('./apps/'+file);
	if(app.prototype instanceof MatrixApplication) {
		applications.push(app);
	}
});

let appSelectionIndex = 0;

let currentApp;

console.log('Loaded Applications');

console.log('Initialising matrix');

const matrix = new LedMatrix(
	{
		...LedMatrix.defaultMatrixOptions(),
		rows: 64,
		cols: 64,
		chainLength: 1,
		hardwareMapping: GpioMapping.Regular,
		parallel: 3,
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

initializeButtons();

console.log('Intialised Buttons');

const nameFont = loadFont('spleen-5x8');

matrix.afterSync((mat, dt, t) => {
	//mat.clear().brightness(10).fgColor(colors[matrixColor]).fill();
	matrix.clear();
	buttonCheck();
	if(currentApp) {
		currentApp.draw(dt, t);
	} else {
		applications.forEach(app => {
			matrix.font(nameFont);
			matrix.fgColor(0xFF)
			const appIndex = applications.indexOf(app);
			const indicator = appIndex === appSelectionIndex ? '> ' : '  ';
			matrix.drawText(indicator + app.name, 0, appIndex * nameFont.height());
		})
	}
	setTimeout(() => mat.sync(), 0);
});

matrix.sync();

function loadApp(app) {
	currentApp = new app(matrix);
	currentApp.setup();
}

function loadFont(fontName) {
	return new Font(fontName, `${process.cwd()}/node_modules/rpi-led-matrix/fonts/${fontName}.bdf`);
}

function initializeButtons() {
	for(const key in Button) {
		const button = Button[key];
		buttonStates[button] = rpio.read(button);
	}
}

function buttonCheck() {
	for(const key in Button) {
		const button = Button[key];
		const reading = rpio.read(button);
		if(reading !== buttonStates[button]) {
			if(currentApp) {
				if(reading) currentApp.onButtonReleased(button);
				else currentApp.onButtonPressed(button);
			} else {
				if (button === Button.UP && reading == true) {
					appSelectionIndex = (appSelectionIndex-1)%applications.length;
				}
				if (button === Button.DOWN && reading == true) {
					appSelectionIndex = (appSelectionIndex+1)%applications.length;
				}
				if (button === Button.A && reading == true) {
					loadApp(applications[appSelectionIndex]);
				}
			}
			buttonStates[button] = reading;
		}
	}
}

function isPressed(button) {
	return !rpio.read(button);
}

//loadApp(applications[0]);

