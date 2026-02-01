function Player(world, spawnX, spawnY, width, height, jumpVelocity) {
    
    RectangleObject.call(this, world, spawnX, spawnY, width, height, jumpVelocity);

    this.jumping = false;
    this.jumpVelocity = jumpVelocity;
    this.t = 0;

    this.setJumpVelocity = function(v) {
        this.jumpVelocity = v;
    }

    this.isJumping = function() {
        return this.jumping;
    }
    
    this.jump = function() {
        this.jumping = true;
    }

    this.perform = function(a) {
        if (a == 0) {
            return;
        } else if (a == 1) {
            this.jump();
            return;
        }
    }
    
    this.tick = function(t) {
        if (this.jumping) {
            this.t += t;
            this.setY(this.spawnY - (this.jumpVelocity * this.t + this.world.gravity * this.t * this.t / 2));
            if (this.getY() > this.spawnY) {
                this.resetPosition();
                this.jumping = false;
                this.t = 0;
            }
        }
    }

    this.resetPosition = function() {
        this.setY(this.spawnY);
        this.jumping = false;
    }
        
    return this;
}
