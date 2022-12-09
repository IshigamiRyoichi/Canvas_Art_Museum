window.addEventListener('DOMContentLoaded', function() {
  modal_process('rainbow-modalOpen','easyRainbowModal','rainbow-modalClose');
  modal_process('particle-modalOpen','easyParticleModal','particle-modalClose');
  modal_process('firefly-modalOpen','easyFireflyModal','firefly-modalClose');
  rainbow_art();
  particle_art();
  firefly_art();
});

function modal_process(modalOpenId, easyModal, modalCloseId){
  const buttonOpen = document.getElementById(modalOpenId);
  const modal = document.getElementById(easyModal);
  const buttonClose = document.getElementsByClassName(modalCloseId)[0];

  buttonOpen.addEventListener('click', modalOpen);
  function modalOpen() {
    modal.style.display = 'block';
  }

  buttonClose.addEventListener('click', modalClose);
  function modalClose() {
    modal.style.display = 'none';
  }

  addEventListener('click', outsideClose);
  function outsideClose(e) {
    if (e.target == modal) {
      modal.style.display = 'none';
    }
  }
}

function rainbow_art(){
  let stageW = 0; // 画面の幅
  let stageH = 0; // 画面の高さ

  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('2d');

  noise.seed(Math.random());

  resize();
  tick();
  window.addEventListener('resize', resize);

  function tick() {
    requestAnimationFrame(tick);
    const time = Date.now() / 4000;
    draw(time);
  }


  function draw(time) {
    // 画面をリセット
    context.clearRect(0, 0, stageW, stageH);
    context.lineWidth = 1;

    const amplitude = stageH / 2; // 振幅（縦幅)の大きさ
    const lineNum = 150; // ラインの数
    const segmentNum = 150; // 分割数

    [...Array(lineNum).keys()].forEach(j => {
      const coefficient = 50 + j;

      context.beginPath();

      const h = Math.round(j / lineNum * 360); // 色相
      const s = 100; // 彩度
      const l = Math.round(j / lineNum * 100); // 明度
      context.strokeStyle = `hsl(${h}, ${s}%, ${l}%)`;

      [...Array(segmentNum).keys()].forEach(i => {

        const x = i / (segmentNum - 1) * stageW;

        const px = i / coefficient;
        const py = (j / 50 + time);
        const y = amplitude * noise.perlin2(px, py) + stageH / 2;

        if (i === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      });
      context.stroke();
    });
  }

  function resize() {
    stageW = innerWidth * devicePixelRatio;
    stageH = innerHeight * devicePixelRatio;

    canvas.width = stageW;
    canvas.height = stageH;
  }
}

function particle_art(){
  const canvas = document.getElementById('particle');
  const ctx = canvas.getContext('2d');

  window.requestAnimationFrame = 
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.weblitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (cb) { setTimeout(cb, 17); };

  const NUM = 50; // 表示数
  const particles = [];

  class Particle {
    constructor(x, y, radius, directionX, directionY, index) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.directionX = directionX;
      this.directionY = directionY;
      this.index = index;
    }
    render() {
      if(this.index % 3 === 0) {
        ctx.fillStyle = "#fff";
        ctx.fill();
      } else if(this.index % 3 === 1) {
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.stroke()
      }else {
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = "#0f0091";
        ctx.fill();
      }
      // 円をかく
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
      
      
    }
    update() {

      this.x += this.directionX;
      if(this.x > canvas.width + this.radius) {
        this.x = -this.radius;
      }
      
      this.render();
    }
  }

  init();
  render();

  function init() {
    for(let i = 0; i < NUM; i++) {
      // particles 
      const x = Math.random() * canvas.width;
      const y = Math.floor(Math.random() * canvas.height);
      const radius = Math.floor(Math.random() * 10);
      const directionX = Math.random() * 2;
      const directionY = Math.random() * 2 - 1;
      const particle = new Particle(x, y, radius, directionX, directionY, i);
      particles.push(particle);
    }
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < particles.length; i++) {
      particles[i].update();
    }
    requestAnimationFrame(render);
  }

}

function firefly_art(){
  const rand = function(min, max) {
    return Math.random() * ( max - min ) + min;
  }
  
  let canvas = document.getElementById('firefly');
  let ctx = canvas.getContext('2d');
  
  // canvas.width = window.innerWidth;
  // canvas.height = window.innerHeight;
  
  window.addEventListener('resize', function() {
    ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'lighter';
  });
  let backgroundColors = [ '#000', '#000' ];
  let colors = [
    [ '#002aff', "#009ff2" ],
    [ '#0054ff', '#27e49b' ], 
    [ '#202bc5' ,'#873dcc' ]
  ];
  let count = 70;
  let blur = [ 12, 70 ];
  let radius = [ 1, 40 ];
  
  ctx.clearRect( 0, 0, canvas.width, canvas.height );
  ctx.globalCompositeOperation = 'lighter';
  
  let grd = ctx.createLinearGradient(0, canvas.height, canvas.width, 0);
  grd.addColorStop(0, backgroundColors[0]);
  grd.addColorStop(1, backgroundColors[1]);
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  let items = [];
  
  while(count--) {
      let thisRadius = rand( radius[0], radius[1] );
      let thisBlur = rand( blur[0], blur[1] );
      let x = rand( -100, canvas.width + 100 );
      let y = rand( -100, canvas.height + 100 );
      let colorIndex = Math.floor(rand(0, 299) / 100);
      let colorOne = colors[colorIndex][0];
      let colorTwo = colors[colorIndex][1];
      
      ctx.beginPath();
      ctx.filter = `blur(${thisBlur}px)`;
      let grd = ctx.createLinearGradient(x - thisRadius / 2, y - thisRadius / 2, x + thisRadius, y + thisRadius);
    
      grd.addColorStop(0, colorOne);
      grd.addColorStop(1, colorTwo);
      ctx.fillStyle = grd;
      ctx.fill();
      ctx.arc( x, y, thisRadius, 0, Math.PI * 2 );
      ctx.closePath();
      
      let directionX = Math.round(rand(-99, 99) / 100);
      let directionY = Math.round(rand(-99, 99) / 100);
    
      items.push({
        x: x,
        y: y,
        blur: thisBlur,
        radius: thisRadius,
        initialXDirection: directionX,
        initialYDirection: directionY,
        initialBlurDirection: directionX,
        colorOne: colorOne,
        colorTwo: colorTwo,
        gradient: [ x - thisRadius / 2, y - thisRadius / 2, x + thisRadius, y + thisRadius ],
      });
  }
  
  
  function changeCanvas(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let adjX = 2;
    let adjY = 2;
    let adjBlur = 1;
    items.forEach(function(item) {
      
      if(item.x + (item.initialXDirection * adjX) >= canvas.width && item.initialXDirection !== 0 || item.x + (item.initialXDirection * adjX) <= 0 && item.initialXDirection !== 0) {
        item.initialXDirection = item.initialXDirection * -1;
      }
      if(item.y + (item.initialYDirection * adjY) >= canvas.height && item.initialYDirection !== 0 || item.y + (item.initialYDirection * adjY) <= 0 && item.initialYDirection !== 0) {
        item.initialYDirection = item.initialYDirection * -1;
      }
      
      if(item.blur + (item.initialBlurDirection * adjBlur) >= radius[1] && item.initialBlurDirection !== 0 || item.blur + (item.initialBlurDirection * adjBlur) <= radius[0] && item.initialBlurDirection !== 0) {
        item.initialBlurDirection *= -1;
      }
    
      item.x += (item.initialXDirection * adjX);
      item.y += (item.initialYDirection * adjY);
      item.blur += (item.initialBlurDirection * adjBlur);
      ctx.beginPath();
      ctx.filter = `blur(${item.blur}px)`;
      let grd = ctx.createLinearGradient(item.gradient[0], item.gradient[1], item.gradient[2], item.gradient[3]);
      grd.addColorStop(0, item.colorOne);
      grd.addColorStop(1, item.colorTwo);
      ctx.fillStyle = grd;
      ctx.arc( item.x, item.y, item.radius, 0, Math.PI * 2 );
      ctx.fill();
      ctx.closePath();
      
    });
    window.requestAnimationFrame(changeCanvas);
    
  }
  
  window.requestAnimationFrame(changeCanvas);
}