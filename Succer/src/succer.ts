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

function _print(_str: string, _x: number, _y: number, _col: number) {
}

function spr(n: number, x: number, y: number, _w = 0, _h = 0, _flip_x = false, _flip_y = false) {
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

function rnd(n: number) {
    return Math.random() * n;
}

function btn(_i: number, _p?: number) {
    return true;
}

function btnp(_i: number, _p?: number) {
    return true;
}

function sfx(_n: number) {
}

function clip(_x = 0, _y = 0, _w = 0, _h = 0) {
}

function pal(_c0 = 0, _c1 = 0, _p = 0) {
}

let offsetX = 0;
let offsetY = 0;
function camera(x = 0, y = 0) {
    offsetX = x;
    offsetY = y;
}

function palt(_col = 0, _t = false) { }

function line(x0: number, y0: number, x1: number, y1: number, _col = 0) {
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

function rect(x0 = 0, y0 = 0, x1 = 0, y1 = 0, _col = 0) {
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

function rectfill(x0 = 0, y0 = 0, x1 = 0, y1 = 0, col: number) {
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

function color(_col = 0) { }

function circ(_x = 0, _y = 0, _r = 0, _col = 0) { }

function music(_n = 0, _a = 0, _b = 0) { }

// succer
// by rylauchelmi


let menu_offset = 128;
let menu_inc = 1;

let timer = 10;
let blink = false;
let mode = 1;
const full_time = 2700;
let half_time = full_time / 2;

let max_val = 32767;
let cos22_5 = 0.9239;
let sin22_5 = 0.3827;

const fh = 384;
const fw = 256;
const fh2 = fh / 2;
const fw2 = fw / 2;
let penaltyw2 = 64;
let fh2_penaltyh = fh2 - 60;
let goalw = 60;
let goalh = 20;
let goall = 10;
let goalx2 = goalw / 2;
let goalx1 = -goalx2;
let border = 20;

let teamcolors = [0, 1, 5];
//let teamcolors[0] = 0
let shirtcolors = [[1, 2], [8, 2], [9, 8], [10, 9], [11, 3], [12, 1], [13, 5], [6, 13], [7, 6], [15, 14]];
//let shirtcolors[0] = { 1,2}
let skincolors = [[4, 5, 0], [15, 14, 4], [15, 14, 4], [15, 14, 9]];



let max_kick = 20;
let dribbledist = 4;

let camtarget = new Vector2(fw2, 0);//{ x: fw2, y: 0 };

let startpos: IVector2[] = [
    { x: 0, y: 0.2 },
    { x: 0.4, y: 0.2 },
    { x: -0.4, y: 0.2 },
    { x: 0.35, y: 0.5 },
    { x: -0.35, y: 0.5 },
    { x: 0, y: 0.90 },
];

let attackpos: IVector2[] = [
    { x: 0, y: -0.2 },
    { x: 0.4, y: -0.1 },
    { x: -0.4, y: -0.25 },
    { x: 0.3, y: 0.1 },
    { x: -0.3, y: 0.2 },
    { x: 0, y: 0.90 },
];

let vel_inc = 0.2;
let min_vel = 0.1;
let ball_dist_thres = 64;

let menu = { timer: 10 };

function print_outlined(t: string, x: number, y: number, c: number, oc: number) {
    for (let i = x - 1; i <= x + 1; ++i) {
        for (let j = y - 1; j <= y + 1; ++j) {
            _print(t, i, j, oc);
        }
    }
    _print(t, x, y, c);
}

function dist_manh(a: IVector2, b: IVector2) {
    return Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
}


function draw_marker(f: PlayerBase) {
    let sp = 29;
    if (f.can_kick()) {
        sp = 30;
    }
    if (f.hasball) {
        sp = 31;
    }
    spr(sp, f.position.x - 4, f.position.y - 6);
}

function jersey_color(f: PlayerBase) {
    let shirt = shirtcolors[teamcolors[f.teamcolors]];
    pal(8, shirt[0]);
    pal(2, shirt[1]);
    pal(4, skincolors[f.skin][2]);
    pal(14, skincolors[f.skin][1]);
    pal(15, skincolors[f.skin][0]);
}

function spr_from_dir(f: PlayerBase) {
    f.lastflip = true;
    let fdirx = f.dir.x;
    let fdiry = f.dir.y;
    if (fdirx < -cos22_5) { // full left
        f.lastspr = 2;
    } else {
        if (fdirx < -sin22_5) { // diag left...
            if (fdiry < 0) { // ...and up
                f.lastspr = 1;
            } else { // ...and down
                f.lastspr = 3;
            }
        } else {
            f.lastflip = false;
            if (fdirx < sin22_5) { // full...
                if (fdiry < 0) { // ...up
                    f.lastspr = 0;
                } else { // ...down
                    f.lastspr = 4;
                }
            } else {
                if (fdirx < cos22_5) { // diag right...
                    if (fdiry < 0) { // ...and up
                        f.lastspr = 1;
                    } else { // ...and down
                        f.lastspr = 3;
                    }
                } else { // full right
                    f.lastspr = 2;
                }
            }
        }
    }
}

function sprite_pos(f: PlayerBase) {
    return { x: f.position.x - f.w, y: f.position.y - f.h };
}

let men: PlayerBase[] = [];

let balllasttouchedside = 0;
let dribble = new Vector2();//{ x: 0, y: 0 };
let dribblen = 0;

var man_with_ball: PlayerBase;


function checktimer(a: { timer: number }) {
    a.timer -= 1;
    return a.timer < 0;
}

function segment_intersect(a1: IVector2, a2: IVector2, b1: IVector2, b2: IVector2): IVector2 | null {
    let ax = a2.x - a1.x;
    let ay = a2.y - a1.y;
    let bx = b2.x - b1.x;
    let by = b2.y - b1.y;
    let a1x = a1.x - b1.x;
    let den = ax * by - ay * bx;
    if (den === 0) {
        return null;
    }
    let a1y = a1.y - b1.y;
    let r = (a1y * bx - a1x * by) / den;
    let s = (a1y * ax - a1x * ay) / den;
    // if 0<= r <= 1 & 0 <= s <= 1, intersection exists
    if (r < 0 || 1 < r || s < 0 || 1 < s) {
        return null;
    }
    return {
        x: a1.x + r * ax,
        y: a1.y + r * ay
    };
}
let ballsfxtime = 0;
function ballsfx() {
    if (ballsfxtime <= 0) {
        sfx(5);
        ballsfxtime = 7;
    }
}

function check_post(p: IVector2, prevball: IVector2) {
    let game = Game.getInstance();
    let ball = game.ball;
    let d = Vector3.distance(ball.position, { x: p.x, y: p.y, z: 0 });
    if (d < ball.w) {
        let delta = Vector2.subtract(p, ball.position);
        let ballspeed = Vector3.distance(ball.position, { x: prevball.x, y: prevball.y, z: 0 });
        //plus_in_place(ball.position, muls(delta, -1 / d * ball.w))
        ball.position.add(Vector2.multiply(-1 / d * ball.w, delta).toVector3());
        //plus_in_place(ball.velocity, muls(delta, -1 / d * ballspeed))
        ball.velocity.add(Vector2.multiply(-1 / d * ballspeed, delta).toVector3());
        ballsfx();
    }
}



function update_cam() {
    let game = Game.getInstance();
    let ball = game.ball;
    if (game.isPlaying()) {
        camtarget = ball.position.toVector2();
    }

    let bx = fw2 + border - 64;
    let by = fh2 + border - 64;
    camtarget.x = Math.floor(MathHelper.clamp(camtarget.x, -bx, bx))
    camtarget.y = Math.floor(MathHelper.clamp(camtarget.y, -by, by))
}

var kickoff_team: number;




function bubble_sort(t: BaseGameEntity[]) {
    let len = t.length;
    let active = true;
    //let tmp = nil
    while (active) {
        active = false;
        for (let i = 0; i < len - 1; ++i) {
            if (t[i + 1].position.y < t[i].position.y) {
                let tmp = t[i];
                t[i] = t[i + 1];
                t[i + 1] = tmp;
                active = true;
            }
        }
    }
}


function damp(m: SoccerBall | PlayerBase) {
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

function side_to_idx(s: number) {
    //-- return flr((s + 1) / 2 + 1)
    //return ((matchtimer >= half_time ? - s : s) + 1) / 2;// + 1
    return Math.floor(((matchtimer >= half_time ? - s : s) + 1) / 2); // + 1
}

function idx_to_side(i: number) {
    //return (matchtimer >= half_time ? - 1 : 1) * (2 * i - 3)
    return (matchtimer >= half_time ? - 1 : 1) * (2 * i - 1);
}


function distance_men_ball() {
    let game = Game.getInstance();
    let ball = game.ball;
    let nearestdist = [max_val, max_val];
    for (let m of men) {
        if (!m.keeper && m.getState() !== Down.getInstance() && m.getState() !== Tackle.getInstance()) {
            let d = dist_manh(m.position, ball.position);
            m.ball_dist = d;
            if (game.isPlaying()) {
                let p = side_to_idx(m.side);
                if (d < nearestdist[p]) {
                    game.controllingPlayers[p].man = m;
                    nearestdist[p] = d;
                }
            }
        }
    }
}

var matchtimer: number;
var camlastpos: Vector2;
var scoring_team: number;

function print_mode(m: number, t: string) {
    if (m === mode) {
        print_outlined(t, 32 - menu_offset, 75, 6, 5);
    }
}


function set_state_ok(f: PlayerBase) {
    if (f.keeper) {
        f.set_state(KeeperStateOk.getInstance());
    } else {
        f.set_state(FieldPlayerStateOK.getInstance());
    }
}

var canvas: HTMLCanvasElement;
var context: CanvasRenderingContext2D | null;

function kick_dir() {
    let game = Game.getInstance();
    let ball = game.ball;
    //let toBall = 
    throwin.balld = Vector2.multiply(0.25, { x: throwin.ballpos.x - throwin.player.position.x, y: throwin.ballpos.y - throwin.player.position.y });
    //clampvec_getlen(throwin.balld, throwin.kickmax);
    throwin.balld.clamp(throwin.kickmax);
    throwin.player.look_at(ball);
}



function check_tackle(tackler: PlayerBase, other: PlayerBase) {
    if (tackler !== other) {
        let dist = Vector3.distance(tackler.position, other.position);
        let tackle_dist = 5;
        if (dist < tackle_dist) {
            other.set_state(Down.getInstance());
        }
    }
}
var starting_team: number;

var changing_side: boolean;


function changeshirt(i: number) {
    teamcolors[i] += 1;
    if (teamcolors[i] >= shirtcolors.length) {
        teamcolors[i] = 1;
    }
    if (teamcolors[i] === teamcolors[3 - i]) {
        teamcolors[i] += 1;
    }
}

function draw_button(s: number, x: number, y: number) {
    spr(64 + s, x - menu_offset, y + (btnp(s) ? 1 : 0));
}