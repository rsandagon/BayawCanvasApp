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

    onStateChange: signals.Dispatcher<string> = new signals.Dispatcher();

    constructor() {
        this.width = 600;
        this.height = 450;
        this.foregroundHeight = 220;
        this.groundHeight = 350;
        this.floorHeight = 250;
        this.setCurrentState(GameState.INTRO);
    }

    setCurrentState(value:string){
        console.log("state >" + value);

        this.currentState = value;
        this.onStateChange.dispatch(value);
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