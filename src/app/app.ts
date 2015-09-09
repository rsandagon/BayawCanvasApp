/**
 * Created by rsandagon on 3/27/15.
 */
import kola = require('kola');
import signals = require('kola-signals');
import hooks = require('kola-hooks');

import PIXI = require('pixi.js');
import introApp = require('./introView/app');
import backgroundApp = require('./background/app');
import models = require('./models');

export interface Kontext extends kola.Kontext {
    setSignal<T>(name: string, hook?: kola.Hook<T>): kola.SignalHook<T>;
    getSignal<T>(name: string): signals.Dispatcher<T>;
    setInstance<T>(name: string, factory: () => T): kola.KontextFactory<T>;
    getInstance<T>(name: string): T;
}


export class App extends kola.App<HTMLElement> {
    renderer;
    stage;
    requestId;

    initialize(kontext: Kontext, opts?: HTMLElement): void {
        //  Signals
        kontext.setSignal('stage.render');
        kontext.setSignal('stage.clicked');

        //  Singleton models
        kontext.setInstance<models.GameModel>('game.model', () => {
            return new models.GameModel();
        }).asSingleton();

        var gameModel : models.GameModel = <models.GameModel> kontext.getInstance('game.model');

        this.renderer = PIXI.autoDetectRenderer(gameModel.width, gameModel.height);
        this.renderer.view.className = "renderer";
        this.opts.appendChild(this.renderer.view);

        this.stage = new PIXI.Container();
        this.stage.getBounds().width = gameModel.width;
        this.stage.getBounds().height = gameModel.height;
    }

    animate():void {
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.stage);
        this.kontext.getSignal("stage.render").dispatch();
    }

    onStart(): void {
        var intro = new introApp.App(this);
        var bg = new backgroundApp.App(this);

        bg.start({container:this.stage});
        intro.start({container:this.stage});

        this.requestId = requestAnimationFrame(this.animate.bind(this));
    }

    onStop(): void {
        if(this.requestId){
            cancelAnimationFrame(this.requestId);
            this.requestId = undefined;
        }
    }
}