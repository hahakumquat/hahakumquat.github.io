function Reward(isJumping) {
    this.scored = false;
    this.lost = false;
    this.a = 0;

    this.score = function() {
        this.scored = true;
    }

    this.lose = function() {
        this.lost = true;
    }

    this.setAction = function(a) {
        this.a = a;
    }

    this.get = function() {
        var r = 0;
        if (this.scored) {
            r += 1;
        }
        if (this.lost) {
            r -= 5;
        }
        if (this.a == 1 && isJumping) {
            r -= 1;
        }
        return r;
    }
}
