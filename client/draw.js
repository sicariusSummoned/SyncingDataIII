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

    user.pos.setX(lerp(user.prev.getX(), user.dest.getX(), user.alpha));
    user.pos.setY(lerp(user.prev.getY(), user.dest.getY(), user.alpha));


    ctx.save();
    ctx.fillStyle = user.color;
    ctx.fillRect(user.pos.getX(), user.pos.getY(), user.scale.getX(), user.scale.getY());
    ctx.restore();
  }
  
  animationFrame = requestAnimationFrame(redraw);
};