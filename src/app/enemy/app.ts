/**
 * Created by rsandagon on 3/27/15.
 */
import kola = require('kola');
import signals = require('kola-signals');
import hooks = require('kola-hooks');
import PIXI = require('pixi.js');
import models = require('../models');
import bayawApp = require('../bayaw/app');

export interface Kontext extends kola.Kontext {
    setSignal<T>(name: string, hook?: kola.Hook<T>): kola.SignalHook<T>;
    getSignal<T>(name: string): signals.Dispatcher<T>;
    setInstance<T>(name: string, factory: () => T): kola.KontextFactory<T>;
    getInstance<T>(name: string): T;
}


export class App extends kola.App<{container:PIXI.Container}> {
    floodMC;
    listeners: signals.Listener<any>[] = [];
    container:PIXI.Container;
    gameModel: models.GameModel;
    floodTextures = [];

    onStart(): void {
        this.gameModel = <models.GameModel> this.kontext.getInstance('game.model');

        this.container = this.opts.container;
        
        var texture1 = PIXI.Texture.fromImage('images/poddle_1.png');
        var texture2 = PIXI.Texture.fromImage('images/poddle_2.png');
        this.floodTextures = [texture1,texture2];

        this.floodMC = new PIXI.extras.MovieClip(this.floodTextures);
        this.floodMC.animationSpeed = 0.05;
        this.floodMC.play();

        this.floodMC.position.x = this.gameModel.width + 50;
        this.floodMC.position.y = 300;

        this.container.addChild(this.floodMC);
        this.listeners.push(this.kontext.getSignal('stage.render').listen(this.updateView, this));
    }

    updateView():void{
        if (this.gameModel.currentState == models.GameState.PLAYING) {
            this.floodMC.position.x -= models.GameSpeed.GROUND_SPEED;

            if (this.floodMC.position.x < -150){
               this.floodMC.position.x = this.gameModel.width + 50;
            }

            var bayaw = <bayawApp.App> this.kontext.getInstance('player.bayaw');

            if(this.isIntersecting(bayaw.sprite,this.floodMC)){
                bayaw.actHurt();
            }else{

                bayaw.actOk();
            }
        }
    }

    isIntersecting(r1, r2):boolean {
        return !(r2.x > (r1.x + r1.width) ||
            (r2.x + r2.width) < r1.x ||
            r2.y > (r1.y + r1.height) ||
            (r2.y + r2.height) < r1.y);
    }

    onStop(): void {
        this.container.removeChild(this.floodMC);
        this.listeners.forEach((listener: signals.Listener<any>) => {listener.unlisten()});
    }
}