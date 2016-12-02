/// <reference path="../State.ts" />

class Tackle extends State<FieldPlayer> {

    private static instance = new Tackle();

    //this is a singleton
    public static getInstance() {
        return this.instance;
    }

    public start(f: FieldPlayer) {
        f.timer = 45;
        //plus_in_place(f.velocity, muls(f.dir, 3.0));
        let result = Vector2.multiply(3.0, f.dir).toVector3();
        f.velocity.add(result);
    }

    public draw(f: FieldPlayer) {
        let pos = sprite_pos(f);
        jersey_color(f);
        spr(32 + f.lastspr, pos.x, pos.y, 1, 1, f.lastflip);
    }

    public update(f: FieldPlayer) {
        if (checktimer(f)) {
            set_state_ok(f);
        } else {
            damp(f);
            //-- check collision
            for (let m of men) {
                check_tackle(f, m);
            }
        }
    }
}