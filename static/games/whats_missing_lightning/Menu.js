Game.Menu = function (game) {

	this.music = null
	this.playButton = null

}

Game.Menu.prototype = {

	init: function (problem_set) {

		this.problem_set = problem_set

	},

  create: function () {
		title = this.game.add.text(this.game.world.centerX,75,"What's Missing?",{font:'80px Arial', fill:'#FFFFFF', align:'center'})
		title.anchor.x = 0.5
    button = this.add.button(this.game.world.centerX, 175, 'lightning', function () {this.state.start('Instructions', true, false, this.problem_set);}, this);
    button.scale.setTo(0.5,0.5)
    button.anchor.x = 0.5

  },

}
