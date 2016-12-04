var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector3 = (function () {
    function Vector3(x, y, z) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        this.x = x;
        this.y = y;
        this.z = z;
    }
    Object.defineProperty(Vector3, "Zero", {
        // Returns a Vector2 with all of its components set to zero.
        get: function () {
            return new Vector3();
        },
        enumerable: true,
        configurable: true
    });
    //overload the + operator
    Vector3.add = function (lhs, rhs) {
        var x = lhs.x + rhs.x;
        var y = lhs.y + rhs.y;
        var z = lhs.z + rhs.z;
        return new Vector3(x, y, z);
    };
    //overload the - operator
    Vector3.subtract = function (lhs, rhs) {
        var x = lhs.x - rhs.x;
        var y = lhs.y - rhs.y;
        var z = lhs.z - rhs.z;
        return new Vector3(x, y, z);
    };
    Vector3.multiply = function (lhs, rhs) {
        return new Vector3(lhs * rhs.x, lhs * rhs.y, lhs * rhs.z);
    };
    Vector3.distance = function (vector1, vector2) {
        return Math.sqrt(Vector2.distanceSquared(vector1, vector2));
    };
    Vector3.distanceSquared = function (vector1, vector2) {
        var x = vector1.x - vector2.x;
        var y = vector1.y - vector2.y;
        var z = vector1.z - vector2.z;
        return x * x + y * y + z * z;
    };
    Vector3.prototype.set = function (v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    };
    //we need some overloaded operators
    Vector3.prototype.add = function (rhs) {
        this.x += rhs.x;
        this.y += rhs.y;
        this.z += rhs.z;
        return this;
    };
    Vector3.prototype.multiply = function (rhs) {
        this.x *= rhs;
        this.y *= rhs;
        this.z *= rhs;
        return this;
    };
    /**
     *   returns the length of a 2D vector
     */
    Vector3.prototype.length = function () {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        return Math.sqrt(x * x + y * y + z * z);
    };
    Vector3.prototype.clamp = function (max) {
        var length = this.length();
        if (length > max) {
            var factor = max / length;
            this.multiply(factor);
        }
    };
    Vector3.prototype.toVector2 = function () {
        return new Vector2(this.x, this.y);
    };
    Vector3.prototype.clone = function () {
        return new Vector3(this.x, this.y, this.z);
    };
    return Vector3;
}());
/// <reference path="./math/Vector3.ts" />
var BaseGameEntity = (function () {
    function BaseGameEntity() {
        this.position = new Vector3();
    }
    return BaseGameEntity;
}());
/// <reference path="./BaseGameEntity.ts" />
var MovingEntity = (function (_super) {
    __extends(MovingEntity, _super);
    function MovingEntity() {
        var _this = _super.apply(this, arguments) || this;
        _this.velocity = new Vector3();
        return _this;
    }
    return MovingEntity;
}(BaseGameEntity));
/// <reference path="./MovingEntity.ts" />
var SoccerBall = (function (_super) {
    __extends(SoccerBall, _super);
    function SoccerBall() {
        var _this = _super.call(this) || this;
        _this.w = 2;
        _this.h = 4;
        _this.damp = 0.975;
        // damp=0.95,
        _this.dampair = 0.985;
        return _this;
    }
    SoccerBall.prototype.draw = function () {
        spr(44, this.position.x - this.w, this.position.y - this.h - this.position.z);
    };
    SoccerBall.prototype.drawshadow = function () {
        spr(45, this.position.x - this.w + 1, this.position.y - this.h + 1);
    };
    SoccerBall.prototype.check_net = function (prevball, goal1, goal2) {
        var res = segment_intersect(prevball, this.position, goal1, goal2);
        if (res) {
            if (goal1.x === goal2.x) {
                this.velocity.x = -this.velocity.x;
            }
            else {
                this.velocity.y = -this.velocity.y;
            }
            //muls_in_place(this.velocity, 0.25)
            this.velocity.multiply(0.25);
            this.position.x = res.x;
            this.position.y = res.y;
        }
    };
    SoccerBall.prototype.update = function () {
        var game = Game.getInstance();
        var prevball = { x: this.position.x, y: this.position.y };
        //plus_in_place(this.position, this.velocity);
        this.position.add(this.velocity);
        var gravity = 0.1;
        if (this.position.z > 0) {
            this.velocity.z -= gravity;
        }
        else {
            this.position.z = 0;
            if (Math.abs(this.velocity.z) < 2 * gravity) {
                this.velocity.z = 0;
            }
            else {
                this.velocity.z = Math.abs(this.velocity.z) * 0.5;
                ballsfx();
            }
        }
        this.position.z += this.velocity.z;
        var post1 = { x: goalx1, y: fh2 };
        var post1_ = { x: goalx1, y: fh2 + goalh / 2 };
        var post2 = { x: goalx2, y: fh2 };
        var post2_ = { x: goalx2, y: fh2 + goalh / 2 };
        var fieldw2 = fw2 + border;
        var fieldh2 = fh2 + border;
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
            scoring_team = side_to_idx(this.position.y > 0 ? 1 : -1);
            kickoff_team = scoring_team;
            game.score[scoring_team] += 1;
            camlastpos = this.position.toVector2(); //copy(this.position);
            game.setState(GameStateGoalmarked.getInstance());
            sfx(0);
            sfx(15);
        }
        //--corner / goal kick
        if (game.isPlaying() && Math.abs(this.position.y) > fh2) {
            throwin.side = -balllasttouchedside;
            if (throwin.side * this.position.y < 0) {
                throwin.init_throwin(CornerKick.getInstance(), new Vector2(fw2, fh2), { x: 1.1, y: 1.03 }, 5);
            }
            else {
                throwin.init_throwin(Goalkick.getInstance(), new Vector2(rnd(penaltyw2), fh2_penaltyh), { x: 1, y: 1.15 }, 25);
            }
        }
        //--field borders
        var bd = this.velocity;
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
        }
        else {
            //muls_in_place(this.velocity, this.dampair);
            this.velocity.multiply(this.dampair);
        }
        bd.z *= this.damp;
    };
    return SoccerBall;
}(MovingEntity));
/// <reference path="./SoccerBall.ts" />
var Game = (function () {
    function Game() {
        this.demo = true;
        this.score = [0, 0];
        this.ball = new SoccerBall();
        this.controllingPlayers = [];
    }
    //this is a singleton
    Game.getInstance = function () {
        return this.instance;
    };
    Game.prototype.get_controlled = function (side) {
        return this.controllingPlayers[side_to_idx(side)].man;
    };
    Game.prototype.create_player = function (_i) {
        //this.controllingPlayers.push(new ControllingPlayer(undefined, i));
    };
    Game.prototype.initialize = function () {
        canvas = document.getElementById("canvas");
        canvas.width = 128;
        canvas.height = 128;
        context = canvas.getContext('2d');
        music(0, 0, 6);
        // this.create_player(0);
        // this.create_player(1);
        var fieldplayercount = 5;
        for (var p = 0; p <= 1; ++p) {
            for (var i = 0; i < fieldplayercount; ++i) {
                var man = new FieldPlayer(p, i); // create_footballer(p, i);
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
    };
    Game.prototype.setState = function (state) {
        //if (newstate.init !== undefined) {
        state.init(this);
        //}
        this.state = state;
    };
    Game.prototype.isPlaying = function () {
        return this.state === GameStatePlaying.getInstance();
    };
    Game.prototype.is_throwin = function () {
        return this.state === GameStateBallin.getInstance();
    };
    Game.prototype.start_match = function (demo) {
        this.score = [0, 0];
        this.demo = demo;
        matchtimer = 0;
        camlastpos = camtarget.clone(); //copy(camtarget)
        scoring_team = 0;
        starting_team = Math.floor(rnd(2)); // + 1
        kickoff_team = starting_team;
        this.setState(GameStateToKickoff.getInstance());
    };
    Game.prototype.update = function () {
        var ball = this.ball;
        ballsfxtime -= 1;
        if (this.isPlaying()) {
            //--time management
            var first_half = !(matchtimer >= half_time);
            if (!this.demo) {
                matchtimer += 1;
            }
            if (first_half && matchtimer >= half_time || matchtimer > full_time) {
                changing_side = first_half;
                //foreach(men, change_side)
                for (var _a = 0, men_1 = men; _a < men_1.length; _a++) {
                    var m = men_1[_a];
                    m.change_side();
                }
                camlastpos = camtarget.clone();
                this.setState(GameStateToKickoff.getInstance());
                kickoff_team = 1 - starting_team;
                sfx(matchtimer > full_time ? 1 : 0);
                return;
            }
            dribblen = 0;
            //foreach(men, dribble_ball)
            for (var _b = 0, men_2 = men; _b < men_2.length; _b++) {
                var m = men_2[_b];
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
                if (ball.velocity.length() > 1) {
                    ballsfx();
                }
            }
            distance_men_ball();
        }
        for (var _c = 0, men_3 = men; _c < men_3.length; _c++) {
            var m = men_3[_c];
            damp(m);
        }
        for (var _d = 0, _e = this.controllingPlayers; _d < _e.length; _d++) {
            var p = _e[_d];
            p.player_input();
        }
        for (var _f = 0, men_4 = men; _f < men_4.length; _f++) {
            var m = men_4[_f];
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
        update_cam();
        if (this.demo) {
            if (checktimer(menu)) {
                menu.timer = 10;
                blink = !blink;
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
    };
    Game.prototype.draw = function () {
        camera();
        rectfill(0, 0, 127, 127, 3);
        camera(camtarget.x - 64, camtarget.y - 64);
        for (var y = -fh2; y <= fh2 - 1; y += 32) {
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
        var draw_list = [];
        draw_list.push(goal_up);
        draw_list.push(this.ball);
        for (var _a = 0, men_5 = men; _a < men_5.length; _a++) {
            var i = men_5[_a];
            draw_list.push(i);
        }
        //add(draw_list, goal_down)
        draw_list.push(goal_down);
        bubble_sort(draw_list);
        for (var _b = 0, draw_list_1 = draw_list; _b < draw_list_1.length; _b++) {
            var i = draw_list_1[_b];
            i.drawshadow();
        }
        for (var _c = 0, draw_list_2 = draw_list; _c < draw_list_2.length; _c++) {
            var i = draw_list_2[_c];
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
        print_outlined(this.score[0].toString(), 116, 1, 12, 0);
        print_outlined("-", 120, 1, 7, 0);
        print_outlined(this.score[1].toString(), 124, 1, 8, 0);
        if (this.demo) {
            menu_offset = Math.max(menu_offset / 2, 1);
        }
        else {
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
    };
    Game.prototype.throw_in = function (dy) {
        var ball = this.ball;
        var dx = -1;
        if (throwin.ballpos.x < 0) {
            dx = -dx;
        }
        if (dy !== 0) {
            dx /= 2;
        }
        var power = 3;
        var d = Vector2.normalize(new Vector2(dx, dy));
        //ball.velocity = muls(d, power);
        ball.velocity.set(Vector2.multiply(power, d).toVector3());
        ball.velocity.z = 1.5;
    };
    return Game;
}());
Game.instance = new Game();
/// <reference path="./Game.ts" />
var cnt = 0;
function animate() {
    cnt++;
    requestAnimationFrame(animate);
    if (cnt % 2) {
        //_update();
        Game.getInstance().update();
        //_draw();
        Game.getInstance().draw();
    }
}
window.onload = function () {
    Game.getInstance().initialize();
    //game = new Game();  
    animate();
};
var MathHelper;
(function (MathHelper) {
    MathHelper.EpsilonDouble = 1e-6;
    MathHelper.Pi = Math.PI; // πの値を表します。
    MathHelper.PiOver2 = Math.PI / 2; // πを 2 で割った値 (π/2) を表します。
    MathHelper.PiOver4 = Math.PI / 4; // πを 4 で割った値 (π/4) を表します。
    MathHelper.TwoPi = Math.PI * 2; // pi の 2 倍の値を表します。
    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    MathHelper.clamp = clamp;
})(MathHelper || (MathHelper = {}));
/// <reference path="./MovingEntity.ts" />
/// <reference path="./math/MathHelper.ts" />
var PlayerBase = (function (_super) {
    __extends(PlayerBase, _super);
    function PlayerBase() {
        var _this = _super.call(this) || this;
        _this.w = 4;
        _this.h = 8;
        _this.vel = 0;
        _this.dir = new Vector2(0, 1); //{ x: 0, y: 1 };
        //prevdir={ x = 0, y = 1 },
        _this.lastspr = 4;
        _this.hasball = false;
        _this.animtimer = 0;
        _this.timer = 0;
        _this.damp = 0.9;
        _this.lastflip = false;
        _this.justshot = 0;
        _this.ball_dist = max_val;
        _this.keeper = false;
        _this.skin = Math.floor(rnd(skincolors.length)) /*+ 1*/;
        return _this;
    }
    PlayerBase.prototype.update = function () {
        var game = Game.getInstance();
        //--update state : draw, input or ai
        if (this.getState().update !== undefined) {
            this.getState().update(this);
        }
        //--update position & check borders
        var newposx = this.position.x + this.velocity.x;
        var newposy = this.position.y + this.velocity.y;
        if (Math.abs(newposx) > fw2 + border) {
            newposx = this.position.x;
            this.velocity.x = 0;
        }
        if (Math.abs(newposy) > fh2 + border) {
            newposy = this.position.y;
            this.velocity.y = 0;
        }
        this.position.x = newposx;
        this.position.y = newposy;
        if (!game.isPlaying()) {
            this.hasball = false;
        }
        //--velocity clamp
        if (this.getState() !== Tackle.getInstance()) {
            //this.vel = clampvec_getlen(this.velocity, this.hasball ? 1.4 : 1.6);
            this.velocity.clamp(this.hasball ? 1.4 : 1.6);
            this.vel = this.velocity.length();
        }
        //-- if (f.vel > min_vel) f.dir = unit(f.d)
        if (this.vel > min_vel) {
            this.dir = Vector3.multiply(1 / this.vel, this.velocity).toVector2();
        }
    };
    PlayerBase.prototype.change_side = function () {
        this.side = -this.side;
    };
    PlayerBase.prototype.can_kick = function () {
        var kickdist = 8;
        return this.touch_ball(kickdist);
    };
    PlayerBase.prototype.touch_ball = function (dist) {
        var game = Game.getInstance();
        var ball = game.ball;
        var x = this.position.x;
        return (x - dist < ball.position.x && ball.position.x < x + dist && this.position.y - dist < ball.position.y && ball.position.y < this.position.y + dist && ball.position.z < 8);
    };
    PlayerBase.prototype.pass = function () {
        var game = Game.getInstance();
        var ball = game.ball;
        //--find the nearest teammate
        //-- in the right direction
        var maxd = 0;
        var target = undefined;
        for (var _i = 0, men_6 = men; _i < men_6.length; _i++) {
            var m = men_6[_i];
            if (m.side === this.side && !m.keeper && m !== this) {
                var front = 20;
                var futm = Vector3.add(m.position, Vector3.multiply(front, m.velocity));
                var dist = Vector3.distance(this.position, { x: futm.x, y: futm.y, z: 0 });
                if (dist < 96) {
                    var relpos = Vector3.subtract(futm, this.position);
                    var dir = Vector2.multiply(1 / dist, relpos);
                    var dirw = Vector2.dot(this.dir, dir);
                    if (dirw > sin22_5) {
                        var distw = MathHelper.clamp(-dist / 32 + 2, 0, 1);
                        var w = dirw * distw;
                        //--todo: add obstruction consideration
                        if (w > maxd && this.is_pass_ok(relpos, dist, dir)) {
                            maxd = w;
                            target = dir;
                        }
                    }
                }
            }
        }
        if (target) {
            //--kick the ball in his direction
            var pass_strength = 3.0;
            //ball.velocity = muls(target, pass_strength);
            ball.velocity.set(Vector2.multiply(pass_strength, target).toVector3());
            ball.velocity.z = 1;
            return true;
        }
        return false;
    };
    PlayerBase.prototype.go_to = function (x, y, min_dist, steps) {
        if (Math.abs(this.position.x - x) < min_dist && Math.abs(this.position.y - y) < min_dist) {
            return true;
        }
        var tmp = this.position.x + this.velocity.x * steps;
        if (this.position.x < x) {
            if (tmp < x)
                this.velocity.x += vel_inc;
        }
        else {
            if (tmp > x)
                this.velocity.x -= vel_inc;
        }
        tmp = this.position.y + this.velocity.y * steps;
        if (this.position.y < y) {
            if (tmp < y) {
                this.velocity.y += vel_inc;
            }
        }
        else {
            if (tmp > y) {
                this.velocity.y -= vel_inc;
            }
        }
        return false;
    };
    PlayerBase.prototype.run_to = function (x, y) {
        return this.go_to(x, y, dribbledist - 1, 0);
    };
    PlayerBase.prototype.findpos = function () {
        var game = Game.getInstance();
        var ball = game.ball;
        //-- if not is_controlled(f) then
        if (this !== game.get_controlled(this.side)) {
            //--local futurme = plus(f, muls({ x=f.d.x, y=f.d.y }, 10))
            //--local futurcon = plus(fcon, muls({ x=fcon.d.x, y=fcon.d.y }, 10))
            //--local futurball = plus(ball, muls({ x=ball.d.x, y=ball.d.y }, 10))
            //--local closer= dist_manh(futurme, futurball) < dist_manh(futurcon, futurball)
            //-- if(dist and don or closer) then
            if (game.isPlaying() &&
                this.ball_dist < ball_dist_thres &&
                game.get_controlled(this.side).ball_dist > ball_dist_thres / 2) {
                this.run_to(ball.position.x, ball.position.y);
            }
            else {
                this.findpos2(ball.position);
            }
        }
    };
    PlayerBase.prototype.findpos2 = function (t) {
        var game = Game.getInstance();
        if (this === throwin.player) {
            return;
        }
        var dest = attackpos[this.startposidx];
        var sid = 1;
        if (game.is_throwin() && t.x * dest.x < 0) {
            sid = -0.5;
        }
        var x = sid * dest.x * fw2 + t.x / 2;
        //--x = clampsym(x, is_throwin() and fw2/ 2 or fw2)
        x = MathHelper.clamp(x, -fw2, fw2);
        var y = this.side * dest.y * fh2 + t.y;
        y = MathHelper.clamp(y, -fh2 * 0.8, fh2 * 0.8);
        this.run_to(x, y);
    };
    PlayerBase.prototype.stick_ball = function () {
        var ball = Game.getInstance().ball;
        var prevball = ball.position.clone();
        ball.position.multiply(0.8);
        //plus_in_place(ball.position, muls(plus(this.position, muls(this.dir, 3)), 0.2))//-- + lerp to wanted_ball
        ball.position.add(Vector3.multiply(0.2, Vector3.add(this.position, Vector2.multiply(3, this.dir).toVector3()))); //-- + lerp to wanted_ball
    };
    PlayerBase.prototype.is_pass_ok = function (_relpos, dist, dir) {
        var game = Game.getInstance();
        if (game.is_throwin()) {
            return true;
        }
        for (var _i = 0, men_7 = men; _i < men_7.length; _i++) {
            var m = men_7[_i];
            var side = (m.side !== this.side);
            if (side) {
                var relpos2 = Vector3.subtract(m.position, this.position);
                var dist2 = Math.max(Math.sqrt(Vector2.dot(relpos2, relpos2)), 1);
                var dir2 = { x: relpos2.x / dist2, y: relpos2.y / dist2 };
                if (Vector2.dot(dir, dir2) > cos22_5 && dist2 / dist < 1.1) {
                    return false;
                }
            }
        }
        return true;
    };
    PlayerBase.prototype.look_at = function (b) {
        this.dir = Vector2.normalize(Vector3.subtract(b.position, this.position).toVector2());
        spr_from_dir(this);
    };
    PlayerBase.prototype.dribble_ball = function () {
        if (this.justshot > 0) {
            this.justshot -= 1;
            this.hasball = false;
            return;
        }
        // m.hasball = not m.keeper and touch_ball(m, dribbledist)
        this.hasball = this.touch_ball(dribbledist);
        if (this.hasball) {
            //plus_in_place(dribble, muls(m.velocity, 1.1));
            var v = Vector3.multiply(1.1, this.velocity);
            dribble.add(v.toVector2());
            dribblen += 1;
            balllasttouchedside = this.side;
            man_with_ball = this;
        }
    };
    PlayerBase.prototype.ball_thrown = function () {
        var game = Game.getInstance();
        this.lastspr = 2;
        set_state_ok(this);
        balllasttouchedside = this.side;
        this.justshot = 10;
        game.setState(GameStatePlaying.getInstance());
    };
    return PlayerBase;
}(MovingEntity));
/// <reference path="./PlayerBase.ts" />
var ControllingPlayer = (function () {
    function ControllingPlayer(man, num, but, ai) {
        if (but === void 0) { but = 0; }
        if (ai === void 0) { ai = false; }
        this.man = man;
        this.num = num;
        this.but = but;
        this.ai = ai;
    }
    ControllingPlayer.prototype.player_input = function () {
        var game = Game.getInstance();
        if (this.ai || game.demo) {
            //if (this.man.getState().ai !== undefined)
            this.man.getState().ai(this);
        }
        else {
            //if (this.man.getState().input !== undefined)
            this.man.getState().input(this);
        }
    };
    ControllingPlayer.prototype.tackle = function () {
        this.man.set_state(Tackle.getInstance());
    };
    ControllingPlayer.prototype.kick = function () {
        var game = Game.getInstance();
        //--pass
        var passed = false;
        if (this.but < 5) {
            passed = this.man.pass();
        }
        if (!passed) {
            var kickfactor = 1.0 + 0.1 * this.but;
            //plus_in_place(game.ball.velocity, muls(this.man.dir, kickfactor))
            game.ball.velocity.add(Vector2.multiply(kickfactor, this.man.dir).toVector3());
            Game.getInstance().ball.velocity.z += kickfactor * 0.5;
            balllasttouchedside = this.man.side;
        }
        this.man.justshot = 5;
        ballsfx();
    };
    ControllingPlayer.prototype.button_released = function () {
        var f = this.man;
        if (f.can_kick()) {
            this.kick();
            balllasttouchedside = f.side;
        }
        else {
            if (f.justshot === 0) {
                this.tackle();
            }
        }
        this.but = 0;
    };
    return ControllingPlayer;
}());
/// <reference path="./PlayerBase.ts" />
var FieldPlayer = (function (_super) {
    __extends(FieldPlayer, _super);
    function FieldPlayer(p, i) {
        var _this = _super.call(this) || this;
        _this.state = FieldPlayerStateOK.getInstance();
        _this.startposidx = i;
        _this.side = p * 2 - 1;
        _this.teamcolors = p + 1;
        return _this;
    }
    FieldPlayer.prototype.getState = function () {
        return this.state;
    };
    FieldPlayer.prototype.set_state = function (state) {
        this.state = state;
        //if (st !== null && st.start !== undefined)
        state.start(this);
    };
    FieldPlayer.prototype.draw = function () {
        //let fo = this;
        this.state.draw(this);
    };
    //public update() {
    //    this.state.update(this);
    //}
    FieldPlayer.prototype.drawshadow = function () {
        spr(46, this.position.x - 2, this.position.y - 2);
    };
    return FieldPlayer;
}(PlayerBase));
var State = (function () {
    function State() {
    }
    State.prototype.init = function (_e) { };
    State.prototype.draw = function (_e) { };
    State.prototype.update = function (_e) { };
    State.prototype.ai = function (_e) { };
    State.prototype.start = function (_e) { };
    State.prototype.input = function (_e) { };
    return State;
}());
/// <reference path="../State.ts" />
var CornerKick = (function (_super) {
    __extends(CornerKick, _super);
    function CornerKick() {
        return _super.apply(this, arguments) || this;
    }
    //this is a singleton
    CornerKick.getInstance = function () {
        return this.instance;
    };
    CornerKick.prototype.start = function () {
        throwin.timer = 35;
        throwin.player.position.x = throwin.pos.x;
        throwin.player.position.y = throwin.pos.y;
        //muls_in_place(throwin_f.velocity, 0);
        throwin.player.velocity.set(Vector3.Zero);
    };
    CornerKick.prototype.ai = function (_p) {
        //--todo : move the player
        if (checktimer(throwin)) {
            kick_dir();
            throwin.player.set_state(FieldPlayerStateRunning.getInstance());
        }
    };
    CornerKick.prototype.input = function (p) {
        if (btn(0, p.num)) {
            throwin.player.velocity.x -= vel_inc;
        }
        if (btn(1, p.num)) {
            throwin.player.velocity.x += vel_inc;
        }
        if (btn(2, p.num)) {
            throwin.player.velocity.y -= vel_inc;
        }
        if (btn(3, p.num)) {
            throwin.player.velocity.y += vel_inc;
        }
        kick_dir();
        if (btn(4, p.num)) {
            throwin.player.set_state(FieldPlayerStateRunning.getInstance());
        }
    };
    CornerKick.prototype.draw = function (f) {
        var animfactor = 1;
        var animoffset = 20;
        var anim_end = 1;
        jersey_color(f);
        if (f.vel > min_vel) {
            animfactor = 4;
            animoffset = 0;
            anim_end = 4;
            spr_from_dir(f);
        }
        f.animtimer += f.vel * 0.25;
        while (Math.floor(f.animtimer) >= anim_end) {
            f.animtimer -= anim_end;
        }
        var pos = sprite_pos(f);
        spr(animoffset + f.lastspr * animfactor + f.animtimer, pos.x, pos.y, 1, 1, f.lastflip);
    };
    return CornerKick;
}(State));
CornerKick.instance = new CornerKick();
/// <reference path="../State.ts" />
var Down = (function (_super) {
    __extends(Down, _super);
    function Down() {
        return _super.apply(this, arguments) || this;
    }
    //this is a singleton
    Down.getInstance = function () {
        return this.instance;
    };
    Down.prototype.start = function (f) {
        f.timer = 60;
        if (f.keeper) {
            f.lastspr = 0;
        }
    };
    Down.prototype.draw = function (f) {
        var down_spr = 37;
        var pos = sprite_pos(f);
        jersey_color(f);
        spr(down_spr + f.lastspr, pos.x, pos.y, 1, 1, f.lastflip);
    };
    Down.prototype.update = function (f) {
        if (checktimer(f)) {
            set_state_ok(f);
        }
        else {
            damp(f);
        }
    };
    return Down;
}(State));
Down.instance = new Down();
/// <reference path="../State.ts" />
var FieldPlayerStateOK = (function (_super) {
    __extends(FieldPlayerStateOK, _super);
    function FieldPlayerStateOK() {
        return _super.apply(this, arguments) || this;
    }
    //this is a singleton
    FieldPlayerStateOK.getInstance = function () {
        return this.instance;
    };
    FieldPlayerStateOK.prototype.ai = function (p) {
        var game = Game.getInstance();
        var ball = game.ball;
        var f = p.man;
        if (f === null) {
            return;
        }
        //-- if (is_throwin()) findpos2(f, ball)
        if (game.is_throwin()) {
            f.findpos2({ x: 0, y: 0 });
        }
        if (game.isPlaying()) {
            //-- if running after the ball and it's going to leave the field on the throwin side
            //-- and a team mate is in front of the ball... let him handle the situation
            if ((f.hasball || f.run_to(ball.position.x, ball.position.y)) && ball.position.z < 8 && f.justshot <= 0) {
                //-- try to shoot
                var goal = { x: 0, y: f.side * fh2 };
                if (dist_manh(goal, f.position) < 75) {
                    f.dir = Vector2.normalize(Vector2.subtract(goal, f.position.toVector2()));
                    p.but = rnd(max_kick / 2) + max_kick / 3;
                    p.kick();
                    return;
                }
                //-- try to pass
                if (!f.pass()) {
                    //-- try to get near the goal
                    if (f.hasball) {
                        var togoal = Vector2.subtract(goal, f.position); //--unit(minus(goal, f))
                        if (Vector2.dot(f.dir, togoal) < sin22_5) {
                            var side = { x: -f.dir.y, y: f.dir.x };
                            var turn = Vector3.add(f.position, Vector2.multiply(35, side).toVector3());
                            f.run_to(turn.x, turn.y);
                        }
                        else {
                            f.run_to(0, goal.y * 0.75);
                        }
                    }
                }
            }
        }
    };
    FieldPlayerStateOK.prototype.input = function (p) {
        var game = Game.getInstance();
        if (p.man == null || (!game.isPlaying() && !game.is_throwin())) {
            return;
        }
        var man = p.man;
        if (btn(0, p.num)) {
            man.velocity.x -= vel_inc;
        }
        if (btn(1, p.num)) {
            man.velocity.x += vel_inc;
        }
        if (btn(2, p.num)) {
            man.velocity.y -= vel_inc;
        }
        if (btn(3, p.num)) {
            man.velocity.y += vel_inc;
        }
        if (game.isPlaying()) {
            if (btn(4, p.num)) {
                p.but += 1;
                if (p.but >= max_kick) {
                    p.button_released();
                }
            }
            else {
                if (p.but > 0) {
                    p.button_released();
                }
            }
        }
    };
    FieldPlayerStateOK.prototype.draw = function (f) {
        var animfactor = 1;
        var animoffset = 20;
        var anim_end = 1;
        jersey_color(f);
        if (f.vel > min_vel) {
            animfactor = 4;
            animoffset = 0;
            anim_end = 4;
            spr_from_dir(f);
        }
        f.animtimer += f.vel * 0.25;
        while (Math.floor(f.animtimer) >= anim_end) {
            f.animtimer -= anim_end;
        }
        var pos = sprite_pos(f);
        spr(animoffset + f.lastspr * animfactor + f.animtimer, pos.x, pos.y, 1, 1, f.lastflip);
    };
    FieldPlayerStateOK.prototype.update = function (f) {
        var game = Game.getInstance();
        if (game.isPlaying()) {
            f.findpos();
        }
        if (game.is_throwin() || game.state === GameStateToBallout.getInstance()) {
            if (throwin.type === FieldPlayerStateThrowin.getInstance()) {
                f.findpos();
            }
            if (throwin.type === Goalkick.getInstance()) {
                f.findpos2({ x: 0, y: 0 });
            }
            if (throwin.type === CornerKick.getInstance()) {
                f.findpos2({ x: 0, y: fh2 * throwin.side });
            }
        }
    };
    return FieldPlayerStateOK;
}(State));
FieldPlayerStateOK.instance = new FieldPlayerStateOK();
/// <reference path="../State.ts" />
var FieldPlayerStateRunning = (function (_super) {
    __extends(FieldPlayerStateRunning, _super);
    function FieldPlayerStateRunning() {
        return _super.apply(this, arguments) || this;
    }
    //this is a singleton
    FieldPlayerStateRunning.getInstance = function () {
        return this.instance;
    };
    FieldPlayerStateRunning.prototype.ai = function (_p) {
        if (throwin.player.run_to(throwin.ballpos.x, throwin.ballpos.y)) {
            var game = Game.getInstance();
            var ball = game.ball;
            throwin.player.ball_thrown();
            ball.velocity.x = throwin.balld.x;
            ball.velocity.y = throwin.balld.y;
            ball.velocity.z = 5;
        }
    };
    FieldPlayerStateRunning.prototype.input = function (_p) {
        var game = Game.getInstance();
        if (throwin.player.run_to(throwin.ballpos.x, throwin.ballpos.y)) {
            var ball = game.ball;
            throwin.player.ball_thrown();
            ball.velocity.x = throwin.balld.x;
            ball.velocity.y = throwin.balld.y;
            ball.velocity.z = 5;
        }
    };
    FieldPlayerStateRunning.prototype.draw = function (f) {
        var animfactor = 1;
        var animoffset = 20;
        var anim_end = 1;
        jersey_color(f);
        if (f.vel > min_vel) {
            animfactor = 4;
            animoffset = 0;
            anim_end = 4;
            spr_from_dir(f);
        }
        f.animtimer += f.vel * 0.25;
        while (Math.floor(f.animtimer) >= anim_end) {
            f.animtimer -= anim_end;
        }
        var pos = sprite_pos(f);
        spr(animoffset + f.lastspr * animfactor + f.animtimer, pos.x, pos.y, 1, 1, f.lastflip);
    };
    return FieldPlayerStateRunning;
}(State));
FieldPlayerStateRunning.instance = new FieldPlayerStateRunning();
/// <reference path="../State.ts" />
var FieldPlayerStateThrowin = (function (_super) {
    __extends(FieldPlayerStateThrowin, _super);
    function FieldPlayerStateThrowin() {
        return _super.apply(this, arguments) || this;
    }
    //this is a singleton
    FieldPlayerStateThrowin.getInstance = function () {
        return this.instance;
    };
    FieldPlayerStateThrowin.prototype.start = function () {
        throwin.timer = 35;
        throwin.player.position.x = throwin.pos.x;
        throwin.player.position.y = throwin.pos.y;
        //muls_in_place(throwin_f.velocity, 0)
        throwin.player.velocity = Vector3.Zero; //.multiply(0);
    };
    FieldPlayerStateThrowin.prototype.ai = function (p) {
        var game = Game.getInstance();
        var ball = game.ball;
        var f = p.man;
        var dy = 0;
        if (ball.position.y * f.side > 0) {
            dy = -2;
        }
        else {
            if (ball.position.y * f.side > -fh2 / 2) {
                dy = -1;
            }
        }
        dy *= f.side;
        if (checktimer(throwin)) {
            game.throw_in(dy);
            f.ball_thrown();
            return;
        }
        f.lastspr = 2 + dy;
        if (f.pass()) {
            f.ball_thrown();
        }
    };
    FieldPlayerStateThrowin.prototype.input = function (p) {
        var game = Game.getInstance();
        var dy = 0;
        if (btn(2, p.num)) {
            dy -= 2;
        }
        if (btn(3, p.num)) {
            dy += 2;
        }
        if ((btn(0, p.num) || btn(1, p.num))) {
            dy /= 2;
        }
        p.man.lastspr = 2 + dy;
        if (btn(4, p.num)) {
            //--if (not pass(p.man)) throw_in(dy)
            game.throw_in(dy);
            p.man.ball_thrown();
        }
    };
    FieldPlayerStateThrowin.prototype.draw = function (f) {
        var game = Game.getInstance();
        var ball = game.ball;
        jersey_color(f);
        var pos = sprite_pos(f);
        f.lastflip = f.position.x > 0;
        spr(48 + f.lastspr, pos.x, pos.y, 1, 1, f.lastflip);
        ball.position.x = f.position.x;
        ball.position.y = f.position.y;
        ball.position.z = 7;
        ball.velocity.z = 0;
    };
    return FieldPlayerStateThrowin;
}(State));
FieldPlayerStateThrowin.instance = new FieldPlayerStateThrowin();
/// <reference path="../State.ts" />
var Tackle = (function (_super) {
    __extends(Tackle, _super);
    function Tackle() {
        return _super.apply(this, arguments) || this;
    }
    //this is a singleton
    Tackle.getInstance = function () {
        return this.instance;
    };
    Tackle.prototype.start = function (f) {
        f.timer = 45;
        //plus_in_place(f.velocity, muls(f.dir, 3.0));
        var result = Vector2.multiply(3.0, f.dir).toVector3();
        f.velocity.add(result);
    };
    Tackle.prototype.draw = function (f) {
        var pos = sprite_pos(f);
        jersey_color(f);
        spr(32 + f.lastspr, pos.x, pos.y, 1, 1, f.lastflip);
    };
    Tackle.prototype.update = function (f) {
        if (checktimer(f)) {
            set_state_ok(f);
        }
        else {
            damp(f);
            //-- check collision
            for (var _i = 0, men_8 = men; _i < men_8.length; _i++) {
                var m = men_8[_i];
                check_tackle(f, m);
            }
        }
    };
    return Tackle;
}(State));
Tackle.instance = new Tackle();
/// <reference path="../State.ts" />
var GameStateBallin = (function (_super) {
    __extends(GameStateBallin, _super);
    function GameStateBallin() {
        return _super.apply(this, arguments) || this;
    }
    //this is a singleton
    GameStateBallin.getInstance = function () {
        return this.instance;
    };
    GameStateBallin.prototype.init = function (game) {
        var ball = game.ball;
        ball.position.x = throwin.ballpos.x;
        ball.position.y = throwin.ballpos.y;
        //muls_in_place(ball.velocity, 0);
        ball.velocity.multiply(0);
        throwin.player.set_state(throwin.type);
    };
    return GameStateBallin;
}(State));
GameStateBallin.instance = new GameStateBallin();
/// <reference path="../State.ts" />
var GameStateGoalmarked = (function (_super) {
    __extends(GameStateGoalmarked, _super);
    function GameStateGoalmarked() {
        var _this = _super.apply(this, arguments) || this;
        _this.timer = 60;
        return _this;
    }
    // this is a singleton
    GameStateGoalmarked.getInstance = function () {
        return this.instance;
    };
    GameStateGoalmarked.prototype.init = function () {
        this.timer = 60;
    };
    GameStateGoalmarked.prototype.update = function (game) {
        if (checktimer(this)) {
            game.setState(GameStateToKickoff.getInstance());
        }
    };
    return GameStateGoalmarked;
}(State));
GameStateGoalmarked.instance = new GameStateGoalmarked();
/// <reference path="../State.ts" />
var GameStatePlaying = (function (_super) {
    __extends(GameStatePlaying, _super);
    function GameStatePlaying() {
        return _super.apply(this, arguments) || this;
    }
    //this is a singleton
    GameStatePlaying.getInstance = function () {
        return this.instance;
    };
    GameStatePlaying.prototype.init = function (game) {
        game.controllingPlayers[0].ai = (mode === 2);
        game.controllingPlayers[1].ai = (mode > 0);
    };
    return GameStatePlaying;
}(State));
GameStatePlaying.instance = new GameStatePlaying();
/// <reference path="../State.ts" />
var GameStateToBallout = (function (_super) {
    __extends(GameStateToBallout, _super);
    function GameStateToBallout() {
        return _super.apply(this, arguments) || this;
    }
    //this is a singleton
    GameStateToBallout.getInstance = function () {
        return this.instance;
    };
    GameStateToBallout.prototype.update = function (game) {
        //-- todo : tout le monde se met en place
        var l = Vector3.distance(throwin.player.position, { x: throwin.pos.x, y: throwin.pos.y, z: 0 }) / throwin.dist;
        camtarget = Vector2.add(Vector2.multiply(1 - l, throwin.ballpos), Vector2.multiply(l, camlastpos));
        if (throwin.player.go_to(throwin.pos.x, throwin.pos.y, 2, 10)) {
            game.setState(GameStateBallin.getInstance());
        }
    };
    return GameStateToBallout;
}(State));
GameStateToBallout.instance = new GameStateToBallout();
/// <reference path="../State.ts" />
var GameStateToKickoff = (function (_super) {
    __extends(GameStateToKickoff, _super);
    function GameStateToKickoff() {
        var _this = _super.apply(this, arguments) || this;
        _this.timer = 60;
        return _this;
    }
    // this is a singleton
    GameStateToKickoff.getInstance = function () {
        return this.instance;
    };
    GameStateToKickoff.prototype.init = function () {
        this.timer = 60;
        for (var _i = 0, men_9 = men; _i < men_9.length; _i++) {
            var m = men_9[_i];
            set_state_ok(m);
        }
        //-- keepers
        men[men.length - 1 - 1].set_state(KeeperStateRun.getInstance());
        men[men.length - 1].set_state(KeeperStateRun.getInstance());
    };
    GameStateToKickoff.prototype.update = function (game) {
        // -- scroll to the center of the field
        var l = Math.max(this.timer / 60, 0);
        camtarget = Vector2.multiply(l, camlastpos); //muls(camlastpos, l);
        var to_exit = matchtimer > full_time;
        // --  if (to_exit) plus_in_place(camtarget, muls({ x=fw2, y=0 }, 1 - l))
        var allok = true;
        for (var _i = 0, men_10 = men; _i < men_10.length; _i++) {
            var m = men_10[_i];
            var i = m.startposidx;
            //--if not m.keeper then
            var dest = to_exit ? { x: 1, y: 0 } : startpos[i];
            //--    if 2* kickoff_team - 3 == m.side then
            if (idx_to_side(kickoff_team) === m.side && !to_exit) {
                if (i === 1) {
                    dest = { x: 0, y: 0.01 };
                }
                if (i === 2 || i === 3) {
                    dest = { x: dest.x, y: 0.02 };
                }
            }
            var ok = m.run_to(dest.x * fw2, dest.y * m.side * fh2);
            ok = ok && (m.vel < min_vel);
            allok = ok && allok;
        }
        if (checktimer(this) && allok) {
            if (to_exit) {
                game.start_match(true);
            }
            else {
                //--keepers
                set_state_ok(men[men.length - 1 - 1]);
                set_state_ok(men[men.length - 1]);
                game.setState(Kickoff.getInstance());
            }
        }
    };
    return GameStateToKickoff;
}(State));
GameStateToKickoff.instance = new GameStateToKickoff();
/// <reference path="../State.ts" />
var Kickoff = (function (_super) {
    __extends(Kickoff, _super);
    function Kickoff() {
        return _super.call(this) || this;
    }
    // this is a singleton
    Kickoff.getInstance = function () {
        return this.instance;
    };
    Kickoff.prototype.init = function (game) {
        var ball = game.ball;
        //muls_in_place(ball.position, 0);
        ball.position.multiply(0);
        //muls_in_place(ball.velocity, 0);
        ball.velocity.multiply(0);
        scoring_team = 0;
        changing_side = false;
        for (var _i = 0, men_11 = men; _i < men_11.length; _i++) {
            var m = men_11[_i];
            m.look_at(ball);
        }
    };
    Kickoff.prototype.update = function (game) {
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
    };
    return Kickoff;
}(State));
Kickoff.instance = new Kickoff();
var GoalDown = (function (_super) {
    __extends(GoalDown, _super);
    //public y = fh2 + goalh;
    function GoalDown() {
        var _this = _super.call(this) || this;
        _this.position.y = fh2 + goalh;
        return _this;
    }
    GoalDown.prototype.draw = function () {
        //spr(60, goalx2, fh2, 1, 1, false, true)
        color(7);
        rect(goalx1, -goall + fh2, goalx2, fh2);
        clip(goalx1 - camtarget.x + 64 + 1, -goall - camtarget.y + 64 + fh2 + 1, goalx2 - goalx1 - 1, goalh - 1);
        for (var x = goalx1; x <= goalx2 + 7; x += 8) {
            for (var y = -goall; y <= goall; y += 8) {
            }
        }
        clip();
    };
    GoalDown.prototype.drawshadow = function () {
    };
    return GoalDown;
}(BaseGameEntity));
var goal_down = new GoalDown();
var GoalKeeper = (function (_super) {
    __extends(GoalKeeper, _super);
    function GoalKeeper(p, i) {
        var _this = _super.call(this) || this;
        _this.startposidx = i;
        _this.side = p * 2 - 1;
        //this.teamcolors = p + 1;
        _this.state = KeeperStateOk.getInstance();
        _this.position.y = (p - 0.5) * (fh - 8);
        _this.keeper = true;
        _this.teamcolors = 0;
        return _this;
    }
    GoalKeeper.prototype.draw = function () {
        this.state.draw(this);
    };
    GoalKeeper.prototype.drawshadow = function () {
        spr(46, this.position.x - 2, this.position.y - 2);
    };
    GoalKeeper.prototype.getState = function () {
        return this.state;
    };
    GoalKeeper.prototype.set_state = function (st) {
        this.state = st;
        if (st !== null && st.start !== undefined) {
            st.start(/*fo*/ this);
        }
    };
    return GoalKeeper;
}(PlayerBase));
/// <reference path="../State.ts" />
var Goalkick = (function (_super) {
    __extends(Goalkick, _super);
    function Goalkick() {
        return _super.apply(this, arguments) || this;
    }
    //this is a singleton
    Goalkick.getInstance = function () {
        return this.instance;
    };
    Goalkick.prototype.start = function () {
        throwin.timer = 35;
        throwin.player.position.x = throwin.pos.x;
        throwin.player.position.y = throwin.pos.y;
        //muls_in_place(throwin_f.velocity, 0)
        throwin.player.velocity.multiply(0);
    };
    Goalkick.prototype.ai = function (_p) {
        //--todo : move the player
        if (checktimer(throwin)) {
            kick_dir();
            throwin.player.set_state(FieldPlayerStateRunning.getInstance());
        }
    };
    Goalkick.prototype.input = function (p) {
        if (btn(0, p.num)) {
            throwin.player.velocity.x -= vel_inc;
        }
        if (btn(1, p.num)) {
            throwin.player.velocity.x += vel_inc;
        }
        if (btn(2, p.num)) {
            throwin.player.velocity.y -= vel_inc;
        }
        if (btn(3, p.num)) {
            throwin.player.velocity.y += vel_inc;
        }
        kick_dir();
        if (btn(4, p.num)) {
            throwin.player.set_state(FieldPlayerStateRunning.getInstance());
        }
    };
    Goalkick.prototype.draw = function (f) {
        var animfactor = 1;
        var animoffset = 20;
        var anim_end = 1;
        jersey_color(f);
        if (f.vel > min_vel) {
            animfactor = 4;
            animoffset = 0;
            anim_end = 4;
            spr_from_dir(f);
        }
        f.animtimer += f.vel * 0.25;
        while (Math.floor(f.animtimer) >= anim_end) {
            f.animtimer -= anim_end;
        }
        var pos = sprite_pos(f);
        spr(animoffset + f.lastspr * animfactor + f.animtimer, pos.x, pos.y, 1, 1, f.lastflip);
    };
    return Goalkick;
}(State));
Goalkick.instance = new Goalkick();
/// <reference path="../State.ts" />
var KeeperStateDive = (function (_super) {
    __extends(KeeperStateDive, _super);
    function KeeperStateDive() {
        return _super.apply(this, arguments) || this;
    }
    //this is a singleton
    KeeperStateDive.getInstance = function () {
        return this.instance;
    };
    KeeperStateDive.prototype.draw = function (k) {
        jersey_color(k);
        var pos = sprite_pos(k);
        spr(k.lastspr, pos.x, pos.y, 1, 1, k.velocity.x < 0);
    };
    KeeperStateDive.prototype.start = function (k) {
        k.timer = 30;
    };
    KeeperStateDive.prototype.update = function (k) {
        var game = Game.getInstance();
        k.lastspr = k.timer > 25 ? 55 : 56;
        if (checktimer(k)) {
            k.lastspr = 0;
            k.set_state(KeeperStateOk.getInstance());
            return;
        }
        if (k.touch_ball(5) && game.isPlaying()) {
            game.ball.velocity.y = 3.0 * (-k.position.y / Math.abs(k.position.y));
            game.ball.velocity.x += k.velocity.x;
            sfx(15);
            balllasttouchedside = k.side;
        }
    };
    return KeeperStateDive;
}(State));
KeeperStateDive.instance = new KeeperStateDive();
/// <reference path="../State.ts" />
/// <reference path="../math/MathHelper.ts" />
var KeeperStateOk = (function (_super) {
    __extends(KeeperStateOk, _super);
    function KeeperStateOk() {
        return _super.apply(this, arguments) || this;
    }
    //this is a singleton
    KeeperStateOk.getInstance = function () {
        return this.instance;
    };
    KeeperStateOk.prototype.draw = function (k) {
        var pos = sprite_pos(k);
        var sp = pos.y < 0 ? 57 : 54;
        jersey_color(k);
        spr(sp, pos.x, pos.y);
    };
    KeeperStateOk.prototype.update = function (k) {
        var game = Game.getInstance();
        var ball = game.ball;
        //-- try to stay in front of the ball
        //--dive ?
        var future = 7;
        var futureball = Vector3.add(ball.position, Vector3.multiply(future, ball.velocity));
        var res = segment_intersect(ball.position, futureball, { x: goalx1, y: fh2 * k.side }, { x: goalx2, y: fh2 * k.side });
        if (res) {
            var divefactor = 0.99;
            var divemax = 10;
            k.velocity.x = MathHelper.clamp((res.x - k.position.x) * divefactor, -divemax, divemax);
            k.set_state(KeeperStateDive.getInstance());
            return;
        }
        else {
            var wantedx = MathHelper.clamp(ball.position.x, -goalx2, goalx2);
            var mx = 1.0; // -- max move per frame
            k.position.x = MathHelper.clamp(wantedx, k.position.x - mx, k.position.x + mx);
            if (Math.abs(k.position.y) < fh2 - 4) {
                k.position.y += k.side;
            }
        }
        if (k.touch_ball(5) && game.isPlaying()) {
            ball.velocity.y = -3.0 * k.side;
            balllasttouchedside = k.side;
        }
    };
    return KeeperStateOk;
}(State));
KeeperStateOk.instance = new KeeperStateOk();
/// <reference path="../State.ts" />
var KeeperStateRun = (function (_super) {
    __extends(KeeperStateRun, _super);
    function KeeperStateRun() {
        return _super.apply(this, arguments) || this;
    }
    //this is a singleton
    KeeperStateRun.getInstance = function () {
        return this.instance;
    };
    KeeperStateRun.prototype.draw = function (f) {
        var animfactor = 1;
        var animoffset = 20;
        var anim_end = 1;
        jersey_color(f);
        if (f.vel > min_vel) {
            animfactor = 4;
            animoffset = 0;
            anim_end = 4;
            spr_from_dir(f);
        }
        f.animtimer += f.vel * 0.25;
        while (Math.floor(f.animtimer) >= anim_end) {
            f.animtimer -= anim_end;
        }
        var pos = sprite_pos(f);
        spr(animoffset + f.lastspr * animfactor + f.animtimer, pos.x, pos.y, 1, 1, f.lastflip);
    };
    return KeeperStateRun;
}(State));
KeeperStateRun.instance = new KeeperStateRun();
var GoalUp = (function (_super) {
    __extends(GoalUp, _super);
    //public y = -fh2;
    function GoalUp() {
        var _this = _super.call(this) || this;
        _this.position.y = -fh2;
        return _this;
    }
    GoalUp.prototype.draw = function () {
        var clipstartx = goalx1 - camtarget.x + 1 + 64;
        var clipstarty = -camtarget.y + 64 - fh2;
        var clipendx = goalx2 - goalx1;
        var clipendy = goalh / 2 + 1;
        //spr(60, goalx2, -fh2 - 17)
        clip(clipstartx, clipstarty - 10, clipendx + 8, clipendy);
        for (var x = goalx1 - 1; x <= goalx2 + 8; x += 8) {
            for (var y = -11; y <= 7; y += 8) {
            }
        }
        clip(clipstartx, clipstarty - goalh, clipendx - 1, clipendy);
        for (var x = goalx1 - 1; x <= goalx2 + 8; x += 8) {
            for (var y = -goalh + 1; y <= 8; y += 8) {
            }
        }
        clip();
        var a = -goall - fh2;
        line(goalx1, a, goalx1, -fh2);
        line(goalx1, a, goalx2, a);
        line(goalx2, a, goalx2, -fh2);
    };
    GoalUp.prototype.drawshadow = function () {
    };
    return GoalUp;
}(BaseGameEntity));
var goal_up = new GoalUp();
var Vector2 = (function () {
    function Vector2(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    Object.defineProperty(Vector2, "Zero", {
        // Returns a Vector2 with all of its components set to zero.
        get: function () {
            return new Vector2();
        },
        enumerable: true,
        configurable: true
    });
    //overload the + operator
    Vector2.add = function (lhs, rhs) {
        var x = lhs.x + rhs.x;
        var y = lhs.y + rhs.y;
        return new Vector2(x, y);
    };
    //overload the - operator
    Vector2.subtract = function (lhs, rhs) {
        var x = lhs.x - rhs.x;
        var y = lhs.y - rhs.y;
        return new Vector2(x, y);
    };
    Vector2.multiply = function (lhs, rhs) {
        return new Vector2(lhs * rhs.x, lhs * rhs.y);
    };
    Vector2.dot = function (lhs, rhs) {
        return lhs.x * rhs.x + lhs.y * rhs.y;
    };
    /**
     *   returns the length of a 2D vector
    */
    Vector2.length = function (vector) {
        var x = vector.x;
        var y = vector.y;
        return Math.sqrt(x * x + y * y);
    };
    /**
     *   normalizes a 2D Vector
     */
    Vector2.normalize = function (vector) {
        //let _length = Vector2.length(vector);
        var x = vector.x;
        var y = vector.y;
        var length = Math.sqrt(x * x + y * y);
        if (length > 1e-6 /*MathHelper.EpsilonDouble*/) {
            vector.x /= length;
            vector.y /= length;
        }
        return vector;
    };
    Vector2.distance = function (vector1, vector2) {
        return Math.sqrt(Vector2.distanceSquared(vector1, vector2));
    };
    Vector2.distanceSquared = function (vector1, vector2) {
        var x = vector1.x - vector2.x;
        var y = vector1.y - vector2.y;
        return x * x + y * y;
    };
    /**
    * calculates the dot product
    * @param v2
    * @return  dot product
    */
    Vector2.prototype.dot = function (vector) {
        return this.x * vector.x + this.y * vector.y;
    };
    //we need some overloaded operators
    Vector2.prototype.add = function (rhs) {
        this.x += rhs.x;
        this.y += rhs.y;
        return this;
    };
    Vector2.prototype.multiply = function (rhs) {
        this.x *= rhs;
        this.y *= rhs;
        return this;
    };
    Vector2.prototype.length = function () {
        var x = this.x;
        var y = this.y;
        return Math.sqrt(x * x + y * y);
    };
    Vector2.prototype.clamp = function (max) {
        var length = this.length();
        if (length > max) {
            var factor = max / length;
            this.multiply(factor);
        }
    };
    Vector2.prototype.clone = function () {
        return new Vector2(this.x, this.y);
    };
    Vector2.prototype.toVector3 = function () {
        return new Vector3(this.x, this.y);
    };
    return Vector2;
}());
var Renderer;
(function (Renderer) {
    var canvas;
})(Renderer || (Renderer = {}));
var SoccerTeam = (function () {
    function SoccerTeam() {
        //pointers to the team members
        this.players = []; //new Array<PlayerBase>(5);
    }
    return SoccerTeam;
}());
var Throwin = (function () {
    function Throwin() {
        this.pos = new Vector2();
        this.ballpos = new Vector2();
        this.timer = 10;
        this.balld = new Vector2();
        this.kickmax = 0;
        this.dist = 0;
    }
    Throwin.prototype.init_throwin = function (t, p, v, m) {
        var game = Game.getInstance();
        var ball = game.ball;
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
        var idx = side_to_idx(this.side);
        if (t === Goalkick.getInstance()) {
            this.player = men[men.length + idx - 2]; //keeper
            this.player.set_state(KeeperStateRun.getInstance());
        }
        else {
            this.player = game.controllingPlayers[idx].man;
        }
        this.dist = Vector3.distance({ x: this.pos.x, y: this.pos.y, z: 0 }, this.player.position);
        camlastpos = camtarget.clone(); //copy(camtarget);
        game.setState(GameStateToBallout.getInstance());
        sfx(0);
    };
    return Throwin;
}());
var throwin = new Throwin();
/// <reference path="./math/MathHelper.ts" />
/// <reference path="./math/Vector2.ts" />
/// <reference path="./State.ts" />
/// <reference path="./FieldPlayer.ts" />
/// <reference path="./GoalKeeper.ts" />
/// <reference path="./SoccerBall.ts" />
/// <reference path="./ControllingPlayer.ts" />
/// <reference path="./Game.ts" />
/// <reference path="./GameStates/GameStatePlaying.ts" />
/// <reference path="./GameStates/Kickoff.ts" />
/// <reference path="./GameStates/GameStateToKickoff.ts" />
/// <reference path="./GameStates/GameStateBallin.ts" />
/// <reference path="./GameStates/GameStateToBallout.ts" />
/// <reference path="./GameStates/GameStateGoalmarked.ts" />
/// <reference path="./GoalKeeperStates/KeeperStateOk.ts" />
/// <reference path="./GoalKeeperStates/KeeperStateDive.ts" />
/// <reference path="./GoalKeeperStates/KeeperStateRun.ts" />
/// <reference path="./FieldPlayerStates/Tackle.ts" />
/// <reference path="./FieldPlayerStates/Down.ts" />
/// <reference path="./FieldPlayerStates/FieldPlayerStateOK.ts" />
/// <reference path="./FieldPlayerStates/FieldPlayerStateRunning.ts" />
/// <reference path="./FieldPlayerStates/FieldPlayerStateThrowin.ts" />
/// <reference path="./FieldPlayerStates/CornerKick.ts" />
/// <reference path="./Throwin.ts" />
function _print(_str, _x, _y, _col) {
}
function spr(n, x, y, _w, _h, _flip_x, _flip_y) {
    if (_w === void 0) { _w = 0; }
    if (_h === void 0) { _h = 0; }
    if (_flip_x === void 0) { _flip_x = false; }
    if (_flip_y === void 0) { _flip_y = false; }
    switch (n) {
        case 45:
            rectfill(x, y, x + 8, y + 8, 6);
            break;
        case 46:
            rectfill(x, y, x + 8, y + 8, 6);
            break;
        default:
            rectfill(x, y, x + 8, y + 8, 7);
            break;
    }
}
function rnd(n) {
    return Math.random() * n;
}
function btn(_i, _p) {
    return true;
}
function btnp(_i, _p) {
    return true;
}
function sfx(_n) {
}
function clip(_x, _y, _w, _h) {
    if (_x === void 0) { _x = 0; }
    if (_y === void 0) { _y = 0; }
    if (_w === void 0) { _w = 0; }
    if (_h === void 0) { _h = 0; }
}
function pal(_c0, _c1, _p) {
    if (_c0 === void 0) { _c0 = 0; }
    if (_c1 === void 0) { _c1 = 0; }
    if (_p === void 0) { _p = 0; }
}
var offsetX = 0;
var offsetY = 0;
function camera(x, y) {
    if (x === void 0) { x = 0; }
    if (y === void 0) { y = 0; }
    offsetX = x;
    offsetY = y;
}
function palt(_col, _t) {
    if (_col === void 0) { _col = 0; }
    if (_t === void 0) { _t = false; }
}
function line(x0, y0, x1, y1, _col) {
    if (_col === void 0) { _col = 0; }
    x0 -= offsetX;
    x1 -= offsetX;
    y0 -= offsetY;
    y1 -= offsetY;
    if (context) {
        context.save();
        //新しいパスを開始する
        context.beginPath();
        //パスの開始座標を指定する
        context.moveTo(x0, y0);
        //座標を指定してラインを引いていく
        context.lineTo(x1, y1);
        //パスを閉じる（最後の座標から開始座標に向けてラインを引く）
        context.closePath();
        //現在のパスを輪郭表示する
        context.stroke();
        context.restore();
    }
}
function rect(x0, y0, x1, y1, _col) {
    if (x0 === void 0) { x0 = 0; }
    if (y0 === void 0) { y0 = 0; }
    if (x1 === void 0) { x1 = 0; }
    if (y1 === void 0) { y1 = 0; }
    if (_col === void 0) { _col = 0; }
    x0 -= offsetX;
    x1 -= offsetX;
    y0 -= offsetY;
    y1 -= offsetY;
    if (context) {
        context.save();
        context.strokeRect(x0, y0, x1 - x0, y1 - y0);
        context.restore();
    }
}
function rectfill(x0, y0, x1, y1, col) {
    if (x0 === void 0) { x0 = 0; }
    if (y0 === void 0) { y0 = 0; }
    if (x1 === void 0) { x1 = 0; }
    if (y1 === void 0) { y1 = 0; }
    x0 -= offsetX;
    x1 -= offsetX;
    y0 -= offsetY;
    y1 -= offsetY;
    if (context) {
        context.save();
        switch (col) {
            case 3:
                context.fillStyle = 'green';
                break;
            case 4:
                context.fillStyle = 'red';
                break;
            case 6:
                context.fillStyle = "gray";
                break;
            case 7:
                context.fillStyle = 'white';
                break;
            default:
                break;
        }
        context.fillRect(x0, y0, x1 - x0, y1 - y0);
        context.restore();
    }
}
function color(_col) {
    if (_col === void 0) { _col = 0; }
}
function circ(_x, _y, _r, _col) {
    if (_x === void 0) { _x = 0; }
    if (_y === void 0) { _y = 0; }
    if (_r === void 0) { _r = 0; }
    if (_col === void 0) { _col = 0; }
}
function music(_n, _a, _b) {
    if (_n === void 0) { _n = 0; }
    if (_a === void 0) { _a = 0; }
    if (_b === void 0) { _b = 0; }
}
// succer
// by rylauchelmi
var menu_offset = 128;
var menu_inc = 1;
var timer = 10;
var blink = false;
var mode = 1;
var full_time = 2700;
var half_time = full_time / 2;
var max_val = 32767;
var cos22_5 = 0.9239;
var sin22_5 = 0.3827;
var fh = 384;
var fw = 256;
var fh2 = fh / 2;
var fw2 = fw / 2;
var penaltyw2 = 64;
var fh2_penaltyh = fh2 - 60;
var goalw = 60;
var goalh = 20;
var goall = 10;
var goalx2 = goalw / 2;
var goalx1 = -goalx2;
var border = 20;
var teamcolors = [0, 1, 5];
//let teamcolors[0] = 0
var shirtcolors = [[1, 2], [8, 2], [9, 8], [10, 9], [11, 3], [12, 1], [13, 5], [6, 13], [7, 6], [15, 14]];
//let shirtcolors[0] = { 1,2}
var skincolors = [[4, 5, 0], [15, 14, 4], [15, 14, 4], [15, 14, 9]];
var max_kick = 20;
var dribbledist = 4;
var camtarget = new Vector2(fw2, 0); //{ x: fw2, y: 0 };
var startpos = [
    { x: 0, y: 0.2 },
    { x: 0.4, y: 0.2 },
    { x: -0.4, y: 0.2 },
    { x: 0.35, y: 0.5 },
    { x: -0.35, y: 0.5 },
    { x: 0, y: 0.90 },
];
var attackpos = [
    { x: 0, y: -0.2 },
    { x: 0.4, y: -0.1 },
    { x: -0.4, y: -0.25 },
    { x: 0.3, y: 0.1 },
    { x: -0.3, y: 0.2 },
    { x: 0, y: 0.90 },
];
var vel_inc = 0.2;
var min_vel = 0.1;
var ball_dist_thres = 64;
var menu = { timer: 10 };
function print_outlined(t, x, y, c, oc) {
    for (var i = x - 1; i <= x + 1; ++i) {
        for (var j = y - 1; j <= y + 1; ++j) {
            _print(t, i, j, oc);
        }
    }
    _print(t, x, y, c);
}
function dist_manh(a, b) {
    return Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
}
function draw_marker(f) {
    var sp = 29;
    if (f.can_kick()) {
        sp = 30;
    }
    if (f.hasball) {
        sp = 31;
    }
    spr(sp, f.position.x - 4, f.position.y - 6);
}
function jersey_color(f) {
    var shirt = shirtcolors[teamcolors[f.teamcolors]];
    pal(8, shirt[0]);
    pal(2, shirt[1]);
    pal(4, skincolors[f.skin][2]);
    pal(14, skincolors[f.skin][1]);
    pal(15, skincolors[f.skin][0]);
}
function spr_from_dir(f) {
    f.lastflip = true;
    var fdirx = f.dir.x;
    var fdiry = f.dir.y;
    if (fdirx < -cos22_5) {
        f.lastspr = 2;
    }
    else {
        if (fdirx < -sin22_5) {
            if (fdiry < 0) {
                f.lastspr = 1;
            }
            else {
                f.lastspr = 3;
            }
        }
        else {
            f.lastflip = false;
            if (fdirx < sin22_5) {
                if (fdiry < 0) {
                    f.lastspr = 0;
                }
                else {
                    f.lastspr = 4;
                }
            }
            else {
                if (fdirx < cos22_5) {
                    if (fdiry < 0) {
                        f.lastspr = 1;
                    }
                    else {
                        f.lastspr = 3;
                    }
                }
                else {
                    f.lastspr = 2;
                }
            }
        }
    }
}
function sprite_pos(f) {
    return { x: f.position.x - f.w, y: f.position.y - f.h };
}
var men = [];
var balllasttouchedside = 0;
var dribble = new Vector2(); //{ x: 0, y: 0 };
var dribblen = 0;
var man_with_ball;
function checktimer(a) {
    a.timer -= 1;
    return a.timer < 0;
}
function segment_intersect(a1, a2, b1, b2) {
    var ax = a2.x - a1.x;
    var ay = a2.y - a1.y;
    var bx = b2.x - b1.x;
    var by = b2.y - b1.y;
    var a1x = a1.x - b1.x;
    var den = ax * by - ay * bx;
    if (den === 0) {
        return null;
    }
    var a1y = a1.y - b1.y;
    var r = (a1y * bx - a1x * by) / den;
    var s = (a1y * ax - a1x * ay) / den;
    // if 0<= r <= 1 & 0 <= s <= 1, intersection exists
    if (r < 0 || 1 < r || s < 0 || 1 < s) {
        return null;
    }
    return {
        x: a1.x + r * ax,
        y: a1.y + r * ay
    };
}
var ballsfxtime = 0;
function ballsfx() {
    if (ballsfxtime <= 0) {
        sfx(5);
        ballsfxtime = 7;
    }
}
function check_post(p, prevball) {
    var game = Game.getInstance();
    var ball = game.ball;
    var d = Vector3.distance(ball.position, { x: p.x, y: p.y, z: 0 });
    if (d < ball.w) {
        var delta = Vector2.subtract(p, ball.position);
        var ballspeed = Vector3.distance(ball.position, { x: prevball.x, y: prevball.y, z: 0 });
        //plus_in_place(ball.position, muls(delta, -1 / d * ball.w))
        ball.position.add(Vector2.multiply(-1 / d * ball.w, delta).toVector3());
        //plus_in_place(ball.velocity, muls(delta, -1 / d * ballspeed))
        ball.velocity.add(Vector2.multiply(-1 / d * ballspeed, delta).toVector3());
        ballsfx();
    }
}
function update_cam() {
    var game = Game.getInstance();
    var ball = game.ball;
    if (game.isPlaying()) {
        camtarget = ball.position.toVector2();
    }
    var bx = fw2 + border - 64;
    var by = fh2 + border - 64;
    camtarget.x = Math.floor(MathHelper.clamp(camtarget.x, -bx, bx));
    camtarget.y = Math.floor(MathHelper.clamp(camtarget.y, -by, by));
}
var kickoff_team;
function bubble_sort(t) {
    var len = t.length;
    var active = true;
    //let tmp = nil
    while (active) {
        active = false;
        for (var i = 0; i < len - 1; ++i) {
            if (t[i + 1].position.y < t[i].position.y) {
                var tmp = t[i];
                t[i] = t[i + 1];
                t[i + 1] = tmp;
                active = true;
            }
        }
    }
}
function damp(m) {
    //muls_in_place(m.velocity, m.damp)
    m.velocity.multiply(m.damp);
}
//function clampvec_getlen(v: IVector2 | IVector3, n: number) {
//    let l = Math.sqrt(Vector2.dot(v, v));
//    if (l > n) {
//        //muls_in_place(v, n / l)
//        v.x *= (n / l);
//        v.y *= (n / l);
//        l = n;
//    }
//    return l
//}
function side_to_idx(s) {
    //-- return flr((s + 1) / 2 + 1)
    //return ((matchtimer >= half_time ? - s : s) + 1) / 2;// + 1
    return Math.floor(((matchtimer >= half_time ? -s : s) + 1) / 2); // + 1
}
function idx_to_side(i) {
    //return (matchtimer >= half_time ? - 1 : 1) * (2 * i - 3)
    return (matchtimer >= half_time ? -1 : 1) * (2 * i - 1);
}
function distance_men_ball() {
    var game = Game.getInstance();
    var ball = game.ball;
    var nearestdist = [max_val, max_val];
    for (var _c = 0, men_12 = men; _c < men_12.length; _c++) {
        var m = men_12[_c];
        if (!m.keeper && m.getState() !== Down.getInstance() && m.getState() !== Tackle.getInstance()) {
            var d = dist_manh(m.position, ball.position);
            m.ball_dist = d;
            if (game.isPlaying()) {
                var p = side_to_idx(m.side);
                if (d < nearestdist[p]) {
                    game.controllingPlayers[p].man = m;
                    nearestdist[p] = d;
                }
            }
        }
    }
}
var matchtimer;
var camlastpos;
var scoring_team;
function print_mode(m, t) {
    if (m === mode) {
        print_outlined(t, 32 - menu_offset, 75, 6, 5);
    }
}
function set_state_ok(f) {
    if (f.keeper) {
        f.set_state(KeeperStateOk.getInstance());
    }
    else {
        f.set_state(FieldPlayerStateOK.getInstance());
    }
}
var canvas;
var context;
function kick_dir() {
    var game = Game.getInstance();
    var ball = game.ball;
    //let toBall = 
    throwin.balld = Vector2.multiply(0.25, { x: throwin.ballpos.x - throwin.player.position.x, y: throwin.ballpos.y - throwin.player.position.y });
    //clampvec_getlen(throwin.balld, throwin.kickmax);
    throwin.balld.clamp(throwin.kickmax);
    throwin.player.look_at(ball);
}
function check_tackle(tackler, other) {
    if (tackler !== other) {
        var dist = Vector3.distance(tackler.position, other.position);
        var tackle_dist = 5;
        if (dist < tackle_dist) {
            other.set_state(Down.getInstance());
        }
    }
}
var starting_team;
var changing_side;
function changeshirt(i) {
    teamcolors[i] += 1;
    if (teamcolors[i] >= shirtcolors.length) {
        teamcolors[i] = 1;
    }
    if (teamcolors[i] === teamcolors[3 - i]) {
        teamcolors[i] += 1;
    }
}
function draw_button(s, x, y) {
    spr(64 + s, x - menu_offset, y + (btnp(s) ? 1 : 0));
}
//# sourceMappingURL=succer.js.map