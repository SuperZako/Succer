/// <reference path="../State.ts" />

class FieldPlayerStateRunning extends State<FieldPlayer> {
    private static instance = new FieldPlayerStateRunning();

    //this is a singleton
    public static getInstance() {
        return this.instance;
    }

    public ai(_p: ControllingPlayer) {
        if (throwin.player.run_to(throwin.ballpos.x, throwin.ballpos.y)) {
            let game = Game.getInstance();
            let ball = game.ball;

            throwin.player.ball_thrown();
            ball.velocity.x = throwin.balld.x;
            ball.velocity.y = throwin.balld.y;
            ball.velocity.z = 5;
        }
    }
    public input(_p: ControllingPlayer) {
        let game = Game.getInstance();
        if (throwin.player.run_to(throwin.ballpos.x, throwin.ballpos.y)) {
            let ball = game.ball;

            throwin.player.ball_thrown();
            ball.velocity.x = throwin.balld.x;
            ball.velocity.y = throwin.balld.y;
            ball.velocity.z = 5;
        }
    }
    public draw(f: FieldPlayer) {
        let animfactor = 1;
        let animoffset = 20;
        let anim_end = 1;

        jersey_color(f);

        if (f.vel > min_vel) {
            animfactor = 4;
            animoffset = 0;
            anim_end = 4;
            spr_from_dir(f);
        }

        f.animtimer += f.vel * 0.25;
        while (Math.floor(f.animtimer) >= anim_end) {
            f.animtimer -= anim_end;
        }

        let pos = sprite_pos(f);
        spr(animoffset + f.lastspr * animfactor + f.animtimer, pos.x, pos.y, 1, 1, f.lastflip);
    }
}