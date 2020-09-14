class MatrixApplication {
    static get name() { return 'App Name' }
    static get description() { return 'App Description'}

    constructor(matrix) {
        this.matrix = matrix;
    }

    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }

    setup() {
        this.matrix.clear();
    }

    draw(dt, t) {
        // Add draw code
    }

    onButtonPressed(button) {
        // Add button code
    }

    onButtonReleased(button) {
        // Add button code
    }
}

export default MatrixApplication;