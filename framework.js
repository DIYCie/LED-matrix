import { GpioMapping, LedMatrix, LedMatrixUtils, MatrixOptions, PixelMapperType, RuntimeOptions }  from 'rpi-led-matrix';
const rpio = require('rpio');
const fs = require('fs');

let colors = [0xC1FF00, 0xFF0000, 0x00FF00, 0x0000FF];
let matrixColor = 0;

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
rpio.open(32, rpio.INPUT, rpio.PULL_UP);

matrix.afterSync((mat, dt, t) => {
	mat.clear().brightness(10).fgColor(colors[matrixColor]).fill();
	console.log(rpio.read(32));
	if(currentApp) currentApp.draw(dt, t);
	setTimeout(() => mat.sync(), 0);
});

matrix.sync();

function loadApp(app) {
	currentApp = new app(matrix);
	currentApp.setup();
}

function buttonCheck() {

}

loadApp(applications[0]);

