/// <reference path="../State.ts" />

class Kickoff extends State<Game> {

    private static instance = new Kickoff();

    constructor() {
        super();
    }

    // this is a singleton
    public static getInstance() {
        return this.instance;
    }

    public init(game: Game) {
        let ball = game.ball;
        //muls_in_place(ball.position, 0);
        ball.position.multiply(0);
        //muls_in_place(ball.velocity, 0);
        ball.velocity.multiply(0);
        scoring_team = 0;
        changing_side = false;
        for (let m of men) {
            m.look_at(ball);
        }
    }

    public update(game: Game) {
        //  --debug("kickoff")
        //--wait for the player to kick off
        //--he can't move just kick in the direction he wants
        game.setState(GameStatePlaying.getInstance());

        //--local p = players[kickoff_team]

        //--local dir = { x=0, y=-p.man.side }
        //-- if (btn(0, p.num)) dir.x = -fw
        //-- if (btn(1, p.num)) dir.x = fw
        //--local do_kick= btn(4, p.num)--kickoff_team)

        //-- if (p.ia or demo) do_kick = true --dir.x = rnd(1) <= 0.5 and fw or - fw

        //--look_at(p.man, dir)
        //-- if (do_kick) then
        //--kick(p)
        //--sfx(0)
        //--kickoff_team = 0
        //--ball_thrown(p.man)
        //--end
    }
}