var TabularQLearning = function(a_dim, gamma, alpha) {

    // state:
    // 'playerPos' : player.getPosition(),
    // 'enemyPos' : enemy.getPosition() => [0...#]
    // 'worldDims' : [world.width, world.height]
    // 'jumping' : player.isJumping() => [0, 1] 
    
    this.a_dim = a_dim;
    this.gamma = gamma;
    this.alpha = alpha;
    
    var enemyBuckets = 20;
    var jumpingBuckets = 2;
    this.Q = utils.createNDimArray([enemyBuckets, jumpingBuckets, a_dim],
                                   function() {
                                       return (Math.random() - 0.5) / 50;
                                   });

    this.parseState = function(s) {
        var eX = s.enemy.getX();
        var worldWidth = s.world.width;
        var enemyIdx = utils.bucket(eX, 0, worldWidth, enemyBuckets);
        
        var isJumping = s.player.isJumping();
        if (isJumping) {
            isJumping = 1;
        } else {
            isJumping = 0;
        }
        return [enemyIdx, isJumping];
    }

    this.get = function(parsed_s) {
        var t = utils.getMulti(this.Q, parsed_s);
        return t;
    }

    this.set = function(parsed_s, t) {
        utils.setMulti(this.Q, parsed_s, t);
    }

    this.setA = function(parsed_s, a, t) {
        var sa = parsed_s.concat(a);
        utils.setMulti(this.Q, sa, t);
    }

    this.max_action = function(s) {
        var parsed_s = this.parseState(s);
        return utils.arrayMaxIndex(this.get(parsed_s));
    }
    
    this.update = function(s, a, r, s_prime) {
        var maxA = this.max_action(s_prime);
        var parsed_s = this.parseState(s);
        var parsed_s_prime = this.parseState(s_prime);
        var t = this.get(parsed_s)[a] + this.alpha * (r.get() + this.gamma * this.get(parsed_s_prime)[maxA] - this.get(parsed_s)[a]);
        this.setA(parsed_s, a, t);
        
        this.alpha = Math.max(this.alpha * 0.999999, 0.001);

    }
    return this;
}
