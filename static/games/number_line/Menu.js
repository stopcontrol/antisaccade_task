Game.Menu = function (game) {

	this.music = null
	this.playButton = null

}

Game.Menu.prototype = {

	init: function (problem_set) {

		this.problem_set = problem_set

	},

  create: function () {

    button = this.add.button(this.game.world.centerX, 175, 'numberline', function () {this.state.start('Instructions', true, false, this.problem_set);}, this);
    button.scale.setTo(0.5,0.5)
    button.anchor.x = 0.5

  },

}
