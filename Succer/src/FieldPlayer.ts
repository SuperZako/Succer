/// <reference path="./PlayerBase.ts" />

class FieldPlayer extends PlayerBase {
    state: State<FieldPlayer>;// = fstate_ok;

    constructor(p: number, i: number) {
        super();
        this.state = FieldPlayerStateOK.getInstance();
        this.startposidx = i;
        this.side = p * 2 - 1;
        this.teamcolors = p + 1;
    }

    public getState() {
        return this.state;
    }

    public set_state(state: State<FieldPlayer>) {
        this.state = state;
        //if (st !== null && st.start !== undefined)
        state.start(this);
    }

    public draw() {
        //let fo = this;
        this.state.draw(this);
    }

    //public update() {
    //    this.state.update(this);
    //}

    public drawshadow() {
        spr(46, this.position.x - 2, this.position.y - 2);
    }


}