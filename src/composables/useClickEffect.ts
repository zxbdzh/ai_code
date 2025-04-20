import { onMounted, onUnmounted, ref } from 'vue';

export function useClickEffect() {
  const isEnabled = ref(true);
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let balls: any[] = [];
  let longPressed = false;
  let multiplier = 0;
  let pointer: HTMLElement;

  const colours = ["#F73859", "#14FFEC", "#00E0FF", "#FF99FE", "#FAF15D"];

  const initEffect = () => {
    canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    canvas.setAttribute("style", "width: 100%; height: 100%; top: 0; left: 0; z-index: 99999; position: fixed; pointer-events: none;");

    pointer = document.createElement("span");
    pointer.classList.add("pointer");
    document.body.appendChild(pointer);

    if (canvas.getContext) {
      ctx = canvas.getContext('2d')!;
      setupEventListeners();
      updateSize();
      loop();
    }
  };

  const setupEventListeners = () => {
    window.addEventListener('resize', updateSize);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
  };

  const removeEventListeners = () => {
    window.removeEventListener('resize', updateSize);
    window.removeEventListener('mousedown', handleMouseDown);
    window.removeEventListener('mouseup', handleMouseUp);
    window.removeEventListener('mousemove', handleMouseMove);
  };

  const handleMouseDown = (e: MouseEvent) => {
    longPressed = true;
    multiplier = 0;
    addBalls(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    longPressed = false;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (pointer) {
      pointer.style.left = e.clientX + 'px';
      pointer.style.top = e.clientY + 'px';
    }
    if (longPressed) {
      multiplier += 0.2;
      addBalls(e.clientX, e.clientY, multiplier);
    }
  };

  const addBalls = (x: number, y: number, count = 5) => {
    for (let i = 0; i < count; i++) {
      balls.push({
        x,
        y,
        angle: Math.random() * Math.PI * 2,
        velocity: 2 + Math.random() * 2,
        radius: 5 + Math.random() * 10,
        color: colours[Math.floor(Math.random() * colours.length)],
        friction: 0.9,
        opacity: 1,
        yVel: 0,
        gravity: 0.1
      });
    }
  };

  const loop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < balls.length; i++) {
      const ball = balls[i];
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = ball.color;
      ctx.globalAlpha = ball.opacity;
      ctx.fill();
      ctx.closePath();

      ball.velocity *= ball.friction;
      ball.x += Math.cos(ball.angle) * ball.velocity;
      ball.y += Math.sin(ball.angle) * ball.velocity + ball.yVel;
      ball.yVel += ball.gravity;
      ball.opacity -= 0.01;

      if (ball.opacity <= 0) {
        balls.splice(i, 1);
        i--;
      }
    }

    requestAnimationFrame(loop);
  };

  const updateSize = () => {
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(2, 2);
  };

  const toggle = () => {
    isEnabled.value = !isEnabled.value;
    if (isEnabled.value) {
      initEffect();
    } else {
      destroyEffect();
    }
  };

  const destroyEffect = () => {
    canvas?.remove();
    pointer?.remove();
    removeEventListeners();
    balls = [];
  };

  onMounted(() => {
    if (isEnabled.value) initEffect();
  });

  onUnmounted(destroyEffect);

  return { isEnabled, toggle };
}