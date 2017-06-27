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
    this.buttonPressed = 'none'
    this.numGraded = 0
    this.points = 0
    this.streak = 0
    this.reps = 0
    this.usedLocs = []
    this.threeTries = false

};

Game.Run.prototype = {

  init: function(week, problem_set) {
    this.week = week
    this.problem_set = problem_set
  },

  create: function() {
    problems = problemGen(this.week, this.problem_set)
    reProblems = problemGen(this.week, this.problem_set) //repeat problem set in SPT
    this.op1s = problems[1].concat(reProblems[1])
    this.op2s = problems[2].concat(reProblems[2])
    this.problem_ids = problems[3].concat(reProblems[3])

    //task info
    this.task = 'VS_verification'
    task_type = 'VS'
    //initializing subject for this game

    //this.logger = new Logger(this.task, this)

    equivalenceGen(true)
    this.equivalence = equivalence

    this.game.world.setBounds(0, 0, 600, 800)
    //background = this.game.add.sprite(0,0,'chalkboard')
    //background.width = this.game.width
    //background.height = this.game.height

    d = new Date()
    this.startTime = d.getTime()

    this.makeButtons()

    this.nextTrial()

  },

  makeButtons: function () {
    d = new Date()
    this.start_time = d.getTime()

    this.equal = this.game.add.button(540, 540, 'equalB')
    this.equal.scale.x = 0.3
    this.equal.scale.y = 0.3
    this.equal.onInputDown.add(function() {
      this.buttonPressed = 'equal'
      newd = new Date()
      this.RT = newd.getTime() - this.start_time
      //check to see if they are correct
      this.grade(this.start_time)
    }, this)

    this.unequal = this.game.add.button(315, 540, 'unequalB')
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
    this.progress = this.game.add.text(860, 560, this.trial + ' out of ' + this.op1s.length, {font:'30px Arial', fill:'#FFFFFF', align:'center'})
    this.progress.anchor.x = 0.5

    this.pointDisplay = this.game.add.text(85, 560, 'Coins: ' + this.points, {font:'30px Arial', fill:'#FFFFFF', align:'center'})
    this.pointDisplay.anchor.x = 0.5

    this.makeProb()
    this.equal.visible = true
    this.unequal.visible = true
  },

  makeProb: function() {
    trialNum = this.trial-1
    if (this.equivalence[trialNum] == 1) {
      this.equalVal = true
    } else {
      this.equalVal = false
    }
    this.presentedNum = unequalGen(this.equalVal, this.problem[2], this.problem[0], this.problem[1])

    this.probText = this.game.add.group()
    this.game.add.text(290,this.game.height/2-70,'+',{font:'80px Arial', fill:'#FFFFFF', align:'center'}, this.probText)
    this.game.add.text(625,this.game.height/2-70,'=',{font:'80px Arial', fill:'#FFFFFF', align:'center'}, this.probText)
    //this.game.add.text(850,this.game.height/2-75,this.presentedNum,{font:'80px Arial', fill:'#FFFFFF', align:'center'}, this.probText)

    this.circle_group = this.game.add.group()

    //this.op1_circs = this.circleGen(this.problem[0],1)
    //this.op2_circs = this.circleGen(this.problem[1],2)


    this.op1_box = this.boxGen(1)
    this.op2_box = this.boxGen(2)
    this.sum_box = this.boxGen(3)

    op1_rects = this.rectGen(this.problem[0],1,[])
    this.op1_orig = op1_rects[0].slice()
    this.op1_used = op1_rects[0]
    this.op1_rectGroup = op1_rects[1]

    op2_rects = this.rectGen(this.problem[1],2,this.op1_used)
    this.op2_used = op2_rects[0]
    this.op2_rectGroup = op2_rects[1]

    this.sum_used = []
    for (ii=0;ii<28;ii++) {
      if (this.op2_used.indexOf(ii) > -1) {
      } else {
        this.sum_used.push(ii)
      }
    }
    trueSum = this.problem[0]+this.problem[1]
    if (this.presentedNum > trueSum) {
      toAdd = this.presentedNum - trueSum
      for (jj=0;jj<toAdd;jj++) {
        rm_coord = parseInt((Math.random() * this.sum_used.length), 0)
        this.sum_used.splice(rm_coord)
      }
    }
    this.real_sum_used = this.sum_used.slice()
    sum_rects = this.rectGen(this.presentedNum,3,this.sum_used)
    sum_used = sum_rects[0]
    this.sum_rectGroup = sum_rects[1]

    this.answerText = [this.problem[0],' + ',this.problem[1], ' = ',this.presentedNum]
    this.answerText = this.answerText.join('')

    this.numFeedback = this.game.add.group()
    numFeed1 = this.problem[0]
    numFeed2 = ' + '
    numFeed3 = this.problem[1]
    numFeed5 = this.presentedNum
    if (this.equalVal) {
      numFeed4 = ' = '
    } else {
      numFeed4 = ' ≠ '
    }
    font_params = {font:'80px Arial', fill:'#FFFFFF', align:'center'}
    this.numFeedback.add(this.game.add.text(this.game.width/2-340, this.game.height/2+180, numFeed1, font_params))
    this.numFeedback.add(this.game.add.text(this.game.width/2-170, this.game.height/2+180, numFeed2, font_params))
    this.numFeedback.add(this.game.add.text(this.game.width/2, this.game.height/2+180, numFeed3, font_params))
    this.numFeedback.add(this.game.add.text(this.game.width/2+170, this.game.height/2+180, numFeed4, font_params))
    this.numFeedback.add(this.game.add.text(this.game.width/2+340, this.game.height/2+180, numFeed5, font_params))
    this.numFeedback.forEach(function(txt){
      txt.anchor.x = 0.5
    },this)
    this.numFeedback.visible = false

  },

  boxGen: function(op) {
    graphics = this.game.add.graphics(0,0)
    if (op == 1) {
      x = 30
    } else if (op == 2) {
      x = 370
    } else {
      x = 700
    }
    xOffset = 56.6
    yOffset = 60
    this.yVal1 = 50
    yVal2 = 470
    graphics.beginFill()
    graphics.lineStyle(6, 0xffffff, 1);
    graphics.drawRect(x, this.yVal1, 340/1.5, 420);

    for (i=1;i<4;i++) {
      graphics.moveTo(x+(xOffset*i),this.yVal1)
      graphics.lineTo(x+(xOffset*i),yVal2)
    }
    for (i=1;i<7;i++) {
      graphics.moveTo(x,this.yVal1+(yOffset*i))
      graphics.lineTo(x+(340/1.5),this.yVal1+(yOffset*i))
    }

    this.circle_group.add(graphics)

    return graphics
  },

  rectGen: function(numRects,op,used_ind) {
    // numRects = 1
    rectGroup = this.game.add.group()
    if (op == 1) {
      x = 33
    } else if (op == 2) {
      x = 373
    } else {
      x = 703
      this.sum_rects_used = []
    }

    coords = []
    for (j=0;j<7;j++) {
      for (i=0;i<4;i++) {
        coords.push([x+(56.6*i),this.yVal1+3+(60*j)])
      }
    }
    colors = [0xff5b5b,0x1e3888,0x47a8bd,0xf5e663,0xffad69,0x9c3848,0xefbcd5,
              0x725ac1,0x97cc04,0xf45d01,0xf7b2ad,0x9abca7,0xf4d353,0x083d77]
    for (k=0;k<numRects;k++) {
      graphics = this.game.add.graphics(0,0)
      coord_ind = this.gen_rand(used_ind)
      if (op != 1 && op != 2) {
        this.sum_rects_used.push(coord_ind)
      }
      used_ind.push(coord_ind)
      rand_color = colors[Math.floor(Math.random() * colors.length)]
      graphics.beginFill(rand_color)
      graphics.drawRect(coords[coord_ind][0], coords[coord_ind][1], 51, 54)
      graphics.endFill()
      this.circle_group.add(graphics)
      rectGroup.add(graphics)
    }
    return [used_ind, rectGroup]
  },

  gen_rand: function(used_ind) {
    inds = used_ind
    new_coord = parseInt((Math.random() * 28), 0)
    if (used_ind.indexOf(new_coord) > -1) {
      return this.gen_rand(inds)
    } else {
      return new_coord
    }
  },

  circleGen: function(numCircs,op) {
      //numCircs = 20
      this.circVals = []

      if (op == 1) {
        graphics = this.game.add.graphics(50,20)
      } else {
        graphics = this.game.add.graphics(450,20)
      }
      color = 0xffffff
      x=250
      y=250
      xo = 60
      yo = 80
      coords = [[x,y],[x+xo,y],[x+xo,y-yo],[x,y-yo],
                [x-xo,y-yo],[x-xo,y],[x-xo,y+yo],[x,y+yo],
                [x+xo,y+yo],[x+xo*2,y+yo],[x+xo*2,y],[x+xo*2,y-yo],
                [x+xo*2,y-yo*2],[x+xo,y-yo*2],[x,y-yo*2],[x-xo,y-yo*2],
                [x-xo*2,y-yo*2],[x-xo*2,y-yo],[x-xo*2,y],[x-xo*2,y+yo]]

      this.usedLocs = []
      for (i = 0; i < numCircs; i++) {
        r = 40
        loc = Math.floor(this.getRandom(0,coords.length))
        for (c = 0; c < 1000; c++) {
          if (this.usedLocs.indexOf(loc) >= 0) {
            loc = Math.floor(this.getRandom(0,coords.length))
          }
        }
        loc = i

        graphics.lineStyle(0)
        graphics.beginFill(color, 1)
        graphics.drawCircle(coords[loc][0]-100,coords[loc][1],r)
        graphics.endFill()

        this.circle_group.add(graphics)

        this.usedLocs.push(loc)

        this.circVals.push([coords[loc][0]-100,coords[loc][1],r])
        }

    return this.circVals

  },

  getRandom: function(min, max) {
    return Math.random() * (max - min) + min;
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


    if (this.trial-1 >= 24) {
      if (this.presentedNum == this.problem[0] + this.problem[1]) {
        if (this.buttonPressed == 'equal') {
          this.answer = 'correct'
        } else {
          this.answer = 'incorrect'
        }
      } else {
        if (this.buttonPressed == 'equal') {
          this.answer = 'incorrect'
        } else {
          this.answer = 'correct'
        }
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

    //this.save()


  },

  save: function() {
    if (this.buttonPressed == 'equal') {
      this.logger.inputData('answer', 0)
    } else {
      this.logger.inputData('answer', 1)
    }
    this.logger.inputData('problem', [this.problem[0],' + ',this.problem[1],' = ',this.presentedNum].join(""))
    this.logger.inputData('RT', this.RT/1000)
    this.logger.inputData('n1', this.op1s[this.trial-1])
    this.logger.inputData('n2', this.op2s[this.trial-1])
    this.logger.inputData('points', this.points)
    this.logger.inputData('problem_id', this.problem_ids[this.trial-1])
    this.logger.inputData('solution', this.op1s[this.trial-1] + this.op2s[this.trial-1])

    if (this.answer == 'correct') {
      this.logger.inputData('ACC', 1)
    } else {
      this.logger.inputData('ACC',0)
    }

    if (this.trial >= this.op1s.length && this.answer == 'correct') {
      this.logger.inputData('finished', 1)
    } else {
      this.logger.inputData('finished', 0)
    }

    this.logger.sendData(this.numGraded)

  },

  onSubmit: function () {
      this.endTrial();
  },

  colCount: function (op,col_counts) {
    col1 = _.range(0,30,4)
    col2 = _.range(1,30,4)
    col3 = _.range(2,30,4)
    col4 = _.range(3,30,4)
    counter = 0
    if (op == 'op1') {
      group = this.op1_rectGroup
      used = this.op1_used
    } else if (op == 'op2') {
      group = this.op2_rectGroup
      used = _.difference(this.op2_used,this.op1_orig)
    } else {
      group = this.sum_rectGroup
      // used = this.sum_used
      used = this.sum_rects_used
    }
    group.forEach(function(rect) {
      if (_.includes(col1, used[counter])) {
        col_counts[0].push(coords[used[counter]][1])
      } else if (_.includes(col2, used[counter])) {
        col_counts[1].push(coords[used[counter]][1])
      } else if (_.includes(col3, used[counter])) {
        col_counts[2].push(coords[used[counter]][1])
      } else if (_.includes(col4, used[counter])) {
        col_counts[3].push(coords[used[counter]][1])
      }
      counter++
    }, this)
    return col_counts
  },

  endTrial: function () {

    //this.op1_rectGroup.destroy()
    this.game.add.tween(this.op1_rectGroup).to({
      x: 340//160
    },500, Phaser.Easing.Quadratic.Out, true)

    this.game.add.tween(this.op1_box).to({
      x: 340//160
    },500, Phaser.Easing.Quadratic.Out, true)

    feedback_counter = 0
    this.numFeedback.forEach(function(txt){
      if (feedback_counter == 0) {
        x_tween_dist = 400
      } else if (feedback_counter == 1) {
        x_tween_dist = 475
      } else if (feedback_counter == 2) {
        x_tween_dist = 550
      } else {
        x_tween_dist = txt.x
      }
      this.game.add.tween(txt).to({
        x: x_tween_dist
      },500, Phaser.Easing.Quadratic.Out, true)
      feedback_counter++
    }, this)

    // this.game.add.tween(this.op2_rectGroup).to({
    //   x: -180//340
    // },500, Phaser.Easing.Quadratic.Out, true)
    //
    // this.game.add.tween(this.sum_rectGroup).to({
    //   x: -180//340
    // },500, Phaser.Easing.Quadratic.Out, true)

    op1_count = 0

    // col_yTweens = []
    col_y = [[],[],[],[]]
    col_y_sorted = [[],[],[],[]]
    col_y = this.colCount('op1',col_y)
    col_y = this.colCount('op2',col_y)
    sums_y = [[],[],[],[]]
    sum_y_sorted = [[],[],[],[]]
    sums_y = this.colCount('sum',sums_y)

    for (i=0;i<col_y_sorted.length;i++) {
       col_y_sorted[i] = col_y[i].slice()
       col_y_sorted[i] = col_y_sorted[i].sort(function(a, b){return b-a})

       sum_y_sorted[i] = sums_y[i].slice()
       sum_y_sorted[i] = sum_y_sorted[i].sort(function(a, b){return b-a})

    }

    counter = 0
    col1 = _.range(0,30,4)
    col2 = _.range(1,30,4)
    col3 = _.range(2,30,4)
    col4 = _.range(3,30,4)
    absolute_loc = [413,353,293,233,173,113,53]

    this.op1_rectGroup.forEach(function(rect) {
      curr_val = this.op1_used[counter]
      if (_.includes(col1, curr_val)) {
        abs_ind = col_y_sorted[0].indexOf(coords[curr_val][1])
        tween_loc = absolute_loc[abs_ind]-coords[curr_val][1]
      } else if (_.includes(col2, curr_val)) {
        abs_ind = col_y_sorted[1].indexOf(coords[curr_val][1])
        tween_loc = absolute_loc[abs_ind]-coords[curr_val][1]
      } else if (_.includes(col3, curr_val)) {
        abs_ind = col_y_sorted[2].indexOf(coords[curr_val][1])
        tween_loc = absolute_loc[abs_ind]-coords[curr_val][1]
      } else if (_.includes(col4, curr_val)) {
        abs_ind = col_y_sorted[3].indexOf(coords[curr_val][1])
        tween_loc = absolute_loc[abs_ind]-coords[curr_val][1]
      }
      this.game.add.tween(rect).to({
        y: tween_loc
      },500, Phaser.Easing.Quadratic.Out, true)
      counter++
    }, this)

    this.op2_rectGroup.forEach(function(rect) {
      curr_val = this.op2_used[counter]
      if (_.includes(col1, curr_val)) {
        abs_ind = col_y_sorted[0].indexOf(coords[curr_val][1])
        tween_loc = absolute_loc[abs_ind]-coords[curr_val][1]
      } else if (_.includes(col2, curr_val)) {
        abs_ind = col_y_sorted[1].indexOf(coords[curr_val][1])
        tween_loc = absolute_loc[abs_ind]-coords[curr_val][1]
      } else if (_.includes(col3, curr_val)) {
        abs_ind = col_y_sorted[2].indexOf(coords[curr_val][1])
        tween_loc = absolute_loc[abs_ind]-coords[curr_val][1]
      } else if (_.includes(col4, curr_val)) {
        abs_ind = col_y_sorted[3].indexOf(coords[curr_val][1])
        tween_loc = absolute_loc[abs_ind]-coords[curr_val][1]
      }
      this.game.add.tween(rect).to({
        y: tween_loc
      },500, Phaser.Easing.Quadratic.Out, true)
      counter++
    }, this)

    counter = 0
    this.sum_rectGroup.forEach(function(rect) {
      curr_val = this.sum_rects_used[counter]
      if (_.includes(col1, curr_val)) {
        abs_ind = sum_y_sorted[0].indexOf(coords[curr_val][1])
        tween_loc = absolute_loc[abs_ind]-coords[curr_val][1]
      } else if (_.includes(col2, curr_val)) {
        abs_ind = sum_y_sorted[1].indexOf(coords[curr_val][1])
        tween_loc = absolute_loc[abs_ind]-coords[curr_val][1]
      } else if (_.includes(col3, curr_val)) {
        abs_ind = sum_y_sorted[2].indexOf(coords[curr_val][1])
        tween_loc = absolute_loc[abs_ind]-coords[curr_val][1]
      } else if (_.includes(col4, curr_val)) {
        abs_ind = sum_y_sorted[3].indexOf(coords[curr_val][1])
        tween_loc = absolute_loc[abs_ind]-coords[curr_val][1]
      }
      this.game.add.tween(rect).to({
        y: tween_loc
      },500, Phaser.Easing.Quadratic.Out, true)
      counter++
    }, this)

    //this.circle_group.destroy()
    this.probText.destroy()

    if (this.streak == 3) {
      corrFeedback = '3 in a row!'
      disp_col = '#3CF948'
    } else if (this.streak == 7) {
      corrFeedback = '7 in a row!'
      disp_col = '#3CF948'
    } else if (this.streak == 15) {
      corrFeedback = '15 in a row!'
      disp_col = '#3CF948'
    } else if (this.streak == 24) {
      corrFeedback = 'Perfect Score!'
      disp_col = '#3CF948'
    } else {
      correct_feedback = ['Way to go!','Awesome!','You Rock!','Correct!','Fantastic!','Nice!']
      feedbackIndex = Math.floor(Math.random() * correct_feedback.length) + 0
      corrFeedback = correct_feedback[feedbackIndex]
      disp_col = '#FFFFFF'
    }

    this.equal.visible = false
    this.unequal.visible = false
    if (this.trial >= this.op1s.length && this.answer == "correct") {
      that = this
      setTimeout(function(){
        that.feedback = that.game.add.text(that.game.width/2-300, that.game.height/2+190, corrFeedback, {font:'60px Arial', fill:disp_col, align:'center'})
        that.feedback.anchor.x = 0.5
      }, 500)
      this.numFeedback.visible = true
      this.game.world.remove(this.progress)
      this.game.world.remove(this.pointDisplay)
      setTimeout(function() {
        that.game.world.remove(that.feedback)
        that.numFeedback.visible = false
        that.op1_rectGroup.destroy()
        that.op2_rectGroup.destroy()
        that.sum_rectGroup.destroy()
        that.quitGame()
      }, 1000)
    } else {
      that = this
      if (this.answer == "incorrect") {
        that = this
        setTimeout(function(){
          that.feedback = that.game.add.text(that.game.width/2-300, that.game.height/2+190, "Sorry :(", {font:'60px Arial', fill:disp_col, align:'center'})
          that.feedback.anchor.x = 0.5
        }, 500)
        this.numFeedback.visible = true
        this.game.world.remove(this.progress)
        this.game.world.remove(this.pointDisplay)

        setTimeout(function() {
          if (that.reps == 1) {
            that.threeTries = true
            that.game.world.remove(that.feedback)
            that.numFeedback.visible = false
            that.op1s.push(that.op1s[that.trial-1])
            that.op2s.push(that.op2s[that.trial-1])
            that.problem_ids.push(that.problem_ids[that.trial-1])
            that.equivalence[that.trial-1]
            that.op1_rectGroup.destroy()
            that.op2_rectGroup.destroy()
            that.sum_rectGroup.destroy()
            that.nextTrial()
          } else {
            that.game.world.remove(that.feedback)
            that.numFeedback.visible = false
            that.numFeedback.visible = false
            that.op1s.push(that.op1s[that.trial-1])
            that.op2s.push(that.op2s[that.trial-1])
            that.equivalence[that.trial-1]
            that.problem_ids.push(that.problem_ids[that.trial-1])
            that.op1_rectGroup.destroy()
            that.op2_rectGroup.destroy()
            that.sum_rectGroup.destroy()
            that.nextTrial()
            // that.makeProb()
            // that.makeButtons()
            // that.progress = that.game.add.text(860, 560, that.trial + ' out of ' + that.op1s.length, {font:'30px Arial', fill:'#FFFFFF', align:'center'})
            // that.progress.anchor.x = 0.5
            //
            // that.pointDisplay = that.game.add.text(85, 560, 'Coins: ' + that.points, {font:'30px Arial', fill:'#FFFFFF', align:'center'})
            // that.pointDisplay.anchor.x = 0.5
          }
          if (that.equalVal == true) {
            that.equivalence.push(1)
          } else {
            that.equivalence.push(0)
          }

        }, 3000) //1000

      } else {
        that = this
        setTimeout(function(){
          that.feedback = that.game.add.text(that.game.width/2-300, that.game.height/2+190, corrFeedback, {font:'60px Arial', fill:disp_col, align:'center'})
          that.feedback.anchor.x = 0.5
        }, 500)
        this.numFeedback.visible = true
        this.game.world.bringToTop(this.numFeedback)
        this.game.world.remove(this.progress)
        this.game.world.remove(this.pointDisplay)
        setTimeout(function() {
          that.game.world.remove(that.feedback)
          that.numFeedback.visible = false
          that.op1_rectGroup.destroy()
          that.op2_rectGroup.destroy()
          that.sum_rectGroup.destroy()
          that.nextTrial()
        }, 3000) //1000
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
    this.circle_group.destroy()

    //this.logger.inputData('endGameStats', [this.startTime, endTime, 'completed'])

      //Let them know it's done...
      this.game.time.events.add(Phaser.Timer.SECOND, function () {
        endText = this.game.add.text(this.game.width/2, 200, 'All done!', {font:'96px Arial', fill:'#FFFFFF', align:'center'});
        endText.anchor.x = 0.5
        finalPoints = this.game.add.text(this.game.width/2, 400, 'You got ' + this.points + ' points', {font:'76px Arial', fill:'#FFFFFF', align:'center'});
        finalPoints.anchor.x = 0.5
        totalPoints = this.points
        this.points = 0
                //  Then let's go back to the main menu.
        // this.game.time.events.add(Phaser.Timer.SECOND * 2,function () {next_task(false)},this)
        this.game.time.events.add(Phaser.Timer.SECOND * 2,function () {end_session()},this)

        //this.game.time.events.add(Phaser.Timer.SECOND * 2, function() {this.state.start('gamePlay', true, false, totalPoints, tasks_to_play, this.week, this.problem_set);}, this);
        //this.game.time.events.add(Phaser.Timer.SECOND * 2, function() {this.state.start('Menu', true, false, this.problem_set);}, this);
      }, this);
  }

};
