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
		this.game.load.image('brick', '/static/games/bridge_game/images/brick.png')
		this.game.load.image('userCol', '/static/games/bridge_game/images/cloud-platform.png')
		this.game.load.spritesheet('dude', '/static/games/bridge_game/images/dude.png', 32, 48)
		this.game.load.image('go', '/static/games/bridge_game/images/go_button.png')
		this.game.load.image('cloud', '/static/games/bridge_game/images/cloud-platform.png')
		this.game.load.image('compCol', '/static/games/bridge_game/images/cloud-platform.png')
		this.game.load.image('crossB','/static/games/bridge_game/images/cross_button.png')
		this.game.load.image('bridgethegap', '/static/games/bridge_game/images/bridgethegap.png')
    this.game.load.image('background', '/static/games/bridge_game/images/moon_background.png')
		this.game.load.image('coin', '/static/games/bridge_game/images/coin_gold.png')
		this.game.load.image('next', '/static/games/bridge_game/images/next_button.png')
		this.game.load.image('back', '/static/games/bridge_game/images/back_button.png')

	},

	create: function () {

		this.preloadBar.cropEnabled = false
		this.state.start('Menu', true, false, this.problem_set)


	},


}
