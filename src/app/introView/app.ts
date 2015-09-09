/**
 * Created by rsandagon on 3/27/15.
 */
import kola = require('kola');
import signals = require('kola-signals');
import hooks = require('kola-hooks');
import PIXI = require('pixi.js');
import models = require('../models');

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

    onStart(): void {
        var texture = PIXI.Texture.fromImage('images/intro.png');
        this.gameModel = <models.GameModel> this.kontext.getInstance('game.model');

        this.container = this.opts.container;
        this.sprite = new PIXI.Sprite(texture);

        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;

        this.sprite.position.x = this.gameModel.width * 0.5;
        this.sprite.position.y = this.gameModel.height * 0.5;

        this.sprite.scale.x = 0;
        this.sprite.scale.y = 0;

        TweenLite.to(this.sprite.scale,2,{x:1,y:1});

        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this.sprite.on('mousedown', this.onClick);

        this.container.addChild(this.sprite);
        this.listeners.push(this.kontext.getSignal('stage.render').listen(this.updateView, this));
    }

    onClick(mouseData):void{
        this.gameModel.setCurrentState(models.GameState.PLAYING);
    }

    updateView():void{
    }

    onStop(): void {
        this.container.removeChild(this.sprite);
        this.listeners.forEach((listener: signals.Listener<any>) => {listener.unlisten()});
    }
}