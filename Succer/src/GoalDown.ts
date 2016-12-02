

class GoalDown extends BaseGameEntity {
    //public y = fh2 + goalh;

    constructor() {
        super();
        this.position.y = fh2 + goalh;
    }
    public draw() {
        //spr(60, goalx2, fh2, 1, 1, false, true)
        color(7)
        rect(goalx1, -goall + fh2, goalx2, fh2)
        clip(goalx1 - camtarget.x + 64 + 1, -goall - camtarget.y + 64 + fh2 + 1, goalx2 - goalx1 - 1, goalh - 1)
        for (let x = goalx1; x <= goalx2 + 7; x += 8) {
            for (let y = -goall; y <= goall; y += 8) {
                //spr(62, x, y + fh2)
            }
        }
        clip();
    }
    public drawshadow() {
    }
}
var goal_down = new GoalDown();