
class Throwin {
    public pos = new Vector2();
    public ballpos = new Vector2();
    public timer = 10;
    public balld = new Vector2();
    public kickmax = 0;
    public dist = 0;


    public player: PlayerBase;

    public side: number;
    public type: State<FieldPlayer>;

    constructor() {
    }

    public init_throwin(t: State<FieldPlayer>, p: Vector2, v: IVector2, m: number) {
        let game = Game.getInstance();
        let ball = game.ball;

        this.type = t;
        this.kickmax = m;
        this.side = -balllasttouchedside;
        this.ballpos = p;
        if (ball.position.x < 0) {
            this.ballpos.x *= -1;
        }
        if (ball.position.y < 0) {
            this.ballpos.y *= -1;
        }
        //throwin.pos = mulv(throwin.ballpos, v);
        this.pos.x = this.ballpos.x * v.x;
        this.pos.y = this.ballpos.y * v.y;

        let idx = side_to_idx(this.side);
        if (t === Goalkick.getInstance()) {
            this.player = men[men.length + idx - 2]; //keeper
            this.player.set_state(KeeperStateRun.getInstance());
        } else {
            this.player = game.controllingPlayers[idx].man;
        }
        this.dist = Vector3.distance({ x: this.pos.x, y: this.pos.y, z: 0 }, this.player.position);
        camlastpos = camtarget.clone(); //copy(camtarget);
        game.setState(GameStateToBallout.getInstance());
        sfx(0);
    }
}

let throwin = new Throwin();