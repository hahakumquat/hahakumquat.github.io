function Logger(world) {
    
    this.gameTime = 0;
    this.epoch = 1;
    this.scores = [];
    this.rewards = [];
    this.currentReward = 0;
    this.currentScore = 0;

    this.addScore = function(x) {
        this.currentScore += x;
    }

    this.addReward = function(r) {
        this.currentReward += r;
    }

    this.resetGame = function() {
        utils.extendRewards(this.currentScore);
        this.scores.push(this.currentScore);
        this.currentScore = 0;
        this.rewards.push(this.currentReward);
        this.currentReward = 0;        
        this.epoch += 1;
    }

    this.tick = function(s) {
        this.gameTime += s;
    }

    this.draw = function() {
        world.ctx.fillText('Score: ' + this.currentScore, 20, 30);
        world.ctx.fillText('Epoch: ' + this.epoch, 20, 50);
    }
}
