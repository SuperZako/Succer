
/// <reference path="./SoccerBall.ts" />

class Game {

    private static instance = new Game();

    //this is a singleton
    public static getInstance() {
        return this.instance;
    }

    public demo = true;
    public score = [0, 0];
    public state: State<Game>;

    public ball = new SoccerBall();

    public controllingPlayers: ControllingPlayer[] = [];


    private constructor() {
    }

    get_controlled(side: number) {
        return this.controllingPlayers[side_to_idx(side)].man;
    }


    public create_player(_i: number) {
        //this.controllingPlayers.push(new ControllingPlayer(undefined, i));
    }

    public initialize() {
        canvas = <HTMLCanvasElement>document.getElementById("canvas");
        canvas.width = 128;
        canvas.height = 128;


        context = canvas.getContext('2d');


        music(0, 0, 6);
        // this.create_player(0);
        // this.create_player(1);

        let fieldplayercount = 5;
        for (let p = 0; p <= 1; ++p) {
            for (let i = 0; i < fieldplayercount; ++i) {
                let man = new FieldPlayer(p, i); // create_footballer(p, i);
                man.position.x = fw2;
                man.position.y = 0;
                //--			if (p == 0) man.y = -man.y
                //add(men, man)
                men.push(man);
            }
        }

        // fieldplayercount += 1;
        // this.controllingPlayers[0].man = men[0];
        this.controllingPlayers.push(new ControllingPlayer(men[0], 0));
        // this.controllingPlayers[1].man = men[fieldplayercount];
        this.controllingPlayers.push(new ControllingPlayer(men[fieldplayercount], 1));

        //add(men, create_keeper(0, fieldplayercount))
        men.push(new GoalKeeper(0, fieldplayercount));
        //add(men, create_keeper(1, fieldplayercount))
        men.push(new GoalKeeper(1, fieldplayercount));

        this.start_match(true);
    }

    public setState(state: State<Game>) {
        //if (newstate.init !== undefined) {
        state.init(this);
        //}
        this.state = state;
    }

    public isPlaying() {
        return this.state === GameStatePlaying.getInstance();
    }


    public is_throwin() {
        return this.state === GameStateBallin.getInstance();
    }

    start_match(demo: boolean) {
        this.score = [0, 0];
        this.demo = demo;
        matchtimer = 0;
        camlastpos = camtarget.clone();//copy(camtarget)
        scoring_team = 0;
        starting_team = Math.floor(rnd(2));// + 1
        kickoff_team = starting_team;
        this.setState(GameStateToKickoff.getInstance())
    }

    public update() {
        let ball = this.ball;

        ballsfxtime -= 1;
        if (this.isPlaying()) {
            //--time management
            let first_half = !(matchtimer >= half_time);
            if (!this.demo) {
                matchtimer += 1
            }
            if (first_half && matchtimer >= half_time || matchtimer > full_time) {
                changing_side = first_half
                //foreach(men, change_side)
                for (let m of men) {
                    m.change_side();
                }
                camlastpos = camtarget.clone();
                this.setState(GameStateToKickoff.getInstance())
                kickoff_team = 1 - starting_team;
                sfx(matchtimer > full_time ? 1 : 0);
                return;
            }

            dribblen = 0
            //foreach(men, dribble_ball)
            for (let m of men) {
                m.dribble_ball();
            }

            if (dribblen > 0) {
                ball.velocity.x = dribble.x / dribblen;
                ball.velocity.y = dribble.y / dribblen;
                //muls_in_place(dribble, 0)
                dribble.multiply(0);

                //--improving ball control
                if (dribblen === 1) {
                    man_with_ball.stick_ball();
                }

                ball.velocity.clamp(10);
                if (/*clampvec_getlen(ball.velocity, 10) > 1*/ball.velocity.length() > 1) {
                    ballsfx();
                }
            }

            distance_men_ball();
        }


        for (let m of men) {
            damp(m);
        }

        for (let p of this.controllingPlayers) {
            p.player_input();
        }

        for (let m of men) {
            //man_update(m);
            m.update();
        }
        ball.update();

        if (this.is_throwin()) {
            this.controllingPlayers[side_to_idx(throwin.side)].man = throwin.player;
        }
        if (this.state.update !== undefined) {
            this.state.update(this);
        }

        update_cam()

        if (this.demo) {
            if (checktimer(menu)) {
                menu.timer = 10;
                blink = !blink
            }
            if (btnp(0)) {
                mode -= 1;
            }
            if (btnp(1)) {
                mode += 1;
            }
            if (mode < 0) {
                mode = 2;
            }
            if (mode > 2) {
                mode = 0;
            }

            if (btnp(2)) {
                changeshirt(1);
            }
            if (btnp(3)) {
                changeshirt(2);
            }

            if (btn(4)) {
                this.start_match(false);
            }
        }
    }

    public draw() {
        camera();
        rectfill(0, 0, 127, 127, 3);

        camera(camtarget.x - 64, camtarget.y - 64);

        for (let y = -fh2; y <= fh2 - 1; y += 32) {
            rectfill(-fw2, y, fw2, y + 16, 3);
            rectfill(-fw2, y + 16, fw2, y + 32, 11);
        }

        color(7);
        rect(-fw2, -fh2, fw2, fh2);
        line(-fw2, 0, fw2, 0);

        rect(-penaltyw2, -fh2, penaltyw2, -fh2_penaltyh);
        rect(-penaltyw2, fh2, penaltyw2, fh2_penaltyh);

        circ(0, 0, 30);

        palt(3, true);
        palt(0, false);

        let draw_list: BaseGameEntity[] = [];
        draw_list.push(goal_up);
        draw_list.push(this.ball);
        for (let i of men) {
            draw_list.push(i);
        }
        //add(draw_list, goal_down)
        draw_list.push(goal_down);
        bubble_sort(draw_list)

        for (let i of draw_list) {
            i.drawshadow()
        }

        for (let i of draw_list) {
            i.draw();
        }

        draw_marker(this.controllingPlayers[0].man);
        draw_marker(this.controllingPlayers[1].man);

        //-- for i in all(men) do
        //--line(i.x, i.y, i.x + 10 * i.dir.x, i.y + 10 * i.dir.y, 10)
        //-- end

        pal();
        palt();
        camera();

        if (scoring_team !== 0) {
            print_outlined("goal!", 55, 6, 7, 0);
        }
        if (matchtimer > full_time) {
            print_outlined("game over", 47, 16, 7, 0);
        }
        if (changing_side) {
            print_outlined("half time", 47, 16, 7, 0);
        }

        print_outlined(this.score[0].toString(), 116, 1, 12, 0)
        print_outlined("-", 120, 1, 7, 0);
        print_outlined(this.score[1].toString(), 124, 1, 8, 0)
        if (this.demo) {
            menu_offset = Math.max(menu_offset / 2, 1);
        } else {
            menu_offset = Math.min(menu_offset * 2, 128);
            print_outlined(Math.floor(matchtimer / 30).toString(), 1, 122, 7, 0);
        }
        print_outlined("succer", 51 + menu_offset, 40, 7, 0);
        print_mode(0, "player vs player");
        print_mode(1, "player vs cpu");
        print_mode(2, "   cpu vs cpu");
        draw_button(0, 20, 74);
        draw_button(1, 100, 74);
        print_outlined("team colors", 42 + menu_offset, 90, 6, 5);
        draw_button(2, 20, 89);
        draw_button(3, 100, 89);
        if (blink) {
            print_outlined("press z to start", 32 - menu_offset, 110, 6, 5);
        }
    }

    throw_in(dy: number) {
        let ball = this.ball;
        let dx = -1;
        if (throwin.ballpos.x < 0) {
            dx = -dx;
        }
        if (dy !== 0) {
            dx /= 2;
        }
        let power = 3;
        let d = Vector2.normalize(new Vector2(dx, dy));
        //ball.velocity = muls(d, power);
        ball.velocity.set(Vector2.multiply(power, d).toVector3());
        ball.velocity.z = 1.5;
    }

}