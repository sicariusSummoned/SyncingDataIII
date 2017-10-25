let Vec2d = require('vector2d');

class User {
  constructor(hash) {
    this.hash = hash;

    this.lastUpdate = new Date().getTime();
    this.pos = Vec2d.ObjectVector(0,0);
    this.vel = Vec2d.ObjectVector(0,0);
    this.acc = Vec2d.ObjectVector(0,0);
    this.prev = Vec2d.ObjectVector(0,0);
    this.dest = Vec2d.ObjectVector(0,0);
    this.scale = Vec2d.ObjectVector(60,60);
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
