/// <reference path="./MovingEntity.ts" />

class SoccerBall extends MovingEntity {
    public w = 2;
    public h = 4;
    public damp = 0.975;
    // damp=0.95,
    public dampair = 0.985;

    constructor() {
        super();
    }

    public draw() {
        spr(44, this.position.x - this.w, this.position.y - this.h - this.position.z);
    }

    public drawshadow() {
        spr(45, this.position.x - this.w + 1, this.position.y - this.h + 1);
    }

    public check_net(prevball: IVector2, goal1: IVector2, goal2: IVector2) {
        let res = segment_intersect(prevball, this.position, goal1, goal2)
        if (res) {
            if (goal1.x === goal2.x) {
                this.velocity.x = -this.velocity.x
            } else {
                this.velocity.y = -this.velocity.y
            }
            //muls_in_place(this.velocity, 0.25)
            this.velocity.multiply(0.25);
            this.position.x = res.x
            this.position.y = res.y
        }
    }

    public update() {
        let game = Game.getInstance();

        let prevball = { x: this.position.x, y: this.position.y };
        //plus_in_place(this.position, this.velocity);
        this.position.add(this.velocity);
        let gravity = 0.1;
        if (this.position.z > 0) {
            this.velocity.z -= gravity;
        } else {
            this.position.z = 0
            if (Math.abs(this.velocity.z) < 2 * gravity) {
                this.velocity.z = 0;
            } else {
                this.velocity.z = Math.abs(this.velocity.z) * 0.5;
                ballsfx();
            }
        }
        this.position.z += this.velocity.z;

        let post1 = { x: goalx1, y: fh2 };
        let post1_ = { x: goalx1, y: fh2 + goalh / 2 };
        let post2 = { x: goalx2, y: fh2 };
        let post2_ = { x: goalx2, y: fh2 + goalh / 2 };
        let fieldw2 = fw2 + border;
        let fieldh2 = fh2 + border;

        if (this.position.y < 0) {
            post1.y = -post1.y;
            post1_.y = -post1_.y;
            post2.y = -post2.y;
            post2_.y = -post2_.y;
        }

        //--goal col
        if (this.position.z <= goall) {
            //--nets
            this.check_net(prevball, post1, post1_);
            this.check_net(prevball, post2, post2_);
            this.check_net(prevball, post1_, post2_);

            //--posts
            check_post(post1, prevball);
            check_post(post2, prevball);
            //--todo check horiz post
        }

        //--touch lines
        if (game.isPlaying() && Math.abs(this.position.x) > fw2) {
            throwin.init_throwin(FieldPlayerStateThrowin.getInstance(), new Vector2(fw2, MathHelper.clamp(Math.abs(this.position.y), -fh2, fh2)), { x: 1, y: 1 }, 1);
        }

        //--scoring_team
        //--todo check ball really entering the goal...
        if (game.isPlaying() &&
            scoring_team === 0 &&
            this.position.z < goall && post1.x < this.position.x && this.position.x < post2.x &&
            fh2 + goalh > Math.abs(this.position.y) && Math.abs(this.position.y) > fh2) {
            scoring_team = side_to_idx(this.position.y > 0 ? 1 : - 1);
            kickoff_team = scoring_team;
            game.score[scoring_team] += 1;
            camlastpos = this.position.toVector2();//copy(this.position);
            game.setState(GameStateGoalmarked.getInstance());
            sfx(0);
            sfx(15);
        }

        //--corner / goal kick
        if (game.isPlaying() && Math.abs(this.position.y) > fh2) {
            throwin.side = -balllasttouchedside;
            if (throwin.side * this.position.y < 0) {
                throwin.init_throwin(CornerKick.getInstance(), new Vector2(fw2, fh2), { x: 1.1, y: 1.03 }, 5);
            } else {
                throwin.init_throwin(Goalkick.getInstance(), new Vector2(rnd(penaltyw2), fh2_penaltyh), { x: 1, y: 1.15 }, 25);
                //--init_throwin(fstate_goalkick, { x=penaltyw2, y=fh2_penaltyh }, { x=1, y=1.15 }, 25)
            }
        }

        //--field borders
        let bd = this.velocity;
        if (this.position.x < -fieldw2) {
            bd.x = Math.abs(bd.x) * 0.5;
            this.position.x = -fieldw2;
        }
        if (this.position.x > fieldw2) {
            bd.x = -Math.abs(bd.x) * 0.5;
            this.position.x = fieldw2;
        }
        if (this.position.y < -fieldh2) {
            bd.y = Math.abs(bd.y) * 0.5;
            this.position.y = -fieldh2;
        }
        if (this.position.y > fieldh2) {
            bd.y = -Math.abs(bd.y) * 0.5;
            this.position.y = fieldh2;
        }

        //--damping
        if (this.position.z < 0.1) {
            damp(this);
        } else {
            //muls_in_place(this.velocity, this.dampair);
            this.velocity.multiply(this.dampair);
        }
        bd.z *= this.damp;
    }
}