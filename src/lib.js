function test() {
    console.log('I work!!!');
};

class Point {
    constructor(x, y, label) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.label = label;
    }

    Draw(context) {
          context.fillRect(this.x, this.y, this.width, this.height);
    }
}

export default Point;