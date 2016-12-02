/// <reference path="../State.ts" />

class KeeperStateRun extends State<GoalKeeper> {

    private static instance = new KeeperStateRun();

    //this is a singleton
    public static getInstance() {
        return this.instance;
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