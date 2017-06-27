Game.Instructions = function (game) {

    "use strict"

    this.game     //  a reference to the currently running game (Phaser.Game)
    this.add       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
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
    this.rnd       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    this.trial = 0
    this.problem = [0,0,0]
    this.numGraded = 0
    this.prevMoverX = 50
    this.points = 0
    this.moveCoin = false
    this.reps = 0
    this.streak = 0
    this.rmInstructB = false
    this.inst_num = 1
    this.inst_finished = false
    this.moveAddendLines = false
    this.clickable = true

  };

Game.Instructions.prototype = {
    init: function(problem_set) {
      this.problem_set = problem_set
    },

    create: function() {
      problems = problemGen(this.week, this.problem_set)
      this.op1s = [1]
      this.op2s = [2]
      this.problem_ids = [0]

      //task info
      this.task = 'VS_production'
      task_type = 'VS'

      //initializing subject for this game
    	//this.results = set_up_subject(this.task);
    	//user = this.results[0];
    	//session = this.results[1];
    	//play = this.results[2];
    	//this.subject = new Subject(user, this.task, task_type, this.problem_set, session, play)

      //this.game.add.tileSprite(0,0,this.op1s.length*1000,600,'background')

      this.game.world.setBounds(0, 0, 960, 600)

      d = new Date()
      this.startTime = d.getTime()

      this.progress = this.game.add.text(860, 560, '1 out of 1', {font:'30px Arial', fill:'#FFFFFF', align:'center'})
      this.progress.fixedToCamera = true
      this.progress.anchor.x = 0.5

      this.pointDisplay = this.game.add.text(85, 560, 'Coins: ' + this.points, {font:'30px Arial', fill:'#FFFFFF', align:'center'})
      this.pointDisplay.anchor.x = 0.5
      this.pointDisplay.fixedToCamera = true


      this.mainLineY = 350
      this.mainLineX = 49
      this.mainLineLength = 851
      this.mainLine = this.game.add.graphics(this.mainLineX, this.mainLineY)
      this.mainLine.lineStyle(6, 0xFFFFFF)
      this.mainLine.lineTo(this.mainLineLength, 0)

      hashX = 50
      this.hashes = this.game.add.group()
      this.labels = this.game.add.group()
      for (i = 0; i < 31; i++) {
        hashMark = this.game.add.graphics(hashX,this.mainLineY - 2.22)
        hashMark.lineStyle(5, 0xFFFFFF)
        hashMark.lineTo(0,20)
        label = this.game.add.text(hashX,this.mainLineY + 20,i,{font: "15px Arial", fill: "#FFFFFF", align: "center"})
        label.anchor.x = 0.5
        this.hashes.add(hashMark)
        this.labels.add(label)
        hashX = hashX + 28.3
      }

      this.nextTrial()

      this.mover = this.game.add.graphics(50,this.mainLineY-250)
      this.mover.beginFill(0x33cccc)
      this.mover.lineStyle(4,0x33cccc,1)
      this.mover.drawCircle(0, 250, 20)

      this.makeDude(this.mover.x,this.mainLineY-20)

      submitButton = this.game.add.button(425, 500, 'go')
      submitButton.onInputUp.add(function() {
        if (this.mover.x > 60 && this.inst_finished && this.clickable) {
          this.game.world.remove(this.back_ground)
          this.game.world.remove(this.instruct_text)
          this.clickable = false
          this.submit = true
          var d = new Date()
          this.RT = d.getTime() - this.start_time
          this.grade(this.startTime)
        }

      }, this)

      this.game.input.onDown.add(this.mouseDragStart, this)
      this.game.input.onUp.add(this.mouseDragEnd, this)

      this.front = this.makeFollower(1000, 0x3232ff,-1000,250)
      this.occlude()

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
        instruct_text = this.game.add.text(670,180,"In this game you need to help your character find a coin\n that is hidden under the number line.\n Try to find as many as possible!",
        {font: "20px Arial", fill: "#FFFFFF", align: "center"})
        instruct_text.anchor.x = (0.5,0.5)
        this.nextB = this.add.button(670, 280, 'next', function () {
          this.game.world.remove(instruct_text)
          this.rmInstructB = true
        }, this);
        this.inst_finished = false
        this.nextB.anchor.x = (0.5,0.5)
        this.nextB.scale.setTo(0.5,0.5)
        this.back_ground = this.makeBox(instruct_text.x-260,instruct_text.y-20,520,160)
        this.game.world.sendToBack(this.back_ground)
      } if (num == 2) {
        instruct_text = this.game.add.text(670,180,"The location of the coin is the number \nthat solves the problem. ",
        {font: "20px Arial", fill: "#FFFFFF", align: "center"})
        instruct_text.anchor.x = (0.5,0.5)
        this.nextB = this.add.button(670, 280, 'next', function () {
          this.game.world.remove(instruct_text)
          this.rmInstructB = true
        }, this);
        this.inst_finished = false
        this.nextB.anchor.x = (0.5,0.5)
        this.nextB.scale.setTo(0.5,0.5)
      } if (num == 3) {
        instruct_text = this.game.add.text(670,180,"When you think you know the answer, drag the blue ball\n to that number's location.\nYour character will follow!",
        {font: "20px Arial", fill: "#FFFFFF", align: "center"})
        instruct_text.anchor.x = (0.5,0.5)
        this.nextB = this.add.button(670,280, 'next', function () {
          this.game.world.remove(instruct_text)
          this.rmInstructB = true
        }, this);
        this.inst_finished = false
        this.nextB.anchor.x = (0.5,0.5)
        this.nextB.scale.setTo(0.5,0.5)
      }if (num == 4) {
        this.instruct_text = this.game.add.text(670,220,"You can try answering this problem now.",
        {font: "20px Arial", fill: "#FFFFFF", align: "center"})
        this.instruct_text.anchor.x = (0.5,0.5)
        this.inst_finished = true
      }
    },

    is_touch_device: function() {
      return (('ontouchstart' in window)
        || (navigator.MaxTouchPoints > 0)
        || (navigator.msMaxTouchPoints > 0))
    },

    mouseDragStart: function() {
      this.mouseDown = true
    },

    mouseDragEnd: function() {
      this.mouseDown = false
    },

    makeFollower: function(width, color, originX, originY) {
      follower = this.game.add.graphics(originX, originY)
      follower.beginFill(color, 1)
      follower.drawRect(-3, this.mainLineY-253, width, 6)
      return follower
    },

    addendLine: function(a,x,y) {
      l_length = a * 28.3
      l = this.game.add.graphics(x, y)
      l.lineStyle(6, 0xFFFFFF)
      l.lineTo(l_length, 0)

      // hashX = 50
      if (this.trial != 0 && a == this.problem[1]) {
        numLabels = a+2
      } else {
        numLabels = a+1
      }

      metaGroup = this.game.add.group()
      hashes = this.game.add.group()
      labels = this.game.add.group()
      hashX = x
      for (i = 0; i < a+1; i++) {
        hashMark = this.game.add.graphics(hashX,y - 2.22)
        hashMark.lineStyle(5, 0xFFFFFF)
        hashMark.lineTo(0,20)
        hashes.add(hashMark)
        hashX = hashX + 28.3
      }
      for (i = 0; i < numLabels; i++) {
        label = this.game.add.text(x,y + 20,i,{font: "15px Arial", fill: "#FFFFFF", align: "center"})
        label.anchor.x = 0.5
        labels.add(label)
        x = x + 28.3
      }

      //edgecase coverup
      // if (this.correct != undefined && a == this.problem[1]) {
      //   rect = this.game.add.graphics(x-40,115)
      //   rect.beginFill(0x000000, 1)
      //   rect.drawRect(0,0, 20, 100)
      // }

      metaGroup.add(hashes)
      metaGroup.add(l)
      metaGroup.add(labels)
      return [l_length, metaGroup]
    },

    hideLine: function() {
      rect = this.game.add.graphics(0,180)
      rect.beginFill(0x000000, 1)
      rect.drawRect(0,0, 1200, 100)

    },

    makeRect: function(x,y, length) {
      rect = this.game.add.graphics(x,y)
      rect.beginFill(0x000000, 1)
      rect.drawRect(0,this.mainlineY-250, length, 25)
    },

    occlude: function() {
      this.occluder1 = this.makeRect(this.mainLineX-102,this.mainLineY-15, 100)
      this.occluder2 = this.makeRect(this.mainLineLength+50.5,this.mainLineY-15, 100)

      this.topLayer = this.game.add.group() //group added to make mover on top
      this.topLayer.add(this.mover)
    },

    nextTrial: function () {

      //clock
      var d = new Date();
      this.start_time = d.getTime();
      //reset the RT counter

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

      this.answerTxt = [this.problem[0],' + ',this.problem[1],' = ?']
      this.answerTxt = this.answerTxt.join('')

      if (this.mover) {
        this.mover.x = 50
        this.front.x = this.mover.x-1000
      }
      //this.probText = this.game.add.text(480, 75, this.answerTxt, {font: "70px Arial", fill: "#FFFFFF", align: "center"})
      //this.probText.anchor.x = 0.5

      this.placeCoin(this.problem[2],this.mainLineY-20)

      this.addendLineMaker()


      this.probTxtGroup = this.probTextMaker('=','?')

      this.trial++;
      this.progress.setText(this.trial + ' out of 1')
    },

    addendLineMaker: function() {
      if (this.problem[2] > 19) {
        a1_vals = this.addendLine(this.problem[0],50,150)
        a1_len = a1_vals[0]
        a2_vals = this.addendLine(this.problem[1],a1_len + 80,150)
      } else {
        a1_vals = this.addendLine(this.problem[0],50,150)
        a1_len = a1_vals[0]
        a2_vals = this.addendLine(this.problem[1],a1_len + 200,150)
      }
      this.a1_line = a1_vals[1]
      this.a2_line = a2_vals[1]
      a2_len = a2_vals[0]
    },

    probTextMaker: function(eq, sum) {
      if (this.problem[2] > 19) {
        probTxtGroup = this.game.add.group()
        ad1Txt = this.game.add.text(a1_len/2, 50, this.problem[0], {font: "70px Arial", fill: "#FFFFFF", align: "center"}, probTxtGroup)
        ad2Txt = this.game.add.text(a1_len+10+a2_len/2, 50, this.problem[1], {font: "70px Arial", fill: "#FFFFFF", align: "center"}, probTxtGroup)
        plusTxt = this.game.add.text(a1_len+15, 50, '+', {font: "70px Arial", fill: "#FFFFFF", align: "center"}, probTxtGroup)
        eqTxt = this.game.add.text(a1_len+a2_len, 50, eq, {font: "70px Arial", fill: "#FFFFFF", align: "center"}, probTxtGroup)
        sumTxt = this.game.add.text(eqTxt.x + 80, 50, sum, {font: "70px Arial", fill: "#FFFFFF", align: "center"}, probTxtGroup)
      } else {
        probTxtGroup = this.game.add.group()
        ad1Txt = this.game.add.text(30+a1_len/2, 50, this.problem[0], {font: "70px Arial", fill: "#FFFFFF", align: "center"}, probTxtGroup)
        ad2Txt = this.game.add.text(a1_len+180+a2_len/2, 50, this.problem[1], {font: "70px Arial", fill: "#FFFFFF", align: "center"}, probTxtGroup)
        plusTxt = this.game.add.text(50+a1_len+55, 50, '+', {font: "70px Arial", fill: "#FFFFFF", align: "center"}, probTxtGroup)
        eqTxt = this.game.add.text(a1_len+220+a2_len+50, 50, eq, {font: "70px Arial", fill: "#FFFFFF", align: "center"}, probTxtGroup)
        sumTxt = this.game.add.text(eqTxt.x + 100, 50, sum, {font: "70px Arial", fill: "#FFFFFF", align: "center"}, probTxtGroup)
      }
      return probTxtGroup
    },

    placeCoin: function(sum,y) {
      count = 0
      this.hashes.forEachAlive(function(h) {
        if (count == sum) {
          x = h.x - 17
        }
        count = count + 1
      }, this)
      this.coin = this.game.add.sprite(x,y,'coin')
      this.coin.visible = false
    },

    grade: function(time_stamp) {
      this.hashes.forEachAlive(function(h) {
        cent = (this.mover.x + this.mover.width/2)
        if (this.submit && (h.x < cent+15 && h.x >= cent-15)) {
          this.response = Math.round((h.x - 50)/28.3)
        }
      }, this)

      if (this.response == this.problem[2] && this.trial == this.op1s.length) {
        this.correct = true
        this.moveCoin = true
        if (this.reps == 0) {
            this.streak += 1
        }
        this.reps = 0
        this.game.world.remove(this.probTxtGroup)
        this.sumText = this.probTextMaker('=',this.problem[2])
        giveFeedback(this, this.correct, this.streak, 'vnt',470, 400, '60px Arial')
        this.points += 1
        this.game.world.remove(this.coin)
        this.numGraded++
        this.pointDisplay.setText("Coins: " + this.points)
        this.moveAddendLines = true
        if (this.problem[2] > 19) {
          this.ad1Txt = this.game.add.text(a1_len/2, 50, this.problem[0], {font: "70px Arial", fill: "#FFFFFF", align: "center"}, probTxtGroup)
          this.ad2Txt = this.game.add.text(a1_len+10+a2_len/2, 50, this.problem[1], {font: "70px Arial", fill: "#FFFFFF", align: "center"}, probTxtGroup)
        } else {
          this.ad1Txt = this.game.add.text(30+a1_len/2, 50, this.problem[0], {font: "70px Arial", fill: "#FFFFFF", align: "center"}, probTxtGroup)
          this.ad2Txt = this.game.add.text(a1_len+180+a2_len/2, 50, this.problem[1], {font: "70px Arial", fill: "#FFFFFF", align: "center"}, probTxtGroup)
        }
        //this.save()
        this.quitGame()
        return
      } else if (this.response == this.problem[2] && this.trial != this.op1s.length) {
        this.correct = true
        if (this.reps == 0) {
            this.streak += 1
        }
        this.reps = 0
        this.game.world.remove(this.probTxtGroup)
        this.sumText = this.probTextMaker('=',this.problem[2])
      } else {
        this.correct = false
        this.streak = 0
        this.reps+=1
        this.game.world.remove(this.probTxtGroup)
        if (this.reps != 3) {
          this.sumText = this.probTextMaker('≠',this.response)
        } else {
          this.sumText = this.probTextMaker('=',this.problem[2])
        }
        that = this
      }

      if (this.streak == 3 || this.streak == 7 || this.streak == 13) {
        this.points += 1
      }

      if (this.correct) {
        this.points += 1
        this.moveCoin = true
        //this.game.world.remove(this.coin)
      } else {
        if (this.points == 0) {
          this.points = 0
        } else {
          this.points -= 1
        }
      }

      this.pointDisplay.setText("Coins: " + this.points)

      if (this.reps != 3) {
        giveFeedback(this, this.correct, this.streak,'vnt',470, 400, '60px Arial')
      }

      this.moveAddendLines = true
      if (this.problem[2] > 19) {
        this.ad1Txt = this.game.add.text(a1_len/2, 50, this.problem[0], {font: "70px Arial", fill: "#FFFFFF", align: "center"}, probTxtGroup)
        this.ad2Txt = this.game.add.text(a1_len+10+a2_len/2, 50, this.problem[1], {font: "70px Arial", fill: "#FFFFFF", align: "center"}, probTxtGroup)
      } else {
        this.ad1Txt = this.game.add.text(30+a1_len/2, 50, this.problem[0], {font: "70px Arial", fill: "#FFFFFF", align: "center"}, probTxtGroup)
        this.ad2Txt = this.game.add.text(a1_len+180+a2_len/2, 50, this.problem[1], {font: "70px Arial", fill: "#FFFFFF", align: "center"}, probTxtGroup)
      }
      this.numGraded++
      //this.save()
      this.endTrial()
    },

    save: function() {
      inputData('answer', this.response)
      inputData('problem', [this.problem[0],' + ',this.problem[1],' = ','?'].join(""))
      inputData('RT', this.RT/1000)
      inputData('n1', parseInt(this.problem[0]))
      inputData('n2', parseInt(this.problem[1]))
      inputData('problem_id', parseInt(this.problem[3]))
      inputData('solution', parseInt(this.problem[2]))

      if (this.correct) {
        inputData('ACC', 1)
      } else {
        inputData('ACC', 0)
      }
      if (this.trial-1 == 0) {
        currTrial = 1
      } else {
        currTrial = this.trial
      }
      inputData('points', this.points)

      if (this.trial >= this.op1s.length && this.correct) {
        inputData('finished', 1)
      } else {
        inputData('finished', 0)
      }

      sendData(this.numGraded)

    },

    endTrial: function() {
      if (this.reps == 3000) {
        this.reps = 0
        this.sorryText = this.game.add.text(200, 400, 'Sorry, the correct answer is ' + this.problem[2], {font: "40px Arial", fill: "#FFFFFF", align: "center"})
        that = this
        setTimeout(function() {
          that.game.world.remove(that.sumText)
          that.game.world.remove(that.sorryText)
          that.game.world.remove(that.a1_line)
          that.game.world.remove(that.a2_line)
          that.game.world.remove(that.ad1Txt)
          that.game.world.remove(that.ad2Txt)
          that.hideLine()
          that.nextTrial()
          that.clickable = true
        }, 1500)
      } else {
        that = this
        setTimeout(function() {
          that.game.world.remove(that.sumText)
          that.game.world.remove(that.a1_line)
          that.game.world.remove(that.a2_line)
          that.game.world.remove(that.ad1Txt)
          that.game.world.remove(that.ad2Txt)
          if (that.correct) {
            that.hideLine()
            that.nextTrial()
            that.clickable = true
          } else {
            that.probTxtGroup = that.probTextMaker('=','?')
            //clock
            var d = new Date();
            that.start_time = d.getTime();
            that.game.world.remove(that.a1_line)
            that.game.world.remove(that.a2_line)
            that.game.world.remove(that.ad1Txt)
            that.game.world.remove(that.ad2Txt)
            that.addendLineMaker()
            that.clickable = true
            //reset the RT counter
          }
        }, 2000)
      }
    },

    quitGame: function () {
        d = new Date()
        endTime = d.getTime()

        //this.subject.inputData('endGameStats', [this.startTime, endTime, 'completed'])
        that = this
        setTimeout(function() {
          that.game.world.remove(that.sumText)

          //nextTask(that.results[0], that.task)


        }, 1000)

        //Let them know it's done...
        this.game.time.events.add(Phaser.Timer.SECOND, function () {
          //this.hideLine()
          //edgecase coverup
          rect = this.game.add.graphics(200,140)
          rect.beginFill(0x0c3ef0, 1) //
          rect.drawRect(0,0, 100, 50)

          instructions = this.game.add.text(490, 50, 'Nice job! Make sense? If so you can get started by pressing the "go" button.\nIf not, you can repeat the instructions by clicking the "back" button\nYou will complete 13 problems in the main game.', {font:'20px Arial', fill:'#FFFFFF', align:'center'});
          instructions.anchor.x = 0.5
          instructions.lineSpacing = -8
          this.back_ground = this.makeBox(this.game.world.centerX-instructions.width/2-5,instructions.y-10,instructions.width+20,instructions.height+200)
          this.game.world.sendToBack(this.back_ground)
          this.go = this.add.button(250, 225, 'go', function () {this.state.start('Run', true, false, this.week, this.problem_set);}, this);
          this.back = this.add.button(650, 225, 'back', function () {

            this.rmInstructB = false
            this.inst_num = 1
            this.inst_finished = false
            this.correct = false
            this.trial = 0
            this.problem = [0,0,0]
            this.numGraded = 0
            this.prevMoverX = 50
            this.points = 0
            this.moveCoin = false
            this.reps = 0
            this.streak = 0


            this.state.start('Instructions', true, false, this.week, this.problem_set);}, this);


        }, this);
    },

    moverMaker: function(x, color) {
      this.mover.destroy()
      this.mover = this.game.add.graphics(x,this.mainLineY-250)
      this.mover.beginFill(0x33cccc)
      this.mover.lineStyle(4,color,1)
      this.mover.drawCircle(0, 250, 20)
    },

    makeDude: function(x,y) {
      this.dude = this.game.add.sprite(x,y,'dude');
      //this.game.physics.enable(this.dude);
      this.dude.anchor.setTo(0.5,1);
      this.dude.scale.x = -1; //also flipped
      this.dude.animations.add('right', [0, 1, 2, 3], 10, true);
      this.dude.animations.add('left', [5, 6, 7, 8], 10, true);
      this.dudeMade = true
    },

    update: function() {

      if (this.rmInstructB) {
        this.game.world.remove(this.nextB)
        this.rmInstructB = false
        this.inst_num += 1
        this.instruct(this.inst_num)
      }

      pointerX = this.clickType.x
      pointerY = this.clickType.y

      if (this.mouseDown && pointerX >= this.mover.x - 50  && pointerX <= this.mover.x + 50 && pointerY >= this.mainLineY-20 && pointerY <= this.mainLineY+20) {
        if (pointerX < this.mainLineLength+50 && pointerX > this.mainLineX) {
          this.moverMaker(pointerX, 0x3232ff)
          if (!this.dudeMade) {
            this.makeDude(pointerX,this.mainLineY-20)
            this.dude.frame = 4
          } else {
            if (pointerX < this.dude.x) {
              this.dude.animations.play('left')
            } else if (pointerX > this.dude.x) {
              this.dude.animations.play('right')
            } else if (this.dude.x == pointerX) {
              this.dude.animations.stop()
              this.dude.frame = 4
            }
            this.dude.x = pointerX
          }
          this.front.x = this.mover.x-1000
        }
      } else {
        this.prevX = this.mover.x
        this.moverMaker(this.prevX,0x33cccc)
        this.dude.x = this.mover.x
      }

      that = this
      if (this.submit) {
        setTimeout(function() {
          this.submit = false
          // that.moverPos = that.mover.x
          // that.mover.x = that.moverPos - 15
          // that.front.x = that.mover.x-1000
          // that.dude.animations.play('left')
          // if (that.moverPos <= 74) {
          //   that.submit = false
          //   that.dude.animations.stop()
          //   that.dude.frame = 4
          // }
        }, 300)
      }

      if (this.moveCoin) {
        this.coin.visible = true
        this.coin.bringToTop()
        this.coin.y -= 3
        if (this.coin.y <= 250) {
          this.game.world.remove(this.coin)
          this.moveCoin = false
        }
      }

      if (this.moveAddendLines) {
        xParam = 3.75
        yParam = 5
        if (this.problem[2] > 19) {
          this.a1_line.y += yParam
          this.a2_line.y += yParam
          this.a2_line.x -= 0.75
          this.sumText.children[0].y += yParam
          this.sumText.children[1].y += yParam
          this.sumText.children[1].x -= 0.75
        } else {
          this.a1_line.y += yParam
          this.a2_line.y += yParam
          this.a2_line.x -= xParam
          this.sumText.children[0].y += yParam
          this.sumText.children[1].y += yParam
          this.sumText.children[1].x -= xParam
        }
        this.game.world.bringToTop(this.a1_line)
        this.game.world.bringToTop(this.a2_line)
        this.game.world.bringToTop(this.dude)
        if (this.a1_line.y >= 200) {
          this.moveAddendLines = false

          for (i=0;i<20;i++) { //a horrible solution to some phaser nonsense
            this.a1_line.children[2].forEachAlive(function(l) {
              l.destroy()
            })
            this.a2_line.children[2].forEachAlive(function(l) {
              l.destroy()
            })
          }
        }
      }

      this.labels.forEachAlive(function(l) {
        //centLabel = (this.mover.x + this.mover.width/2)
        labelX = l.x
        labelY = l.y
        oldLabel = l.text
        if ((labelX > this.mover.x-10 && labelX < this.mover.x+10 && this.mouseDown) || (labelX > this.mover.x-10 && labelX < this.mover.x+10 && !this.submit)) {
          l.destroy()
          label = this.game.add.text(labelX,labelY,oldLabel,{font: "30px Arial", fill: "#FFFFFF", align: "center"})
          label.anchor.x = 0.5
        } else if (l.style.font == "30px Arial"){
          //l.destroy()
          label = this.game.add.text(l.x,l.y,l.text,{font: "15px Arial", fill: "#FFFFFF", align: "center"})
          label.anchor.x = 0.5
          l.destroy()

        }
        this.labels.add(label)
        this.prevMoverX = this.mover.x
      }, this)
    }
}
