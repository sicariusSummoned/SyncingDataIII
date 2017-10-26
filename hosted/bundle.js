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

    user.pos._x = lerp(user.prev._x, user.dest._x, user.alpha);
    user.pos._y = lerp(user.prev._y, user.dest._y, user.alpha);

    ctx.save();
    ctx.fillStyle = user.color;
    ctx.fillRect(user.pos._x, user.pos._y, user.scale._x, user.scale._y);
    ctx.restore();
  }

  animationFrame = requestAnimationFrame(redraw);
};
'use strict';

var canvas = void 0;
var ctx = void 0;

var socket = void 0;
var hash = void 0;
var animationFrame = void 0;
var users = {};

var keyDownHandler = function keyDownHandler(e) {
  var keyPressed = e.which;
  var user = users[hash];

  console.log('user.vector in keydown');
  console.dir(user.acc);
  console.dir(user.vel);
  console.dir(user.pos);
  console.dir(user.prev);
  console.dir(user.dest);

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

  console.log('user.vector in keyUp');
  console.dir(user.acc);
  console.dir(user.vel);
  console.dir(user.pos);
  console.dir(user.prev);
  console.dir(user.dest);

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
    user.vel._y = user.jumpSpeed;
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

  user.prev._x = data.prev._x;
  user.prev._y = data.prev._y;
  user.dest._x = data.dest._x;
  user.dest._y = data.dest._y;

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
  debugger;

  var user = users[hash];
  var acceleration = Vec2D.ObjectVector(0, 0);

  console.log('user.vector properties in update');
  console.dir(user.vel);
  console.dir(user.acc);
  console.dir(user.prev);
  console.dir(user.dest);
  console.dir(user.pos);

  //update prev to last known position
  user.prev._x = user.pos._x;
  user.prev._y = user.pos._y;

  if (user.moveRight && user.dest._x < 400) {
    acceleration.add(Vec2d.ObjectVector(2, 0));
  }

  if (user.moveLeft && user.dest._x > 0) {
    acceleration.add(Vec2d.ObjectVector(-2, 0));
  }

  if (!user.moveLeft && !user.moveRight) {
    user.vel._x = user.vel._x * user.friction;
  }

  if (user.jumping && user.dest._y < 400) {
    acceleration._y = user.gravity;
  }

  if (user.jumping && user.dest._y >= 400) {
    user.jumping = false;
    acceleration._y = 0;
  }

  user.acc._x = acceleration._x;
  user.acc._y = acceleration._y;

  user.vel = user.vel + user.acc;

  if (user.vel._x > user.maxVelocity || user.vel._y > user.maxVelocity) {
    user.vel._x = 1;
    user.vel._y = 1;

    user.vel._x *= user.maxVelocity;

    user.vel._y *= user.maxVelocity;
  }

  user.dest._x = user.pos._x + user.vel._x;
  user.dest._y = user.pos._y + user.vel._y;

  user.alpha = 0.05;

  socket.emit('movementUpdate', user);
};
