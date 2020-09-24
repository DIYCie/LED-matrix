import MatrixApplication from '../MatrixApplication';
import Button from "../Button";
module.exports = class AppName extends MatrixApplication {
    static get name() { return '[App Name]'; }
    static get description() { return '[App Description]'; }

    constructor(matrix) {
        super(matrix);
    }

    setup() {
    }

    draw(deltaTime, time) {
    }

    onButtonPressed(button) {
    }

    onButtonReleased(button) {
    }
}
