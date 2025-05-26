/************************************

THE GAME SCENE. THE BIG 'UN.

ACT I - Teaching controls, showing main feedback loop
ACT II - Crazed Square, Nervous Circle, Snobby Square...
ACT III - Angry escalation! And lovers protest!
ACT IV - MURDER AND VIOLENCE AND AHHHHHH. #BeScaredBeAngry

(different scene...)
ACT V - Post-credits peace

*************************************/

function Scene_Game(){

	var self = this;
	Scene.call(self);

	////////////
	// SET UP //
	////////////

    // Graphics!
    var g = new PIXI.Container();
    self.graphics = g;
    Game.stage.addChild(g);

	// Set Up Everything
    self.world = new World(self);
    self.camera = new Camera(self);
    self.director = new Director(self);
    self.tv = new TV(self);
    self.world.addProp(self.tv);

    // Special effects!
    self.scale = 1;
    self.x = self.y = self.offX = self.offY = 0;
    self.shaker = new ScreenShake(self);
    self.zoomer = new ScreenZoomOut(self);

    // Avoid these spots.
    self.avoidSpots = [];

    // TIMER
    self.timerDuration = 5 * 60 * 1000;
    self.timerStart = null;
    self.timerActive = false;
    self.timerText = null;

    // START TIMER
    self.startTimer = function() {
        self.timerStart = Date.now();
        self.timerActive = true;
        if(!self.timerText) {
            var style = new PIXI.TextStyle({
                fontFamily: 'Arial',
                fontSize: 32,
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4,
                align: 'right',
            });
            self.timerText = new PIXI.Text("05:00", style);
            self.timerText.anchor.set(1, 0);
            self.timerText.x = Game.width - 20;
            self.timerText.y = 20;
        }
        if (!Game.stage.children.includes(self.timerText)) {
            Game.stage.addChild(self.timerText);
        }
    };

    // STOP TIMER
    self.stopTimer = function() {
        self.timerActive = false;
        if (self.timerText && Game.stage.children.includes(self.timerText)) {
            Game.stage.removeChild(self.timerText);
        }
    };

    // TIME'S UP
    self.showGameOver = function() {
        self.stopTimer();

        var style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 64,
            fill: '#ff3333',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center',
        });
        var gameOverText = new PIXI.Text("GAME OVER", style);
        gameOverText.anchor.set(0.5, 0.5);
        gameOverText.x = Game.width / 2;
        gameOverText.y = Game.height / 2;
        Game.stage.addChild(gameOverText);

        setTimeout(function() {
            Game.stage.removeChild(gameOverText);
            Game.sceneManager.gotoScene("Credits");
        }, 3000);
    }

    // UPDATE
    self.update = function(){
        
        self.world.update();
        self.camera.update();
        self.director.update();

        // This order is important
        self.zoomer.update();
        self.shaker.update();
        g.scale.x = g.scale.y = self.scale;
        g.x = self.x + self.offX;
        g.y = self.y + self.offY;
        self.zoomer.fixLaptop(); // hack.

        // TOTALLY A HACK
        var ratio = self.zoomer.timer/self.zoomer.fullTimer;
        ratio = (1-ratio)/1;
        self.shaker.baseAlpha = 0.15 + ratio*0.45;

        // TIMER LOGIC
        if (self.timerActive && self.timerStart && self.timerText) {
            var elapsed = Date.now() - self.timerStart;
            var remaining = Math.max(0, self.timerDuration - elapsed);
            var minutes = Math.floor(remaining / 60000);
            var seconds = Math.floor((remaining % 60000) / 1000);
            self.timerText.text =
                (minutes < 10 ? "0" : "") + minutes + ":" +
                (seconds < 10 ? "0" : "") + seconds;

            if (remaining <= 0) {
                self.timerActive = false;
                self.showGameOver();
            }
        }
    };

	// TO IMPLEMENT
	self.kill = function(){};

    // Going to a Stage
    self.go = function(sceneFunc){
        sceneFunc(self);
        self.update();
    };

    /////////////
    // FADE IN //
    /////////////

    var blackout = MakeSprite("blackout");
    Game.stage.addChild(blackout);
    Tween_get(blackout).to({alpha:0}, _s(BEAT), Ease.quadInOut).call(function(){
        Game.stage.removeChild(blackout);
    });

    ////////////
    // STAGES //
    ////////////

    Stage_Start(self);
    self.startTimer();
    Stage_Hat(self); // renable later
    //Stage_Lovers(self);
    //Stage_Screamer(self, true);
    //Stage_Nervous(self, true);
    //Stage_Snobby(self, true);
    //Stage_Angry_Escalation(self, true);
    // Stage_Evil(self, true);

}