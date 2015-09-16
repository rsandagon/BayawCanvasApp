/**
 * Created by randagon 9/9/2015
 */

import signals = require('kola-signals');

export class GameModel {

    width : number;
    height: number;
    foregroundHeight : number;
    groundHeight: number;
    currentState: string;
    floorHeight: number;
    score: number;

    onStateChange: signals.Dispatcher<string> = new signals.Dispatcher();
    onScoreChange: signals.Dispatcher<string> = new signals.Dispatcher();

    constructor() {
        this.width = 600;
        this.height = 450;
        this.foregroundHeight = 220;
        this.groundHeight = 350;
        this.floorHeight = 150;
        this.setCurrentState(GameState.INTRO);
        this.score = 0;
    }

    setCurrentState(value:string){
        this.currentState = value;
        this.onStateChange.dispatch(value);
    }

    setScore(value: number) {
        this.score = value;
        this.onScoreChange.dispatch();
    }
}

export class GameState{
    static INTRO : string = "intro";
    static PLAYING : string = "playing";
    static PAUSED : string = "paused";
}

export class GameSpeed{
    static BG_SPEED : number = 0.5;
    static FG_SPEED : number = 0.8;
    static GROUND_SPEED : number = 0.9;
}