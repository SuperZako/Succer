/// <reference path="../State.ts" />

class FieldPlayerStateOK extends State<FieldPlayer> {

    private static instance = new FieldPlayerStateOK();

    //this is a singleton
    public static getInstance() {
        return this.instance;
    }


    public ai(p: ControllingPlayer) {
        let game = Game.getInstance();
        let ball = game.ball;
        let f = p.man;
        if (f === null) {
            return;
        }

        //-- if (is_throwin()) findpos2(f, ball)
        if (game.is_throwin()) {
            f.findpos2({ x: 0, y: 0 });
        }
        if (game.isPlaying()) {
            //-- if running after the ball and it's going to leave the field on the throwin side
            //-- and a team mate is in front of the ball... let him handle the situation

            if ((f.hasball || f.run_to(ball.position.x, ball.position.y)) && ball.position.z < 8 && f.justshot <= 0) {
                //-- try to shoot
                let goal = { x: 0, y: f.side * fh2 };
                if (dist_manh(goal, f.position) < 75) {
                    f.dir = Vector2.normalize(Vector2.subtract(goal, f.position.toVector2()));
                    p.but = rnd(max_kick / 2) + max_kick / 3;
                    p.kick();
                    return;
                }
                //-- try to pass
                if (!f.pass()) {
                    //-- try to get near the goal
                    if (f.hasball) {
                        let togoal = Vector2.subtract(goal, f.position); //--unit(minus(goal, f))
                        if (Vector2.dot(f.dir, togoal) < sin22_5) {
                            let side = { x: -f.dir.y, y: f.dir.x };
                            let turn = Vector3.add(f.position, Vector2.multiply(35, side).toVector3());
                            f.run_to(turn.x, turn.y);
                        } else {
                            f.run_to(0, goal.y * 0.75);
                        }
                    }
                }
            }
        }
    }

    public input(p: ControllingPlayer) {
        let game = Game.getInstance();
        if (p.man == null || (!game.isPlaying() && !game.is_throwin())) {
            return;
        }

        let man = p.man;

        if (btn(0, p.num)) {
            man.velocity.x -= vel_inc;
        }
        if (btn(1, p.num)) {
            man.velocity.x += vel_inc;
        }
        if (btn(2, p.num)) {
            man.velocity.y -= vel_inc;
        }
        if (btn(3, p.num)) {
            man.velocity.y += vel_inc;
        }

        if (game.isPlaying()) {
            if (btn(4, p.num)) {
                p.but += 1;
                if (p.but >= max_kick) {
                    p.button_released();
                }
            } else {
                if (p.but > 0) {
                    p.button_released();
                }
            }
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

    public update(f: FieldPlayer) {
        let game = Game.getInstance();
        if (game.isPlaying()) {
            f.findpos();
        }
        if (game.is_throwin() || game.state === GameStateToBallout.getInstance()) {
            if (throwin.type === FieldPlayerStateThrowin.getInstance()) {
                f.findpos();
            }
            if (throwin.type === Goalkick.getInstance()) {
                f.findpos2({ x: 0, y: 0 });
            }
            if (throwin.type === CornerKick.getInstance()) {
                f.findpos2({ x: 0, y: fh2 * throwin.side });
            }
        }
    }
}