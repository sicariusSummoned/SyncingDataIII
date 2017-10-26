const lerp = (v0, v1, alpha) => {
  return (1 - alpha) * v0 + alpha * v1;
};

const redraw = (time) => {
  updatePosition();

  ctx.clearRect(0, 0, 500, 500);

  const keys = Object.keys(users);

  for (let i = 0; i < keys.length; i++) {
    const user = users[keys[i]];

    if (user.alpha < 1) user.alpha += 0.05;

    user.pos._x = lerp(user.prev._x,user.dest._x, user.alpha);
    user.pos._y = lerp(user.prev._y, user.dest._y, user.alpha);


    ctx.save();
    ctx.fillStyle = user.color;
    ctx.fillRect(user.pos._x, user.pos._y, user.scale._x, user.scale._y);
    ctx.restore();
  }
  
  animationFrame = requestAnimationFrame(redraw);
};