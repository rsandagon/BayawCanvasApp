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
    bg;
    fg;
    mrt;
    gg;

    listeners: signals.Listener<any>[] = [];
    container:PIXI.Container;
    gameModel: models.GameModel;

    onStart(): void {
        this.gameModel = <models.GameModel> this.kontext.getInstance('game.model');

        this.container = this.opts.container;
        var texture1 = PIXI.Texture.fromImage('images/background.png');
        var texture2 = PIXI.Texture.fromImage('images/foreground.png');
        var texture3 = PIXI.Texture.fromImage('images/ground.png');
        var texture4 = PIXI.Texture.fromImage('images/mrt.png');

        this.bg = new PIXI.extras.TilingSprite(texture1, this.gameModel.width, this.gameModel.height);
        this.fg = new PIXI.extras.TilingSprite(texture2, this.gameModel.width, this.gameModel.foregroundHeight);
        this.gg = new PIXI.extras.TilingSprite(texture3, this.gameModel.width, this.gameModel.groundHeight);
        this.mrt = new PIXI.Sprite(texture4);

        this.bg.position.x = 0;
        this.bg.position.y = 0;

        this.fg.position.x = 0;
        this.fg.position.y = 50;

        this.gg.position.x = 0;
        this.gg.position.y = 120;

        this.mrt.position.x = 2000;
        this.mrt.position.y = 90;

        this.container.addChild(this.bg);
        this.container.addChild(this.fg);
        this.container.addChild(this.mrt);
        this.container.addChild(this.gg);

        TweenMax.to(this.mrt.position, 8, { delay: 3, x: -10000, repeat:-1});

        this.listeners.push(this.kontext.getSignal('stage.render').listen(this.updateView, this));
    }

    updateView():void{
        if (this.gameModel.currentState == models.GameState.PLAYING) {
            this.bg.tilePosition.x -= models.GameSpeed.BG_SPEED;
            this.fg.tilePosition.x -= models.GameSpeed.FG_SPEED;
            this.gg.tilePosition.x -= models.GameSpeed.GROUND_SPEED;
        }
    }

    onStop(): void {
        this.container.removeChild(this.bg);
        this.container.removeChild(this.fg);
        this.listeners.forEach((listener: signals.Listener<any>) => {listener.unlisten()});
    }
}