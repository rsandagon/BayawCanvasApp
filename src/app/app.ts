/**
 * Created by jcabresos on 3/27/15.
 */
import kola = require('kola');
import signals = require('kola-signals');
import hooks = require('kola-hooks');

import PIXI = require('pixi.js');
import cat = require('./cat/app');

export interface Kontext extends kola.Kontext {
    setSignal<T>(name: string, hook?: kola.Hook<T>): kola.SignalHook<T>;
    getSignal<T>(name: string): signals.Dispatcher<T>;
    setInstance<T>(name: string, factory: () => T): kola.KontextFactory<T>;
    getInstance<T>(name: string): T;
}


export class App extends kola.App<HTMLElement> {
    renderer;
    stage;
    cat:cat.App;

    initialize(kontext: Kontext, opts?: HTMLElement): void {
        kontext.setSignal('stage.render');

        this.renderer = PIXI.autoDetectRenderer(this.opts.clientWidth, this.opts.clientHeight,{backgroundColor : 0x1099bb});
        this.opts.appendChild(this.renderer.view);

        this.stage = new PIXI.Container();
        this.stage.getBounds().width = this.opts.clientWidth;
        this.stage.getBounds().height = this.opts.clientHeight;

        console.log("opts>" + this.opts.clientWidth);
        console.log(this.stage.getBounds().width);

        for (var i=0 ; i < 400; i++){
            var kitten = new cat.App(this);
            kitten.start({container:this.stage});
        }

        requestAnimationFrame(this.animate.bind(this));
    }

    animate():void {
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.stage);
        this.kontext.getSignal("stage.render").dispatch();
    }

    onStart(): void {
    }


    onStop(): void {
    }
}