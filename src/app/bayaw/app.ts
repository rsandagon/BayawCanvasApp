/**
 * Created by rsandagon on 3/27/15.
 */
import kola = require('kola');
import signals = require('kola-signals');
import hooks = require('kola-hooks');
import PIXI = require('pixi.js');
import models = require('../models');
import gsap = require('gsap');

export interface Kontext extends kola.Kontext {
    setSignal<T>(name: string, hook?: kola.Hook<T>): kola.SignalHook<T>;
    getSignal<T>(name: string): signals.Dispatcher<T>;
    setInstance<T>(name: string, factory: () => T): kola.KontextFactory<T>;
    getInstance<T>(name: string): T;
}


export class App extends kola.App<{container:PIXI.Container}> {
    sprite;
    listeners: signals.Listener<any>[] = [];
    container:PIXI.Container;
    gameModel:models.GameModel;
    stateChangeListener:signals.Listener<string>;
    walkTextures: PIXI.Texture[];
    jumpTextures: PIXI.Texture[];

    onStart(): void {
        var i;
        this.walkTextures = [];
        this.jumpTextures = [];

        for (i = 0; i < 6; i++) {
            var texture = PIXI.Texture.fromImage('images/BayawWalkcycle_' + (i + 1) + '.png');
            this.walkTextures.push(texture);
        }

        for (i = 0; i < 4; i++) {
            var texture = PIXI.Texture.fromImage('images/JumpCycle_' + (i + 1) + '.png');
            this.jumpTextures.push(texture);
        }

        this.gameModel = <models.GameModel> this.kontext.getInstance('game.model');

        this.container = this.opts.container;
        this.sprite = new PIXI.extras.MovieClip(this.walkTextures);
        this.sprite.animationSpeed = 0.15;

        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;

        this.sprite.position.x = 100;
        this.sprite.position.y = this.gameModel.height * 0.65;

        this.sprite.scale.x = 0;
        this.sprite.scale.y = 0;

        this.container.addChild(this.sprite);
        this.listeners.push(this.kontext.getSignal('stage.render').listen(this.updateView, this));
        this.listeners.push(this.kontext.getSignal('stage.clicked').listen(this.onStageClicked, this));
        this.stateChangeListener = this.gameModel.onStateChange.listen(this.stateChanged, this);
    }

    onStageClicked(data):void{
        var payload = data.payload;
        
        var goDown = function(){
            //TweenLite.to(this.sprite.position, 1, { delay: 1, y: this.gameModel.floorHeight + 100, onComplete: walk.bind(this) });
        }

        var walk = function(){
            this.sprite.textures = this.walkTextures;
        }

        if (this.gameModel.currentState == models.GameState.PLAYING){
            if (payload.y < this.gameModel.floorHeight) {
                this.sprite.textures = this.jumpTextures;
                //TweenLite.to(this.sprite.position, 1, { x: payload.x, y: this.gameModel.floorHeight - 150, onComplete: goDown.bind(this) });
            }else{
                this.sprite.textures = this.walkTextures;
                //TweenMax.to(this.sprite.position, 1, { x: payload.x, y: payload.y });
            }

        }else{
            this.sprite.position.x = 100;
            this.sprite.position.y = this.gameModel.height * 0.65;
        }
    }

    stateChanged(state):void{
        switch(state){
            case models.GameState.PLAYING:
                this.sprite.play();
                //TweenLite.to(this.sprite.scale, 1, { x: 1.2, y: 1.2 });
                break;
            case models.GameState.INTRO:
                this.sprite.stop();
                //TweenMax.to(this.sprite.scale, 1, { x: 0, y: 0 });
                break;
            default:
                break;
        }
    }

    updateView():void{
    }

    onStop(): void {
        this.container.removeChild(this.sprite);
        this.listeners.forEach((listener: signals.Listener<any>) => {listener.unlisten()});
    }
}