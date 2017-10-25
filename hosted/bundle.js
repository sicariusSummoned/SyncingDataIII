"use strict";

var lerp = function lerp(v0, v1, alpha) {
  return (1 - alpha) * v0 + alpha * v1;
};

var redraw = function redraw(time) {
  updatePosition();

  ctx.clearRect(0, 0, 500, 500);

  var keys = Object.keys(users);

  for (var i = 0; i < keys.length; i++) {
    var user = users[keys[i]];

    if (user.alpha < 1) user.alpha += 0.05;

    user.pos.setX(lerp(user.prev.getX(), user.dest.getX(), user.alpha));
    user.pos.setY(lerp(user.prev.getY(), user.dest.getY(), user.alpha));

    ctx.save();
    ctx.fillStyle = user.color;
    ctx.fillRect(user.pos.getX(), user.pos.getY(), user.scale.getX(), user.scale.getY());
    ctx.restore();
  }

  animationFrame = requestAnimationFrame(redraw);
};
'use strict';

var Vec2d = require('vector2d');

var canvas = void 0;
var ctx = void 0;

var socket = void 0;
var hash = void 0;

var users = {};

var keyDownHandler = function keyDownHandler(e) {
  var keyPressed = e.which;
  var user = users[hash];

  //LEFT or A
  if (keyPressed === 65 || keyPressed === 37) {
    user.moveLeft = true;
  }

  //RIGHT or D
  else if (keyPressed === 68 || keyPressed === 39) {
      user.moveRight = true;
    }
};

var keyUpHandler = function keyUpHandler(e) {
  var keyReleased = e.which;
  var user = users[hash];

  //LEFT or A
  if (keyReleased === 65 || keyReleased === 37) {
    user.moveLeft = false;
  }

  //RIGHT or D
  else if (keyReleased === 68 || keyReleased === 39) {
      user.moveRight = false;
    }

  //UP or W (for jumping)
  if (keyReleased === 87 || keyReleased === 38) {
    user.vel.setY(square.jumpSpeed);
    user.jumping = true;
  }
};

var init = function init() {
  canvas = document.querySelector('#canvas');
  ctx = canvas.getContext('2d');

  socket = io.connect();

  socket.on('joined', setUser); //on user join
  socket.on('updatedMovement', update); //when user moves
  socket.on('left', removeUser); // when a user leaves

  document.body.addEventListener('keydown', keyDownHandler);
  document.body.addEventListener('keyup', keyUpHandler);
};

window.onload = init;
'use strict';

var update = function update(data) {
  if (!users[data.hash]) {
    users[data.hash] = data;
    return;
  }

  if (data.hash === hash) {
    return;
  }

  if (users[data.hash].lastUpdate >= data.lastUpdate) {
    return;
  }

  var user = users[data.hash];

  user.prev.setAxes(data.prev.getX(), data.prev.getY());
  user.dest.setAxes(data.dest.getX(), data.dest.getY());

  user.moveLeft = data.moveLeft;
  user.moveRight = data.moveRight;
  user.jumping = data.jumping;
  user.alpha = 0.05;
};

var removeUser = function removeUser(data) {
  if (users[data.hash]) {
    delete users[data.hash];
  }
};

var setUser = function setUser(data) {
  hash = data.hash;
  users[hash] = data;
  requestAnimationFrame(redraw);
};

var updatePosition = function updatePosition() {
  var user = users[hash];
  var acceleration = Vec2d.ObjectVector(0, 0);

  //update prev to last known position

  user.prev.setAxes(user.pos.getX(), user.pos.getY());

  if (user.moveRight && user.dest.getX() < 400) {
    acceleration.add(Vec2d.ObjectVector(2, 0));
  }

  if (user.moveLeft && user.dest.getX() > 0) {
    acceleration.add(Vec2d.ObjectVector(-2, 0));
  }

  if (!user.moveLeft && !user.moveRight) {
    user.vel.setX(user.vel.getX() * user.friction);
  }

  if (user.jumping && user.dest.getY() < 400) {
    acceleration.setY(user.gravity);
  }

  if (user.jumping && user.dest.getY() >= 400) {
    user.jumping = false;
    acceleration.setY(0);
  }

  user.acc.setAxes(acceleration.getX(), acceleration.getY());

  user.vel.add(user.acc.clone());

  if (user.vel.magnitude() > user.maxVelocity) {
    user.vel = user.vel.clone().normalize();

    user.vel.mulS(user.maxVelocity);
  }

  user.dest.setAxes(user.pos.getX() + user.vel.getX(), user.pos.getY() + user.vel.getY());

  user.alpha = 0.05;

  socket.emit('movementUpdate', user);
};
