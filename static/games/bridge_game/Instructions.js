Game.Instructions = function(game) {

  "use strict";

  this.game;      //  a reference to the currently running game (Phaser.Game)
  this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
  this.camera;    //  a reference to the game camera (Phaser.Camera)
  this.cache;     //  the game cache (Phaser.Cache)
  this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
  this.load;      //  for preloading assets (Phaser.Loader)
  this.math;      //  lots of useful common math operations (Phaser.Math)
  this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
  this.stage;     //  the game stage (Phaser.Stage)
  this.time;      //  the clock (Phaser.Time)
  this.tweens;    //  the tween manager (Phaser.TweenManager)
  this.state;     //  the state manager (Phaser.StateManager)
  this.world;     //  the game world (Phaser.World)
  this.particles; //  the particle manager (Phaser.Particles)
  this.physics;   //  the physics manager (Phaser.Physics)
  this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

  this.feedback
  this.stats
  this.trial = 0
  this.problem = [0,0,0]
  this.blockLength = 20
  this.bridgeY = 475
  this.compX = 175
  this.clickMargin = 50
  this.fallen = false
  this.iters = 0
  this.stopFall = false
  this.numGraded = 0
  this.RT
  this.RTb = 0
  this.prevTime = 0
  this.numFeedback = 'null'
  this.gameFinished = 'null'
  this.reps = 0
  this.streak = 0
  this.rmInstructB = false
  this.inst_num = 1
  this.inst_finished = false


};

Game.Instructions.prototype = {

  init: function(problem_set) {
    this.problem_set = problem_set
  },

  create: function () {
    problems = problemGen(this.week, this.problem_set)
    this.op1s = [1]
    this.op2s = [2]
    this.problem_ids = [0]
    this.numProblems = this.op1s.length

    //task info
    this.task = 'VS_missing'
    task_type = 'VS'

    this.points = 0

    //initializing subject for this game
    //this.results = set_up_subject(this.task)
    //user = this.results[0]
    //session = this.results[1]
    //play = this.results[2]
    //this.subject = new Subject(user, this.task, task_type, this.problem_set, session, play)

    this.game.world.setBounds(0,0,this.op1s.length*1000,600)
    //this.game.add.tileSprite(0,0,this.op1s.length*1000,600,'background')
    //this.game.stage.backgroundColor = '#02625B'

    d = new Date()
    this.startTime = d.getTime()

    this.progress = this.game.add.text(860, 560, '1 out of 1', {font:'30px Arial', fill:'#FFFFFF', align:'center'})
    this.progress.fixedToCamera = true
    this.progress.anchor.x = 0.5

    this.pointDisplay = this.game.add.text(85, 560, 'Coins: ' + this.points, {font:'30px Arial', fill:'#FFFFFF', align:'center'})
    this.pointDisplay.anchor.x = 0.5
    this.pointDisplay.fixedToCamera = true

    this.nextTrial()

    this.game.physics.startSystem(Phaser.Physics.BOX2D)

    //creating cloud group
    this.clouds = this.game.add.group()
    this.coins = this.game.add.group()
    this.coins.enableBody = true
    this.clouds.enableBody = true

    this.cCloud = this.clouds.create(this.compX-100,this.bridgeY + 48,'cloud')
    this.cCloud.anchor.setTo(0.5,1)
    this.cCloud.scale.setTo(0.7, 0.45)
    this.cCloud.body.immovable = true

    for (i = 0; i < this.numProblems; i++) {
      this.gapLength = this.op1s[i] + this.op2s[i]
      if (i == 0) {
        currCloudx = this.compX + this.blockLength * this.problem[2] - this.blockLength/2
      } else {
        currCloudx = currCloudx + this.cCloud.width + this.blockLength*this.gapLength - 45
      }
      this.Ucloud = this.clouds.create(currCloudx, this.bridgeY + 5, 'cloud')
      this.Ucloud.scale.setTo(0.7,0.45);
      this.Ucloud.body.immovable = true;

      coin = this.coins.create(currCloudx+215, this.bridgeY - 35, 'coin')
    }

    //adding our dude
    this.makeDude()

    //add initial blocks
    this.makeBridges()

    this.compText = this.game.add.text(0,0,0,{font: "60px Arial", fill: "#FFFFFF", align: "center"})
    this.compText.visible = false

    //mouse/touch handlers
    this.game.input.onDown.add(this.mouseDragStart, this);
    this.game.input.addMoveCallback(this.mouseDragMove, this);
    this.game.input.onUp.add(this.mouseDragEnd, this);

    //button to make bridge fall
    this.cross = this.game.add.button(this.game.camera.width/2, 25, 'crossB')
    this.cross.visible = false
    this.cross.anchor.x = 0.5
    this.cross.onInputUp.add(function() {
      if (this.compBridge.length == this.problem[0] && this.inst_finished) {
        if (this.last_inst) {
          this.game.world.remove(this.instruct_text)
          this.game.world.remove(this.back_ground)
          this.rmInstructB = true
        }
        frameIntervals = [14,15,16,17,18,19,20] //making own timer according to intervals b/w frames
        timeStep = frameIntervals[Math.floor(Math.random() * frameIntervals.length)];
        this.RT = this.RTb * timeStep
        this.RTb = 1
        this.fallen = true
      }
    }, this)
    this.cross.fixedToCamera = true;


    if (this.is_touch_device()) {
      this.clickType = this.game.input.pointer1
    } else {
      this.clickType = this.game.input.mousePointer
    }

    this.instruct(this.inst_num)

  },

  makeBox: function(x,y,width,height) {
    rect = this.game.add.graphics(x,y)
    rect.lineStyle(2, 0x13bee3, 1);
    rect.beginFill(0x0c3ef0, 1)
    rect.drawRect(0,0, width, height)
    return rect
  },

  instruct: function(num) {
    if (num == 1) {
      this.occluder = this.game.add.graphics(this.game.world.centerX-100,0)
      this.occluder.beginFill(0x000000, 1)
      this.occluder.drawRect(0,0, 200, 100)

      instruct_text = that.game.add.text(this.game.world.centerX,250,"Your job in this game is to make a bridge so your character can cross safely \nand get the coin on the other side.",
      {font: "20px Arial", fill: "#FFFFFF", align: "center"})
      instruct_text.anchor.x = (0.5,0.5)
      this.nextB = this.add.button(this.game.world.centerX, 320, 'next', function () {
        this.game.world.remove(instruct_text)
        this.rmInstructB = true
      }, this);
      this.inst_finished = false
      this.nextB.anchor.x = (0.5,0.5)
      this.nextB.scale.setTo(0.5,0.5)
      this.back_ground = this.makeBox(this.game.world.centerX-instruct_text.width/2-10,instruct_text.y-10,instruct_text.width+10,instruct_text.height+60)
      this.game.world.sendToBack(this.back_ground)
    } else if (num == 2) {
      instruct_text = that.game.add.text(this.game.world.centerX,275,"The bridge needs to be as long as the number above.",
      {font: "20px Arial", fill: "#FFFFFF", align: "center"})
      instruct_text.anchor.x = (0.5,0.5)
      this.nextB = this.add.button(this.game.world.centerX, 320, 'next', function () {
        this.game.world.remove(instruct_text)
        this.rmInstructB = true
      }, this);
      this.inst_finished = false
      this.nextB.anchor.x = (0.5,0.5)
      this.nextB.scale.setTo(0.5,0.5)
    } else if (num == 3) {
      instruct_text = that.game.add.text(this.game.world.centerX,275,"You can't move the left side of the bridge.",
      {font: "20px Arial", fill: "#FFFFFF", align: "center"})
      instruct_text.anchor.x = (0.5,0.5)
      this.nextB = this.add.button(this.game.world.centerX, 320, 'next', function () {
        this.game.world.remove(instruct_text)
        this.rmInstructB = true
      }, this);
      this.inst_finished = false
      this.nextB.anchor.x = (0.5,0.5)
      this.nextB.scale.setTo(0.5,0.5)
    } else if (num == 4) {
      instruct_text = that.game.add.text(this.game.world.centerX,275,"But you can drag the blocks up on the right side to complete the bridge.",
      {font: "20px Arial", fill: "#FFFFFF", align: "center"})
      instruct_text.anchor.x = (0.5,0.5)
      this.nextB = this.add.button(this.game.world.centerX, 320, 'next', function () {
        this.game.world.remove(instruct_text)
        this.rmInstructB = true
      }, this);
      this.inst_finished = false
      this.nextB.anchor.x = (0.5,0.5)
      this.nextB.scale.setTo(0.5,0.5)
    } else if (num == 5) {
      this.occluder.visible = false
      instruct_text = that.game.add.text(this.game.world.centerX,250,"If your bridge is too long the sides will collide and you'll have to try again.\nIf your bridge is too short your character will fall through the gap!",
      {font: "20px Arial", fill: "#FFFFFF", align: "center"})
      instruct_text.anchor.x = (0.5,0.5)
      this.nextB = this.add.button(this.game.world.centerX, 320, 'next', function () {
        this.game.world.remove(instruct_text)
        this.rmInstructB = true
      }, this);
      this.inst_finished = true
      this.nextB.anchor.x = (0.5,0.5)
      this.nextB.scale.setTo(0.5,0.5)
    } else if (num == 6) {
      this.instruct_text = that.game.add.text(this.game.world.centerX,260,"Go ahead and make a bridge that is the correct length \nand hit the cross button when you're ready.",
      {font: "20px Arial", fill: "#FFFFFF", align: "center"})
      this.instruct_text.anchor.x = (0.5,0.5)
      this.inst_finished = true
      this.last_inst = true
    }
  },

  is_touch_device: function() {
    return (('ontouchstart' in window)
      || (navigator.MaxTouchPoints > 0)
      || (navigator.msMaxTouchPoints > 0))
  },

  makeDude: function() {
    this.dude = this.game.add.sprite(this.cCloud.width - 140,this.bridgeY - 40,'dude');
    this.game.physics.enable(this.dude);
    this.dude.body.bounce.y = 0.3;
    this.dude.body.gravity.y = 400;
    this.dude.body.collideWorldBounds = false;
    this.dude.anchor.setTo(0.5,1);
    this.dude.scale.x = -1; //also flipped
    this.dude.animations.add('right', [0, 1, 2, 3], 10, true);
    this.dude.animations.add('left', [5, 6, 7, 8], 10, true);
  },

  makeBridges: function() {
    //adding problem text
    this.goal = this.game.add.text(this.game.camera.width/2, 100,this.problem[2], {font: "60px Arial", fill: "#FFFFFF", align: "center"})
    this.goal.fixedToCamera = true
    this.goal.anchor.x = 0.5

    this.userY = this.bridgeY + 5
    this.userX = this.compX + this.blockLength * this.problem[2] - this.blockLength + this.blockLength*2
    this.compY = this.bridgeY + 5
    this.compBridge = this.game.add.group();
    this.userBridge = this.game.add.group();
    this.compBridge.enableBody = true;
    this.userBridge.enableBody = true;
    this.numCompBlock = 0
    this.addCompBlock();
    initU = this.userBridge.create(this.userX, this.userY, 'brick');
    initU.body.immovable = true;


  },

  fall: function() {
    if (!this.crossBridge) {
      this.compBridge.x = this.compX+this.blockLength
      this.compBridge.y = this.compY+(this.blockLength*this.compBridge.length-this.blockLength)+this.blockLength
      this.compBridge.pivot.x = this.compX+this.blockLength
      this.compBridge.pivot.y = this.compY+(this.blockLength*this.compBridge.length)

      this.userBridge.x = this.userX
      this.userBridge.y = this.userY+(this.blockLength*this.userBridge.length)
      this.userBridge.pivot.x = this.userX
      this.userBridge.pivot.y = this.userY+(this.blockLength*this.userBridge.length)
    }

    if (this.userBridge.length > this.problem[1]) {
      that = this
      if (this.iters == 1) {
        this.compText.visible = false
        this.userBlockText.visible = false
        if (this.reps != 2) {
          giveFeedback(this, false, this.streak, 'vnt',this.game.camera.width/2, 25, "60px Arial")
          this.numFeedback = this.game.add.text(this.game.camera.width/2, 125, this.problem[0] + ' + ' + this.userBridge.length + ' ≠ ' + this.problem[2], {font: "60px Arial", fill: "#FFFFFF", align: "center"})
          this.numFeedback.anchor.x = 0.5
          this.numFeedback.fixedToCamera = true;
          this.game.time.events.add(1000, function() {
            that.numFeedback.visible = false
            //that.game.add.tween(that.numFeedback).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true)
          }, this)
        }
      }
      if (this.userBridge.length > this.compBridge.length) {
      this.userBridge.forEach(function(block) {
        if (Math.abs(this.compBridge.children[this.compBridge.length-1].world.y - block.world.y) <= 5) {
          if (Math.abs(this.compBridge.children[this.compBridge.length-1].world.x - block.world.x) <= 20) {
            this.stopFall = true
            return
          }
        }
      }, this)
    } else if (this.compBridge.length >= this.userBridge.length) {
      this.compBridge.forEach(function(block) {
        if (Math.abs(block.world.x - this.userBridge.children[this.userBridge.length-1].world.x) <= 10) {
          if (Math.abs(block.world.y - this.userBridge.children[this.userBridge.length-1].world.y) <= 40) {
            this.stopFall = true
            return
          }
        }
      }, this)
    }
    if (this.stopFall) {
      return
    }
    }

    this.userBridge.rotation -= 0.06
    this.compBridge.rotation += 0.06

      if (this.userBridge.rotation <= -Math.PI/2) {
        this.userBridge.rotation = -Math.PI/2
        this.compBridge.rotation = Math.PI/2
        this.fallen = false
    }

    if (this.userBridge.length <= this.problem[1]) {
      this.crossBridge = true
    }
  },

  //need to add logic for ipad stuff
  mouseDragStart: function() {
    //this.game.physics.box2d.mouseDragStart(this.game.input.mousePointer);
    this.mouseDown = true
    //this.game.physics.box2d.dragStart(this.game.input.mousePointer);
  },

  mouseDragMove: function() {
    this.game.physics.box2d.mouseDragMove(this.clickType);
  },

  mouseDragEnd: function() {
    this.game.physics.box2d.mouseDragEnd();
    this.mouseDown = false
  },

  addCompBlock: function() {
    if (this.numCompBlock != 0) {
      this.compY = this.compY - this.blockLength
    }
    if (this.numCompBlock == this.problem[0]-1) {
      topY = this.compY
      stopBuild = true
    }
    if (this.numCompBlock > this.problem[0]) {
      this.compY = topY
    }
    this.numCompBlock = this.numCompBlock + 1
    if (this.numCompBlock <= this.problem[0]) {
      block = this.compBridge.create(this.compX,this.compY,'brick')
      //block.scale.x = -1
      block.body.immovable = true;
      blockAdded = this.game.time.now;
    }

    if (this.compBridge.length == this.problem[0] && stopBuild) {
      that = this
      setTimeout(function() {
        that.compText = that.game.add.text(that.compX+10, topY-20, that.problem[0],{font: "18px Arial", fill: "#FFFFFF", align: "center"})
        that.userBlockText = that.game.add.text(that.userX+10, that.userY-20, that.userBridge.length,{font: "18px Arial", fill: "#FFFFFF", align: "center"})
        that.compText.anchor.x = 0.5
        that.userBlockText.anchor.x = 0.5
        stopBuild = false
      }, 200)
    }

  },

  nextTrial: function () {

    if (this.op1s[this.trial] <= 9) {
        op1 = '  ' + this.op1s[this.trial];
    } else { op1 = this.op1s[this.trial];}

    if (this.op2s[this.trial] <= 9) {
        op2 = '  ' + this.op2s[this.trial];
    } else { op2 = this.op2s[this.trial];}

    if (this.trial == 0) {
      this.gapLength = +op1 + +op2
    }

    this.problem[0] = +op1;
    this.problem[1] = +op2;
    this.problem[2] = +op1 + +op2;
    this.problem[3] = this.problem_ids[this.trial]
    //this.problem[3] = this.s[this.trial]

    this.trial++;
    this.progress.setText(this.trial + ' out of 1')

  },

  stopDude: function() {
    this.dude.body.velocity.x = 0;
    this.dude.animations.stop();
    this.dude.frame = 4
  },

  adjustDude: function() { //this handles an edgecase
    if (this.dude.y >= this.bridgeY + 5) {
      this.dude.body.gravity.y = 10;
      this.dude.body.bounce.y = 0;
      this.dude.y = this.bridgeY + 5
    }
  },

  endTrial: function() {
      d = new Date()
      this.grade(d.getTime());

      if ((this.trial) >= this.op1s.length && this.correct == true) {
        if (this.reps == 0) {
            this.streak += 1
        }
        this.reps = 0
        this.quitGame();
      } else {
        if (this.dude.body.velocity.x != 0) {
          this.stopDude()
        }
        this.crossBridge = false;
        this.numCompBlock = 0;
        if (this.correct == true) {
          if (this.reps == 0) {
              this.streak += 1
          }
          this.reps = 0
          delay = 200
          this.nextTrial()
          this.compX = this.dude.x + 35
        } else {
          this.streak = 0
          this.reps += 1
          if (this.reps == 3000) {
            this.nextTrial()
            if (this.userBridge.length < this.problem[1]) {
              if (this.trial > 0) {
                xAdd = this.game.camera.width
              } else {
                xAdd = this.game.camera.width/2
              }
              this.sryText = this.game.add.text(xAdd-200, 25,'Sorry, the answer is', {font: "70px Arial", fill: "#FFFFFF", align: "center"})
              this.corrTxt = this.game.add.text(xAdd, 125, this.problem[0] + ' + ' + this.problem[1] + ' = ' + this.problem[2], {font: "60px Arial", fill: "#FFFFFF", align: "center"})
              delay = 5000
              sorryD = 3000
            } else {
              this.sryText = this.game.add.text(this.game.camera.width/2-200, 25,'Sorry, the answer is', {font: "70px Arial", fill: "#FFFFFF", align: "center"})
              this.corrTxt = this.game.add.text(this.game.camera.width/2, 125, this.problem[0] + ' + ' + this.problem[1] + ' = ' + this.problem[2], {font: "60px Arial", fill: "#FFFFFF", align: "center"})
              delay = 1000
              sorryD = 1000
            }
            var that = this
            setTimeout(function() {
              that.dude.x = (that.userX + (that.Ucloud.width - 100))
              //that.dude.y = that.bridgeY-3
              that.dude.y = that.bridgeY-10
              that.dude.body.velocity.y = 0
              that.compX = that.dude.x + 35
              that.game.world.remove(that.sryText)
              that.game.world.remove(that.corrTxt)
              that.reps = 0
            }, sorryD)

            // this.dude.x = (this.userX + (this.Ucloud.width - 100))
            // this.dude.y = this.dude.y - 50
            // this.compX = this.dude.x + 35
            // this.reps = 0
          } else {
            if (this.userBridge.length > this.problem[1]) {
              delay = 1000
            } else {
              delay = 3000
            }
          }
        }

        if (this.streak == 3 || this.streak == 7 || this.streak == 12) {
          this.points += 1
        }

        if (this.correct) {
          this.points += 1
        } else {
          if (this.points == 0) {
            this.points = 0
          } else {
            this.points -= 1
          }
        }
        this.pointDisplay.setText("Coins: " + this.points)


        if (this.userBridge.length < this.problem[1] && this.reps != 3) {
          rmDelay = delay
        } else {
          rmDelay = 0
        }

        var that = this

        setTimeout(function() {
          that.game.world.remove(that.userBridge)
          that.game.world.remove(that.compBridge)
          d = new Date()
          that.end_trial = d.getTime()
        }, rmDelay)

        setTimeout(function() {
          that.makeBridges()
          that.correct = false
          that.overlap = 0
          that.iters = 0
        }, delay)
      }
  },

  grade: function(time_stamp) {

    this.numGraded++
    //this.save(this.numGraded)

  },

  save: function (curr_trial) {
    inputData('answer', this.userBridge.length)
    inputData('problem', [this.problem[0],' + ','?',' = ',this.problem[2]].join(""))
    inputData('n1', parseInt(this.problem[0]))
    inputData('n2', parseInt(this.problem[1]))
    inputData('points', this.points)
    inputData('problem_id', parseInt(this.problem[3]))
    inputData('solution', parseInt(this.problem[2]))
    inputData('RT', this.RT/1000)

     if (this.userBridge.length == this.problem[1]) {
      inputData('ACC', 1)
     } else {
      inputData('ACC', 0)
     }

     // if trial number is larger than numer of problems
     // and their answer was correct then the game is finished
     if ((this.trial) >= this.op1s.length && this.correct == true) {
       inputData('finished', 1)
     } else {
       inputData('finished', 0)
     }

     sendData(curr_trial)

  },

  onSubmit: function () {
      this.endTrial();
  },

  longBridgeRmv: function () {
    this.crossBridge = false
    this.stopFall = false
    this.fallen = false
    var that = this
    setTimeout(function(){
      that.onSubmit()
    }, 1000)
  },

  collectCoin: function (dude, coin) {
    coin.kill()
  },

  update: function () {

    if (this.rmInstructB) {
      this.game.world.remove(this.nextB)
      this.rmInstructB = false
      this.inst_num += 1
      this.instruct(this.inst_num)
    }

    this.game.physics.arcade.collide(this.dude,this.clouds)
    this.game.physics.arcade.collide(this.dude,this.userBridge)
    this.game.physics.arcade.collide(this.dude,this.compBridge)
    this.game.physics.arcade.overlap(this.dude,this.coins,this.collectCoin, null, this)

    if (this.numFeedback.visible == true && this.iters % 3 == 0) {
      //this.numFeedback.fill = this.gradient('#FF057A','#8A3F62',60)[this.iters]
    }
    if (this.dude.y > 800 && this.reps != 3) {
      this.dude.y = this.bridgeY-3
      this.dude.x = this.compX - 35
    }

    if (this.iters > 1) {
      this.cross.visible = false
    } else if (this.compBridge.length == this.problem[0]) {
      if (this.RTb == 0) {
        d = new Date()
        this.start_time = d.getTime()
      }
      this.RTb++
      this.cross.visible = true
    }

    this.game.camera.x = this.dude.x - 100

    if (this.fallen && !this.stopFall) {
      this.iters++
      this.game.world.remove(this.goal)
      this.fall()

    }

    if (this.stopFall) {
      this.longBridgeRmv()
    }

    if (this.crossBridge == true) {

        that = this
        if (this.userBridge.length != this.problem[1] && this.iters == 1) {
          this.compText.visible = false
          this.userBlockText.visible = false
          if (this.reps != 2) {
            giveFeedback(this, false, this.streak, 'vnt',this.game.camera.width/2, 25, "60px Arial")
            this.numFeedback = this.game.add.text(this.game.camera.width/2, 125, this.problem[0] + ' + ' + this.userBridge.length + ' ≠ ' + this.problem[2], {font: "60px Arial", fill: "#FFFFFF", align: "center"})
            this.numFeedback.anchor.x = 0.5
            this.numFeedback.fixedToCamera = true;
            this.game.time.events.add(1000, function() {
              that.numFeedback.visible = false
              //that.game.add.tween(numFeedback).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true)
            }, this)
          }
        } else if (this.iters == 1) {
          this.compText.visible = false
          this.userBlockText.visible = false
            giveFeedback(this, true, this.streak, 'vnt',this.game.camera.width/2, 25, "60px Arial")
            this.numFeedback = this.game.add.text(this.game.camera.width/2, 125, this.problem[0] + ' + ' + this.userBridge.length + ' = ' + this.problem[2], {font: "60px Arial", fill: "#FFFFFF", align: "center"})
            this.numFeedback.anchor.x = 0.5
            this.numFeedback.fixedToCamera = true;
            this.game.time.events.add(1000, function() {
              that.numFeedback.visible = false
              //that.game.add.tween(numFeedback).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true)
            }, this)
        }

        this.dude.body.velocity.x = 100;
        this.dude.animations.play('right');

        if (this.userBridge.length + this.problem[0] < this.problem[2]) { //user's bridge is too short
          if (this.dude.x >= (this.compX + (this.problem[0] * this.blockLength)+this.blockLength)) {
            if (this.userBridge.length == this.problem[1] - 1 || this.compBridge.length <= 2) { //edge case; adjust y-value slightly below
              this.crossBridge = false
            }
            this.dude.body.velocity.x = 0;
            this.dude.y = 485
            this.onSubmit()
          }
        } else if ((this.userBridge.length + this.problem[0]) == this.problem[2]) { //user is correct
            this.adjustDude()
            if (this.dude.x >= (this.userX + (this.Ucloud.width - 100))) { //stop him once he gets to this point
              this.correct = true

              if (this.trial == this.op1s.length && this.gameFinished == 'null') {
                this.gameFinished = true
              }
              if (this.gameFinished) {
                this.onSubmit()
              }
              if (this.gameFinished != 'null') {
                this.stopDude()
              }
            }
        }
    } else { // stand still if you're not doing anything else
      this.stopDude()
      this.dude.body.gravity.y = 300
      this.dude.body.bounce.y = 0.3
    }

    if ((this.game.time.now - blockAdded > 250) && this.iters == 0) { //incrementally add comp blocks
      this.addCompBlock(this.compX,this.compY)
    }

    if (this.mouseDown && this.compText.visible == true) {
      this.makeUserBridge();
    }
  },


  removeBlocks: function (item, iter) {
    if (item.y == this.userY) {
      if (item.y != 480) {
        item.destroy()
      }
    }
  },

  makeUserBridge: function () {
    //edge case
    if (this.userY > this.bridgeY + 25) {
      this.userY = this.bridgeY + 25
    }

    if (this.userX > 200) {
      mouseX = this.clickType.x + (this.userX - this.clickType.x)
    } else {
      mouseX = this.clickType.x
    }

    if (this.userY == 500) {
      this.userY = 480
    }

      if (mouseX >= this.userX - this.clickMargin && mouseX <= this.userX + this.clickMargin) {
        if (this.clickType.y <= this.userY - this.blockLength && this.clickType.y >= this.userY - this.clickMargin) {
          this.userY = this.userY - this.blockLength;
          block = this.userBridge.create(this.userX,this.userY,'brick')
          block.body.immovable = true;

          if (this.userBlockText != null) {
            this.game.world.remove(this.userBlockText)
          }
          this.userBlockText = this.game.add.text(this.userX+10, this.userY-20, this.userBridge.length,{font: "18px Arial", fill: "#FFFFFF", align: "center"})
          this.userBlockText.anchor.x = 0.5

        } else if (this.clickType.y >= this.userY + this.blockLength && this.clickType.y <= this.userY + this.clickMargin) {
          this.userBridge.forEach(function(block) {
            this.removeBlocks(block)
          }, this)
          this.game.world.remove(this.userBlockText)
          if (this.userY <= 460) {
            this.userBlockText = this.game.add.text(this.userX+10, this.userY, this.userBridge.length,{font: "18px Arial", fill: "#FFFFFF", align: "center"})
            this.userBlockText.anchor.x = 0.5
          } else {
            this.userBlockText = this.game.add.text(this.userX+10, this.userY-20, this.userBridge.length,{font: "18px Arial", fill: "#FFFFFF", align: "center"})
            this.userBlockText.anchor.x = 0.5
          }
          this.userY = this.userY + 20;
        }
      }

  },

  quitGame: function () {
      d = new Date()
      endTime = d.getTime()

      this.gameFinished = false
      //this.subject.inputData('endGameStats', [this.start_time, endTime, 'completed'])
      //nextTask(this.results[0], this.task)

      this.pointDisplay.setText("Coins: " + 1)


      //Let them know it's done...
      this.game.time.events.add(Phaser.Timer.SECOND, function () {
        instructions = this.game.add.text(490, 150, 'Nice job! Make sense? If so you can get started by pressing the "go" button.\nIf not, you can repeat the instructions by clicking the "back" button\nYou will complete 12 problems in the main game.', {font:'20px Arial', fill:'#FFFFFF', align:'center'});
        instructions.anchor.x = 0.5
        instructions.lineSpacing = -8
        this.back_ground = this.makeBox(this.game.world.centerX-instructions.width/2-15,instructions.y-10,instructions.width+10,instructions.height+140)
        this.game.world.sendToBack(this.back_ground)
        this.go = this.add.button(250, 275, 'go', function () {this.state.start('Run', true, false, this.week, this.problem_set);}, this);
        this.back = this.add.button(650, 275, 'back', function () {

          this.trial = 0
          this.problem = [0,0,0]
          this.blockLength = 20
          this.bridgeY = 475
          this.compX = 175
          this.clickMargin = 50
          this.fallen = false
          this.iters = 0
          this.stopFall = false
          this.numGraded = 0
          this.RT
          this.RTb = 0
          this.prevTime = 0
          this.numFeedback = 'null'
          this.gameFinished = 'null'
          this.reps = 0
          this.streak = 0
          this.rmInstructB = false
          this.inst_num = 1
          this.inst_finished = false
          this.correct = false
          this.crossBridge = false

          this.state.start('Instructions', true, false, this.week, this.problem_set);}, this);


      }, this);


  }
};
