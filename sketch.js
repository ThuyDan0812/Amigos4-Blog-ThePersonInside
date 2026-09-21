/* ==========================================================================
   sketch.js - SYSTEM LOGIC, VIRUS OPERATOR, AND DOM GENERATION
   ========================================================================== */

let activeHeartbeatSound = null;
let activeKeyboardSound = null;
let activeChimeSound = null;
let sessionAvatarFile = "";

const avatarFiles = [
  "edited-media/COMM2754-2026-S2-A3w12-Amigos4-ava1.jpg",
  "edited-media/COMM2754-2026-S2-A3w12-Amigos4-ava2.jpg",
  "edited-media/COMM2754-2026-S2-A3w12-Amigos4-ava3.jpg",
];
sessionAvatarFile = avatarFiles[Math.floor(Math.random() * avatarFiles.length)];

const CorruptionOperator = {
  sessions: 0,
  threshold: 3,
  clonedButtons: [],
  originalTexts: [],

  incrementAndCheck: function () {
    this.sessions++;
    console.log(
      `[CorruptionOperator] Interaction ${this.sessions}/${this.threshold}`,
    );
    return this.sessions >= this.threshold;
  },

  reset: function () {
    this.sessions = 0;
    this.clonedButtons.forEach((btn) => btn.remove());
    this.clonedButtons = [];
  },
};

window.addEventListener("DOMContentLoaded", () => {
  const heartbeatPool = [
    "designed-sounds/heartbeat1.wav",
    "designed-sounds/heartbeat2.wav",
  ];
  const chimePool = [
    "designed-sounds/message-chime.wav",
    "designed-sounds/message-chime2.wav",
  ];

  try {
    activeHeartbeatSound = new Audio(
      heartbeatPool[Math.floor(Math.random() * heartbeatPool.length)],
    );
    activeChimeSound = new Audio(
      chimePool[Math.floor(Math.random() * chimePool.length)],
    );
  } catch (e) {
    console.warn("Audio preloading error:", e);
  }

  setupSearchAudio();
  setupModalInteraction();
  generateDynamicContent();
});

/* ==========================================================================
   VIRUS LOGIC
   ========================================================================== */
window.isGlitchActive = false;
window.adSpamInterval = null;
window.glitchTimeoutId = null;

const CORRUPTION_DURATION_MS = 10000;
const AD_SPAWN_INTERVAL_MS = 350;
const CTA_TEXT = "You saw the addiction. Did you see the person?";

window.triggerGlobalGlitch = function triggerCorruption() {
  if (window.isGlitchActive) return;
  window.isGlitchActive = true;

  document.body.classList.add("grayscale-glitch-body");

  if (activeChimeSound) {
    activeChimeSound.currentTime = 0;
    activeChimeSound.play().catch(() => {});
  }

  const textElements = Array.from(
    document.querySelectorAll(
      "p, h1, h2, h3, h4, span, a, button, small, strong, em",
    ),
  );
  if (CorruptionOperator.originalTexts.length === 0) {
    CorruptionOperator.originalTexts = textElements.map((el) => {
      return { element: el, originalHTML: el.innerHTML };
    });
  }

  swapAllTextToCTA();
  startFog();

  window.adSpamInterval = setInterval(spawnSpamAd, AD_SPAWN_INTERVAL_MS);

  window.glitchTimeoutId = setTimeout(() => {
    if (window.adSpamInterval) clearInterval(window.adSpamInterval);
    if (typeof HydraAdsSystem !== "undefined") {
      HydraAdsSystem.clearAll();
    }
    if (window.isGlitchActive) {
      showLookAwayButton();
    }
  }, CORRUPTION_DURATION_MS);
};

function swapAllTextToCTA() {
  const textElements = document.querySelectorAll(
    "p, h1, h2, h3, h4, span, a, button, small, strong, em",
  );
  textElements.forEach((el) => {
    if (!el.closest("#whats-new-modal")) {
      if (el.children.length === 0) {
        el.innerText = CTA_TEXT;
        el.style.color = "#ff0000";
        el.style.backgroundColor = "#000";
      }
    }
  });
}

function startFog() {
  if (document.getElementById("fog-overlay")) return;
  const fog = document.createElement("div");
  fog.id = "fog-overlay";
  document.body.appendChild(fog);
  requestAnimationFrame(() => fog.classList.add("fog-active"));
}

function spawnSpamAd() {
  if (activeChimeSound) {
    activeChimeSound.currentTime = 0;
    activeChimeSound.play().catch(() => {});
  }

  const ad = document.createElement("div");
  ad.className = "spam-ad";

  const width = 32 + Math.random() * 20;
  const top = Math.random() * 75;
  const left = Math.random() * 70;
  const rotate = (Math.random() * 10 - 5).toFixed(1);

  ad.style.top = `${top}%`;
  ad.style.left = `${left}%`;
  ad.style.width = `${width}%`;
  ad.style.setProperty("--rot", `${rotate}deg`);
  ad.innerText = CTA_TEXT;

  document.body.appendChild(ad);
}

function showLookAwayButton() {
  const btn = document.createElement("button");
  btn.id = "look-away-btn";
  btn.innerText = "Looking away is never the answer";
  document.body.appendChild(btn);

  requestAnimationFrame(() => btn.classList.add("look-away-visible"));
  btn.addEventListener("click", () => showFinalPanel(), { once: true });
}

function showFinalPanel() {
  const fog = document.getElementById("fog-overlay");
  if (fog) fog.remove();

  const btn = document.getElementById("look-away-btn");
  if (btn) btn.remove();

  document.querySelectorAll(".spam-ad").forEach((ad) => ad.remove());

  const page = document.querySelector(".page");
  const topbar = document.querySelector(".topbar");
  if (page) page.style.display = "none";
  if (topbar) topbar.style.display = "none";

  const modal = document.getElementById("whats-new-modal");
  if (modal) {
    modal.classList.remove("hidden");
    // Removed the black background override to keep it white/clean
  }

  window.isGlitchActive = false;
}

window.restoreWebToNormal = function () {
  if (window.adSpamInterval) clearInterval(window.adSpamInterval);
  if (window.glitchTimeoutId) clearTimeout(window.glitchTimeoutId);
  if (typeof HydraAdsSystem !== "undefined") HydraAdsSystem.clearAll();

  const fog = document.getElementById("fog-overlay");
  if (fog) fog.remove();
  document.querySelectorAll(".spam-ad").forEach((ad) => ad.remove());
  const lookAwayBtn = document.getElementById("look-away-btn");
  if (lookAwayBtn) lookAwayBtn.remove();

  document.body.classList.remove("grayscale-glitch-body");

  const page = document.querySelector(".page");
  const topbar = document.querySelector(".topbar");
  if (page) page.style.display = "";
  if (topbar) topbar.style.display = "";

  CorruptionOperator.originalTexts.forEach((item) => {
    if (item.element) {
      item.element.innerHTML = item.originalHTML;
      item.element.style.color = "";
      item.element.style.backgroundColor = "";
    }
  });

  CorruptionOperator.originalTexts = [];
  CorruptionOperator.reset();
  window.isGlitchActive = false;
};

function setupSearchAudio() {
  const searchInput = document.querySelector(".search-box input");
  if (searchInput) {
    searchInput.addEventListener("focus", () => {
      if (activeKeyboardSound) {
        activeKeyboardSound.currentTime = 0;
        activeKeyboardSound.play().catch(() => {});
      }
    });
  }
}

function setupModalInteraction() {
  const openBtn = document.getElementById("whats-new-btn");
  const closeBtn = document.getElementById("close-modal-btn");
  const modal = document.getElementById("whats-new-modal");

  if (!openBtn || !closeBtn || !modal) return;

  openBtn.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.remove("hidden");
    window.restoreWebToNormal();
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    window.restoreWebToNormal();
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
      window.restoreWebToNormal();
    }
  });
}

function generateDynamicContent() {
  const isFemale =
    sessionAvatarFile.includes("ava1") || sessionAvatarFile.includes("ava3");
  const names = isFemale
    ? ["b3' d4u cut3 ng0c ngh3ch", "c0ng chUa' m1t u0t", "t13u thu d0ng d4nh"]
    : [
        "l4ng tu c0 d0n",
        "h13p s1 b0ng d3m",
        "y3u 3m 4000 n4m",
        "h4n d0i v0 d0i",
      ];

  const selectedName = names[Math.floor(Math.random() * names.length)];
  const genderIcon = isFemale ? "♀" : "♂";
  const randomVip = Math.floor(Math.random() * 10) + 1;

  const profileElement = document.getElementById("dynamic-profile");
  if (profileElement) {
    profileElement.innerHTML = `
      <div class="profile-box-inner" style="padding: 10px;">
        <strong style="font-size: 1.1em; color: black; font-family: Arial;">${selectedName}${genderIcon}</strong>
        <div class="vip-banner"><marquee scrollamount="3">✨👑 Amigos! VIP ${randomVip} 👑✨</marquee></div>
        <table class="retro-stats-table">
          <tr><th colspan="2">Personal Info</th></tr>
          <tr><td>Age:</td><td>${Math.floor(Math.random() * 5) + 18}</td></tr>
          <tr><td>Join Date:</td><td>14/02/2009</td></tr>
          <tr><td>Posts:</td><td>${Math.floor(Math.random() * 500) + 100}</td></tr>
          <tr><td>EXP:</td><td>99,999 🌟</td></tr>
          <tr><td>Pro Index:</td><td>Level ${Math.floor(Math.random() * 50) + 10}</td></tr>
        </table>
        <div style="margin-top: 15px; font-size: 0.9em; font-family: Arial; color: black;">
          <strong>Interests / Sở thích:</strong><br>
          Đi bay 🚀, Kẹo ke 🍬, Vinahouse xập xình 🎶<br>
          <span class="english-sub">[Partying/using 🚀, Molly/Ket 🍬, Loud Vinahouse music 🎶]</span>
        </div>
      </div>
    `;
  }

  const drugImages = [
    "edited-media/COMM2754-2026-S2-A3w12-Amigos4-element1.png",
    "edited-media/COMM2754-2026-S2-A3w12-Amigos4-element2.png",
    "edited-media/COMM2754-2026-S2-A3w12-Amigos4-element3.png",
  ];
  const randomDrugImage =
    drugImages[Math.floor(Math.random() * drugImages.length)];

  const postTemplates = [
    {
      date: "14/06/2009 - 02:14 AM",
      text: "H0m n4y b4y qu4' 43 3j... L3n lu0n 🚀",
      sub: "[Today I'm so high bros... Let's go 🚀]",
      hasImage: false,
      isInteractive: false,
      isCrashInteractive: false,
      comments: [
        {
          name: "b0y_s4d",
          text: "ch0 3m th3o daika v0i!!! 🤤",
          sub: "[Let me tag along big bro!!! 🤤]",
        },
      ],
    },
    {
      date: "22/08/2009 - 04:30 AM",
      text: "K0 b4y k0 v3^`... s4p ngu0n r0i 💊",
      sub: "[Not going home unless I'm high... crashing now 💊]",
      hasImage: false,
      isInteractive: false,
      isCrashInteractive: true,
      comments: [
        {
          name: "pRinC3ss",
          text: "l3n d0\` di 4nh 3i 🔥",
          sub: "[Get dressed/ready to roll bro 🔥]",
        },
        {
          name: "You",
          text: "...ông lại dùng nữa à? Lên mạng nhắn tôi đi, dạo này ông ổn không?",
          sub: "[...are you using again? Get online and message me, are you okay lately?]",
          isContrast: true,
        },
      ],
    },
    {
      date: "10/10/2009 - 15:20 PM",
      text: "Id0l m0i n0i b1. b4t' v1\\` ch0i m4 tuY', b0i v4y. 4nh 3m ch0i l3n' th0i s40 l4i ch0i c0ng kh4i =)))",
      sub: "[Newly rising idol got arrested for doing drugs, that's why you gotta do it secretly bros, why do it in public =)))]",
      hasImage: false,
      isInteractive: true,
      isCrashInteractive: false,
      comments: [
        {
          name: "d4rk_k1ng",
          text: "qu4' non =)))",
          sub: "[Too green/noob =)))]",
        },
        {
          name: "You",
          text: "Nghiện ngập tàn phá cuộc đời họ đấy, đừng đùa giỡn nữa.",
          sub: "[Addiction destroys their lives, stop joking around.]",
          isContrast: true,
        },
      ],
    },
  ];

  postTemplates.sort(() => 0.5 - Math.random());
  let feedHTML = "";
  let allCommentsPool = [];

  postTemplates.forEach((post) => {
    let commentsHTML = "";
    post.comments.forEach((c) => {
      const contrastClass = c.isContrast ? "contrast-comment" : "";
      const commenterName = c.isContrast ? "You" : c.name;
      commentsHTML += `
        <div class="retro-comment-item ${contrastClass}">
          <strong>${commenterName}:</strong>
          <span class="teencode-text" style="font-size:0.95em;">${c.text}</span>
          <span class="english-sub">${c.sub}</span>
        </div>
      `;
      allCommentsPool.push({ name: commenterName, text: c.text });
    });

    const imageHTML = post.hasImage
      ? `<div class="drug-image-container"><img src="${post.imgSrc || randomDrugImage}" alt="Partying" onerror="this.style.display='none'"></div>`
      : "";
    const crashHTML = post.isCrashInteractive
      ? `<div style="background: black; border: 2px solid #ff00ff; margin: 15px 0;"><div id="interactive-crash-canvas" style="width:100%; height:250px; position:relative;"></div><div style="text-align:center; color:#ff00ff; font-size:0.8em; margin-bottom:5px;">(Move cursor to experience the crash)</div></div>`
      : "";
    const interactiveHTML = post.isInteractive
      ? `<div style="background: black; border: 3px dashed #ff00ff; padding: 5px; margin: 15px 0;"><marquee scrollamount="5" style="color:#00ffff; font-weight:bold; font-family:'Times New Roman', serif;">!!! H0T N3WS !!! b4y l4c. bi. bat' !!! [HOT NEWS: Got caught high!] !!!</marquee><div id="interactive-post-canvas" style="width:100%; height:300px; position:relative;"></div><div style="text-align:center; color:#ff00ff; font-size:0.8em; margin-top:5px;">(Hover to scratch and reveal the person)</div></div>`
      : "";

    feedHTML += `
      <div class="random-post">
        <div class="random-post-date">${post.date}</div>
        <p class="teencode-text">${post.text}</p>
        <span class="english-sub">${post.sub}</span>
        ${imageHTML} ${crashHTML} ${interactiveHTML}
        <div class="retro-comments"><strong style="margin-bottom:8px; display:block; font-family:Arial; color:black;">Comments:</strong>${commentsHTML}</div>
      </div>
    `;
  });

  feedHTML += `<div class="punchline">“You saw the addiction.<br />Did you see the person?”</div>`;
  const feedElement = document.getElementById("dynamic-blog-feed");
  if (feedElement) feedElement.innerHTML = feedHTML;

  if (document.getElementById("interactive-crash-canvas")) {
    new p5(interactiveCrashSketch);
  }
  if (document.getElementById("interactive-post-canvas")) {
    new p5(interactivePostSketch);
  }
  const marquee = document.getElementById("marquee-comments");
  if (marquee && allCommentsPool.length > 0) {
    allCommentsPool.sort(() => 0.5 - Math.random());
    marquee.innerHTML = allCommentsPool
      .map(
        (c) =>
          `<p class="marquee-comment-item"><span class="marquee-comment-name">${c.name}:</span> ${c.text}</p>`,
      )
      .join("");
  }

  const keywordContainer = document.getElementById("random-keywords-container");
  const searchInput = document.querySelector(".search-box input");
  if (keywordContainer && searchInput) {
    const searchKeywords = [
      "Tobacco impact VN",
      "Substance abuse data",
      "Synthetic drugs effects",
      "Rehab center near me",
      "Mental health support 111",
    ];
    searchKeywords.sort(() => 0.5 - Math.random());
    keywordContainer.innerHTML = searchKeywords
      .slice(0, 3)
      .map((kw) => `<div class="keyword-link">► ${kw}</div>`)
      .join("");
    document.querySelectorAll(".keyword-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        searchInput.value = e.target.innerText.replace("► ", "");
        searchInput.focus();
      });
    });
  }

  // NOTE: Removed old promo ad logic here because your new sketchUI.js Rotator handles it!
}
