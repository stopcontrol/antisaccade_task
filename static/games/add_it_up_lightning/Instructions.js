Game.Instructions = function (game) {

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

    this.keypad;
    this.problem;
    this.response_box;
    this.feedback;
    this.stats;
    this.trial = 0;

    //stars setting
    this.stars;
    this.waveformX;
    this.waveformY;

    this.xl;
    this.yl;

    this.cx = 0;
    this.cy = 0;

    this.pressed = false;
    this.numGraded = 0;
    this.points = 0
    this.reps = 0
    this.streak = 0
    this.rmInstructB = false
    this.inst_num = 1
    this.inst_finished = false

};

Game.Instructions.prototype = {

  init: function(maxTime, algebra, problem_set) {
      this.ogMaxTime = maxTime;
      this.maxTime = maxTime;
      this.problem_set = problem_set

      if (!algebra)
        {
          this.algebra = false;
        }
      else {this.algebra = algebra;}
  },

  create: function () {
      problems = problemGen(this.week, this.problem_set)
      reProblems = problemGen(this.week, this.problem_set) //repeat problem set in SPT
      this.op1s = [1]//problems[1].concat(reProblems[1])
      this.op2s = [2]//problems[2].concat(reProblems[2])
      this.problem_ids = [0]//problems[3].concat(reProblems[3])

      if (this.algebra) {
        if (this.maxTime != 0) {
          this.task = 'SP_missing_timed'
        } else {
          this.task = 'SP_missing'
        }
      } else {
        if (this.maxTime != 0) {
          this.task = 'SP_production_timed'
        } else {
          this.task = 'SP_production'
        }
      }
      task_type = 'SP'
      //initializing subject for this game

      //this.results = set_up_subject(this.task)
      //user = this.results[0]
      //session = this.results[1]
      //play = this.results[2]

      //this.subject = new Subject(user, this.task, task_type, this.problem_set, session, play)

      this.game.world.setBounds(0, 0, 600, 800);
      //background.width = this.game.width
      //background.height = this.game.height
      this.trial = -1;

      this.feedback = this.game.add.text(this.game.width/2, 200, 'X', {font:'80px Arial', fill:'#FFFFFF', align:'center'});
      this.feedback.anchor.setTo(0.5, 0.5);
      this.feedback.visible = false;

      //Timer
      this.maxTime = 50000
      //this.pie = new PieProgress(this.game, 900, 50, 32);
      //this.game.world.add(this.pie);
      //this.clock = this.game.add.tween(this.pie).to({progress: 1}, this.maxTime, Phaser.Easing.Linear.None, false, 0);
      //this.clock.onComplete.add(this.endTrial, this);

      if (this.maxTime != 0) {
        this.pie = new PieProgress(this.game, 900, 50, 32);
        this.game.world.add(this.pie);
        this.clock = this.game.add.tween(this.pie).to({progress: 1}, this.maxTime, Phaser.Easing.Linear.None, false, 0);
        this.clock.onComplete.add(this.endTrial, this);
        timing_mode = 'timed'
      } else {
        timing_mode = 'untimed'
      }

      //make problem display
      this.problem = new HorizontalProblem(this.game, this.game.width/4-170, 90);

      //make stats
      this.stats = createStats(this.game, 475, 20);

      //make keypad
      this.keypad = makeKeypad(this.game, this.game.world.centerX + 360, this.game.height/4, this.onPress, this.onSubmit,this);

      var d = new Date()
      this.gameStartTime = d.getTime()

      //get things going
      this.nextTrial();

      this.instruct(this.inst_num)

  },

  makeBox: function(x,y,width,height) {
    rect = this.game.add.graphics(x,y)
    rect.lineStyle(2, 0x13bee3, 1);
    rect.beginFill(0x0c3ef0, 1)
    rect.drawRect(0,0, width, height)
    return rect
  },

  instruct: function (num) {
    if (num == 1) {
          instruct_text = this.game.add.text(this.game.world.centerX+60,460,"In this game you'll be \nsolving addition problems.",
          {font: "20px Arial", fill: "#FFFFFF", align: "center"})
          this.nextB = this.add.button(this.game.world.centerX+175, 530, 'next', function () {
            this.game.world.remove(instruct_text)
            this.rmInstructB = true
          }, this);
          this.inst_finished = false
          this.back_ground = this.makeBox(instruct_text.x-80,instruct_text.y-10,400,120)
          this.game.world.sendToBack(this.back_ground)
          this.nextB.anchor.x = (0.5,0.5)
          this.nextB.scale.setTo(0.5,0.5)
    } if (num == 2) {
		          instruct_text = this.game.add.text(this.game.world.centerX,470,"It is just like the previous game,but now\n you have to answer before time runs out.",
		          {font: "20px Arial", fill: "#FFFFFF", align: "center"})
		          this.nextB = this.add.button(this.game.world.centerX+175, 530, 'next', function () {
		            this.game.world.remove(instruct_text)
		            this.rmInstructB = true
		          }, this);
		          this.inst_finished = false
		          this.nextB.anchor.x = (0.5,0.5)
		          this.nextB.scale.setTo(0.5,0.5)
		} if (num == 3) {
		          instruct_text = this.game.add.text(this.game.world.centerX+100,50,"This circle shows how much time you have left.",
		          {font: "20px Arial", fill: "#FFFFFF", align: "center"})
		          this.nextB = this.add.button(this.game.world.centerX+300, 80, 'next', function () {
		            this.game.world.remove(instruct_text)
		            this.rmInstructB = true
		          }, this);
		          this.inst_finished = false
              this.game.world.remove(this.back_ground)
              this.back_ground = this.makeBox(instruct_text.x-20,instruct_text.y-10,450,80)
              this.game.world.sendToBack(this.back_ground)
		          this.nextB.anchor.x = (0.5,0.5)
		          this.nextB.scale.setTo(0.5,0.5)
		} if (num == 4) {
		          instruct_text = this.game.add.text(this.game.world.centerX+100,50,"The real game will be much faster than this.",
		          {font: "20px Arial", fill: "#FFFFFF", align: "center"})
		          this.nextB = this.add.button(this.game.world.centerX+300, 80, 'next', function () {
		            this.game.world.remove(instruct_text)
		            this.rmInstructB = true
		          }, this);
		          this.inst_finished = false
		          this.nextB.anchor.x = (0.5,0.5)
		          this.nextB.scale.setTo(0.5,0.5)
		}if (num == 5) {
          instruct_text = this.game.add.text(this.game.world.centerX,470,"When you think you know the answer, \nkey it in on the number pad.",
          {font: "20px Arial", fill: "#FFFFFF", align: "center"})
          this.nextB = this.add.button(this.game.world.centerX+175, 530, 'next', function () {
            this.game.world.remove(instruct_text)
            this.rmInstructB = true
          }, this);
          this.inst_finished = false
          this.game.world.remove(this.back_ground)
          this.back_ground = this.makeBox(instruct_text.x-40,instruct_text.y-10,400,120)
          this.game.world.sendToBack(this.back_ground)
          this.nextB.anchor.x = (0.5,0.5)
          this.nextB.scale.setTo(0.5,0.5)
    } if (num == 6) {
          this.instruct_text = this.game.add.text(this.game.world.centerX,490,"Go ahead and try this problem now.",
          {font: "20px Arial", fill: "#FFFFFF", align: "center"})
          this.inst_finished = true
    }
  },

  nextTrial: function () {
    this.pressed = false
    //clock
    var d = new Date();
    this.start_time = d.getTime();
    //reset the RT counter
    this.stats.children[3].text='';

    if (this.maxTime != 0) {
      this.pie.progress = 0;
      this.clock.start();
    }

    if (typeof(this.correct) != 'undefined') {
      if (this.correct == true || this.reps == 3000) {
        this.trial++
        this.reps = 0
      } else {
        this.trial = this.trial
      }
    } else {
      this.trial++
    }

    this.progress = this.game.add.text(860, 560, this.trial+1 + ' out of 1', {font:'30px Arial', fill:'#FFFFFF', align:'center'})
    this.progress.anchor.x = 0.5

    this.pointDisplay = this.game.add.text(85, 560, 'Coins: ' + this.points, {font:'30px Arial', fill:'#FFFFFF', align:'center'})
    this.pointDisplay.anchor.x = 0.5


    if (this.op1s[this.trial] <= 9) {
        op1 = '  ' + this.op1s[this.trial];
    } else { op1 = this.op1s[this.trial];}

    if (this.op2s[this.trial] <= 9) {
        op2 = '  ' + this.op2s[this.trial];
    } else { op2 = this.op2s[this.trial];}

    if (this.algebra == false) {
      this.problem.problem.children[0].text = op1;
      this.problem.problem.children[1].text = op2;
      this.problem.problem.children[5].text = '  ?';
      this.problem.problem.children[5].x = 390
    } else {
      this.problem.problem.children[0].text = op1;
      this.problem.problem.children[1].text = '  ?';
      this.problem.problem.children[5].text = parseInt(op1) + parseInt(op2);
    }


    if (this.problem.problem.children[1].text.length == 2) {
      if (this.problem.problem.children[1].x > 160) {
        this.problem.problem.children[1].x = 160
      }
      this.problem.problem.children[1].x += 23
    } else {
      this.problem.problem.children[1].x = 160
    }

  },

  endTrial: function() {
    var d = new Date();
    this.stats.RT = d.getTime() - this.start_time;
    this.grade(d.getTime());

    if (!this.correct) {
      this.streak = 0
      this.reps += 1
    } else {
      if (this.reps == 0) {
        this.streak += 1
      }
      this.reps = 0
    }

    this.giveFeedback();
    if ((this.trial +1) >= this.op1s.length && this.correct == true) {
      this.quitGame();
    } else {
      this.game.time.events.add(Phaser.Timer.SECOND, this.nextTrial, this);
    }
  },

  grade: function (time_stamp) {
    this.numGraded+= 1
    if (this.algebra === false) {
      this.user_answer = parseInt(this.problem.problem.children[5].text);
      correct_answer = parseInt(this.problem.problem.children[0].text) + parseInt(this.problem.problem.children[1].text);
    }
    else {
      this.user_answer = parseInt(this.problem.problem.children[1].text);
      correct_answer = parseInt(this.problem.problem.children[5].text - parseInt(this.problem.problem.children[0].text));
    }
    if (this.user_answer == correct_answer) {
      this.points+=1
      this.correct = true;
      //off by one bc of grade order
      if (this.streak == 2) {
        this.feedback.text = "3 in a row! Extra coin!"
        this.feedback.fill = '#3CF948'
        //change color to green...
        this.points+=1
      } else if (this.streak == 6) {
        this.feedback.text = "7 in a row! Extra coin!"
        this.feedback.fill = '#3CF948'
        this.points+=1
      } else if (this.streak == 14) {
        this.feedback.text = "15 in a row! Extra coin!"
        this.feedback.fill = '#3CF948'
        this.points+=1
      } else if (this.streak == 25) {
        this.feedback.text = "Perfect Score! Extra coin!"
        this.feedback.fill = '#3CF948'
        this.points+=1
      } else {
        correct_feedback = ['Way to go!','Awesome!','You Rock!','Correct!','Fantastic!','Nice!']
        feedbackIndex = Math.floor(Math.random() * correct_feedback.length) + 0
        this.feedback.text = correct_feedback[feedbackIndex]
        this.feedback.fill = '#FFFFFF'
      }
      this.stats.points++;

      if (this.maxTime != 0) {
        this.maxTime = this.ogMaxTime;
      }
    } else {
      if (this.points == 0) {
        this.points = 0
      } else {
        this.points -= 1
      }
      this.correct = false;
      this.feedback.text = 'Try Again!'
      this.feedback.fill = '#FFFFFF'
      this.stats.points--;
      if (this.maxTime != 0) {
        this.maxTime += 1000
      }
    };
    if (this.maxTime != 0) {
      this.clock.pendingDelete = true
      this.clock = this.game.add.tween(this.pie).to({progress: 1}, this.maxTime, Phaser.Easing.Linear.None, false, 0);
      this.clock.onComplete.add(this.endTrial, this)
    }

    //this.save()


    this.stats.children[1].text=this.stats.points;
    this.stats.children[3].text=this.stats.RT;
  },

  save: function() {
    inputData('answer', this.user_answer)

    if (this.algebra == false) {
        inputData('problem', [parseInt(op1),' + ',parseInt(op2),' = ?'].join(""))
    } else {
        inputData('problem', [parseInt(op1),' + ? = ',parseInt(op1)+parseInt(op2)].join(""))
    }

    inputData('n1', this.op1s[this.trial])
    inputData('n2', this.op2s[this.trial])
    inputData('problem_id', this.problem_ids[this.trial])
    inputData('points', this.points)
    inputData('solution', this.op1s[this.trial] + this.op2s[this.trial])
    inputData('RT', this.stats.RT/1000)
    if (this.correct) {
      inputData('ACC', 1)
    } else {
      inputData('ACC',0)
    }

    if (this.trial+1 >= this.op1s.length && this.correct) {
      inputData('finished', 1)
    } else {
      inputData('finished', 0)
    }

    sendData(this.numGraded)

  },

  giveFeedback: function () {
    this.game.world.remove(this.back_ground)
    this.game.add.tween(this.problem.problem).to( { alpha: 0 }, 100, "Linear", true);
    this.game.add.tween(this.keypad).to( { alpha: 0 }, 100, "Linear", true);

      this.numFeedback = this.game.add.text(0,0,'null')
      this.numFeedback.visible = false

    if (this.reps != 3) {
      if (this.correct==true) {
        //this.stars.visible = true;
        this.feedback.visible = true;
        this.game.world.remove(this.progress)
        this.game.world.remove(this.pointDisplay)
        if (!this.algebra) {
          this.numFeedback = this.game.add.text(this.game.width/2, 300, parseInt(op1) + ' + ' + parseInt(op2) + ' = ' + this.user_answer, {font:'80px Arial', fill:'#FFFFFF', align:'center'});
        } else {
          this.numFeedback = this.game.add.text(this.game.width/2, 300, parseInt(op1) + ' + ' + this.user_answer + ' = ' + (parseInt(op1)+parseInt(op2)), {font:'80px Arial', fill:'#FFFFFF', align:'center'});
        }
        this.numFeedback.visible = true;
        this.numFeedback.anchor.x = 0.5;
        this.game.world.remove(this.progress)
        this.game.world.remove(this.pointDisplay)
      } else {
        this.feedback.visible = true;
        if (isNaN(this.user_answer)) {
          this.numFeedback = this.game.add.text(this.game.width/2, 300, " ", {font:'80px Arial', fill:'#FFFFFF', align:'center'});
        } else {
          if (!this.algebra) {
            this.numFeedback = this.game.add.text(this.game.width/2, 300, parseInt(op1) + ' + ' + parseInt(op2) + ' ≠ ' + this.user_answer, {font:'80px Arial', fill:'#FFFFFF', align:'center'});
          } else {
            this.numFeedback = this.game.add.text(this.game.width/2, 300, parseInt(op1) + ' + ' + this.user_answer + ' ≠ ' + (parseInt(op1)+parseInt(op2)), {font:'80px Arial', fill:'#FFFFFF', align:'center'});
          }
        }
        this.numFeedback.visible = true;
        this.numFeedback.anchor.x = 0.5;
        this.game.world.remove(this.progress)
        this.game.world.remove(this.pointDisplay)
      }
    } else {
      this.feedback.text = "Sorry, the correct answer is"
      this.feedback.cssFont = '70px Arial'
      this.feedback.visible = true
      if (isNaN(this.user_answer)) {
        this.numFeedback = this.game.add.text(this.game.width/2, 300, " ", {font:'80px Arial', fill:'#FFFFFF', align:'center'});
      } else {
        if (!this.algebra) {
          this.numFeedback = this.game.add.text(this.game.width/2, 300, parseInt(op1) + ' + ' + parseInt(op2) + ' = ' + (parseInt(op1)+parseInt(op2)), {font:'80px Arial', fill:'#FFFFFF', align:'center'});
        } else {
          this.numFeedback = this.game.add.text(this.game.width/2, 300, parseInt(op1) + ' + ' + parseInt(op2) + ' = ' + (parseInt(op1)+parseInt(op2)), {font:'80px Arial', fill:'#FFFFFF', align:'center'});
        }
      }
      this.numFeedback.visible = true;
      this.numFeedback.anchor.x = 0.5;
      this.game.world.remove(this.progress)
      this.game.world.remove(this.pointDisplay)

    }


    this.game.time.events.add(Phaser.Timer.SECOND, function() {
        //this.stars.visible = false;
        this.feedback.visible = false;
        this.numFeedback.visible = false;
        this.game.add.tween(this.problem.problem).to( { alpha: 1 }, 100, "Linear", true);
        this.game.add.tween(this.keypad).to( { alpha: 1 }, 100, "Linear", true);
      },
    this);

  },


  onSubmit: function () {
    if (!this.pressed) {
      this.pressed = true
      if (this.maxTime != 0) {
        this.clock.stop();
        this.clock.pendingDelete = false;
      }
      if (this.maxTime == 0 || this.pie._progress != 1) {
        this.endTrial();
      }
    }

  },

  onPress: function (button) {
    problem = this.problem;

    if (this.inst_finished) {
      if (this.algebra === false) {
        //which child contains the response
        i = 5;
        initPos = problem.problem.children[i].x
        //initPos = 390
      } else {
        i = 1;
        initPos = 160
      }

      t = problem.problem.children[i].text

      if (t == '?' || t == '  ?') {
        t = '';
        problem.problem.children[i].text ='';
      }

      if (button.number =='-') {
        problem.problem.children[i].text = t.substring(0, t.length - 1);
        if (this.algebra == false) {
          problem.problem.children[i].x = initPos
        } else {
          problem.problem.children[i].x += 20
        }
      }
      else {
        j = t + button.number;
        if (parseInt(j) < 10) {j = '  ' + j;}
        else {j = parseInt(j);}
        problem.problem.children[i].text = '  ' + parseInt(j);
        if (problem.problem.children[i].text.length > 3 & this.algebra) {
          problem.problem.children[i].x -= 20
        } else {
          problem.problem.children[i].x = initPos
        }
      }
    }
  },

  update: function () {

    if (this.rmInstructB) {
      this.game.world.remove(this.nextB)
      this.rmInstructB = false
      this.inst_num += 1
      this.instruct(this.inst_num)
    }

    if (this.correct) {
      this.game.world.remove(this.instruct_text)
    }

    this.problem.update();
  },

  quitGame: function (pointer) {
      //  Here you should destroy anything you no longer need.
      //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
      this.problem.problem.visible = false;
      this.keypad.visible = false;

      d = new Date()
      endTime = d.getTime()

      this.numGraded = 0

      //this.subject.inputData('endGameStats', [this.gameStartTime, endTime, 'completed'])
      //session_url = 'http://' + homebase + '/session/'

      //nextTask(this.results[0], this.task)

      //Let them know it's done...
      this.game.time.events.add(Phaser.Timer.SECOND, function () {
        instructions = this.game.add.text(490, 50, 'Nice job! Make sense? If so you can get started by pressing the "go" button.\nIf not, you can repeat the instructions by clicking the "back" button\nYou will complete 24 problems in the main game.\n\n Remember that the time is going to be much faster!', {font:'20px Arial', fill:'#FFFFFF', align:'center'});
        instructions.anchor.x = 0.5
        instructions.lineSpacing = -8
        this.back_ground = this.makeBox(143,instructions.y-10,instructions.width+20,instructions.height+200)
        this.game.world.sendToBack(this.back_ground)
        this.go = this.add.button(250, 225, 'go', function () {this.state.start('Run', true, false, 3000, false, this.problem_set);}, this);
        this.back = this.add.button(650, 225, 'back', function () {

          this.cx = 0;
          this.cy = 0;

          this.pressed = false;
          this.numGraded = 0;
          this.points = 0
          this.reps = 0
          this.streak = 0
          this.rmInstructB = false
          this.inst_num = 1
          this.inst_finished = false

          this.state.start('Instructions', true, false, this.week, this.problem_set);}, this);


      }, this);

  }

};
