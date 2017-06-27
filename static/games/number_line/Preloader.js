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

		//	Here we load the rest of the assets our game needs.
		this.game.load.image('go', '/static/games/number_line/images/Go_button.png');
		this.game.load.image('numberline', '/static/games/number_line/images/SPT_ProductionTask_Button.png')
		this.game.load.image('coin', '/static/games/number_line/images/coin_gold.png')
		this.game.load.spritesheet('dude', '/static/games/number_line/images/dude.png',32,48)
		this.game.load.image('next', '/static/games/number_line/images/next_button.png')
		this.game.load.image('back', '/static/games/number_line/images/back_button.png')



	},

	create: function () {

		this.preloadBar.cropEnabled = false
		this.state.start('Menu', true, false, this.problem_set)


	},


}
