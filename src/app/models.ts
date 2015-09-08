/**
 * Created by randagon 9/9/2015
 */

import signals = require('kola-signals');

export class GameModel {

    width : number;
    height: number;
    currentState: string;

    constructor() {
        this.width = 600;
        this.height = 450;
        this.currentState = GameState.INTRO;
    }
}

export class GameState{
    static INTRO : string = "intro";
    static PLAYING : string = "playing";
    static PAUSED : string = "paused";
}