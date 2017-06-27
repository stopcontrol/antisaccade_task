Game.Menu = function (game) {

	this.music = null
	this.playButton = null

}

Game.Menu.prototype = {

	init: function (problem_set) {

		this.problem_set = problem_set

	},

  create: function () {
		title = this.game.add.text(this.game.world.centerX,this.game.world.centerY-150,"Bingo Generator",{font:'80px Arial', fill:'#FFFFFF', align:'center'})
		title.anchor.x = 0.5

		title = this.game.add.text(200,this.game.world.centerY-5,"A:",{font:'30px Arial', fill:'#FFFFFF', align:'center'})
		title.anchor.x = 0.5

		button = this.add.button(300, this.game.world.centerY, 'k1', function () {this.state.start('Run', true, false, this.problem_set,0,'A',0);}, this);
    button.scale.setTo(0.5,0.5)
    button.anchor.x = 0.5

		button = this.add.button(this.game.world.centerX-100, this.game.world.centerY, 'k2', function () {this.state.start('Run', true, false, this.problem_set,0,'A',1);}, this);
    button.scale.setTo(0.5,0.5)
    button.anchor.x = 0.5

		button = this.add.button(this.game.world.centerX, this.game.world.centerY, 'k3', function () {this.state.start('Run', true, false, this.problem_set,0,'A',2);}, this);
		button.scale.setTo(0.5,0.5)
		button.anchor.x = 0.5

		button = this.add.button(this.game.world.centerX+100, this.game.world.centerY, 'k4', function () {this.state.start('Run', true, false, this.problem_set,0,'A',3);}, this);
		button.scale.setTo(0.5,0.5)
		button.anchor.x = 0.5

		title = this.game.add.text(200,this.game.world.centerY+100-5,"B:",{font:'30px Arial', fill:'#FFFFFF', align:'center'})
		title.anchor.x = 0.5

		button = this.add.button(300, this.game.world.centerY+100, 'k1', function () {this.state.start('Run', true, false, this.problem_set,0,'B',0);}, this);
		button.scale.setTo(0.5,0.5)
		button.anchor.x = 0.5

		button = this.add.button(this.game.world.centerX-100, this.game.world.centerY+100, 'k2', function () {this.state.start('Run', true, false, this.problem_set,0,'B',1);}, this);
		button.scale.setTo(0.5,0.5)
		button.anchor.x = 0.5

		button = this.add.button(this.game.world.centerX, this.game.world.centerY+100, 'k3', function () {this.state.start('Run', true, false, this.problem_set,0,'B',2);}, this);
		button.scale.setTo(0.5,0.5)
		button.anchor.x = 0.5

		button = this.add.button(this.game.world.centerX+100, this.game.world.centerY+100, 'k4', function () {this.state.start('Run', true, false, this.problem_set,0,'B',3);}, this);
		button.scale.setTo(0.5,0.5)
		button.anchor.x = 0.5

  },

	startWk1: function () {
		this.state.start('Run', true, false, this.problem_set);
	}

}
