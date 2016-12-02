/// <reference path="../State.ts" />


class Down extends State<FieldPlayer> {

    private static instance = new Down();

    //this is a singleton
    public static getInstance() {
        return this.instance;
    }

    public start(f: FieldPlayer) {
        f.timer = 60;
        if (f.keeper) {
            f.lastspr = 0;
        }
    }

    public draw(f: FieldPlayer) {
        let down_spr = 37;
        let pos = sprite_pos(f);
        jersey_color(f);
        spr(down_spr + f.lastspr, pos.x, pos.y, 1, 1, f.lastflip);
    }

    public update(f: FieldPlayer) {
        if (checktimer(f)) {
            set_state_ok(f);
        } else {
            damp(f);
        }
    }
}