Game.Preloader = function (game) {

	this.background = null
	this.preloadBar = null
	this.ready = false
	this.rnd

}

Game.Preloader.prototype = {

	init: function (problem_set) {
		this.problem_set = problem_set
	},

	preload: function () {

		this.preloadBar = this.add.sprite(120, 200, 'preloaderBar')

		this.load.setPreloadSprite(this.preloadBar)


		this.game.load.image('equalB','/static/games/is_it_equal_zen/images/Equal_Button.png')
		this.game.load.image('unequalB','/static/games/is_it_equal_zen/images/Unequal_Button.png')
		this.game.load.image('zen','/static/games/is_it_equal_zen/images/ZenMode_Button.png')
		this.game.load.image('go', '/static/games/is_it_equal_zen/images/Go_button.png');
		this.game.load.image('next', '/static/games/is_it_equal_zen/images/next_button.png')
		this.game.load.image('back', '/static/games/is_it_equal_zen/images/back_button.png')

	},

	create: function () {

		this.preloadBar.cropEnabled = false
		this.state.start('Menu', true, false, this.problem_set)


	},


}
