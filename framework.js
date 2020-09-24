import {
	Font,
	GpioMapping,
	HorizontalAlignment,
	LayoutUtils,
	LedMatrix,
	LedMatrixUtils,
	PixelMapperType, VerticalAlignment
} from 'rpi-led-matrix';
import MatrixApplication from "./MatrixApplication";
import Button from "./Button";
import { exec } from 'child_process';

const rpio = require('rpio');
const fs = require('fs');

let buttonStates = {};
for(const key in Button) {
	buttonStates[Button[key]] = false;
}

console.log('Loading Applications');
let applications = [];

let appSelectionIndex = 0;
let appSelectionOffset = 0;
let currentApp;

function loadApps() {
	applications = [];

	fs.readdirSync(__dirname+'/apps').forEach((file) => {
		let app = require('./apps/'+file);
		if(app.prototype instanceof MatrixApplication) {
			applications.push(app);
		}
	});

	applications.push({name: 'Reload Apps'});
	applications.push({name: 'Exit'});
	applications.push({name: 'Shutdown'});

	appSelectionIndex = 0;
	appSelectionOffset = 0;
	currentApp = undefined;

};

loadApps();

console.log('Loaded Applications');

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

initializeButtons();

console.log('Intialised Buttons');

const nameFont = loadFont('spleen-5x8');

matrix.afterSync((mat, dt, t) => {
	matrix.clear();
	buttonCheck();
	if(currentApp) {
		currentApp.draw(dt, t);
	} else {
		matrix.font(nameFont).fgColor(0xFF).brightness(255);
		applications.forEach(app => {
			const appIndex = applications.indexOf(app);
			const indicator = appIndex === appSelectionIndex ? '> ' : '  ';
			const lines = LayoutUtils.textToLines(nameFont, matrix.width(), indicator + app.name);
			const glyphs = LayoutUtils.linesToMappedGlyphs([lines[0]], nameFont.height(), matrix.width(), nameFont.height(), HorizontalAlignment.Left, VerticalAlignment.Top);
			glyphs.forEach(glyph => {
				matrix.drawText(glyph.char, glyph.x, glyph.y+(appIndex-appSelectionOffset)*nameFont.height());
			});
		})
	}
	setTimeout(() => matrix.sync(), 0);
});

matrix.sync();

function loadApp(app) {
	if(app.name === 'Shutdown') shutdown()
	else if(app.name === 'Reload Apps') loadApps()
	else if(app.name === 'Exit') process.exit()
	else {
		currentApp = new app(matrix);
		currentApp.setup();
	}
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
        			if(button === Button.POWER && reading == false) showMenu();
				else if(reading) currentApp.onButtonReleased(button);
				else currentApp.onButtonPressed(button);
			} else {
				if (button === Button.UP && reading == false) {
					appSelectionIndex = (appSelectionIndex-1)%applications.length;
					if (appSelectionIndex < 0) appSelectionIndex+=applications.length;
				}
				if (button === Button.DOWN && reading == false) {
					appSelectionIndex = (appSelectionIndex+1)%applications.length;
				}
				if (button === Button.A && reading == false) {
					loadApp(applications[appSelectionIndex]);
				}
				if (appSelectionIndex+1 > matrix.height()/nameFont.height()+appSelectionOffset) {
					appSelectionOffset = appSelectionIndex+1-matrix.height()/nameFont.height();
				} else if (appSelectionIndex < appSelectionOffset) {
					appSelectionOffset = appSelectionIndex;
				}
			}
			buttonStates[button] = reading;
		}
	}
}

function isPressed(button) {
	return !rpio.read(button);
}
function showMenu() {
	currentApp = undefined;
}

function shutdown(){
	exec('sudo /sbin/shutdown now', function(error, stdout, stderr) {
		console.log(`Error: ${error}`);
		console.log(`StdOut: ${stdout}`);
		console.log(`StdErr: ${stderr}`);
	});
	process.exit();
}

//loadApp(applications[0]);

