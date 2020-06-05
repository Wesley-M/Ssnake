import KeyControls from "../controls/KeyControls.js"

export default class Snake {
    constructor() {
        this.head = {x: 10, y: 10};
        this.body = [
            {x: 10, y: 15}, 
            {x: 10, y: 20}, 
            {x: 10, y: 25}, 
            {x: 10, y: 30}, 
            {x: 10, y: 35},
            {x: 10, y: 40},
            {x: 10, y: 45},
            {x: 10, y: 50},
            {x: 10, y: 55},
            {x: 10, y: 60},
        ];
        this.velocity = {x: 0, y: 0};
        this.speed = 1;
        this.currentDirection;
        this.distanceBetweenSegments = 5;

        this.__initActions();
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

        this.currentDirection = direction;

        this.body.forEach((segment, index) => {
            if (index == 0) {
                let distance = Math.sqrt(Math.pow((this.head.x - segment.x), 2) + Math.pow((this.head.y - segment.y), 2));
                if (distance - this.distanceBetweenSegments > 0) {
                    this.moveSegmentTowards(segment, this.head, Math.abs(distance - this.distanceBetweenSegments));
                }
            } else {
                let distance = Math.sqrt(Math.pow((this.body[index - 1].x - segment.x), 2) + Math.pow((this.body[index - 1].y - segment.y), 2));
                if (distance - this.distanceBetweenSegments > 0) {
                    this.moveSegmentTowards(segment, this.body[index - 1], Math.abs(distance - this.distanceBetweenSegments));
                }
            }
        });

        this.head.x += this.velocity.x;
        this.head.y += this.velocity.y;
    }

    moveSegmentTowards(segment1, segment2, speed) {
        let angle = Math.atan2(segment2.y - segment1.y, segment2.x - segment1.x);
        segment1.x += Math.cos(angle) * speed;
        segment1.y += Math.sin(angle) * speed;
    }

    get position() {
        return this.head;
    }

    desaccelerate() {
        this.velocity = {x: 0, y: 0};
    }

    update() {
        this.move(this.currentDirection);
    }
}