const update = data => {
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

  const user = users[data.hash];

  user.prev._x = data.prev._x;
  user.prev._y = data.prev._y;
  user.dest._x = data.dest._x;
  user.dest._y = data.dest._y;

  user.moveLeft = data.moveLeft;
  user.moveRight = data.moveRight;
  user.jumping = data.jumping;
  user.alpha = 0.05;
};

const removeUser = (data) => {
  if (users[data.hash]) {
    delete users[data.hash];
  }
};

const setUser = (data) => {
  hash = data.hash;
  users[hash] = data;
  requestAnimationFrame(redraw);
};

const updatePosition = () => {
  debugger;


  const user = users[hash];
  const acceleration = Vec2D.ObjectVector(0, 0);


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