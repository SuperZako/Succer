/// <reference path="../State.ts" />

class GameStateGoalmarked extends State<Game> {

    private static instance = new GameStateGoalmarked();

    public timer = 60;

    // this is a singleton
    public static getInstance() {
        return this.instance;
    }

    public init() {
        this.timer = 60;
    }

    public update(game: Game) {
        if (checktimer(this)) {
            game.setState(GameStateToKickoff.getInstance());
        }
    }
}