

function Whale() {
    var self = this;

    self.x = 200;
    self.y = 100;

    self.sprite = new cc.Sprite(res.docker_whale);

    self.sprite.attr({
        x: self.x,
        y: self.y,
        scale: 0.2
    });

    self.moveLeft = function() {
        self.x -= 10;
        self.sprite.attr({ x: self.x })
    }
    self.moveRight = function() {
        self.x += 10;
        self.sprite.attr({ x: self.x })
    }
}
