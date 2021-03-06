STICK_COUNT = 100;
function setup_fps_meters() {
  var heading = document.getElementById('heading');
  var meter = new FPSMeter(heading, {
      heat: true,
      theme: 'colorful',
      graph: true
  });

  // Tap into snabbt.js tick
  var _snabbtjs_tick = snabbtjs.tick_animations;

  master_tick = function(time) {
    _snabbtjs_tick(time);
    meter.tick();
  };

  snabbtjs.tick_animations = master_tick;
}

function animate(prefix, index) {
  if(index != STICK_COUNT - 1)
    return;

  for(var i=0;i<STICK_COUNT;++i) {
    var stick = document.getElementById(prefix + i);
    snabbt(stick, {
      from_position: [0, -(STICK_COUNT/2) * 5 + 5*i, 0],
      position: [200, 0, 0],
      duration: 500,
      easing: 'ease',
    }).then({
      position: [200, 0, 0],
      rotation_post: [0, 0, (i/STICK_COUNT)*2*Math.PI],
      duration: 1000,
      easing: 'ease',
    }).then({
      from_position: [
        200*Math.cos((i/STICK_COUNT)*2*Math.PI),
        -200*Math.sin((i/STICK_COUNT)*2*Math.PI),
        0
      ],
      position: [
        100*Math.cos((i/STICK_COUNT)*2*Math.PI),
        -100*Math.sin((i/STICK_COUNT)*2*Math.PI),
        0
      ],
      from_rotation: [0, 0, (i/STICK_COUNT)*2*Math.PI - 2*Math.PI],
      rotation: [0, 0, (i/STICK_COUNT)*2*Math.PI - 2*Math.PI],
      from_rotation_post: [-2*Math.PI, 0, 0],
      rotation_post: [0, 0, 0],
      delay: i*10,
      duration: 1000,
      easing: 'ease',
    }).then({
      from_position: [100, 0, 0],
      position: [0, -(STICK_COUNT/2) * 5 + 5*i, 0],
      from_rotation: [0, 0, 0],
      from_rotation_post: [0, 0, (i/STICK_COUNT)*2*Math.PI],// + Math.PI],
      rotation_post: [0, 0, 0],
      easing: 'ease',
      delay: STICK_COUNT*10 + i*10,
      duration: 1000,
      callback: (function(j) { return function() { animate(prefix, j) } })(i),
    });
  }
}


function init() {
  setup_fps_meters();
  var colors = randomColor({
    count: 7,
    luminosity: 'dark',
    format: 'rgb'
  });

  var c1 = document.getElementById('c1');
  c1.style.top = window.innerHeight/2 + 'px';
  c1.style.left = (3*(window.innerWidth/4) - 25) + 'px';
  var c2 = document.getElementById('c2');
  c2.style.top = window.innerHeight/2 + 'px';
  c2.style.left = ((window.innerWidth/4) - 25) + 'px';

  function setup_sticks(root, prefix) {
    for(var i=0;i<STICK_COUNT;++i) {
      var stick = document.createElement('div');
      stick.className = 'stick';
      stick.style.background = colors[i % colors.length];
      stick.id = prefix + i;
      root.appendChild(stick);
    }
  }
  setup_sticks(c1, 'r');
  animate('r', STICK_COUNT - 1);
  setup_sticks(c2, 'l');
  animate('l', STICK_COUNT - 1);

}
