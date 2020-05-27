import { GpioMapping, LedMatrix, LedMatrixUtils, MatrixOptions, PixelMapperType, RuntimeOptions }  from 'rpi-led-matrix';
import 'rpio' as rpio;

// Initialise buttons
console.log('Intialising buttons')
rpio.open(32, rpio.INPUT, rpio.PULL_UP);


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
let colors = [0xC1FF00, 0xFF0000, 0x00FF00, 0x0000FF];
let matrixColor = 0;

matrix.afterSync((mat, dt, t) => {
	matrix.clear().brightness(100).fgColor(colors[matrixColor]).fill();
	setTimeout(() => matrix.sync(), 0);
});

matrix.sync();

function pollButtons(pin) {
	rpio.msleep(20);
	if (rpio.read(pin)) return;
	matrixColor = (matrixColor+1)%colors.length;
}

rpio.poll(32, pollButtons, rpio.POLL_LOW);
