/// <reference path="../State.ts" />

class FieldPlayerStateThrowin extends State<FieldPlayer> {

    private static instance = new FieldPlayerStateThrowin();

    //this is a singleton
    public static getInstance() {
        return this.instance;
    }

    public start() {
        throwin.timer = 35;
        throwin.player.position.x = throwin.pos.x;
        throwin.player.position.y = throwin.pos.y;
        //muls_in_place(throwin_f.velocity, 0)
        throwin.player.velocity = Vector3.Zero;//.multiply(0);
    }
    public ai(p: ControllingPlayer) {
        let game = Game.getInstance();
        let ball = game.ball;
        let f = p.man;
        let dy = 0;
        if (ball.position.y * f.side > 0) {
            dy = -2;
        } else {
            if (ball.position.y * f.side > -fh2 / 2) {
                dy = -1
            }
        }
        dy *= f.side;

        if (checktimer(throwin)) {
            game.throw_in(dy);
            f.ball_thrown();
            return;
        }
        f.lastspr = 2 + dy;
        if (f.pass()) {
            f.ball_thrown();
        }
    }
    public input(p: ControllingPlayer) {
        let game = Game.getInstance();
        let dy = 0;
        if (btn(2, p.num)) {
            dy -= 2;
        }
        if (btn(3, p.num)) {
            dy += 2;
        }
        if ((btn(0, p.num) || btn(1, p.num))) {
            dy /= 2;
        }
        p.man.lastspr = 2 + dy;
        if (btn(4, p.num)) {
            //--if (not pass(p.man)) throw_in(dy)
            game.throw_in(dy);
            p.man.ball_thrown();
        }
    }
    public draw(f: FieldPlayer) {
        let game = Game.getInstance();
        let ball = game.ball;
        jersey_color(f);
        let pos = sprite_pos(f);
        f.lastflip = f.position.x > 0;
        spr(48 + f.lastspr, pos.x, pos.y, 1, 1, f.lastflip);
        ball.position.x = f.position.x;
        ball.position.y = f.position.y;
        ball.position.z = 7
        ball.velocity.z = 0
    }
}