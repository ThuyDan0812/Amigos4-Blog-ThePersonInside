/* ==========================================================================
   sketchUI.js - p5.js GENERATIVE ART & UI CANVASES (MERGED)
   ========================================================================== */

// =========================================================
// 0. PROMO ADVERTISEMENTS ROTATOR
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
  const quangcaoDiv = document.querySelector(".promo .quangcao");

  if (quangcaoDiv) {
    const promoImages = [
      "edited-media/COMM2754-2026-S2-A3w12-Amigos4-ad1.png",
      "edited-media/COMM2754-2026-S2-A3w12-Amigos4-ad2.png",
      "edited-media/COMM2754-2026-S2-A3w12-Amigos4-ad3.png",
      "edited-media/COMM2754-2026-S2-A3w12-Amigos4-ad4.png",
    ];

    const imgElement = document.createElement("img");
    imgElement.style.transition = "transform 0.2s ease-in-out, filter 0.2s ease-in-out";
    quangcaoDiv.appendChild(imgElement);

    if (!document.getElementById("promo-shake-style")) {
      const styleSheet = document.createElement("style");
      styleSheet.id = "promo-shake-style";
      styleSheet.innerText = `
        @keyframes promoShake {
          0% { transform: scale(1.04) rotate(0deg); }
          25% { transform: scale(1.04) rotate(-2deg); }
          50% { transform: scale(1.04) rotate(2deg); }
          75% { transform: scale(1.04) rotate(-1deg); }
          100% { transform: scale(1.04) rotate(0deg); }
        }
        .promo-hover-shake {
          animation: promoShake 0.4s ease-in-out infinite alternate;
          filter: brightness(1.15) contrast(1.05);
          cursor: pointer;
        }
      `;
      document.head.appendChild(styleSheet);
    }

    quangcaoDiv.addEventListener("mouseenter", () => {
      imgElement.classList.add("promo-hover-shake");
    });
    quangcaoDiv.addEventListener("mouseleave", () => {
      imgElement.classList.remove("promo-hover-shake");
    });

    let currentIndex = -1;
    function changePromoImage() {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * promoImages.length);
      } while (randomIndex === currentIndex && promoImages.length > 1);
      currentIndex = randomIndex;
      imgElement.src = promoImages[currentIndex];
    }
    changePromoImage();
    setInterval(changePromoImage, 3000);
  }
});

// =========================================================
// AVATAR & INTERACTIVE POST SKETCHES (Original)
// =========================================================
const avatarSketch = (p) => {
  let selectedImg, isHovered = false, wasHovered = false, globalHue = 0;
  p.preload = () => { selectedImg = p.loadImage(sessionAvatarFile); };
  
  p.setup = () => {
    const container = document.getElementById("avatar-canvas-container");
    const w = container ? container.offsetWidth : 220;
    p.createCanvas(w, w).parent("avatar-canvas-container");
    p.colorMode(p.HSB, 360, 100, 100, 100);
  };
  
  p.draw = () => {
    p.background(30, 30, 30);
    isHovered = p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height;
    
    if (isHovered && !wasHovered) {
      if (typeof activeHeartbeatSound !== 'undefined' && activeHeartbeatSound) {
        activeHeartbeatSound.currentTime = 0;
        activeHeartbeatSound.play().catch(() => {});
      }
    }
    wasHovered = isHovered;
    
    p.push();
    p.translate(p.width / 2, p.height / 2);
    p.imageMode(p.CENTER);
    const imgSize = p.width * 0.9;
    
    if (selectedImg && selectedImg.width > 0) {
      if (!isHovered) {
        p.drawingContext.filter = "grayscale(100%) brightness(130%)";
        p.noTint();
      } else {
        p.drawingContext.filter = "none";
        globalHue = (globalHue + 3) % 360;
        p.tint(globalHue, 80, 100, 100);
      }
      p.image(selectedImg, 0, 0, imgSize, imgSize);
    } else {
      p.noStroke();
      if (isHovered) {
        globalHue = (globalHue + 3) % 360;
        p.fill(p.color(globalHue, 80, 100));
      } else {
        p.fill(p.color(0, 0, 80));
      }
      p.rectMode(p.CENTER);
      p.rect(0, 0, imgSize, imgSize);
    }
    p.pop();
  };
  
  p.windowResized = () => {
    const container = document.getElementById("avatar-canvas-container");
    if (container) p.resizeCanvas(container.offsetWidth, container.offsetWidth);
  };
};

const interactiveCrashSketch = (p) => {
  let drugImg;
  const step = 10;
  const chars = ["@", "*", "?", "^", "!", "x_x", "#", "%", ">", "<"];
  
  p.preload = () => {
    const drugImages = [
      "edited-media/COMM2754-2026-S2-A3w12-Amigos4-element1.png", 
      "edited-media/COMM2754-2026-S2-A3w12-Amigos4-element2.png", 
      "edited-media/COMM2754-2026-S2-A3w12-Amigos4-element3.png"
    ];
    const randomDrug = p.random(drugImages);
    drugImg = p.loadImage(
      randomDrug,
      () => console.log("Crash sketch loaded:", randomDrug),
      () => console.error("Crash sketch FAILED:", randomDrug)
    );
  };
  
  p.setup = () => {
    const container = document.getElementById("interactive-crash-canvas");
    if (!container) return;
    p.createCanvas(container.offsetWidth, container.offsetHeight).parent(container);
    if (drugImg && drugImg.width > 0) {
      drugImg.resize(p.width, p.height);
      drugImg.loadPixels();
    }
    p.textAlign(p.CENTER, p.CENTER);
    p.textFont("Arial");
    p.noStroke();
  };
  
  p.draw = () => {
    p.background(15);
    if (!drugImg || !drugImg.pixels || drugImg.pixels.length === 0) return;
    
    for (let y = 0; y < p.height; y += step) {
      for (let x = 0; x < p.width; x += step) {
        const i = (y * drugImg.width + x) * 4;
        const r = drugImg.pixels[i];
        const g = drugImg.pixels[i + 1];
        const b = drugImg.pixels[i + 2];
        const a = drugImg.pixels[i + 3];
        if (a === 0 || a === undefined) continue;
        
        const d = p.dist(p.mouseX, p.mouseY, x, y);
        const isHovering = p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height;
        
        if (isHovering && d < 120) {
          const threshold = p.map(d, 0, 120, 1, 0);
          if (p.random() < threshold) {
            p.fill(r + 70, g + 70, b + 70);
            p.textSize(step * 1.5);
            p.text(p.random(chars), x, y);
          } else {
            p.fill(r, g, b);
            p.rect(x, y, step, step);
          }
        } else {
          p.fill(r, g, b);
          p.rect(x, y, step, step);
        }
      }
    }
  };
  
  p.windowResized = () => {
    const container = document.getElementById("interactive-crash-canvas");
    if (container) {
      p.resizeCanvas(container.offsetWidth, container.offsetHeight);
      if (drugImg && drugImg.width > 0) {
        drugImg.resize(p.width, p.height);
        drugImg.loadPixels();
      }
    }
  };
};

const interactivePostSketch = (p) => {
  let faceImg, drugImg, topLayer;
  let mouseStoppedFrames = 31; 
  let wasHovering = false; 
  let hoverSounds = [];

  p.preload = () => {
    const faces = ["edited-media/COMM2754-2026-S2-A3w12-Amigos4-bao.png", "edited-media/COMM2754-2026-S2-A3w12-Amigos4-nam.png", "edited-media/COMM2754-2026-S2-A3w12-Amigos4-dan.png", "edited-media/COMM2754-2026-S2-A3w12-Amigos4-hang.png"];
    const randomFace = p.random(faces);
    faceImg = p.loadImage(randomFace);

    const drugs = [
      "edited-media/COMM2754-2026-S2-A3w12-Amigos4-element1.png", 
      "edited-media/COMM2754-2026-S2-A3w12-Amigos4-element2.png", 
      "edited-media/COMM2754-2026-S2-A3w12-Amigos4-element3.png"
    ];
    const randomDrug = p.random(drugs);
    drugImg = p.loadImage(randomDrug);
  };
  
  p.setup = () => {
    const container = document.getElementById("interactive-post-canvas");
    if (!container) return;
    p.createCanvas(container.offsetWidth, container.offsetHeight).parent(container);
    topLayer = p.createGraphics(p.width, p.height);
    drawDrugPattern(topLayer, 255);

    hoverSounds = [
      new Audio("edited-sounds/ping.wav"), 
      new Audio("edited-sounds/ping2.wav")
    ];
    hoverSounds.forEach(snd => snd.volume = 0.5);
  };

  p.draw = () => {
    p.background(20);
    p.imageMode(p.CENTER);
    if (faceImg && faceImg.width > 0) {
      p.image(faceImg, p.width / 2, p.height / 2, 220, 220);
    }
    
    const isHovering = p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height;
    const isMoving = p.dist(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY) > 0.5;

    if (isHovering && !wasHovering) {
      if (hoverSounds.length > 0) {
        const snd = p.random(hoverSounds);
        snd.currentTime = 0; 
        snd.play().catch((error) => console.log("Audio blocked by browser:", error));
      }
    }
    wasHovering = isHovering;

    if (isHovering && isMoving) {
      if (mouseStoppedFrames > 30) {
        if (typeof CorruptionOperator !== 'undefined') {
          const shouldCorrupt = CorruptionOperator.incrementAndCheck();
          if (shouldCorrupt && typeof triggerGlobalGlitch === 'function') {
            triggerGlobalGlitch();
          }
        }
      }
      topLayer.erase();
      topLayer.noStroke();
      topLayer.fill(255);
      topLayer.ellipse(p.mouseX, p.mouseY, 90, 90);
      topLayer.noErase();
      mouseStoppedFrames = 0;
    } else if (isHovering && !isMoving) {
      mouseStoppedFrames++;
    } else if (!isHovering) {
      mouseStoppedFrames++;
    }

    if (mouseStoppedFrames > 30) drawDrugPattern(topLayer, 15);

    p.imageMode(p.CORNER);
    p.image(topLayer, 0, 0);
  };

  function drawDrugPattern(graphics, alphaValue) {
    if (!drugImg || drugImg.width === 0) return;
    graphics.push();
    graphics.tint(255, alphaValue);
    graphics.imageMode(p.CENTER);
    graphics.image(drugImg, p.width / 2, p.height / 2, p.width, p.width);
    graphics.pop();
  }

  p.windowResized = () => {
    const container = document.getElementById("interactive-post-canvas");
    if (container) {
      p.resizeCanvas(container.offsetWidth, container.offsetHeight);
      topLayer = p.createGraphics(p.width, p.height);
      drawDrugPattern(topLayer, 255);
    }
  };
};

// =========================================================
// 1. SCROLLING AD SKETCH (NEW VERSION)
// =========================================================
const cloverImageFile = "edited-media/COMM2754-2026-S2-A3w12-Amigos4-clover.gif";
const maxClovers = 12;
const cloverPreloads = [];
for (let i = 0; i < maxClovers; i++) {
  const img = new Image();
  img.src = cloverImageFile;
  cloverPreloads.push(img);
}

const scrollingAdSketch = (p) => {
  let adText = "You saw the addiction. Did you see the person?";
  let textXPos = 0;
  let scrollSpeed = 1.5;
  let textWidthValue = 0;
  let gap = 400;
  let container = null;
  let cloverPool = [];
  let cloverImageReady = false;
  let cloverImageWidth = 32;
  let cloverImageHeight = 32;
  const iconGap = 3;

  let candies = [];
  let loadedSounds = [];
  let isHovering = false;

  const candyImageFiles = [
    "edited-media/COMM2754-2026-S2-A3w12-Amigos4-element1.png",
    "edited-media/COMM2754-2026-S2-A3w12-Amigos4-element2.png",
    "edited-media/COMM2754-2026-S2-A3w12-Amigos4-element3.png",
  ];
  let candyImages = [];
  let candyImagesReady = false;
  let loadedCandyCount = 0;
  let pendingCandyHover = false;
  let pendingHoverX = 0;
  let pendingHoverY = 0;

  const soundFiles = [
    "designed-sounds/sound1.wav",
    "designed-sounds/sound2.wav",
  ];

  function setupCloverPool() {
    if (!container) return;
    cloverPreloads.forEach((preloadImg) => {
      preloadImg.style.position = "absolute";
      preloadImg.style.pointerEvents = "none";
      preloadImg.style.display = "none";
      preloadImg.style.objectFit = "contain";
      preloadImg.style.zIndex = "2";
      container.appendChild(preloadImg);
      cloverPool.push(preloadImg);
    });
  }

  function setupCloverSize() {
    const sampleImg = cloverPool[0];
    if (!sampleImg) return;
    const originalWidth = sampleImg.naturalWidth;
    const originalHeight = sampleImg.naturalHeight;
    if (originalWidth > 0 && originalHeight > 0) {
      cloverImageHeight = 32;
      cloverImageWidth = (originalWidth / originalHeight) * cloverImageHeight;
      cloverPool.forEach((img) => {
        img.style.width = `${cloverImageWidth}px`;
        img.style.height = `${cloverImageHeight}px`;
      });
    }
    cloverImageReady = true;
  }

  function triggerInteraction(x, y) {
    if (loadedSounds.length > 0) {
      const snd = p.random(loadedSounds);
      snd.currentTime = 0;
      snd.play().catch((error) => console.log("Audio blocked:", error));
    }
    if (candyImagesReady) {
      spawnCandyParticles(x, y);
    } else {
      pendingCandyHover = true;
      pendingHoverX = x;
      pendingHoverY = y;
    }
  }

  p.setup = () => {
    container = document.querySelector(".banner");
    const w = container?.clientWidth || 300;
    const h = container?.clientHeight || 40;
    const canvas = p.createCanvas(w, h);
    if (container) {
      canvas.parent(container);
      container.style.position = "relative";
      container.style.overflow = "hidden";
    }
    setupCloverPool();
    if (cloverPool[0] && cloverPool[0].complete) {
      setupCloverSize();
    } else if (cloverPool[0]) {
      cloverPool[0].onload = setupCloverSize;
    }
    p.textSize(24); p.textFont("Georgia"); p.textStyle(p.BOLD); p.textAlign(p.LEFT, p.CENTER);
    textWidthValue = p.textWidth(adText);
    textXPos = p.width;
    loadedSounds = soundFiles.map((path) => {
      const snd = new Audio(path);
      snd.volume = 0.5;
      return snd;
    });
    candyImageFiles.forEach((path) => {
      const img = new Image();
      img.src = path;
      img.onload = () => {
        loadedCandyCount++;
        candyImages.push(img);
        if (loadedCandyCount === candyImageFiles.length) {
          candyImagesReady = true;
          if (pendingCandyHover) {
            spawnCandyParticles(pendingHoverX, pendingHoverY);
            pendingCandyHover = false;
          }
        }
      };
      img.onerror = () => {
        loadedCandyCount++;
        if (loadedCandyCount === candyImageFiles.length) {
          candyImagesReady = true;
          if (pendingCandyHover) {
            spawnCandyParticles(pendingHoverX, pendingHoverY);
            pendingCandyHover = false;
          }
        }
      };
    });
  };

  p.mousePressed = () => {
    const isMobileOrTablet = window.matchMedia("(max-width: 760px)").matches;
    if (isMobileOrTablet) {
      const mouseInCanvas = p.mouseX > 0 && p.mouseX <= p.width && p.mouseY > 0 && p.mouseY <= p.height;
      if (mouseInCanvas) {
        triggerInteraction(p.mouseX, p.mouseY);
      }
    }
  };

  function spawnCandyParticles(x, y) {
    if (!candyImagesReady) {
      pendingCandyHover = true; pendingHoverX = x; pendingHoverY = y; return;
    }
    const usableImages = candyImages.filter((img) => img.complete && img.naturalWidth > 0);
    if (usableImages.length === 0) return;
    const particleCount = p.floor(p.random(15, 30));
    for (let i = 0; i < particleCount; i++) {
      const selectedImage = p.random(usableImages);
      candies.push(new CandyParticle(p, selectedImage, x, y));
    }
  }

  p.draw = () => {
    p.clear();
    p.fill("#FFFFFF");
    p.noStroke();

    const isMobileOrTablet = window.matchMedia("(max-width: 760px)").matches;
    const mouseInCanvas = p.mouseX > 0 && p.mouseX <= p.width && p.mouseY > 0 && p.mouseY <= p.height;

    if (!isMobileOrTablet) {
      if (mouseInCanvas && !isHovering) {
        isHovering = true;
        triggerInteraction(p.mouseX, p.mouseY);
      }
      if (!mouseInCanvas) isHovering = false;
    }

    candies = candies.filter((candy) => {
      candy.update();
      candy.display();
      return !candy.isDead();
    });

    const textWithCloversWidth = cloverImageWidth + iconGap + textWidthValue + iconGap + cloverImageWidth;
    const fullLength = textWithCloversWidth + gap;

    cloverPool.forEach((img) => {
      if (img) img.style.display = "none";
    });

    let cloverIndexCounter = 0;
    for (let currentX = textXPos; currentX < p.width; currentX += fullLength) {
      if (cloverImageReady) {
        const firstCloverX = currentX;
        const firstCloverY = p.height / 2 - cloverImageHeight / 2;
        if (firstCloverX + cloverImageWidth > 0 && firstCloverX < p.width) {
          if (cloverIndexCounter < cloverPool.length) {
            const activeClover = cloverPool[cloverIndexCounter];
            activeClover.style.display = "block";
            activeClover.style.left = `${firstCloverX}px`;
            activeClover.style.top = `${firstCloverY}px`;
          }
        }
      }
      cloverIndexCounter++;

      const textX = currentX + cloverImageWidth + iconGap;
      p.text(adText, textX, p.height / 2);

      if (cloverImageReady) {
        const secondCloverX = textX + textWidthValue + iconGap;
        const secondCloverY = p.height / 2 - cloverImageHeight / 2;
        if (secondCloverX + cloverImageWidth > 0 && secondCloverX < p.width) {
          if (cloverIndexCounter < cloverPool.length) {
            const activeClover = cloverPool[cloverIndexCounter];
            activeClover.style.display = "block";
            activeClover.style.left = `${secondCloverX}px`;
            activeClover.style.top = `${secondCloverY}px`;
          }
        }
      }
      cloverIndexCounter++;
    }
    textXPos -= scrollSpeed;
    if (textXPos <= -textWithCloversWidth) textXPos += fullLength;
  };

  p.windowResized = () => {
    const currentContainer = document.querySelector(".banner");
    if (currentContainer) {
      p.resizeCanvas(currentContainer.clientWidth, currentContainer.clientHeight);
      textWidthValue = p.textWidth(adText);
    }
  };
};

class CandyParticle {
  constructor(p, image, x, y) {
    this.p = p; this.image = image; this.x = x; this.y = y;
    this.vx = p.random(-3.5, 3.5); this.vy = p.random(-4.5, 0.5);
    this.gravity = 0.1; this.alpha = 1.0; this.lifespan = 180;
    this.size = p.random(12, 20); this.rotation = p.random(p.TWO_PI); this.rotationSpeed = p.random(-0.04, 0.04);
  }
  update() {
    this.x += this.vx; this.vy += this.gravity; this.y += this.vy;
    this.rotation += this.rotationSpeed; this.lifespan--;
    this.alpha = this.p.map(this.lifespan, 0, 180, 0, 1.0);
  }
  display() {
    if (!this.image || !this.image.complete || this.image.naturalWidth === 0) return;
    const ctx = this.p.drawingContext;
    const imgRatio = this.image.naturalWidth / this.image.naturalHeight;
    let drawWidth = this.size; let drawHeight = this.size;
    if (imgRatio >= 1) drawHeight = this.size / imgRatio; else drawWidth = this.size * imgRatio;
    ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.rotation);
    ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
    ctx.drawImage(this.image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();
  }
  isDead() { return this.lifespan <= 0; }
}

// =========================================================
// 3. BACKGROUND PIXEL ARTWORK SKETCH (NEW VERSION)
// =========================================================
const backgroundSketch = (p) => {
  let aspectRatio;
  let stars = [];
  let waveSeeds = [];
  let orbs = [];

  let timeAccumulator = 0;
  let p5Colors = [];

  const rawColors = [
    [105, 0, 125],
    [25, 0, 85],
    [50, 0, 105],
    [135, 0, 170],
  ];

  const LOW_RES_WIDTH = 400;

  p.setup = () => {
    let container = document.getElementById("bg-canvas-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "bg-canvas-container";
      document.body.prepend(container);
    }
    aspectRatio = window.innerHeight / window.innerWidth;
    const lowResHeight = p.floor(LOW_RES_WIDTH * aspectRatio);
    p.pixelDensity(1);
    p.frameRate(30);
    const canvas = p.createCanvas(LOW_RES_WIDTH, lowResHeight);
    canvas.parent(container);
    p5Colors = rawColors.map((colorValue) => {
      return p.color(colorValue[0], colorValue[1], colorValue[2]);
    });

    orbs = [
      { x: 0.2, y: 0.25, baseR: 110, phase: 0.0, colorShiftSpeed: 0.15 },
      { x: 0.8, y: 0.2, baseR: 120, phase: 1.5, colorShiftSpeed: 0.12 },
      { x: 0.5, y: 0.5, baseR: 100, phase: 3.0, colorShiftSpeed: 0.18 },
      { x: 0.15, y: 0.75, baseR: 115, phase: 4.2, colorShiftSpeed: 0.14 },
      { x: 0.85, y: 0.8, baseR: 125, phase: 2.1, colorShiftSpeed: 0.16 },
      { x: 0.5, y: 0.85, baseR: 95, phase: 5.5, colorShiftSpeed: 0.11 },
    ];

    stars = Array.from({ length: 6 }, () => ({
      x: p.random(p.width),
      y: p.random(p.height),
      vx: p.random(-0.3, 0.3),
      vy: p.random(-0.2, 0.2),
      phase: p.random(p.TWO_PI),
    }));

    waveSeeds = [p.random(100), p.random(100)];
  };

  p.draw = () => {
    const dt = p.min(p.deltaTime * 0.001, 0.05);
    timeAccumulator += dt;
    const t = timeAccumulator * 0.6;
    const bgSpeed = 0.4;
    const bgProgress = (timeAccumulator * bgSpeed) % p5Colors.length;
    const bgIdx1 = p.floor(bgProgress);
    const bgIdx2 = (bgIdx1 + 1) % p5Colors.length;
    const bgAmt = bgProgress - bgIdx1;

    const bgColor = p.lerpColor(p5Colors[bgIdx1], p5Colors[bgIdx2], bgAmt);
    p.background(bgColor);
    p.noStroke();

    orbs.forEach((orb) => {
      const cx = p.width * orb.x;
      const cy = p.height * orb.y;
      const pulse = p.sin(timeAccumulator * 1.2 + orb.phase);
      const currentRadius = orb.baseR + pulse * 14;
      const colorProgress =
        (timeAccumulator * orb.colorShiftSpeed + orb.phase) % p5Colors.length;
      const idx1 = p.floor(colorProgress);
      const idx2 = (idx1 + 1) % p5Colors.length;
      const amt = colorProgress - idx1;

      const activeColor = p.lerpColor(p5Colors[idx1], p5Colors[idx2], amt);
      const layers = 4;
      for (let i = layers; i > 0; i--) {
        const currentR = p.map(
          i, 1, layers, currentRadius, currentRadius * 0.15
        );
        const alphaVal = p.map(i, 1, layers, 35, 140);
        p.fill(
          p.red(activeColor),
          p.green(activeColor),
          p.blue(activeColor),
          alphaVal
        );
        p.ellipse(cx, cy, currentR);
      }
    });

    p.fill(255, 255, 255, 100);
    p.noStroke();
    const spacing = 6;
    for (let x = 0; x < p.width; x += spacing) {
      for (let y = 0; y < p.height; y += spacing) {
        const dTL = p.dist(x, y, 0, 0);
        const dBR = p.dist(x, y, p.width, p.height);
        if (dTL < p.width * 0.35 || dBR < p.width * 0.35) {
          p.rect(x, y, 1, 1);
        }
      }
    }

    p.noFill();
    p.stroke(255, 255, 255, 160);
    p.strokeWeight(1);
    waveSeeds.forEach((seed, index) => {
      p.beginShape();
      const yOffset = index === 0 ? p.height * 0.22 : p.height * 0.78;
      for (let x = 0; x <= p.width; x += 3) {
        const y =
          yOffset +
          p.sin(x * 0.03 + t * 1.5 + seed) * 4 +
          p.cos(x * 0.02 - t) * 2;
        p.vertex(x, y);
      }
      p.endShape();
    });

    stars.forEach((star) => {
      star.x = (star.x + star.vx * (dt * 30) + p.width) % p.width;
      star.y = (star.y + star.vy * (dt * 30) + p.height) % p.height;
      p.fill(255, 255, 255);
      p.noStroke();
      p.rect(star.x, star.y, 1, 1);
      p.rect(star.x - 1, star.y, 3, 1);
      p.rect(star.x, star.y - 1, 1, 3);
    });
  };

  p.windowResized = () => {
    aspectRatio = window.innerHeight / window.innerWidth;
    p.resizeCanvas(LOW_RES_WIDTH, p.floor(LOW_RES_WIDTH * aspectRatio));
  };
};

// Initialize sketches
new p5(avatarSketch);
new p5(scrollingAdSketch);
new p5(backgroundSketch);