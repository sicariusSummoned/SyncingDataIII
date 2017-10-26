    let Vec2D = require('vector2d');

    class User {
      constructor(hash) {

        this.hash = hash;

        this.lastUpdate = new Date().getTime();
        this.pos = Vec2D.ObjectVector(0, 0);
        this.vel = Vec2D.ObjectVector(0, 0);
        this.acc = Vec2D.ObjectVector(0, 0);
        this.prev = Vec2D.ObjectVector(0, 0);
        this.dest = Vec2D.ObjectVector(0, 0);
        this.scale = Vec2D.ObjectVector(60, 60);

        console.dir(this.pos);
        console.dir(this.scale);
        console.dir(this.vel);


        this.moveLeft = false;
        this.moveRight = false;
        this.jumping = false;
        this.maxVelocity = 10.0;
        this.jumpSpeed = 10.0;
        this.gravity = -9.81;
        this.friction = 0.2;
        this.alpha = 0;
        this.color = `rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`
      }
    }

    module.exports = User;
