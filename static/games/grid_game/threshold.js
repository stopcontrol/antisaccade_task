Phaser.Filter.Threshold = function(game) {
    Phaser.Filter.call(this, game);

    this.fragmentSrc = [
      "precision mediump float;",
      "varying vec2 vTextureCoord;",
      "varying vec4 vColor;",
      "uniform sampler2D uSampler;",

      "void main(void) {",
        "vec4 color = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y));",
        "float thresh = step(0.3, color.a);",
        "vec4 sum = vec4(thresh * 0.7, thresh * 0.9, thresh, thresh);",
        "gl_FragColor = sum;",

      "}"
    ];

};

Phaser.Filter.Threshold.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.Threshold.prototype.constructor = Phaser.Filter.Threshold;
