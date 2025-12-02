import { useEffect, useRef } from 'react';

function InspirationalParticles({ theme = 'light' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Floating sparkle particles
    class Sparkle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = Math.random() * 4 + 1;
        this.speedY = -(Math.random() * 1.5 + 0.5);
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.opacity = 0;
        this.life = 0;
        this.maxLife = Math.random() * 200 + 100;
        this.twinkle = Math.random() * Math.PI * 2;
        this.twinkleSpeed = Math.random() * 0.05 + 0.02;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.life++;
        this.twinkle += this.twinkleSpeed;

        // Fade in and out
        if (this.life < 50) {
          this.opacity = this.life / 50;
        } else if (this.life > this.maxLife - 50) {
          this.opacity = (this.maxLife - this.life) / 50;
        } else {
          this.opacity = 0.8 + Math.sin(this.twinkle) * 0.2;
        }

        if (this.life > this.maxLife || this.y < -20) {
          this.reset();
        }
      }

      draw() {
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 3
        );

        if (theme === 'dark') {
          gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
          gradient.addColorStop(0.5, `rgba(164, 214, 94, ${this.opacity * 0.6})`);
          gradient.addColorStop(1, 'rgba(164, 214, 94, 0)');
        } else {
          gradient.addColorStop(0, `rgba(164, 214, 94, ${this.opacity})`);
          gradient.addColorStop(0.5, `rgba(0, 104, 71, ${this.opacity * 0.5})`);
          gradient.addColorStop(1, 'rgba(0, 104, 71, 0)');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Add star points for sparkle effect
        if (Math.random() > 0.97) {
          ctx.strokeStyle = theme === 'dark' 
            ? `rgba(255, 255, 255, ${this.opacity})` 
            : `rgba(164, 214, 94, ${this.opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(this.x - this.size * 2, this.y);
          ctx.lineTo(this.x + this.size * 2, this.y);
          ctx.moveTo(this.x, this.y - this.size * 2);
          ctx.lineTo(this.x, this.y + this.size * 2);
          ctx.stroke();
        }
      }
    }

    // Light rays
    class LightRay {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = -50;
        this.length = Math.random() * 100 + 50;
        this.width = Math.random() * 2 + 0.5;
        this.speed = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.angle = Math.random() * 0.3 - 0.15;
      }

      update() {
        this.y += this.speed;
        if (this.y > canvas.height + 50) {
          this.y = -50;
          this.x = Math.random() * canvas.width;
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        const gradient = ctx.createLinearGradient(0, 0, 0, this.length);
        if (theme === 'dark') {
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
          gradient.addColorStop(0.5, `rgba(164, 214, 94, ${this.opacity})`);
          gradient.addColorStop(1, 'rgba(164, 214, 94, 0)');
        } else {
          gradient.addColorStop(0, 'rgba(164, 214, 94, 0)');
          gradient.addColorStop(0.5, `rgba(0, 104, 71, ${this.opacity})`);
          gradient.addColorStop(1, 'rgba(0, 104, 71, 0)');
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(-this.width / 2, 0, this.width, this.length);
        ctx.restore();
      }
    }

    const sparkles = Array.from({ length: 40 }, () => new Sparkle());
    const lightRays = Array.from({ length: 8 }, () => new LightRay());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw light rays first (background layer)
      lightRays.forEach(ray => {
        ray.update();
        ray.draw();
      });

      // Draw sparkles on top
      sparkles.forEach(sparkle => {
        sparkle.update();
        sparkle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ 
        opacity: 0.6,
        zIndex: 0
      }}
    />
  );
}

export default InspirationalParticles;
