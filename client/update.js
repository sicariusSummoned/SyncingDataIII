const update = data => {
  if(!users[data.hash]){
    users[data.hash] = data;
    return;
  }
  
  if(data.hash === hash){
    return;
  }
  
  if(users[data.hash].lastUpdate >= data.lastUpdate){
    return;
  }
  
  const user = users[data.hash];
  
  user.prev.setAxes(data.prev.getX(),data.prev.getY());
  user.dest.setAxes(data.dest.getX(),data.dest.getY());
  
  user.moveLeft = data.moveLeft;
  user.moveRight = data.moveRight;
  user.jumping = data.jumping;
  user.alpha = 0.05;
};

const removeUser = (data) =>{
  if(users[data.hash]){
    delete users[data.hash];
  }
};

const setUser = (data) =>{
  hash = data.hash;
  users[hash] = data;
  requestAnimationFrame(redraw);
};

const updatePosition = () => {
  const user = users[hash];
  const acceleration = Vec2d.ObjectVector(0,0);
  
  //update prev to last known position
  
  user.prev.setAxes(user.pos.getX(), user.pos.getY());
  
  if(user.moveRight && user.dest.getX() < 400){
    acceleration.add(Vec2d.ObjectVector(2,0));
  }
  
  if(user.moveLeft && user.dest.getX() > 0){
    acceleration.add(Vec2d.ObjectVector(-2,0));
  }
  
  if(!user.moveLeft && !user.moveRight){
    user.vel.setX(user.vel.getX()*user.friction);
  }
  
  if(user.jumping && user.dest.getY() < 400){
    acceleration.setY(user.gravity);
  }
  
  if(user.jumping && user.dest.getY() >= 400){
    user.jumping = false;
    acceleration.setY(0);
  }
  
  user.acc.setAxes(acceleration.getX(), acceleration.getY());
  
  user.vel.add(user.acc.clone());
  
  if(user.vel.magnitude() > user.maxVelocity){
    user.vel = user.vel.clone().normalize();
    
    user.vel.mulS(user.maxVelocity);
  }
  
  user.dest.setAxes(user.pos.getX()+user.vel.getX(), user.pos.getY() + user.vel.getY());
  
  
  user.alpha = 0.05;
  
  socket.emit('movementUpdate',user);
}