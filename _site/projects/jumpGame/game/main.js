var init = function() {

    var WIDTH = 500;
    var HEIGHT = 400;
    var worldSpeed = 1;
    var gravity = -1.5;
    var world = new World('game', WIDTH, HEIGHT, -1, worldSpeed);

    var FLOOR = 300;
    var floorHeight = 3;
    var floor = new RectangleObject(world, 0, FLOOR, world.width, floorHeight);

    var playerSpawnX = 50;
    var playerWidth = 50;
    var playerHeight = 50;
    var jumpVelocity = 15;
    var player = new Player(world, playerSpawnX, floor.getY() - playerHeight,
                            playerWidth, playerHeight, jumpVelocity);

    var enemyWidth = 20;
    var enemyHeight = 40;
    var enemySpeed = 8;
    var enemy = new Enemy(world, world.width, floor.getY() - enemyHeight,
                          enemyWidth, enemyHeight, enemySpeed);

    var logger = new Logger(world);

    utils.plot();

    // agent
    var epsilon = 0.1;
    var gamma = 0.99;
    var alpha = 1;
    var a_dim = 2;
    var learner = TabularQLearning(a_dim, gamma, alpha);
    var agent = epsilonGreedyAgent(learner, epsilon);    
    var humanMode = false;


    var hasContact = function(p, e) {
        var p1 = p.getPosition();
        var p2 = [p1[0] + p.getWidth(), p1[1] + p.getHeight()];
        var e1 = e.getPosition();
        var e2 = [e1[0] + e.getWidth(), e1[1] + e.getHeight()];
        if (p1[0] > e2[0] || p2[0] < e1[0]) {
            return false;
        }
        if (p1[1] > e2[1] || p2[1] < e1[1]) {
            return false;
        }
        return true;
    }
    
    if (humanMode) {
        document.addEventListener("keydown", function(e) {
            if (e.keyCode == 32) {
                player.jump();
            }
        });
    }
    
    var animate = function() {
        utils.recordParameters(agent.epsilon,
                               agent.learner.gamma,
                               agent.learner.alpha);
        var s = new State(world, player, enemy);
        var a = agent.choose_action(s);

        var r = new Reward(player.isJumping());
        r.setAction(a);
        player.perform(a);
        
        player.tick(world.speed);
        enemy.tick(world.speed);
        logger.tick(world.speed);

        // loss detection
        if (hasContact(player, enemy)) {
            player.resetPosition();
            enemy.resetPosition();
            logger.resetGame();
            r.lose();
        }

        // point detection
        if (enemy.getX() < player.getX() + player.getWidth()) {
            if (!enemy.isCleared()) {
                enemy.setCleared(true);
                logger.addScore(1);
                r.score();
            }            
        }

        logger.addReward(r.get());
        
        var s_prime = new State(world, player, enemy);

        agent.learner.update(s, a, r, s_prime);
        
        utils.updateQ(agent.learner.Q);

        world.draw();
        logger.draw();
        player.draw();
        enemy.draw();
        
        window.requestAnimationFrame(animate);
    }
    
    animate();
}

init();


