/**
 * Created by rsandagon on 3/27/15.
 */
import kola = require('kola');
import signals = require('kola-signals');
import hooks = require('kola-hooks');
import PIXI = require('pixi.js');

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

    onStart(): void {
        this.container = this.opts.container;
        var texture = PIXI.Texture.fromImage('images/cat.png');

        this.sprite = new PIXI.Sprite(texture);

        this.sprite.position.x = 0;
        this.sprite.position.y = 0;

        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this.sprite.on('mousedown', this.onClick);

        this.container.addChild(this.sprite);
        this.listeners.push(this.kontext.getSignal('stage.render').listen(this.updateView, this));
        this.listeners.push(this.kontext.getSignal('stage.clicked').listen(this.followSprite, this));
    }

    onClick(mouseData):void{
        console.log("clicked >" + mouseData);
    }

    followSprite(payload:any):void{
        console.log(payload);
    }

    updateView():void{
    }

    onStop(): void {
        this.container.removeChild(this.sprite);
        this.listeners.forEach((listener: signals.Listener<any>) => {listener.unlisten()});
    }
}