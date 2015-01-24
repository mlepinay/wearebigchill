var Waves = function(attrs) {
  var SPRITE_RES = res.waves;
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

  this.deep_sea_sprite = cc.Sprite.create();
  this.deep_sea_sprite.color = cc.color(57,77,84,1);
  this.deep_sea_sprite.setTextureRect(cc.rect(0, 0, 800, sprite.y + 20));
  this.deep_sea_sprite.setOpacity(180);

  var height = sprite.y / 2;

  self.addToLayer = function(layer) {
    for (var i = 0; i < self.sprites.length; i++)
      layer.addChild(self.sprites[i], 10);
    layer.addChild(this.deep_sea_sprite, 10);
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

    self.deep_sea_sprite.x = 400;
    self.deep_sea_sprite.y = sprite.y - height - 15;
  }

}
