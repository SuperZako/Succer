

class GoalKeeper extends PlayerBase {
    state: State<GoalKeeper>;

    constructor(p: number, i: number) {
        super();

        this.startposidx = i;
        this.side = p * 2 - 1;
        //this.teamcolors = p + 1;

        this.state = KeeperStateOk.getInstance();
        this.position.y = (p - 0.5) * (fh - 8);
        this.keeper = true;
        this.teamcolors = 0;
    }

    public draw() {
        this.state.draw(this);
    }

    public drawshadow() {
        spr(46, this.position.x - 2, this.position.y - 2)
    }

    public getState() {
        return this.state;
    }


    public set_state(st: State<GoalKeeper>) {
        this.state = st
        if (st !== null && st.start !== undefined) {
            st.start(/*fo*/this);
        }
    }
}