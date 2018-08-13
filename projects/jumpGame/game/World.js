function World(id, width, height, gravity, speed, delay) {
    
    this.canvas = document.getElementById(id);
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;
    this.delay = delay;
    
    this.ctx = this.canvas.getContext("2d");
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "#333333";

    this.gravity = gravity;
    this.speed = speed;

    this.draw = function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillRect(0, 290, this.width, 2);
    }
}
