var epsilonGreedyAgent = function(learner, epsilon) {

    this.epsilon = epsilon;
    this.learner = learner;
    
    this.choose_action = function(s) {
        this.updateEpsilon();
        var randomVal = Math.random();
        if (randomVal < this.epsilon) {
            return Math.floor(Math.random() * (this.learner.a_dim));
        } else {
            return this.learner.max_action(s);
        }        
    }

    this.updateEpsilon = function() {
        this.epsilon *= 0.99999;
    }

    return this;
}
