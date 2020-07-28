import { GpioMapping, LedMatrix, LedMatrixUtils, MatrixOptions, PixelMapperType, RuntimeOptions }  from 'rpi-led-matrix';
const rpio = require('rpio');

let colors = [0xC1FF00, 0xFF0000, 0x00FF00, 0x0000FF];
let matrixColor = 0;

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

matrix.afterSync((mat, dt, t) => {
//	matrix.clear().brightness(10).fgColor(colors[matrixColor]).fill();
matrix
  .clear()            // clear the display
  .brightness(50)    // set the panel brightness to 100%
  .fgColor(0x0000FF)  // set the active color to blue
  .fill()             // color the entire diplay blue
  .fgColor(0xFFFF00)  // set the active color to yellow
  // draw a yellow circle around the display
  .drawCircle(32, 32, 31)
  // draw a yellow rectangle
  .drawRect(16, 16, 32, 32)
  // sets the active color to red
  .fgColor({ r: 255, g: 0, b: 0 })
  // draw two diagonal red lines connecting the corners
  .drawLine(0, 0, matrix.width(), matrix.height())
  .drawLine(matrix.width() - 1, 0, 0, matrix.height() - 1);
	setTimeout(() => matrix.sync(), 0);
});

matrix.sync();
console.log("Width = " + matrix.width());
console.log("Height = " + matrix.height());
// Initialise buttons
console.log('Intialising buttons')
rpio.open(32, rpio.INPUT, rpio.PULL_UP);

function pollButtons(pin) {
	rpio.msleep(20);
	if (rpio.read(pin)) return;
	console.log('button pressed');
	matrixColor = (matrixColor+1)%colors.length;
}

rpio.poll(32, pollButtons, rpio.POLL_LOW);
