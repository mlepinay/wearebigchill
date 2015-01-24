var Waves = function(attrs) {
  var SPRITE_RES = res.waves;
  var SCALE = 0.2;
  var SPEED = 0.2;
  var ROT_SPEED = 0.05;
  var ROTATION = 5;

  var self = this;
  var sprite;

  sprite = new cc.Sprite(SPRITE_RES);
  sprite.attr({ x: attrs.x, y: attrs.y, scale: SCALE });
  sprite.pos = { x: sprite.x, y: sprite.y };

  self.sprites = [sprite];

  var width = sprite.width * SCALE;
  var angle = 0;
  var moved = 0;

  for (var i = 1; i < 20; i++) {
    sprite = new cc.Sprite(SPRITE_RES);
    sprite.attr({ x: attrs.x + width * i, y: attrs.y, scale: SCALE });
    sprite.pos = { x: sprite.x, y: sprite.y };
    self.sprites.push(sprite);
  }

  self.addToLayer = function(layer) {
    for (var i = 0; i < self.sprites.length; i++)
      layer.addChild(self.sprites[i], 10);
  }

  self.update = function() {
    var i = 0, move = 0;
    var stepX = Math.cos(angle) * ROTATION
    var stepY = Math.sin(angle) * ROTATION

    angle += ROT_SPEED;

    if (moved >= width) {
      move = -moved;
      moved = 0;
    } else {
      moved += SPEED;
      move = moved;
    }

    for (i = 0; i < self.sprites.length; i++) {
      sprite = self.sprites[i]
      sprite.x = sprite.pos.x + stepX - moved;
      sprite.y = sprite.pos.y + stepY;
    }
  }

}
