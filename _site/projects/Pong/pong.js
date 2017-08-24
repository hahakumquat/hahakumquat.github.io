/* Pong Game by Michael Ge, 2015 */

var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
    function(callback) { window.setTimeout(callback, 1000/60) };

/* Global Variables */

var w = $(window).width();
var h = $(window).height();
var canvas = document.createElement('canvas');
canvas.width = w;
canvas.height = h;

var c = canvas.getContext('2d');

var pH = 0.2 * h;
var pW = Math.max(20, 0.1 * pH);

var p1 = new Player1();
var p2 = new Player2();

var ball = new Ball(w/2, h/2);

var spd = 8;

var mouse = h/2;
var new_mouse = h/2;

/* Main Function */
$(function() {
    $("body").css("overflow", "hidden");
    document.body.appendChild(canvas);
    animate(step);
});

function renderLine() {
    c.setLineDash([pW * 2, pW * 2]);
    c.strokeStyle="white";
    c.lineWidth = 20;
    c.beginPath();
    c.moveTo(w/2, 0);
    c.lineTo(w/2, h);
    c.stroke();
}

function step() {
    update();
    render();
    animate(step);
}

var update = function() {
    p1.update();
    p2.update();
    ball.update(p1, p2);
}

function render() {
    c.fillStyle = "#000000";
    c.fillRect(0, 0, w, h);
    p1.render();
    p2.render();
    ball.render();
    renderLine();
}

/* Paddle and Score classes for players */

function Paddle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    this.y_speed = 0;
    this.points = 0;
}

function Score(txt,x,y) {
    this.text = txt;
    this.x = x;
    this.y = y;
}

/* Player 1 and 2 render and updating */

function Player1() {
    this.paddle = new Paddle(pW, h/2 - pH/2, pW, pH);
    this.score = new Score(this.paddle.points, w/2 - 190, 140);
}

function Player2() {
    this.paddle = new Paddle(w - 2 * pW, h/2 - pH/2, pW, pH);
    this.score = new Score(this.paddle.points, w/2 + 190, 140);
}

Player1.prototype.render = function() {
    this.paddle.render();
    this.score.render();
}

Player1.prototype.update = function() {
    document.onmousemove = function() {
        new_mouse = window.event.pageY - pH/2;
    }
    this.paddle.move(this.paddle.x, new_mouse);
}

Player2.prototype.render = function() {
    this.paddle.render();
    this.score.render();
}

Player2.prototype.update = function() {
    this.paddle.y = p1.paddle.y;
}

Paddle.prototype.render = function() {
    c.fillStyle = "#FFFFFF";
    c.fillRect(this.x, this.y, this.width, this.height);
}

Paddle.prototype.move = function(x, new_mouse) {
    if (new_mouse < 0) {
        this.y = 0;
    }
    else if (new_mouse > h - pH) {
        this.y = h - pH;
    }
    else {
        this.y = new_mouse;
    }
    this.x = x;
    this.y_speed = -(new_mouse - mouse);
    mouse = new_mouse;
}

Score.prototype.render = function() {
    c.font = "160px sans-serif";
    c.fillStyle = "white";
    c.textAlign = "center";
    c.fillText(this.text, this.x, this.y);
}

/* Ball class, render, and updating. */

function Ball(x, y) {
    var spd = 8;
    this.x = x;
    this.y = y;
    this.x_speed = -spd;
    this.y_speed = -spd;
    this.radius = pW/2;
}

Ball.prototype.render = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
    c.fill();
}

Ball.prototype.update = function(p1, p2) {

    //Performs a move
    this.x += this.x_speed;
    this.y += this.y_speed;
    
    var left = this.x - this.radius;
    var top = this.y - this.radius;
    var right = this.x + this.radius;
    var bottom = this.y + this.radius;

    // Hits top or bottom wall
    if (top < 0) {
        this.y_speed = -this.y_speed;
    }
    else if (bottom > h) {
        this.y_speed = -this.y_speed;
    }

    // Point Score for Player 2
    if (right < 0) {
        this.x = w/2;
        this.y = h/2;
        this.x_speed = -spd;
        this.y_speed = -spd;
        p2.score.text++;
    }
    // Point Score for Player 1
    else if (left > w) {
        this.x = w/2;
        this.y = h/2;
        this.x_speed = -spd;
        this.y_speed = spd;
        p1.score.text++;
    }

    //Paddle Collision
    if (left < p1.paddle.x + pW
        && left > p1.paddle.x
        && p1.paddle.y < this.y
        && p1.paddle.y + pH > this.y) {
        this.x = p1.paddle.x + pW * 2;
        this.x_speed = -this.x_speed;
        this.y_speed += p1.paddle.y_speed / 2;
        this.y += this.y_speed;
    }

    if (right < p2.paddle.x + pW
        && right > p2.paddle.x
        && p2.paddle.y < this.y
        && p2.paddle.y + pH > this.y) {
        this.x = p2.paddle.x - pW;
        this.x_speed = -this.x_speed;
        this.y_speed += p2.paddle.y_speed / 2;
        this.y += this.y_speed;
    }
}
