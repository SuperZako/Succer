
class GoalUp extends BaseGameEntity {
    //public y = -fh2;

    constructor() {
        super();
        this.position.y = -fh2;
    }

    public draw() {
        let clipstartx = goalx1 - camtarget.x + 1 + 64;
        let clipstarty = -camtarget.y + 64 - fh2;
        let clipendx = goalx2 - goalx1;
        let clipendy = goalh / 2 + 1;
        //spr(60, goalx2, -fh2 - 17)
        clip(clipstartx, clipstarty - 10, clipendx + 8, clipendy);
        for (let x = goalx1 - 1; x <= goalx2 + 8; x += 8) {
            for (let y = -11; y <= 7; y += 8) {
                //spr(61, x, y - fh2)
            }
        }
        clip(clipstartx, clipstarty - goalh, clipendx - 1, clipendy)
        for (let x = goalx1 - 1; x <= goalx2 + 8; x += 8) {
            for (let y = -goalh + 1; y <= 8; y += 8) {
                //spr(62, x, y - fh2)
            }
        }
        clip();
        let a = -goall - fh2;
        line(goalx1, a, goalx1, -fh2);
        line(goalx1, a, goalx2, a);
        line(goalx2, a, goalx2, -fh2);
    }

    public drawshadow() {
    }
}
var goal_up = new GoalUp();