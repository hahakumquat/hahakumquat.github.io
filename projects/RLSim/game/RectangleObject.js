function RectangleObject(world, spawnX, spawnY, width, height) {
    this.spawnX = spawnX;
    this.spawnY = spawnY;
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.width = width;
    this.height = height;
    this.world = world;

    this.getX = function() {
        return this.x;
    }
    
    this.getY = function() {
        return this.y;
    }
    
    this.setX = function(x) {
        this.x = x;
    }
    
    this.setY = function(y) {
        this.y = y;
    }

    this.translateX = function(x) {
        this.x += x;
    }
    
    this.translateY = function(y) {
        this.y += y;
    }

    this.getPosition = function() {
        return [this.x, this.y];
    }
    
    this.setPosition = function(x, y) {
        this.setX(x);
        this.setY(y);
    }

    this.resetPosition = function() {
        this.setPosition(this.spawnX, this.spawnY);
    }

    this.outOfBounds = function() {
        return ((this.x < 0)
                || (this.y < 0)
                || (this.x + this.width > this.world.width)
                || (this.y + this.height > this.world.height));
    }

    this.getWidth = function() {
        return this.width;
    }

    this.getHeight = function() {
        return this.height;
    }

    this.draw = function() {
        this.world.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
