import KeyControls from "../controls/KeyControls.js"

export default class Snake {
    constructor() {
        this.head = {x: 10, y: 10};
        this.body = [];
        this.speed = 1;
        this.velocity = {x: 0, y: 0};
        this.distanceBetweenSegments = 5;
        this.currentDirection;
        this.minLength = 20;

        this.__initBody();
        this.__initActions();
    }

    __initBody() {
        let segment = 1;
        for (let i = 0; i < this.minLength; i++) {
            this.body.push({x: this.head.x, y: this.head.y + segment * this.distanceBetweenSegments});
            segment += 1;
        }
    }

    __initActions() {
        const controls = new KeyControls();
    
        controls.addKeyAction("keydown", 37, () => { this.move("left")  }, false);
        controls.addKeyAction("keydown", 39, () => { this.move("right") }, false);
        controls.addKeyAction("keydown", 38, () => { this.move("up")    }, false);
        controls.addKeyAction("keydown", 40, () => { this.move("down")  }, false);

        controls.addKeyAction("keyup", 37, () => { this.desaccelerate() }, false);
        controls.addKeyAction("keyup", 39, () => { this.desaccelerate() }, false);
        controls.addKeyAction("keyup", 38, () => { this.desaccelerate() }, false);
        controls.addKeyAction("keyup", 40, () => { this.desaccelerate() }, false);

        controls.init();
    }

    move (direction) {
        this.changeVelocity(direction);

        this.currentDirection = direction;

        this.moveSegments();
    }

    changeVelocity(direction) {
        switch(direction) {
            case "up":
                this.velocity.y = -this.speed;
                break;
            case "down":
                this.velocity.y = this.speed;
                break;
            case "left":
                this.velocity.x = -this.speed;
                break;
            case "right":
                this.velocity.x = this.speed;
                break;
        }
    }

    moveSegments() {
        const FIRST_SEGMENT = 0;
        let currentDistanceBetweenSegs = 0;

        //  Move the head of the snake
        this.head.x += this.velocity.x;
        this.head.y += this.velocity.y;

        // Move the first body segment
        this.moveSegmentTowards(this.body[FIRST_SEGMENT], this.head);

        // Move the rest of the body
        this.body.forEach((segment, index) => {
            if (index != FIRST_SEGMENT) {
                const LAST_SEGMENT = index - 1;
                this.moveSegmentTowards(segment, this.body[LAST_SEGMENT]);
            }
        });
    }

    getDistanceBetweenSegments(seg1, seg2) {
        return Math.sqrt(
            Math.pow((seg1.x - seg2.x), 2) + 
            Math.pow((seg1.y - seg2.y), 2)
        );
    }

    moveSegmentTowards(seg1, seg2) {
        let currentDistanceBetweenSegs = this.getDistanceBetweenSegments(seg1, seg2);
        if (currentDistanceBetweenSegs > this.distanceBetweenSegments) {
            let angle = Math.atan2(seg2.y - seg1.y, seg2.x - seg1.x);
            let relativeSpeed = Math.abs(currentDistanceBetweenSegs - this.distanceBetweenSegments)
            seg1.x += Math.cos(angle) * relativeSpeed;
            seg1.y += Math.sin(angle) * relativeSpeed;
        }
    }

    get position() {
        return this.head;
    }

    desaccelerate() {
        this.velocity = {x: 0, y: 0};
    }

    get position() {
        return this.head; 
    }

    update() {
        this.move(this.currentDirection);
    }
}