let canvas;
let ctx;

let socket;
let hash;
let animationFrame;
let users = {};

const keyDownHandler = (e) => {
  var keyPressed = e.which;
  const user = users[hash];


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

const keyUpHandler = (e) => {
  var keyReleased = e.which;
  const user = users[hash];


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

const init = () => {
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
