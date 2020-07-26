class MatrixApplication {
    constructor(matrix, name, description) {
        this.matrix = matrix;
        this.name = name;
        this.description = description;
    }

    setup() {
        this.matrix.clear();
    }

    draw(dt, t) {
        // Add draw code
    }
}

export { MatrixApplication }