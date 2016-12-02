/// <reference path="./PlayerBase.ts" />

class ControllingPlayer {
    constructor(public man: PlayerBase, public num: number, public but = 0, public ai = false) {
    }



    public player_input() {
        let game = Game.getInstance();
        if (this.ai || game.demo) {
            //if (this.man.getState().ai !== undefined)
            this.man.getState().ai(this);
        } else {
            //if (this.man.getState().input !== undefined)
            this.man.getState().input(this);
        }
    }

    public tackle() {
        this.man.set_state(Tackle.getInstance());
    }

    public kick() {
        let game = Game.getInstance();
        //--pass
        let passed = false;
        if (this.but < 5) {
            passed = this.man.pass();
        }

        if (!passed) {
            let kickfactor = 1.0 + 0.1 * this.but;
            //plus_in_place(game.ball.velocity, muls(this.man.dir, kickfactor))
            game.ball.velocity.add(Vector2.multiply(kickfactor, this.man.dir).toVector3());
            Game.getInstance().ball.velocity.z += kickfactor * 0.5;
            balllasttouchedside = this.man.side;
        }

        this.man.justshot = 5;
        ballsfx();
    }

    public button_released() {
        let f = this.man;
        if (f.can_kick()) {
            this.kick();
            balllasttouchedside = f.side;
        } else {
            if (f.justshot === 0) {
                this.tackle();
            }
        }
        this.but = 0;
    }

}