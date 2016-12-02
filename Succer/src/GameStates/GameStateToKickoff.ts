/// <reference path="../State.ts" />


class GameStateToKickoff extends State<Game> {

    private static instance = new GameStateToKickoff();

    public timer = 60;

    // this is a singleton
    public static getInstance() {
        return this.instance;
    }

    public init() {
        this.timer = 60;
        for (let m of men) {
            set_state_ok(m);
        }
        //-- keepers
        men[men.length - 1 - 1].set_state(KeeperStateRun.getInstance());
        men[men.length - 1].set_state(KeeperStateRun.getInstance());
    }

    public update(game: Game) {
        // -- scroll to the center of the field
        let l = Math.max(this.timer / 60, 0);
        camtarget = Vector2.multiply(l, camlastpos);//muls(camlastpos, l);

        let to_exit = matchtimer > full_time;

        // --  if (to_exit) plus_in_place(camtarget, muls({ x=fw2, y=0 }, 1 - l))

        let allok = true;
        for (let m of men) {
            let i = m.startposidx;
            //--if not m.keeper then
            let dest = to_exit ? { x: 1, y: 0 } : startpos[i];
            //--    if 2* kickoff_team - 3 == m.side then
            if (idx_to_side(kickoff_team) === m.side && !to_exit) {
                if (i === 1) {
                    dest = { x: 0, y: 0.01 };
                }
                if (i === 2 || i === 3) {
                    dest = { x: dest.x, y: 0.02 };
                }
            }
            let ok = m.run_to(dest.x * fw2, dest.y * m.side * fh2);
            ok = ok && (m.vel < min_vel);
            allok = ok && allok;
            //--    if (ok) look_at(m, ball)
            //--end
        }

        if (checktimer(this) && allok) {
            if (to_exit) {
                game.start_match(true);
            } else {
                //--keepers
                set_state_ok(men[men.length - 1 - 1]);
                set_state_ok(men[men.length - 1]);
                game.setState(Kickoff.getInstance());
            }
        }
    }
}