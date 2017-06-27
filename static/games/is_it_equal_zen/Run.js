Game.Run = function (game) {

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

    this.trial = 0
    this.problem = [0,0,0]
    this.timedOut = false
    this.buttonPressed = 'none'
    this.numGraded = 0
    this.points = 0
    this.streak = 0
    this.reps = 0

};

Game.Run.prototype = {

  init: function(maxTime, algebra, problem_set) {
      this.ogMaxTime = maxTime
      this.maxTime = maxTime
      this.problem_set = problem_set
  },

  create: function() {
    problems = problemGen(this.week, this.problem_set)
    reProblems = problemGen(this.week, this.problem_set) //repeat problem set in SPT
    this.op1s = problems[1].concat(reProblems[1])
    this.op2s = problems[2].concat(reProblems[2])
    this.problem_ids = problems[3].concat(reProblems[3])

    //task info
    if (this.maxTime != 0) {
      this.task = 'SP_verification_timed'
    } else {
      this.task = 'SP_verification'
    }
    task_type = 'SP'
    //initializing subject for this game

    //this.results = set_up_subject(this.task)
    //user = this.results[0]
    //session = this.results[1]
    //play = this.results[2]
    //this.subject = new Subject(user, this.task, task_type, this.problem_set, session, play)

    equivalenceGen(true)
    this.equivalence = equivalence

    this.game.world.setBounds(0, 0, 600, 800)
    //background = this.game.add.sprite(0,0,'chalkboard')
    //background.width = this.game.width
    //background.height = this.game.height

    if (this.maxTime != 0) {
      this.pie = new PieProgress(this.game, 900, 50, 32)
      this.game.world.add(this.pie)
      this.clock = this.game.add.tween(this.pie).to({progress: 1}, this.maxTime, Phaser.Easing.Linear.None, false, 0)
      this.clock.onComplete.add(function() {this.timedOut = true}, this)
      this.clock.onComplete.add(this.endTrial, this)
      timing_mode = 'timed'
    } else {
      timing_mode = 'untimed'
      //this.subject.inputData('timed',0)
    }

    d = new Date()
    this.startTime = d.getTime()

    this.makeButtons()

    this.nextTrial()

  },

  makeButtons: function () {
    d = new Date()
    this.start_time = d.getTime()

    this.equal = this.game.add.button(580, 380, 'equalB')
    this.equal.scale.x = 0.3
    this.equal.scale.y = 0.3
    this.equal.onInputDown.add(function() {
      this.buttonPressed = 'equal'
      newd = new Date()
      this.RT = newd.getTime() - this.start_time
      //check to see if they are correct
      this.grade(this.start_time)
    }, this)

    this.unequal = this.game.add.button(275, 380, 'unequalB')
    this.unequal.scale.x = .3
    this.unequal.scale.y = .3
    this.unequal.onInputDown.add(function() {
      this.buttonPressed = 'unequal'
      newd = new Date()
      this.RT = newd.getTime() - this.start_time
      //check to see if they are correct
      this.grade(this.start_time)
    }, this)
  },

  nextTrial: function () {

    var d = new Date()
    this.start_time = d.getTime()

    if (this.maxTime != 0) {
      this.pie.progress = 0
      this.clock.start()
    }

    if (this.op1s[this.trial] <= 9) {
        op1 = '  ' + this.op1s[this.trial];
    } else { op1 = this.op1s[this.trial];}

    if (this.op2s[this.trial] <= 9) {
        op2 = '  ' + this.op2s[this.trial];
    } else { op2 = this.op2s[this.trial];}

    this.problem[0] = +op1;
    this.problem[1] = +op2;
    this.problem[2] = +op1 + +op2;

    this.trial++
    this.progress = this.game.add.text(860, 560, this.trial + ' out of 24', {font:'30px Arial', fill:'#FFFFFF', align:'center'})
    this.progress.anchor.x = 0.5

    this.pointDisplay = this.game.add.text(85, 560, 'Coins: ' + this.points, {font:'30px Arial', fill:'#FFFFFF', align:'center'})
    this.pointDisplay.anchor.x = 0.5

    this.makeProb()
    this.equal.visible = true
    this.unequal.visible = true
  },

  makeProb: function() {
    if (this.equivalence[this.trial-1] == 1) {
      equal = true
    } else {
      equal = false
    }

    if (this.buttonPressed == 'none' || this.answer == 'correct') {
      this.presentedNum = unequalGen(equal, this.problem[2], this.problem[0], this.problem[1])
    } else if (this.answer == 'incorrect') {
      this.presentedNum = this.presentedNum
    }

    this.answerText = [this.problem[0],' + ',this.problem[1], ' = ',this.presentedNum]
    this.answerText = this.answerText.join('')
    this.probText = this.game.add.text(this.game.width/2, this.game.height/2-100, this.answerText, {font:'80px Arial', fill:'#FFFFFF', align:'center'})
    this.probText.anchor.x = 0.5

    if (equal) {
      numFeedbackText = this.answerText
    } else {
      numFeedbackText = [this.problem[0],' + ',this.problem[1], ' ≠ ',this.presentedNum]
      numFeedbackText = numFeedbackText.join('')
    }
    this.numFeedback = this.game.add.text(this.game.width/2, this.game.height/2-100, numFeedbackText, {font:'80px Arial', fill:'#FFFFFF', align:'center'})
    this.numFeedback.anchor.x = 0.5
    this.numFeedback.visible = false
  },

  grade: function(time_stamp) {
    this.numGraded += 1
    if (this.buttonPressed == 'equal' && this.equivalence[this.trial-1] == 1) { //it is equal and they are correct
      this.answer = 'correct'
    } else if (this.buttonPressed == 'equal' && this.equivalence[this.trial-1] == 2) { //it is equal and they are incorrect
      this.answer = 'incorrect'
    } else if (this.buttonPressed == 'unequal') {
      if (this.equivalence[this.trial-1] == 2) { //it is unequal and they are correct
        this.answer = 'correct'
      } else  { //it is unequal and they are incorrect
        this.answer = 'incorrect'
      }
    }

    if (this.answer == 'correct') {
      this.points+= 1
      if (this.reps == 0) {
        this.streak += 1
      }
      this.reps = 0
    } else if (this.answer = 'incorrect') {
      this.streak = 0
      this.reps += 1
      if (this.points == 0) {
        this.points = 0
      } else {
        this.points -= 1
      }
    }

    if (this.streak == 3 || this.streak == 7 || this.streak == 15 || this.streak == 24) {
      this.points += 1
    }

    this.onSubmit()

    this.save()


  },

  save: function() {
    if (this.buttonPressed == 'equal') {
      inputData('answer', 0)
    } else {
      inputData('answer', 1)
    }
    inputData('problem', [this.problem[0],' + ',this.problem[1],' = ',this.presentedNum].join(""))
    inputData('RT', this.RT/1000)
    inputData('n1', this.op1s[this.trial-1])
    inputData('n2', this.op2s[this.trial-1])
    inputData('points', this.points)
    inputData('problem_id', this.problem_ids[this.trial-1])
    inputData('solution', this.op1s[this.trial-1] + this.op2s[this.trial-1])

    if (this.answer == 'correct') {
      inputData('ACC', 1)
    } else {
      inputData('ACC',0)
    }

    if (this.trial >= this.op1s.length && this.answer == 'correct') {
      inputData('finished', 1)
    } else {
      inputData('finished', 0)
    }

    sendData(this.numGraded)

  },

  onSubmit: function () {
      if (this.maxTime != 0) {
        this.clock.stop()
        this.clock.pendingDelete = false
      }
      this.endTrial();
  },

  endTrial: function () {

    if (this.streak == 3) {
      corrFeedback = '3 in a row! Extra coin!'
      disp_col = '#3CF948'
    } else if (this.streak == 7) {
      corrFeedback = '7 in a row! Extra coin!'
      disp_col = '#3CF948'
    } else if (this.streak == 15) {
      corrFeedback = '15 in a row! Extra coin!'
      disp_col = '#3CF948'
    } else if (this.streak == 24) {
      corrFeedback = 'Perfect Score! Extra coin!'
      disp_col = '#3CF948'
    } else {
      correct_feedback = ['Way to go!','Awesome!','You Rock!','Correct!','Fantastic!','Nice!']
      feedbackIndex = Math.floor(Math.random() * correct_feedback.length) + 0
      corrFeedback = correct_feedback[feedbackIndex]
      disp_col = '#FFFFFF'
    }

    this.game.world.remove(this.probText)
    this.equal.visible = false
    this.unequal.visible = false
    if ((this.trial) >= this.op1s.length && this.answer == "correct" && !this.timedOut) {
      this.feedback = this.game.add.text(this.game.width/2, 50, corrFeedback, {font:'80px Arial', fill:disp_col, align:'center'})
      this.feedback.anchor.x = 0.5
      this.numFeedback.visible = true
      this.game.world.remove(this.progress)
      this.game.world.remove(this.pointDisplay)
      if (this.maxTime != 0) {
        this.maxTime = this.ogMaxTime;
      }
      setTimeout(function() {
        that.game.world.remove(that.feedback)
        that.numFeedback.visible = false
        that.quitGame()
      }, 1000)
    } else {
      that = this
      if (this.answer == "incorrect") {
        this.feedback = this.game.add.text(this.game.width/2, 50, "Try Again!", {font:'80px Arial', fill:disp_col, align:'center'})
        this.feedback.anchor.x = 0.5
        this.numFeedback.visible = true
        this.game.world.remove(this.progress)
        this.game.world.remove(this.pointDisplay)
        if (this.maxTime != 0) {
          this.maxTime += 1000
        }

        setTimeout(function() {
          that.game.world.remove(that.feedback)
          that.numFeedback.visible = false
          that.makeProb()
          that.makeButtons()
          that.progress = that.game.add.text(860, 560, that.trial + ' out of 24', {font:'30px Arial', fill:'#FFFFFF', align:'center'})
          that.progress.anchor.x = 0.5

          that.pointDisplay = that.game.add.text(85, 560, 'Coins: ' + that.points, {font:'30px Arial', fill:'#FFFFFF', align:'center'})
          that.pointDisplay.anchor.x = 0.5

          if (that.maxTime != 0) {
            that.answer = 'none'
            that.pie.progress = 0
            that.clock.start()
          }

        }, 1000)

      } else if (this.timedOut) { //else if the trial has timed out
        this.points-= 1
        this.game.world.remove(this.progress)
        this.game.world.remove(this.pointDisplay)
        this.timedOut = false
        this.feedback = this.game.add.text(this.game.width/2, 50, "Try Again!", {font:'80px Arial', fill:disp_col, align:'center'})
        this.feedback.anchor.x = 0.5
        //this.answer = 'none'
        if (this.maxTime != 0) {
          this.maxTime += 1000
        }

        setTimeout(function() {
          that.game.world.remove(that.feedback)
          that.numFeedback.visible = false
          that.makeProb()
          that.makeButtons()
          that.progress = that.game.add.text(860, 560, that.trial + ' out of 24', {font:'30px Arial', fill:'#FFFFFF', align:'center'})
          that.progress.anchor.x = 0.5


          that.pointDisplay = that.game.add.text(85, 560, 'Coins: ' + that.points, {font:'30px Arial', fill:'#FFFFFF', align:'center'})
          that.pointDisplay.anchor.x = 0.5

          if (that.maxTime != 0) {
            that.pie.progress = 0
            that.clock.start()
          }

        }, 1000)
      } else {
        this.feedback = this.game.add.text(this.game.width/2, 50, corrFeedback, {font:'80px Arial', fill:disp_col, align:'center'})
        this.feedback.anchor.x = 0.5
        this.numFeedback.visible = true
        this.game.world.remove(this.progress)
        this.game.world.remove(this.pointDisplay)
        if (this.maxTime != 0) {
          this.maxTime = this.ogMaxTime;
        }
        setTimeout(function() {
          that.game.world.remove(that.feedback)
          that.numFeedback.visible = false
          that.nextTrial()
        }, 1000)
      }
      if (this.maxTime != 0) {
        this.clock.pendingDelete = true
        this.clock = this.game.add.tween(this.pie).to({progress: 1}, this.maxTime, Phaser.Easing.Linear.None, false, 0);
        this.clock.onComplete.add(function() {this.timedOut = true}, this)
        this.clock.onComplete.add(this.endTrial, this)

      }
    }
  },

  update: function() {

  },

  quitGame: function () {
    d = new Date()
    endTime = d.getTime()

    this.trial = 0
    this.numGraded = 0

    //this.subject.inputData('endGameStats', [this.startTime, endTime, 'completed'])
    //nextTask(this.results[0], this.task)

      //Let them know it's done...
      this.game.time.events.add(Phaser.Timer.SECOND, function () {
        endText = this.game.add.text(this.game.width/2, 200, 'All done!', {font:'96px Arial', fill:'#FFFFFF', align:'center'});
        endText.anchor.x = 0.5
        finalPoints = this.game.add.text(this.game.width/2, 400, 'You got ' + this.points + ' points', {font:'76px Arial', fill:'#FFFFFF', align:'center'});
        finalPoints.anchor.x = 0.5
        totalPoints = this.points
        this.points = 0
                //  Then let's go back to the main menu.
        //this.game.time.events.add(Phaser.Timer.SECOND * 2, function() {this.state.start('Menu', true, false, this.problem_set);}, this);
      }, this);
  }

};
