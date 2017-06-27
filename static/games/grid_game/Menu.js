Game.Menu = function (game) {

	this.music = null
	this.playButton = null

}

Game.Menu.prototype = {

	init: function (problem_set) {

		this.problem_set = problem_set

	},

  create: function () {

		bucket_button = this.add.button(this.game.world.centerX, 175, 'balancingact', function () {this.state.start('Instructions', true, false, this.problem_set);}, this);
		bucket_button.scale.setTo(0.5,0.5)
    bucket_button.anchor.x = 0.5

  },

}
