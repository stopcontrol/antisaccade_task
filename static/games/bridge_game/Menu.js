Game.Menu = function (game) {

	this.music = null
	this.playButton = null

}

Game.Menu.prototype = {

	init: function (problem_set) {

		this.problem_set = problem_set

	},

  create: function () {

    bridge_button = this.add.button(this.game.world.centerX, 175, 'bridgethegap', function () {this.state.start('Instructions', true, false, this.problem_set);}, this);
    bridge_button.scale.setTo(0.5,0.5)
    bridge_button.anchor.x = 0.5

  },

}
