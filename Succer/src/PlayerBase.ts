/// <reference path="./MovingEntity.ts" />
/// <reference path="./math/MathHelper.ts" />

abstract class PlayerBase extends MovingEntity {
    w = 4;
    h = 8;

    vel = 0;
    dir = new Vector2(0, 1);//{ x: 0, y: 1 };
    //prevdir={ x = 0, y = 1 },
    lastspr = 4;
    hasball = false;
    animtimer = 0;
    timer = 0;
    damp = 0.9;
    lastflip = false;
    justshot = 0;
    ball_dist = max_val;
    startposidx: number; // = i;
    side: number; // = p * 2 - 1;
    keeper = false;
    teamcolors: number;//= p + 1;
    skin = Math.floor(rnd(skincolors.length)) /*+ 1*/;



    constructor() {
        super();
    }

    public abstract getState<T>(): State<T>;
    public abstract set_state<T>(st: State<T>): void;
    public abstract draw(): void;

    public abstract drawshadow(): void;

    public update() {
        let game = Game.getInstance();
        //--update state : draw, input or ai
        if (this.getState().update !== undefined) {
            this.getState().update(this);
        }

        //--update position & check borders
        let newposx = this.position.x + this.velocity.x
        let newposy = this.position.y + this.velocity.y
        if (Math.abs(newposx) > fw2 + border) {
            newposx = this.position.x;
            this.velocity.x = 0;
        }
        if (Math.abs(newposy) > fh2 + border) {
            newposy = this.position.y;
            this.velocity.y = 0;
        }
        this.position.x = newposx;
        this.position.y = newposy;

        if (!game.isPlaying()) {
            this.hasball = false;
        }

        //--velocity clamp
        if (this.getState() !== Tackle.getInstance()) {
            //this.vel = clampvec_getlen(this.velocity, this.hasball ? 1.4 : 1.6);
            this.velocity.clamp(this.hasball ? 1.4 : 1.6);
            this.vel = this.velocity.length();
        }
        //-- if (f.vel > min_vel) f.dir = unit(f.d)
        if (this.vel > min_vel) {
            this.dir = Vector3.multiply(1 / this.vel, this.velocity).toVector2();
        }
    }

    public change_side() {
        this.side = -this.side;
    }

    public can_kick() {
        let kickdist = 8
        return this.touch_ball(kickdist);
    }


    public touch_ball(dist: number) {
        let game = Game.getInstance();
        let ball = game.ball;
        let x = this.position.x;
        return (x - dist < ball.position.x && ball.position.x < x + dist && this.position.y - dist < ball.position.y && ball.position.y < this.position.y + dist && ball.position.z < 8)
    }

    public pass() {
        let game = Game.getInstance();
        let ball = game.ball;
        //--find the nearest teammate
        //-- in the right direction
        let maxd = 0;
        let target: IVector2 | undefined = undefined;

        for (let m of men) {
            if (m.side === this.side && !m.keeper && m !== this) {
                let front = 20
                let futm = Vector3.add(m.position, Vector3.multiply(front, m.velocity));
                let dist = Vector3.distance(this.position, { x: futm.x, y: futm.y, z: 0 });
                if (dist < 96) {
                    let relpos = Vector3.subtract(futm, this.position);
                    let dir = Vector2.multiply(1 / dist, relpos);
                    let dirw = Vector2.dot(this.dir, dir);
                    if (dirw > sin22_5) {
                        let distw = MathHelper.clamp(-dist / 32 + 2, 0, 1);
                        let w = dirw * distw;
                        //--todo: add obstruction consideration
                        if (w > maxd && this.is_pass_ok(relpos, dist, dir)) {
                            maxd = w;
                            target = dir;
                        }
                    }
                }
            }
        }

        if (target) {
            //--kick the ball in his direction
            let pass_strength = 3.0;
            //ball.velocity = muls(target, pass_strength);
            ball.velocity.set(Vector2.multiply(pass_strength, target).toVector3());
            ball.velocity.z = 1;
            return true;
        }
        return false;
    }


    public go_to(x: number, y: number, min_dist: number, steps: number) {
        if (Math.abs(this.position.x - x) < min_dist && Math.abs(this.position.y - y) < min_dist) {
            return true
        }

        let tmp = this.position.x + this.velocity.x * steps;
        if (this.position.x < x) {
            if (tmp < x)
                this.velocity.x += vel_inc;
        } else {
            if (tmp > x)
                this.velocity.x -= vel_inc;
        }
        tmp = this.position.y + this.velocity.y * steps
        if (this.position.y < y) {
            if (tmp < y) {
                this.velocity.y += vel_inc;
            }
        } else {
            if (tmp > y) {
                this.velocity.y -= vel_inc;
            }
        }
        return false;
    }

    run_to(x: number, y: number) {
        return this.go_to(x, y, dribbledist - 1, 0)
    }

    public findpos() {
        let game = Game.getInstance();
        let ball = game.ball;

        //-- if not is_controlled(f) then
        if (this !== game.get_controlled(this.side)) {
            //--local futurme = plus(f, muls({ x=f.d.x, y=f.d.y }, 10))
            //--local futurcon = plus(fcon, muls({ x=fcon.d.x, y=fcon.d.y }, 10))
            //--local futurball = plus(ball, muls({ x=ball.d.x, y=ball.d.y }, 10))
            //--local closer= dist_manh(futurme, futurball) < dist_manh(futurcon, futurball)
            //-- if(dist and don or closer) then
            if (game.isPlaying() &&
                this.ball_dist < ball_dist_thres &&
                game.get_controlled(this.side).ball_dist > ball_dist_thres / 2) {
                this.run_to(ball.position.x, ball.position.y);
            } else {
                this.findpos2(ball.position);
            }
        }
    }

    public findpos2(t: IVector2) {
        let game = Game.getInstance();
        if (this === throwin.player) {
            return;
        }

        let dest = attackpos[this.startposidx];
        let sid = 1;
        if (game.is_throwin() && t.x * dest.x < 0) {
            sid = -0.5;
        }

        let x = sid * dest.x * fw2 + t.x / 2;
        //--x = clampsym(x, is_throwin() and fw2/ 2 or fw2)
        x = MathHelper.clamp(x, -fw2, fw2);
        let y = this.side * dest.y * fh2 + t.y;
        y = MathHelper.clamp(y, -fh2 * 0.8, fh2 * 0.8);
        this.run_to(x, y);
    }

    public stick_ball() {
        let ball = Game.getInstance().ball;

        let prevball = ball.position.clone();
        ball.position.multiply(0.8);
        //plus_in_place(ball.position, muls(plus(this.position, muls(this.dir, 3)), 0.2))//-- + lerp to wanted_ball
        ball.position.add(Vector3.multiply(0.2, Vector3.add(this.position, Vector2.multiply(3, this.dir).toVector3())));//-- + lerp to wanted_ball
    }


    public is_pass_ok(_relpos: IVector2, dist: number, dir: IVector2) {
        let game = Game.getInstance();
        if (game.is_throwin()) {
            return true;
        }

        for (let m of men) {
            let side = (m.side !== this.side);
            if (side) {
                let relpos2 = Vector3.subtract(m.position, this.position);
                let dist2 = Math.max(Math.sqrt(Vector2.dot(relpos2, relpos2)), 1);
                let dir2 = { x: relpos2.x / dist2, y: relpos2.y / dist2 };
                if (Vector2.dot(dir, dir2) > cos22_5 && dist2 / dist < 1.1) {
                    return false;
                }
            }
        }
        return true
    }

    public look_at(b: SoccerBall) {
        this.dir = Vector2.normalize(Vector3.subtract(b.position, this.position).toVector2());
        spr_from_dir(this);
    }

    public dribble_ball() {
        if (this.justshot > 0) {
            this.justshot -= 1;
            this.hasball = false;
            return;
        }
        // m.hasball = not m.keeper and touch_ball(m, dribbledist)
        this.hasball = this.touch_ball(dribbledist);
        if (this.hasball) {
            //plus_in_place(dribble, muls(m.velocity, 1.1));
            let v = Vector3.multiply(1.1, this.velocity);
            dribble.add(v.toVector2());
            dribblen += 1;
            balllasttouchedside = this.side;
            man_with_ball = this;
        }
    }

    ball_thrown() {
        let game = Game.getInstance();
        this.lastspr = 2;
        set_state_ok(this);
        balllasttouchedside = this.side;
        this.justshot = 10;
        game.setState(GameStatePlaying.getInstance());
    }
}