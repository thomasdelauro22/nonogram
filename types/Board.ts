export class Board {
    width: number = 0;
    height: number = 0;
    rowClues: number[][] = [];
    colClues: number[][] = [];

    // for pixels, 0 = unknown, 1 = unshaded, 2 = shaded
    pixels: number[][] = [];

    initialize(width: number, height: number) {
        // set width and height
        this.width = width;
        this.height = height;

        //initialize arrays
        for (let i = 0; i < width; i++) {
            this.rowClues.push([]);
            this.pixels.push([]);
            for (let j = 0; j < height; j ++) {
                if (j === 0) {
                    this.colClues.push([]);
                }
                // set each pixel to unknown
                this.pixels[i].push(0);
            }
        }
    }
}

