interface IVector3 {
    x: number;
    y: number;
    z: number;
}
declare class Vector3 implements IVector3 {
    x: number;
    y: number;
    z: number;
    constructor(x?: number, y?: number, z?: number);
    static readonly Zero: Vector3;
    static add(lhs: IVector3, rhs: IVector3): Vector3;
    static subtract(lhs: IVector3, rhs: IVector3): Vector3;
    static multiply(lhs: number, rhs: IVector3): Vector3;
    static distance(vector1: IVector3, vector2: IVector3): number;
    static distanceSquared(vector1: IVector3, vector2: IVector3): number;
    set(v: IVector3): this;
    add(rhs: IVector3): this;
    multiply(rhs: number): this;
    /**
     *   returns the length of a 2D vector
     */
    length(): number;
    clamp(max: number): void;
    toVector2(): Vector2;
    clone(): Vector3;
}
declare abstract class BaseGameEntity {
    position: Vector3;
    abstract draw(): void;
    abstract drawshadow(): void;
}
declare abstract class MovingEntity extends BaseGameEntity {
    velocity: Vector3;
}
declare class SoccerBall extends MovingEntity {
    w: number;
    h: number;
    damp: number;
    dampair: number;
    constructor();
    draw(): void;
    drawshadow(): void;
    check_net(prevball: IVector2, goal1: IVector2, goal2: IVector2): void;
    update(): void;
}
declare class Game {
    private static instance;
    static getInstance(): Game;
    demo: boolean;
    score: number[];
    state: State<Game>;
    ball: SoccerBall;
    controllingPlayers: ControllingPlayer[];
    private constructor();
    get_controlled(side: number): PlayerBase;
    create_player(_i: number): void;
    initialize(): void;
    setState(state: State<Game>): void;
    isPlaying(): boolean;
    is_throwin(): boolean;
    start_match(demo: boolean): void;
    update(): void;
    draw(): void;
    throw_in(dy: number): void;
}
declare var cnt: number;
declare function animate(): void;
declare namespace MathHelper {
    const EpsilonDouble = 0.000001;
    const Pi: number;
    const PiOver2: number;
    const PiOver4: number;
    const TwoPi: number;
    function clamp(value: number, min: number, max: number): number;
}
declare abstract class PlayerBase extends MovingEntity {
    w: number;
    h: number;
    vel: number;
    dir: Vector2;
    lastspr: number;
    hasball: boolean;
    animtimer: number;
    timer: number;
    damp: number;
    lastflip: boolean;
    justshot: number;
    ball_dist: number;
    startposidx: number;
    side: number;
    keeper: boolean;
    teamcolors: number;
    skin: number;
    constructor();
    abstract getState<T>(): State<T>;
    abstract set_state<T>(st: State<T>): void;
    abstract draw(): void;
    abstract drawshadow(): void;
    update(): void;
    change_side(): void;
    can_kick(): boolean;
    touch_ball(dist: number): boolean;
    pass(): boolean;
    go_to(x: number, y: number, min_dist: number, steps: number): boolean;
    run_to(x: number, y: number): boolean;
    findpos(): void;
    findpos2(t: IVector2): void;
    stick_ball(): void;
    is_pass_ok(_relpos: IVector2, dist: number, dir: IVector2): boolean;
    look_at(b: SoccerBall): void;
    dribble_ball(): void;
    ball_thrown(): void;
}
declare class ControllingPlayer {
    man: PlayerBase;
    num: number;
    but: number;
    ai: boolean;
    constructor(man: PlayerBase, num: number, but?: number, ai?: boolean);
    player_input(): void;
    tackle(): void;
    kick(): void;
    button_released(): void;
}
declare class FieldPlayer extends PlayerBase {
    state: State<FieldPlayer>;
    constructor(p: number, i: number);
    getState(): State<FieldPlayer>;
    set_state(state: State<FieldPlayer>): void;
    draw(): void;
    drawshadow(): void;
}
declare abstract class State<EntityType> {
    init(_e: EntityType): void;
    draw(_e: EntityType): void;
    update(_e: EntityType): void;
    ai(_e: ControllingPlayer): void;
    start(_e: EntityType): void;
    input(_e: ControllingPlayer): void;
}
declare class CornerKick extends State<FieldPlayer> {
    private static instance;
    static getInstance(): CornerKick;
    start(): void;
    ai(_p: ControllingPlayer): void;
    input(p: ControllingPlayer): void;
    draw(f: FieldPlayer): void;
}
declare class Down extends State<FieldPlayer> {
    private static instance;
    static getInstance(): Down;
    start(f: FieldPlayer): void;
    draw(f: FieldPlayer): void;
    update(f: FieldPlayer): void;
}
declare class FieldPlayerStateOK extends State<FieldPlayer> {
    private static instance;
    static getInstance(): FieldPlayerStateOK;
    ai(p: ControllingPlayer): void;
    input(p: ControllingPlayer): void;
    draw(f: FieldPlayer): void;
    update(f: FieldPlayer): void;
}
declare class FieldPlayerStateRunning extends State<FieldPlayer> {
    private static instance;
    static getInstance(): FieldPlayerStateRunning;
    ai(_p: ControllingPlayer): void;
    input(_p: ControllingPlayer): void;
    draw(f: FieldPlayer): void;
}
declare class FieldPlayerStateThrowin extends State<FieldPlayer> {
    private static instance;
    static getInstance(): FieldPlayerStateThrowin;
    start(): void;
    ai(p: ControllingPlayer): void;
    input(p: ControllingPlayer): void;
    draw(f: FieldPlayer): void;
}
declare class Tackle extends State<FieldPlayer> {
    private static instance;
    static getInstance(): Tackle;
    start(f: FieldPlayer): void;
    draw(f: FieldPlayer): void;
    update(f: FieldPlayer): void;
}
declare class GameStateBallin extends State<Game> {
    private static instance;
    static getInstance(): GameStateBallin;
    init(game: Game): void;
}
declare class GameStateGoalmarked extends State<Game> {
    private static instance;
    timer: number;
    static getInstance(): GameStateGoalmarked;
    init(): void;
    update(game: Game): void;
}
declare class GameStatePlaying extends State<Game> {
    private static instance;
    static getInstance(): GameStatePlaying;
    init(game: Game): void;
}
declare class GameStateToBallout extends State<Game> {
    private static instance;
    static getInstance(): GameStateToBallout;
    update(game: Game): void;
}
declare class GameStateToKickoff extends State<Game> {
    private static instance;
    timer: number;
    static getInstance(): GameStateToKickoff;
    init(): void;
    update(game: Game): void;
}
declare class Kickoff extends State<Game> {
    private static instance;
    constructor();
    static getInstance(): Kickoff;
    init(game: Game): void;
    update(game: Game): void;
}
declare class GoalDown extends BaseGameEntity {
    constructor();
    draw(): void;
    drawshadow(): void;
}
declare var goal_down: GoalDown;
declare class GoalKeeper extends PlayerBase {
    state: State<GoalKeeper>;
    constructor(p: number, i: number);
    draw(): void;
    drawshadow(): void;
    getState(): State<GoalKeeper>;
    set_state(st: State<GoalKeeper>): void;
}
declare class Goalkick extends State<GoalKeeper> {
    private static instance;
    static getInstance(): Goalkick;
    start(): void;
    ai(_p: ControllingPlayer): void;
    input(p: ControllingPlayer): void;
    draw(f: FieldPlayer): void;
}
declare class KeeperStateDive extends State<GoalKeeper> {
    private static instance;
    static getInstance(): KeeperStateDive;
    draw(k: GoalKeeper): void;
    start(k: GoalKeeper): void;
    update(k: GoalKeeper): void;
}
declare class KeeperStateOk extends State<GoalKeeper> {
    private static instance;
    static getInstance(): KeeperStateOk;
    draw(k: GoalKeeper): void;
    update(k: GoalKeeper): void;
}
declare class KeeperStateRun extends State<GoalKeeper> {
    private static instance;
    static getInstance(): KeeperStateRun;
    draw(f: FieldPlayer): void;
}
declare class GoalUp extends BaseGameEntity {
    constructor();
    draw(): void;
    drawshadow(): void;
}
declare var goal_up: GoalUp;
interface IVector2 {
    x: number;
    y: number;
}
declare class Vector2 implements IVector2 {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    static readonly Zero: Vector2;
    static add(lhs: Vector2, rhs: Vector2): Vector2;
    static subtract(lhs: IVector2, rhs: IVector2): Vector2;
    static multiply(lhs: number, rhs: IVector2): Vector2;
    static dot(lhs: IVector2, rhs: IVector2): number;
    /**
     *   returns the length of a 2D vector
    */
    static length(vector: IVector2): number;
    /**
     *   normalizes a 2D Vector
     */
    static normalize(vector: Vector2): Vector2;
    static distance(vector1: IVector2, vector2: IVector2): number;
    static distanceSquared(vector1: IVector2, vector2: IVector2): number;
    /**
    * calculates the dot product
    * @param v2
    * @return  dot product
    */
    dot(vector: Vector2): number;
    add(rhs: IVector2): this;
    multiply(rhs: number): this;
    length(): number;
    clamp(max: number): void;
    clone(): Vector2;
    toVector3(): Vector3;
}
declare namespace Renderer {
}
declare class SoccerTeam {
    private players;
    constructor();
}
declare class Throwin {
    pos: Vector2;
    ballpos: Vector2;
    timer: number;
    balld: Vector2;
    kickmax: number;
    dist: number;
    player: PlayerBase;
    side: number;
    type: State<FieldPlayer>;
    constructor();
    init_throwin(t: State<FieldPlayer>, p: Vector2, v: IVector2, m: number): void;
}
declare let throwin: Throwin;
declare function _print(_str: string, _x: number, _y: number, _col: number): void;
declare function spr(n: number, x: number, y: number, _w?: number, _h?: number, _flip_x?: boolean, _flip_y?: boolean): void;
declare function rnd(n: number): number;
declare function btn(_i: number, _p?: number): boolean;
declare function btnp(_i: number, _p?: number): boolean;
declare function sfx(_n: number): void;
declare function clip(_x?: number, _y?: number, _w?: number, _h?: number): void;
declare function pal(_c0?: number, _c1?: number, _p?: number): void;
declare let offsetX: number;
declare let offsetY: number;
declare function camera(x?: number, y?: number): void;
declare function palt(_col?: number, _t?: boolean): void;
declare function line(x0: number, y0: number, x1: number, y1: number, _col?: number): void;
declare function rect(x0?: number, y0?: number, x1?: number, y1?: number, _col?: number): void;
declare function rectfill(x0: number, y0: number, x1: number, y1: number, col: number): void;
declare function color(_col?: number): void;
declare function circ(_x?: number, _y?: number, _r?: number, _col?: number): void;
declare function music(_n?: number, _a?: number, _b?: number): void;
declare let menu_offset: number;
declare let menu_inc: number;
declare let timer: number;
declare let blink: boolean;
declare let mode: number;
declare const full_time = 2700;
declare let half_time: number;
declare let max_val: number;
declare let cos22_5: number;
declare let sin22_5: number;
declare const fh = 384;
declare const fw = 256;
declare const fh2: number;
declare const fw2: number;
declare let penaltyw2: number;
declare let fh2_penaltyh: number;
declare let goalw: number;
declare let goalh: number;
declare let goall: number;
declare let goalx2: number;
declare let goalx1: number;
declare let border: number;
declare let teamcolors: number[];
declare let shirtcolors: number[][];
declare let skincolors: number[][];
declare let max_kick: number;
declare let dribbledist: number;
declare let camtarget: Vector2;
declare let startpos: IVector2[];
declare let attackpos: IVector2[];
declare let vel_inc: number;
declare let min_vel: number;
declare let ball_dist_thres: number;
declare let menu: {
    timer: number;
};
declare function print_outlined(t: string, x: number, y: number, c: number, oc: number): void;
declare function dist_manh(a: IVector2, b: IVector2): number;
declare function draw_marker(f: PlayerBase): void;
declare function jersey_color(f: PlayerBase): void;
declare function spr_from_dir(f: PlayerBase): void;
declare function sprite_pos(f: PlayerBase): {
    x: number;
    y: number;
};
declare let men: PlayerBase[];
declare let balllasttouchedside: number;
declare let dribble: Vector2;
declare let dribblen: number;
declare var man_with_ball: PlayerBase;
declare function checktimer(a: {
    timer: number;
}): boolean;
declare function segment_intersect(a1: IVector2, a2: IVector2, b1: IVector2, b2: IVector2): IVector2 | null;
declare let ballsfxtime: number;
declare function ballsfx(): void;
declare function check_post(p: IVector2, prevball: IVector2): void;
declare function update_cam(): void;
declare var kickoff_team: number;
declare function bubble_sort(t: BaseGameEntity[]): void;
declare function damp(m: SoccerBall | PlayerBase): void;
declare function side_to_idx(s: number): number;
declare function idx_to_side(i: number): number;
declare function distance_men_ball(): void;
declare var matchtimer: number;
declare var camlastpos: Vector2;
declare var scoring_team: number;
declare function print_mode(m: number, t: string): void;
declare function set_state_ok(f: PlayerBase): void;
declare var canvas: HTMLCanvasElement;
declare var context: CanvasRenderingContext2D | null;
declare function kick_dir(): void;
declare function check_tackle(tackler: PlayerBase, other: PlayerBase): void;
declare var starting_team: number;
declare var changing_side: boolean;
declare function changeshirt(i: number): void;
declare function draw_button(s: number, x: number, y: number): void;
