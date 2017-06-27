Game.Run = function (game) {

    "use strict"

    this.game      //  a reference to the currently running game (Phaser.Game)
    this.add      //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera    //  a reference to the game camera (Phaser.Camera)
    this.cache     //  the game cache (Phaser.Cache)
    this.input     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load      //  for preloading assets (Phaser.Loader)
    this.math      //  lots of useful common math operations (Phaser.Math)
    this.sound     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage     //  the game stage (Phaser.Stage)
    this.time      //  the clock (Phaser.Time)
    this.tweens    //  the tween manager (Phaser.TweenManager)
    this.state     //  the state manager (Phaser.StateManager)
    this.world     //  the game world (Phaser.World)
    this.particles //  the particle manager (Phaser.Particles)
    this.physics   //  the physics manager (Phaser.Physics)
    this.rnd      //  the repeatable random number generator (Phaser.RandomDataGenerator)

    this.feedback
    this.stats
    this.trial = 0;
    this.balanceFriction = 400
    this.balance = []
    this.balanceY = 350
    this.cBalanceX = 272
    this.uBalanceX = 678
    this.problem = [0,0,0];
    this.submitted = false;
    this.buttonPressed = 'none'
    this.answer = 'none'
    this.userDropped = false
    this.startDispensing = null
    this.stopDispensing = null
    this.numGraded = 0
    this.points = 0
    this.reps = 0
    this.streak = 0
};

Game.Run.prototype = {

  init: function(week, problem_set) {
    this.week = week
    this.problem_set = problem_set
  },

  create: function () {
    problems = problemGen(this.week, this.problem_set)
    reProblems = problemGen(this.week, this.problem_set) //repeat problem set in SPT
    this.op1s = problems[1].concat(reProblems[1])
    this.op2s = problems[2].concat(reProblems[2])
    this.problem_ids = problems[3].concat(reProblems[3])

    //this.op1s = [12,10]
    //this.op2s = [12,8]
    //this.problem_ids = [2,2]
    //task info
    this.task = 'VS_verification'
    task_type = 'VS'

    //this.logger - new Logger(this.task, this)

    this.points = 0

    equivalenceGen(false)
    this.equivalence = equivalence
    equivalenceGen(false)
    this.equivalence = this.equivalence.concat(equivalence)

    //this.equivalence = [2,2]

    this.game.world.setBounds(0, 0, 960, 600);
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.restitution = 0.1;//0.75
    this.game.physics.p2.gravity.y = 600;//400;

    d = new Date()
    this.startTime = d.getTime()

    this.numUserBalls = 0

    trialData = {}
    trialData['ACC'] = []

    this.balance[0] = this.game.add.group()
    this.balance[0].weight = 0
    this.balance[1] = this.game.add.group()
    this.balance[1].weight = 0

    this.scaleGroup = this.game.add.group()

    this.jarCollisionGroup = this.game.physics.p2.createCollisionGroup()
    this.ballCollisionGroup = this.game.physics.p2.createCollisionGroup()

    //first trial
    this.progress = this.game.add.text(this.game.world.centerX*2-100, 560, '1 out of '+this.op1s.length, {font:'30px Arial', fill:'#FFFFFF', align:'center'})
    this.progress.fixedToCamera = true
    this.progress.anchor.x = 0.5

    this.pointDisplay = this.game.add.text(85, 560, 'Coins: ' + this.points, {font:'30px Arial', fill:'#FFFFFF', align:'center'})
    this.pointDisplay.anchor.x = 0.5
    this.pointDisplay.fixedToCamera = true

    this.leftBeam = this.game.add.sprite(this.cBalanceX,this.balanceY,'board')
    this.leftBeam.scale.x = 4
    this.leftBeam.scale.y = 5//6
    this.leftBeam.anchor.x = 0.5
    this.leftBeam.anchor.y = 0.5
    this.leftBeam.enableBody = true
    this.game.physics.p2.enableBody(this.leftBeam)
    this.leftBeam.body.immovable = true
    this.leftBeam.body.static = true
    this.leftBeam.body.setCollisionGroup(this.jarCollisionGroup)
    this.leftBeam.body.collides([this.ballCollisionGroup])
    this.balance[0].add(this.leftBeam)

    this.rightBeam = this.game.add.sprite(this.uBalanceX,this.balanceY,'board')
    this.rightBeam.scale.x = 4
    this.rightBeam.scale.y = 5//6
    this.rightBeam.anchor.x = 0.5
    this.rightBeam.anchor.y = 0.5
    this.game.physics.p2.enableBody(this.rightBeam)
    this.rightBeam.body.immovable = true
    this.rightBeam.body.static = true
    this.rightBeam.body.setCollisionGroup(this.jarCollisionGroup)
    this.rightBeam.body.collides([this.ballCollisionGroup])

    this.balance[1].add(this.rightBeam)

    this.waterBase1 = this.makeWaterBase(168, 300, 'small')
    this.waterBase1.anchor.y = 1
    this.waterBase1.height = 0

    this.waterBase2 = this.makeWaterBase(368, 300, 'small')
    this.waterBase2.anchor.y = 1
    this.waterBase2.height = 0
    this.balance[0].add(this.waterBase1)
    this.balance[0].add(this.waterBase2)

    this.waterBase3 = this.makeWaterBase(663,300, 'small')
    this.waterBase3.anchor.y = 1
    this.waterBase3.height = 0
    this.balance[1].add(this.waterBase3)

    measure1 = this.game.add.sprite(-95,31,'measurer')
    measure1.height = measure1.height/1.5
    measure1.width = measure1.width*1.8
    this.balance[0].add(measure1)

    measure2 = this.game.add.sprite(105,31,'measurer')
    measure2.height = measure2.height/1.5
    measure2.width = measure2.width*1.8
    this.balance[0].add(measure2)

    measure3 = this.game.add.sprite(400,31,'measurer')
    measure3.height = measure3.height/1.5
    measure3.width = measure3.width*1.8
    this.balance[1].add(measure3)

    this.pivot = this.game.add.sprite(480,440,'board')
    this.pivot.anchor.x = 0.5
    this.pivot.anchor.y = 0.5
    this.pivot.width = this.pivot.width*4
    this.pivot.height = this.pivot.height*2
    this.scaleGroup.add(this.pivot)

    this.attach1 = this.game.add.sprite(270,400,'board')
    this.attach1.anchor.x = 0.5
    this.attach1.anchor.y = 0.5
    this.attach1.height = this.attach1.height*13
    this.attach1.width = this.attach1.width/2
    this.balance[0].add(this.attach1)

    this.attach2 = this.game.add.sprite(670,400,'board')
    this.attach2.anchor.x = 0.5
    this.attach2.anchor.y = 0.5
    this.attach2.height = this.attach2.height*13
    this.attach2.width = this.attach2.width/2
    this.balance[1].add(this.attach2)

    this.triangle = this.game.add.sprite(475,435,'triangle')
    this.triangle.anchor.x = 0.5
    this.triangle.anchor.y = 0.5
    this.triangle.height = this.triangle.height/2
    this.triangle.width = this.triangle.width/2
    this.scaleGroup.add(this.triangle)

    this.pp1 = this.game.add.sprite(475,440,'circle')
    this.pp1.anchor.x = 0.5
    this.pp1.anchor.y = 0.5
    this.pp1.height = this.pp1.height/6
    this.pp1.width = this.pp1.width/6
    this.scaleGroup.add(this.pp1)

    this.pp2 = this.game.add.sprite(270,440,'circle')
    this.pp2.anchor.x = 0.5
    this.pp2.anchor.y = 0.5
    this.pp2.height = this.pp2.height/6
    this.pp2.width = this.pp2.width/6
    this.balance[0].add(this.pp2)

    this.pp3 = this.game.add.sprite(670,440,'circle')
    this.pp3.anchor.x = 0.5
    this.pp3.anchor.y = 0.5
    this.pp3.height = this.pp3.height/6
    this.pp3.width = this.pp3.width/6
    this.balance[1].add(this.pp3)
    this.game.world.bringToTop(this.balance[1])

    this.nextTrial()

    //this.blurX = this.game.add.filter('BlurX');
    //this.blurY = this.game.add.filter('BlurY');
    //this.threshold = this.game.add.filter('Threshold');

    //this.blurX.blur = 15//20; //100
    //this.blurY.blur = 15//20;//25; //1

  },

  drawScale: function(x,value) {
    hashes = this.game.add.group()
    hashY = 103
    for (i = 0; i < 35; i++) {
      if (35-i == value) {
        lineWidth = 4
        lineStart = -70
        lineEnd = 90
      } else {
        lineWidth = 2
        lineStart = 0
        lineEnd = 20
      }
      hashMark = this.game.add.graphics(x+lineStart,hashY)
      hashMark.lineStyle(lineWidth, 0xFFFFFF)
      hashMark.lineTo(lineEnd,0)
      hashes.add(hashMark)
      hashY = hashY + 6
    }
    return hashes
  },

  makeWaterBase: function(x,y, type) {
    water_base = this.game.add.sprite(x,y+13,'water_base')
    water_base.width = water_base.width-3
    left_wall = this.game.add.sprite(x-47,0,'board')
    right_wall = this.game.add.sprite(x+47,0,'board')
    this.game.physics.p2.enableBody(water_base)
    water_base.body.setCollisionGroup(this.jarCollisionGroup)
    water_base.body.collides([this.ballCollisionGroup])
    water_base.body.static = true

    left_wall.height = left_wall.height*100
    left_wall.width = 10
    this.game.physics.p2.enableBody(left_wall)
    left_wall.body.setCollisionGroup(this.jarCollisionGroup)
    left_wall.body.collides([this.ballCollisionGroup])
    left_wall.body.static = true
    left_wall.alpha = 0

    right_wall.height = left_wall.height*100
    right_wall.width = 10
    this.game.physics.p2.enableBody(right_wall)
    right_wall.body.setCollisionGroup(this.jarCollisionGroup)
    right_wall.body.collides([this.ballCollisionGroup])
    right_wall.body.static = true
    right_wall.alpha = 0

  return water_base
  },

  makeButtons: function() {
    d = new Date()
    this.start_time = d.getTime()

    this.equal = this.game.add.button(500, 500, 'equalB')
    this.equal.scale.x = .3
    this.equal.scale.y = .3
    this.equal.onInputDown.add(function() {
      this.buttonPressed = 'equal'
      newd = new Date();
      this.RT = newd.getTime() - this.start_time;
      //check to see if they are correct
      //if (this.equalBool) {
      //  this.coin.visible = true
      //}
      this.adjustBalance()
      this.unequal.kill()
      this.equal.kill()
      that = this
      setTimeout(function() {
        that.grade(that.start_time)
      }, 1000)
    }, this)

    this.unequal = this.game.add.button(340, 500, 'unequalB')
    this.unequal.scale.x = 0.3
    this.unequal.scale.y = 0.3
    this.unequal.onInputDown.add(function() {
      this.buttonPressed = 'unequal'
      newd = new Date();
      this.RT = newd.getTime() - this.start_time;
      //check to see if they are correct
      //if (!this.equalBool) {
      //  this.coin.visible = true
      //}
      this.adjustBalance()
      this.unequal.kill()
      this.equal.kill()
      that = this
      setTimeout(function() {
        that.grade(that.start_time)
      }, 1000)
    }, this)
  },

  grade: function(time_stamp) {
    if (this.buttonPressed == 'equal' && this.equivalence[this.trial-1] == 1) { //it is equal and they are correct
      this.answer = 'correct'
      this.points += 1
    } else if (this.buttonPressed == 'equal' && this.equivalence[this.trial-1] == 2) { //it is equal and they are incorrect
      this.answer = 'incorrect'
      if (this.points == 0) {
        this.points = 0
      } else {
        this.points -= 1
      }
    } else if (this.buttonPressed == 'unequal') {
      if (this.equivalence[this.trial-1] == 2) { //it is unequal and they are correct
        this.answer = 'correct'
        this.points += 1
      } else  { //it is unequal and they are incorrect
        this.answer = 'incorrect'
        if (this.points == 0) {
          this.points = 0
        } else {
          this.points -= 1
        }
      }
    }

    if (this.answer == "incorrect") {
      this.reps += 1
      this.streak = 0
      giveFeedback(this, false, this.streak,'vnt',480, 500, "60px Arial")
    } else {
      if (this.reps == 0) {
        this.streak += 1
      }
      this.reps = 0
      giveFeedback(this, true, this.streak,'vnt',480, 500, "60px Arial")
    }

    if (this.streak == 3 || this.streak == 7 || this.streak == 12) {
      this.points += 1
    }

    this.balance[0].weight = 0
    this.balance[1].weight = 0

    that = this
    setTimeout(function() {

    comp1Text = that.game.add.text(143,that.waterBase1.y-(6*that.problem[0])-20,that.problem[0], {font: "50px Arial", fill: "#FFFFFF", align: "center"});
    comp1Text.anchor.y = 0.5
    that.balance[0].add(comp1Text)

    comp2Text = that.game.add.text(343,that.waterBase2.y-(6*that.problem[1])-20,that.problem[1], {font: "50px Arial", fill: "#FFFFFF", align: "center"});
    comp2Text.anchor.y = 0.5
    that.balance[0].add(comp2Text)

    userText = that.game.add.text(633,that.waterBase3.y-(6*that.numUserBalls)-20,that.numUserBalls, {font: "50px Arial", fill: "#FFFFFF", align: "center"});
    userText.anchor.y = 0.5
    that.balance[1].add(userText)

    hash1 = that.drawScale(195,that.problem[0])
    that.balance[0].add(hash1)

    hash2 = that.drawScale(395,that.problem[1])
    that.balance[0].add(hash2)

    hash3 = that.drawScale(690,that.numUserBalls)
    that.balance[1].add(hash3)

    if (that.equivalence[that.trial-1] == 1) {
      equalSign = that.game.add.text(510, that.balance[0].y+200,'=', {font: "60px Arial", fill: "#FFFFFF", align: "center"});
    } else {
      equalSign = that.game.add.text(510, that.balance[0].y+200,'≠', {font: "60px Arial", fill: "#FFFFFF", align: "center"});
    }
    plus = that.game.add.text(255, that.balance[0].y+200,'+', {font: "60px Arial", fill: "#FFFFFF", align: "center"});

    that.endTrial()
    setTimeout(function() {
      comp1Text.kill()
      comp2Text.kill()
      userText.kill()
      plus.kill()
      equalSign.kill()
      hash1.forEach(function (h) { h.kill() })
      hash2.forEach(function (h) { h.kill() })
      hash3.forEach(function (h) { h.kill() })

      that.game.add.tween(that.waterBase1).to({
        height: 0
      },500, Phaser.Easing.Quadratic.Out, true)

      that.game.add.tween(that.waterBase2).to({
        height: 0
      },500, Phaser.Easing.Quadratic.Out, true)

      that.game.add.tween(that.waterBase3).to({
        height: 0
      },500, Phaser.Easing.Quadratic.Out, true)

      that.adjustBalance()

    }, 2000) //1750

  }, 1100) //1100

  //this.save(this.numGraded)

  },

  save: function (curr_trial) {
    if (this.buttonPressed == 'equal') {
      this.logger.inputData('answer', 0)
    } else {
      this.logger.inputData('answer', 1)
    }

    this.logger.inputData('problem', [this.problem[0],' + ',this.problem[1],' = ',this.ballsToDrop].join(""))
    this.logger.inputData('RT', this.RT/1000)
    this.logger.inputData('n1', parseInt(this.problem[0]))
    this.logger.inputData('n2', parseInt(this.problem[1]))
    this.logger.inputData('points', this.points)
    this.logger.inputData('problem_id', parseInt(this.problem[3]))
    this.logger.inputData('solution', parseInt(this.problem[2]))

    if (this.answer == 'correct') {
      this.logger.inputData('ACC', 1)
      trialData.ACC[curr_trial-1] == 1
    } else  {
      this.logger.inputData('ACC', 0)
      trialData.ACC[curr_trial-1] == 0
    }

    this.numGraded++
    if (this.trial >= this.op1s.length && this.answer == 'correct') {
      this.logger.inputData('finished', 1)
    } else {
      this.logger.inputData('finished', 0)
    }

    this.logger.sendData(this.numGraded)

  },

  nextTrial: function() {
    var d = new Date();
    this.start_time = d.getTime();
      if (this.op1s[this.trial] <= 9) {
          op1 = '  ' + this.op1s[this.trial];
      } else { op1 = this.op1s[this.trial];}

      if (this.op2s[this.trial] <= 9) {
          op2 = '  ' + this.op2s[this.trial];
      } else { op2 = this.op2s[this.trial];}
      this.problem[0] = +op1;
      this.problem[1] = +op2;
      this.problem[2] = +op1 + +op2;
      this.problem[3] = this.problem_ids[this.trial]
    if (this.answer == "incorrect") {
        this.op1s.push(this.op1s[this.trial])
        this.op2s.push(this.op2s[this.trial])
        this.problem_ids.push(this.problem_ids[this.trial])
        this.equivalence.push(this.equivalence[this.trial])
    }
    if (this.trial == 0) {
      this.progress.setText(1 + ' out of '+this.op1s.length)
      this.pointDisplay.setText("Coins: " + this.points)
    } else {
      this.progress.setText(this.trial+1 + ' out of '+this.op1s.length)
      this.pointDisplay.setText("Coins: " + this.points)
    }
    this.trial++

    this.dropBall()
    this.waterTable()

    this.numCompBalls = this.problem[2]
    this.balance[0].weight = (3000 * this.numCompBalls)

  },

  makeBalls: function(x,numBalls,bal) {
    numBalls = 15
    y = 300
    for (i = 0; i < numBalls; i++) {
      if (i < 8) {
        ball = this.game.add.sprite(x-45+(i*8),y,"balls")
      } else {
        ball = this.game.add.sprite(x-45+((i-8)*8),y-6,"balls")
      }
      //ball = this.game.add.sprite(x,(60-i*20),"balls")
      //ball.width = ball.width/2
      //ball.height = ball.height/2
      this.game.physics.p2.enableBody(ball)
      ball.body.setCircle(ball.width * 0.3); //0.3
      ball.body.setCollisionGroup(this.ballCollisionGroup)
      ball.body.collides([this.jarCollisionGroup, this.ballCollisionGroup])//, this.leftBall2CollisionGroup])
      //ball.body.mass = 50
      //ball.body.damping = 0.3;
      this.balance[bal].add(ball)
      //ball.filters = [this.blurX, this.blurY,this.threshold]
      //ball.filterArea = this.game.camera.view;
    }
  },

  dropBall: function() {

    if (this.equivalence[this.trial-1] == 1) {
      this.equalBool = true
    } else {
      this.equalBool = false
    }
    if (this.equalBool) {
      this.coin = this.game.add.sprite(540,500,'coin')
    } else {
      this.coin = this.game.add.sprite(380,500,'coin')
    }
    this.coin.visible = false
    this.ballsToDrop = unequalGen(this.equalBool, this.problem[2], this.problem[0], this.problem[1])
    this.numUserBalls = this.ballsToDrop
    this.balance[1].weight = (3000 * this.numUserBalls)
    that = this
    setTimeout(function() {
      that.makeButtons()
    }, 2000)
  },

  dropCompBall: function() {
    var that = this
    setTimeout(function() {
      setTimeout(function() {
        that.comp2Dropped = true
      }, 10) //2500
    }, 10) //3000

      setTimeout(function() {
        that.comp1Dropped = true
        setTimeout(function() {
          setTimeout(function() {
            that.userDropped = true
          }, 10) //2500
          that.dropBall()
        }, 10) //3500
      }, 10)
  },

  adjustBalance: function() {
    this.submitted = true

    weightDiff = ((this.balance[0].weight-this.balance[1].weight)/this.balanceFriction)
    if (weightDiff > this.game.height/3) { //edge cases
      weightDiff = this.game.height/3
    }
    if (weightDiff < -this.game.height/3) {
      weightDiff = -this.game.height/3
    }

    angDiff = (-weightDiff)/4

    balanceTweenComp = this.game.add.tween(this.balance[0]).to({
      y: weightDiff
    }, 1000, Phaser.Easing.Quadratic.Out, true)

    balanceTweenUser = this.game.add.tween(this.balance[1]).to({
      y: -weightDiff
    }, 1000, Phaser.Easing.Quadratic.Out, true)

    pivotTween = this.game.add.tween(this.pivot).to({
      angle: angDiff
    }, 1000, Phaser.Easing.Quadratic.Out, true)

  },

  waterTable: function() {

    waterLevel1 = 6*this.problem[0]
    waterLevel2 = 6*this.problem[1]
    waterLevel3 = 6*this.ballsToDrop

    that = this
    setTimeout(function() {
      that.game.add.tween(that.waterBase1).to({
        height: waterLevel1
      },700, Phaser.Easing.Quadratic.Out, true)

      that.game.add.tween(that.waterBase2).to({
        height: waterLevel2
      },700, Phaser.Easing.Quadratic.Out, true)

      that.game.add.tween(that.waterBase3).to({
        height: waterLevel3
      },700, Phaser.Easing.Quadratic.Out, true)
    },700)
  },

  endTrial: function() {
    var that = this
    if ((this.trial) >= this.op1s.length && this.answer == 'correct') {
      this.pointDisplay.setText("Coins: " + this.points)
      if (this.coin) {
        this.game.world.remove(this.coin)
      }
      setTimeout(function() {
        that.quitGame();
      }, 2500)
    } else {
      this.pointDisplay.setText("Coins: " + this.points)
      if (this.coin) {
        this.game.world.remove(this.coin)
      }
      setTimeout(function() {
        that.nextTrial()
      }, 2500)
    }
  },

  update: function() {
  },

  quitGame: function () {
      this.balance[0].destroy()
      this.balance[1].destroy()
      this.scaleGroup.destroy()
      this.game.world.remove(this.pointDisplay)
      this.game.world.remove(this.progress)

      d = new Date()
      endTime = d.getTime()

      this.gameFinished = false

      //Let them know it's done...
      this.game.time.events.add(Phaser.Timer.SECOND, function () {
        endText = this.game.add.text(this.game.width/2, 150, 'All done!', {'font': '70px Arial', 'fill':'#fff'});
        endText.anchor.x = 0.5
        finalPoints = this.game.add.text(this.game.width/2, 250, 'You got ' + this.points + ' points', {font:'70px Arial', fill:'#FFFFFF', align:'center'});
        finalPoints.anchor.x = 0.5
        totalPoints = this.points
        this.points = 0
        //  Then let's go back to the main menu.
        //this.game.time.events.add(Phaser.Timer.SECOND * 2, function() {this.state.start('Menu', true, false, this.problem_set);}, this);
      }, this);
  }
};
