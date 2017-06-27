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

};

Game.Run.prototype = {

  init: function(maxTime, algebra, problem_set,currBoard) {
      this.ogMaxTime = maxTime;
      this.maxTime = maxTime;
      this.problem_set = problem_set
      this.currBoard = currBoard //3 will reach max call stack sometimes... 3,2,1,0

      if (!algebra)
        {
          this.algebra = false;
        }
      else {this.algebra = algebra;}
  },

  create: function () {
    Error.stackTraceLimit = Infinity;

    //bckgrnd = this.game.add.graphics(0,0)
    //bckgrnd.beginFill(0xFFFFFF, 1)
    //bckgrnd.drawRect(0,0,1000,1000)
    //bckgrnd.endFill()

    //A
    //op1
    if (this.problem_set == 'A') {
      p11 = [7,2,3,4,4,2,5,6,3,6,2,5]
      p12 = [8,3,4,9,3,5,6,4,9,2,7,6,2,5,7,6,8,5,7,4,2,9,5,6]
      p13 = [4,9,2,16,6,13,7,2,9,5,15,7,13,5,14,6,17,2,2,6,12,5,16,4,12,4,15,3,8,3,4,8,3,12,6,14,7,3,9,6,5,5,2,5,2,4,7,6]
      p14 = [2,18,5,12,7,16,5,13,7,4,17,9,5,7,13,2,3,14,6,15,2,12,9,15,16,7,19,6,8,15,4,17,2,6,9,12,5,14,4,18,19,4,15,2,8,8,7,5,4,19,3,14,6,17,5,4,6,3,5,6,16,5,9,3,2,9,6,9,7,16,6,8]
      //op2
      p21 = [3,5,6,2,5,6,2,2,7,3,4,4]
      p22 = [5,6,2,7,7,2,8,5,4,4,5,9,6,4,9,3,6,7,3,9,5,6,8,2]
      p23 = [12,7,5,3,8,7,3,16,4,12,4,9,6,8,5,9,3,4,15,3,4,7,2,5,6,9,2,6,5,16,15,6,7,5,13,2,5,17,6,12,2,14,14,4,6,2,13,2]
      p24 = [14,6,8,5,19,2,17,7,5,19,3,16,4,9,6,6,6,5,18,4,4,6,14,2,9,13,4,9,6,8,5,9,15,3,17,4,7,9,12,5,7,9,7,16,5,16,3,12,15,6,7,2,13,5,18,2,2,17,2,19,8,14,6,16,5,7,12,4,15,3,8,15]
    } else {
      p11 = [4,7,2,3,3,8,2,6,2,5,4,3]
      p12 = [3,3,8,6,9,5,7,5,3,8,9,8,4,3,6,2,8,4,7,4,2,7,2,9]
      p13 = [2,13,12,6,2,3,7,3,7,5,8,18,2,3,8,9,3,4,2,6,12,2,13,13,8,4,16,3,5,9,17,8,3,3,4,5,8,7,14,7,14,4,6,2,15,4,12,9]
      p14 = [4,15,4,3,18,15,7,3,2,4,7,5,13,8,18,8,3,13,8,5,6,12,9,6,7,5,8,3,7,9,14,17,2,7,4,17,9,3,8,18,16,2,5,9,8,17,8,3,13,2,3,14,2,14,9,6,19,12,3,2,13,19,6,7,16,9,8,4,19,4,12,18]

      p21 = [6,2,3,5,4,2,8,4,7,3,3,2]
      p22 = [9,2,7,4,8,9,2,3,4,2,3,4,6,5,7,3,9,8,8,3,7,6,8,5]
      p23 = [8,4,8,14,7,14,6,5,12,9,2,2,13,15,9,3,4,8,3,4,7,18,2,5,7,13,4,9,3,5,2,12,2,12,6,13,4,2,6,8,3,3,7,17,3,16,3,8]
      p24 = [6,3,13,2,2,9,16,5,17,18,2,9,2,4,7,2,14,9,14,13,17,8,3,14,8,19,17,12,12,8,3,8,3,6,8,6,13,15,19,4,4,13,3,15,7,2,9,19,4,18,9,8,7,6,18,4,8,3,4,8,5,3,7,18,7,5,12,3,5,16,7,9]
    }

    this.op1 = [p11,p12,p13,p14]
    this.op2 = [p21,p22,p23,p24]

    this.setParams();

  },

  shuffle: function (array1, array2,repDist1,repDist2,multi1,multi2,reps,counter,nSpaces) {
    orig1 = array1
    orig2 = array2
    var currInd = orig1.length, tempVal1, tempVal2, randInd
    while (0 != currInd) {
      randInd = Math.floor(Math.random() * currInd)
      currInd -= 1
      tempVal1 = array1[currInd]
      tempVal2 = array2[currInd]
      array1[currInd] = array1[randInd]
      array2[currInd] = array2[randInd]
      array1[randInd] = tempVal1
      array2[randInd] = tempVal2
    }

    sums = []
    for (i=0;i<orig1.length;i++) {
      sums.push(array1[i]+array2[i])
    }
    //spaces = Array(nSpaces+1).fill(0)
    //sums = sums.concat(spaces)
    nReps = 0
    issues = []
    for (i=0;i<orig1.length;i++) {
        if (sums[i] == sums[i-repDist1] || sums[i] == sums[i+repDist1] || sums[i] == sums[i-repDist2] || sums[i] == sums[i+repDist2] || sums[i] == sums[i-(repDist2+1)] || sums[i] == sums[i-(repDist2-1)] || sums[i] == sums[i+(repDist2+1)] || sums[i] == sums[i+(repDist2-1)]) {
          if (sums[i] == 0) {
            if (sums[i-repDist1] == 0 || sums[i+repDist1] == 0) {
              nReps+=1
              issues.push([i,sums[i]])
            } else if (sums[i-repDist2] == 0 || sums[i+repDist2] == 0) {
              nReps+=1
              issues.push([i,sums[i]])
            }
          } else {
            nReps+=1
            issues.push([i,sums[i]])
          }
        }
    }
    return [array1, array2, nReps,issues]
  },

  drawBoard: function (margin,x_spacing,y_spacing,nRow,repDist1,repDist2,nSpaces,nIters) {
    corner_x = margin
    corner_y = margin
    op1s = this.op1[this.currBoard].concat(Array(nSpaces).fill(0))
    op2s = this.op2[this.currBoard].concat(Array(nSpaces).fill(0))
    minReps = 1000
    for (kk=0;kk<nIters;kk++) {
      output = this.shuffle(op1s,op2s,repDist1,repDist2,[],[],[],0,nSpaces)
      if (output[2] < minReps) {
        minReps = output[2]
        minIssues = output[3]
        problems = []
        for (jj=0; jj < output[0].length; jj++) {
          problem = output[0][jj] + output[1][jj]
          problems.push(problem)
        }
      }
    }
    console.log(minIssues)
    console.log(minReps)

    for (i=0; i < problems.length; i++) {
      problem = problems[i]//op1s[i] + op2s[i]
      //problem = this.op1[this.currBoard][i] + ' + ' + this.op2[this.currBoard][i]
      if (problem == 0) {
        problem = ' '
      }
      this.pointDisplay = this.game.add.text(corner_x,corner_y,problem, {font:'30px Arial', fill:'#FFFFFF', align:'center'})
      this.pointDisplay.anchor.x = 0.5
      corner_x+=x_spacing
      if ((i+1) % nRow == 0) {
        corner_x = margin
        corner_y+=y_spacing
      }
    }
  },

  setParams: function () {

    if (this.currBoard == 0) {
      margin = 150
      x_spacing = 100
      y_spacing = 60
      nRow = 4//3
      repDist = 5
      repDist1 = 1
      repDist2 = 4//3
      nSpaces = 4
      //draw bingo board and dividers here
      this.drawBoard(margin,x_spacing,y_spacing,nRow,repDist1,repDist2,nSpaces,100000)

    } else if (this.currBoard == 1) {
      margin = 150
      x_spacing = 100
      y_spacing = 60
      nRow = 5//6
      repDist = 5//6
      repDist1 = 1
      repDist2 = 6
      nSpaces = 1//12
      //draw bingo board and dividers here
      this.drawBoard(margin,x_spacing,y_spacing,nRow,repDist1,repDist2,nSpaces,100000)//1000000)
    } else if (this.currBoard == 2) {
      margin = 150
      x_spacing = 100
      y_spacing = 60
      nRow = 7//8
      repDist = 7//8
      repDist1 = 1
      repDist2 = 8
      nSpaces = 1//0//8//16
      //draw bingo board and dividers here
      this.drawBoard(margin,x_spacing,y_spacing,nRow,repDist1,repDist2,nSpaces,100000)//5000000)
    } else if (this.currBoard == 3) {
      margin = 150
      x_spacing = 100
      y_spacing = 60
      nRow = 9
      repDist = 9
      repDist1 = 1
      repDist2 = 8
      nSpaces = 9//28
      //draw bingo board and dividers here
      this.drawBoard(margin,x_spacing,y_spacing,nRow,repDist1,repDist2,nSpaces,1000000)
    }

  },

};
