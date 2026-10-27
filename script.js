
/* ==========================================
   1. ENGAGEMENT DETAILS
   EDIT THESE VALUES FOR YOUR EVENT
========================================== */

const engagement = {
  groom: "Rohit",
  bride: "Sravani",

  groomParents: "Sri. Ramesh & Smt. Lakshmi",
  brideParents: "Sri. Suresh & Smt. Padma",

  // Month is zero-based:
  // 0 = January, 11 = December.
  // Set the actual engagement date and time.
  date: new Date(2026, 11, 20, 10, 30, 0),

  venue: "Sri Lakshmi Convention Hall",
  address: "Main Road, Kavali, Andhra Pradesh",

  // Replace this with your actual venue location.
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=Kavali+Andhra+Pradesh",

  durationHours: 2
};


/* ==========================================
   2. POPULATE INVITATION DETAILS
========================================== */

function setText(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}

function formatDate(date, options) {
  return new Intl.DateTimeFormat("en-IN", options).format(date);
}

function formatEventDate(date) {
  return formatDate(date, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function formatEventTime(date) {
  return formatDate(date, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
}

function populateEventCalendar(date) {
  setText("calendarMonth", formatDate(date, { month: "long" }));
  setText("calendarYear", String(date.getFullYear()));
  setText("heroDate", formatDate(date, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).replace(",", " ·"));

  const calendarDays = document.getElementById("calendarDays");

  if (!calendarDays) return;

  calendarDays.replaceChildren();
  calendarDays.setAttribute(
    "aria-label",
    `${formatDate(date, { month: "long" })} ${date.getFullYear()}`
  );
  setText("eventDate", formatEventDate(date));

  const firstWeekday = new Date(
    date.getFullYear(),
    date.getMonth(),
    1
  ).getDay();
  const daysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

  for (let blank = 0; blank < firstWeekday; blank++) {
    const emptyDay = document.createElement("span");
    emptyDay.className = "calendar-day is-empty";
    emptyDay.setAttribute("aria-hidden", "true");
    calendarDays.appendChild(emptyDay);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement("span");
    dayCell.className = "calendar-day";
    dayCell.setAttribute("role", "gridcell");
    dayCell.textContent = String(day);

    if (day === date.getDate()) {
      dayCell.classList.add("is-event-day");
      dayCell.setAttribute("aria-current", "date");
      dayCell.setAttribute(
        "aria-label",
        `Engagement date: ${formatEventDate(date)}`
      );

      const heart = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      heart.classList.add("heart-bg");
      heart.setAttribute("viewBox", "0 0 24 24");
      heart.setAttribute("aria-hidden", "true");

      const heartPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      heartPath.setAttribute(
        "d",
        "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      );
      heart.appendChild(heartPath);

      const dayNumber = document.createElement("span");
      dayNumber.textContent = String(day);
      dayCell.replaceChildren(heart, dayNumber);
    }

    calendarDays.appendChild(dayCell);
  }
}

function populateInvitation() {
  // Couple names
  setText("heroGroom", engagement.groom);
  setText("heroBride", engagement.bride);

  setText("familyGroom", engagement.groom);
  setText("familyBride", engagement.bride);

  setText("finalGroom", engagement.groom);
  setText("finalBride", engagement.bride);
  setText("scratchGroomName", engagement.groom);
  setText("scratchBrideName", engagement.bride);

  const groomScratchImage = document.getElementById("scratchGroomImage");
  const brideScratchImage = document.getElementById("scratchBrideImage");
  if (groomScratchImage) groomScratchImage.alt = `Portrait of ${engagement.groom}`;
  if (brideScratchImage) brideScratchImage.alt = `Portrait of ${engagement.bride}`;

  // Family details
  setText("groomParents", engagement.groomParents);
  setText("brideParents", engagement.brideParents);

  // Event details
  populateEventCalendar(engagement.date);
  setText("eventTime", formatEventTime(engagement.date));

  setText("venueName", engagement.venue);
  setText("venueAddress", engagement.address);

  const mapLink = document.getElementById("mapLink");

  if (mapLink) {
    mapLink.href = engagement.mapUrl;
  }

  document.title =
    `${engagement.groom} & ${engagement.bride} | Engagement Invitation`;
}

populateInvitation();

function initializeFamilyCarousels() {
  document.querySelectorAll(".family-carousel").forEach(carousel => {
    const track = carousel.querySelector(".family-carousel-track");
    const slides = Array.from(carousel.querySelectorAll(".family-slide"));
    const viewport = carousel.querySelector(".family-carousel-viewport");
    const indicators = Array.from(carousel.querySelectorAll(".carousel-indicator"));
    let currentSlide = 0;
    let pointerStartX = null;
    let pointerStartY = null;

    function showSlide(index) {
      const nextSlide = Math.max(0, Math.min(index, slides.length - 1));
      const activeElement = document.activeElement;

      if (nextSlide !== currentSlide && slides[currentSlide].contains(activeElement)) {
        viewport.focus({ preventScroll: true });
      }

      currentSlide = nextSlide;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;

      slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === currentSlide;
        slide.inert = !isActive;
        slide.setAttribute("aria-hidden", String(!isActive));
      });

      indicators.forEach((indicator, indicatorIndex) => {
        indicator.classList.toggle("is-active", indicatorIndex === currentSlide);
      });
    }

    viewport.addEventListener("pointerdown", event => {
      if (event.target.closest("button, canvas")) return;
      pointerStartX = event.clientX;
      pointerStartY = event.clientY;
    });

    viewport.addEventListener("pointerup", event => {
      if (pointerStartX === null || pointerStartY === null) return;
      const distanceX = event.clientX - pointerStartX;
      const distanceY = event.clientY - pointerStartY;
      pointerStartX = null;
      pointerStartY = null;

      if (Math.abs(distanceX) < 50 || Math.abs(distanceX) < Math.abs(distanceY) * 1.25) return;
      if (distanceX < 0) showSlide(1);
      else showSlide(0);
    });

    viewport.addEventListener("pointercancel", () => {
      pointerStartX = null;
      pointerStartY = null;
    });

    viewport.addEventListener("keydown", event => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      showSlide(event.key === "ArrowLeft" ? 1 : 0);
    });

    showSlide(0);
  });
}

initializeFamilyCarousels();

function initializeScratchCards() {
  document.querySelectorAll(".family-scratch-slide").forEach(card => {
    const canvas = card.querySelector(".scratch-overlay");
    const context = canvas.getContext("2d", { willReadFrequently: true });

    if (!context) {
      throw new Error("Unable to initialize the scratch-card canvas.");
    }

    let scratching = false;
    let moveCount = 0;

    function paintFoil() {
      if (card.classList.contains("is-revealed")) return;

      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(bounds.width * pixelRatio);
      canvas.height = Math.round(bounds.height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const gradient = context.createLinearGradient(0, 0, bounds.width, bounds.height);
      gradient.addColorStop(0, "#d2b875");
      gradient.addColorStop(0.48, "#f7e9bf");
      gradient.addColorStop(1, "#b99753");
      context.globalCompositeOperation = "source-over";
      context.fillStyle = gradient;
      context.fillRect(0, 0, bounds.width, bounds.height);

      context.fillStyle = "rgba(255, 255, 255, 0.22)";
      for (let y = 8; y < bounds.height; y += 18) {
        for (let x = 8; x < bounds.width; x += 18) {
          context.beginPath();
          context.arc(x, y, 1, 0, Math.PI * 2);
          context.fill();
        }
      }

      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillStyle = "#65451f";
      context.font = "24px Georgia, serif";
      context.fillText("✦", bounds.width / 2, bounds.height / 2 - 25);
      context.font = "600 12px Arial, sans-serif";
      context.fillText("SCRATCH TO REVEAL", bounds.width / 2, bounds.height / 2 + 4);
      context.font = "11px Arial, sans-serif";
      context.fillText("A portrait awaits", bounds.width / 2, bounds.height / 2 + 25);
    }

    function revealPortrait() {
      card.classList.add("is-revealed");
      canvas.style.pointerEvents = "none";
    }

    function getCanvasPoint(event) {
      const bounds = canvas.getBoundingClientRect();
      return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    }

    function scratchAt(point) {
      context.globalCompositeOperation = "destination-out";
      context.beginPath();
      context.arc(point.x, point.y, 18, 0, Math.PI * 2);
      context.fill();
    }

    function checkScratchProgress() {
      moveCount += 1;
      if (moveCount % 4 !== 0) return;

      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let transparent = 0;
      let sampled = 0;

      for (let alphaIndex = 3; alphaIndex < pixels.length; alphaIndex += 32) {
        if (pixels[alphaIndex] < 40) transparent += 1;
        sampled += 1;
      }

      if (transparent / sampled >= 0.1) revealPortrait();
    }

    canvas.addEventListener("pointerdown", event => {
      event.preventDefault();
      scratching = true;
      canvas.setPointerCapture(event.pointerId);
      scratchAt(getCanvasPoint(event));
    });

    canvas.addEventListener("pointermove", event => {
      if (!scratching || card.classList.contains("is-revealed")) return;
      scratchAt(getCanvasPoint(event));
      checkScratchProgress();
    });

    canvas.addEventListener("pointerup", () => {
      scratching = false;
    });
    canvas.addEventListener("pointercancel", () => {
      scratching = false;
    });
    const resizeObserver = new ResizeObserver(paintFoil);
    resizeObserver.observe(canvas.parentElement);
    paintFoil();
  });
}

initializeScratchCards();

/* ==========================================
   3. CREATE FLOATING GOLD PARTICLES
========================================== */

function createParticles() {
  const container = document.getElementById("particles");

  if (!container) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const particleCount = reducedMotion ? 0 : 35;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("span");

    particle.className = "particle";

    const size = 2 + Math.random() * 4;
    const duration = 6 + Math.random() * 8;
    const delay = Math.random() * 10;

    particle.style.left = `${Math.random() * 100}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;

    container.appendChild(particle);
  }
}

createParticles();


/* ==========================================
   4. ENVELOPE OPENING EXPERIENCE
========================================== */

const introScreen = document.getElementById("introScreen");
const envelope = document.getElementById("envelope");
const openButton = document.getElementById("openInvitation");
const invitation = document.getElementById("invitation");

let invitationOpened = false;

openButton.addEventListener("click", () => {
  if (invitationOpened) return;

  invitationOpened = true;
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });

  openButton.disabled = true;
  openButton.textContent = "Opening your invitation...";

  envelope.classList.add("opened");
  introScreen.classList.add("is-opening");

  const handsTransition = document.getElementById("divineHandsTransition");

  // Show the joined hands without a separate entrance animation.
  if (handsTransition) {
    window.setTimeout(() => {
      handsTransition.classList.add("is-joined");
      playHandsMeeting(handsTransition);
    }, 120);
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const submergeDuration = reducedMotion ? 0 : 600;

  // Let the joined hands hold, then submerge before revealing the invitation.
  window.setTimeout(() => {
    if (handsTransition) {
      handsTransition.classList.add("is-submerging");
    }

    window.setTimeout(() => {
      if (handsTransition) handsTransition.remove();

      introScreen.classList.add("is-hidden");

      window.setTimeout(() => {
        introScreen.remove();
        invitation.classList.add("is-visible");
        document.body.classList.add("invitation-opened");
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        observeSections();
      }, reducedMotion ? 0 : 600);
    }, submergeDuration);
  }, 3000);
});


/* ==========================================
   5. SCROLL-TRIGGERED SECTION ANIMATIONS
========================================== */

function observeSections() {
  const sections = document.querySelectorAll(".section-reveal");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    sections.forEach(section => {
      section.classList.add("is-revealed");
    });

    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  sections.forEach(section => {
    observer.observe(section);
  });
}


/* ==========================================
   6. LIVE COUNTDOWN TIMER
========================================== */

const countdownIds = [
  "days",
  "hours",
  "minutes",
  "seconds"
];

let countdownInterval = null;

function updateCountdown() {
  const now = Date.now();
  const target = engagement.date.getTime();
  const difference = target - now;

  const message = document.getElementById("countdownMessage");

  if (difference <= 0) {
    countdownIds.forEach(id => setText(id, "00"));

    if (message) {
      message.textContent =
        difference > -86400000
          ? "The auspicious day has arrived! Shubhamastu!"
          : "Thank you for being part of our celebration.";
    }

    if (countdownInterval !== null) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }

    return;
  }

  const days = Math.floor(
    difference / (1000 * 60 * 60 * 24)
  );

  const hours = Math.floor(
    (difference / (1000 * 60 * 60)) % 24
  );

  const minutes = Math.floor(
    (difference / (1000 * 60)) % 60
  );

  const seconds = Math.floor(
    (difference / 1000) % 60
  );

  setText("days", String(days).padStart(2, "0"));
  setText("hours", String(hours).padStart(2, "0"));
  setText("minutes", String(minutes).padStart(2, "0"));
  setText("seconds", String(seconds).padStart(2, "0"));

  if (message) {
    message.textContent =
      "Every second brings us closer to a beautiful beginning.";
  }
}

updateCountdown();
countdownInterval = setInterval(updateCountdown, 1000);


/* ==========================================
   7. GOOGLE CALENDAR INTEGRATION
========================================== */

// Format local date/time without accidentally shifting
// the event to a different date through UTC conversion.
function toGoogleCalendarDate(date) {
  const pad = value => String(value).padStart(2, "0");

  return (
    date.getFullYear() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
}

document.getElementById("calendarButton").addEventListener(
  "click",
  () => {
    const start = engagement.date;

    const end = new Date(
      start.getTime() +
      engagement.durationHours * 60 * 60 * 1000
    );

    const title =
      `Engagement Ceremony - ${engagement.groom} & ${engagement.bride}`;

    const details =
      `You are invited to celebrate the engagement of ` +
      `${engagement.groom} and ${engagement.bride}. ` +
      `We look forward to your presence and blessings.`;

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: title,
      dates:
        `${toGoogleCalendarDate(start)}/` +
        `${toGoogleCalendarDate(end)}`,
      details,
      location: `${engagement.venue}, ${engagement.address}`
    });

    const calendarUrl =
      `https://calendar.google.com/calendar/render?${params}`;

    window.open(
      calendarUrl,
      "_blank",
      "noopener,noreferrer"
    );
  }
);


/* ==========================================
   8. SHARE INVITATION
========================================== */

function getShareText() {
  return (
    `💐 ENGAGEMENT INVITATION 💐\n\n` +
    `With the blessings of God and our elders,\n` +
    `we invite you to celebrate the engagement of\n\n` +
    `${engagement.groom} & ${engagement.bride}\n\n` +
    `📅 ${formatEventDate(engagement.date)}\n` +
    `🪔 Muhurtham: ${formatEventTime(engagement.date)}\n` +
    `📍 ${engagement.venue}\n` +
    `${engagement.address}\n\n` +
    `Your presence and blessings mean everything to us. 🙏`
  );
}

document.getElementById("shareButton").addEventListener(
  "click",
  async () => {
    const shareText = getShareText();

    if (navigator.share) {
      try {
        await navigator.share({
          title:
            `${engagement.groom} & ${engagement.bride} - Engagement`,
          text: shareText,
          url: window.location.href
        });

        return;
      } catch (error) {
        // Sharing can be cancelled by the guest.
        if (error.name === "AbortError") return;

        console.error("Native sharing failed:", error);
      }
    }

    // Fallback for browsers without native sharing.
    try {
      await navigator.clipboard.writeText(
        shareText + "\n\n" + window.location.href
      );

      alert(
        "Invitation details copied! You can now share them."
      );
    } catch {
      window.prompt(
        "Copy the invitation details below:",
        shareText + "\n\n" + window.location.href
      );
    }
  }
);


/* ==========================================
   9. PRINT / SAVE AS PDF
========================================== */

document.getElementById("printButton").addEventListener(
  "click",
  () => {
    window.print();
  }
);


/* ==========================================
   10. BACKGROUND MUSIC CONTROL
========================================== */

const musicButton = document.getElementById("musicButton");
const musicIcon = document.getElementById("musicIcon");
const backgroundMusic = document.getElementById("backgroundMusic");

let musicPlaying = false;

musicButton.addEventListener("click", async () => {
  if (!musicPlaying) {
    try {
      await backgroundMusic.play();

      musicPlaying = true;

      musicButton.classList.add("is-playing");
      musicButton.setAttribute("aria-pressed", "true");
      musicButton.setAttribute(
        "aria-label",
        "Pause background music"
      );

      musicIcon.textContent = "♫";
    } catch (error) {
      console.error("Music playback failed:", error);

      alert(
        "Add a valid music.mp3 file to the project folder, then try again."
      );
    }
  } else {
    backgroundMusic.pause();

    musicPlaying = false;

    musicButton.classList.remove("is-playing");
    musicButton.setAttribute("aria-pressed", "false");
    musicButton.setAttribute(
      "aria-label",
      "Play background music"
    );

    musicIcon.textContent = "♫";
  }
});


/* ==========================================
   11. HANDLE MUSIC ENDING OR ERRORS
========================================== */

backgroundMusic.addEventListener("error", () => {
  musicPlaying = false;

  musicButton.classList.remove("is-playing");
  musicButton.setAttribute("aria-pressed", "false");
});


/* ==========================================
   12. PAGE INITIALIZATION
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  // The opening screen remains visible until
  // the guest presses the Open Invitation button.
  document.body.classList.remove("invitation-opened");
});


/* ==========================================
   13. JOINED HANDS REVEAL (OPENING TRANSITION)
   0.1s  joined hands appear
   halo, ripples, sparks, Om flash, and caption play around the still image
   4.5s  the invitation is revealed
========================================== */

function playHandsMeeting(overlay) {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  overlay.classList.add("is-clasped");

  if (!reducedMotion) launchHandsSparks();
}

function launchHandsSparks() {
  const box = document.getElementById("dhSparks");

  if (!box) return;

  for (let i = 0; i < 30; i++) {
    const spark = document.createElement("span");
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 160;
    const size = 3 + Math.random() * 5;

    spark.className = "dh-spark";
    spark.style.width = `${size}px`;
    spark.style.height = `${size}px`;
    spark.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    spark.style.setProperty(
      "--dy",
      `${Math.sin(angle) * distance * 0.7 - 25}px`
    );
    spark.style.setProperty("--dur", `${1.5 + Math.random() * 1.5}s`);

    spark.addEventListener("animationend", () => spark.remove());
    box.appendChild(spark);
  }
}


/* ==========================================
   14. HERO SCENE LAYOUT
   Fits the artwork to the hero's width (so bells and leaves at the edges
   stay visible) and stretches only the plain wall in the middle.
========================================== */

function initHeroScene() {
  const hero = document.querySelector(".hero");
  const scene = document.getElementById("heroScene");

  if (!hero || !scene) return;

  const IMAGE_WIDTH = 736;
  const IMAGE_HEIGHT = 1104;

  const fit = () => {
    const width = hero.clientWidth;
    const height = hero.clientHeight;

    // Never taller than the hero, never wider than the hero.
    const unit = Math.min(width / IMAGE_WIDTH, height / IMAGE_HEIGHT);
    const sceneWidth = IMAGE_WIDTH * unit;

    scene.style.setProperty("--u", unit.toFixed(5));
    scene.style.width = `${sceneWidth}px`;
    scene.style.left = `${(width - sceneWidth) / 2}px`;
    scene.classList.toggle("is-boxed", width - sceneWidth > 2);
  };

  fit();

  if ("ResizeObserver" in window) {
    new ResizeObserver(fit).observe(hero);
  } else {
    window.addEventListener("resize", fit);
  }
}

initHeroScene();
