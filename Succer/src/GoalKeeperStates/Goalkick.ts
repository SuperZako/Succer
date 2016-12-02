/// <reference path="../State.ts" />

class Goalkick extends State<GoalKeeper> {

    private static instance = new Goalkick();

    //this is a singleton
    public static getInstance() {
        return this.instance;
    }

    public start() {
        throwin.timer = 35;
        throwin.player.position.x = throwin.pos.x;
        throwin.player.position.y = throwin.pos.y;
        //muls_in_place(throwin_f.velocity, 0)
        throwin.player.velocity.multiply(0);
    }

    public ai(_p: ControllingPlayer) {
        //--todo : move the player
        if (checktimer(throwin)) {
            kick_dir();
            throwin.player.set_state(FieldPlayerStateRunning.getInstance());
        }
    }

    public input(p: ControllingPlayer) {
        if (btn(0, p.num)) {
            throwin.player.velocity.x -= vel_inc;
        }
        if (btn(1, p.num)) {
            throwin.player.velocity.x += vel_inc;
        }
        if (btn(2, p.num)) {
            throwin.player.velocity.y -= vel_inc;
        }
        if (btn(3, p.num)) {
            throwin.player.velocity.y += vel_inc;
        }

        kick_dir();
        if (btn(4, p.num)) {
            throwin.player.set_state(FieldPlayerStateRunning.getInstance());
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

        f.animtimer += f.vel * 0.25
        while (Math.floor(f.animtimer) >= anim_end) {
            f.animtimer -= anim_end;
        }

        let pos = sprite_pos(f);
        spr(animoffset + f.lastspr * animfactor + f.animtimer, pos.x, pos.y, 1, 1, f.lastflip)
    }
}