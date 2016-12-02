/// <reference path="../State.ts" />

class KeeperStateDive extends State<GoalKeeper> {

    private static instance = new KeeperStateDive();

    //this is a singleton
    public static getInstance() {
        return this.instance;
    }

    public draw(k: GoalKeeper) {
        jersey_color(k);
        let pos = sprite_pos(k);
        spr(k.lastspr, pos.x, pos.y, 1, 1, k.velocity.x < 0);
    }

    public start(k: GoalKeeper) {
        k.timer = 30;
    }

    public update(k: GoalKeeper) {
        let game = Game.getInstance();

        k.lastspr = k.timer > 25 ? 55 : 56;
        if (checktimer(k)) {
            k.lastspr = 0;
            k.set_state(KeeperStateOk.getInstance());
            return;
        }
        if (k.touch_ball(5) && game.isPlaying()) {
            game.ball.velocity.y = 3.0 * (-k.position.y / Math.abs(k.position.y));
            game.ball.velocity.x += k.velocity.x;
            sfx(15);
            balllasttouchedside = k.side;
        }
    }
}