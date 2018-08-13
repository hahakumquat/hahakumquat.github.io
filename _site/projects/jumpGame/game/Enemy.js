function Enemy(world, spawnX, spawnY, width, height, speed) {
    
    RectangleObject.call(this, world, spawnX, spawnY, width, height);

    this.cleared = false;
    this.speed = speed;

    this.getSpeed = function() {
        return this.speed;
    }
    
    this.setSpeed = function(s) {
        this.speed = s;
    }

    this.isCleared = function() {
        return this.cleared;
    }
    
    this.setCleared = function(b) {
        this.cleared = b;
    }

    this.tick = function(t) {
        this.translateX(-this.speed * t);
        if (this.isCleared() && this.outOfBounds()) {
            this.setX(this.spawnX + Math.random() * world.width);
            this.setCleared(false);
        }
    }
}
