let circles = [];
let lightX = 0, lightY = 0; // Posición suavizada de la luz
let texts = ["hello", "i'm sandra", "welcome", "to my", "portfolio"]; // Textos en orden
let showMenu = false; // Estado para alternar entre la pantalla principal y el menú
let transitionProgress = 0; // Progreso de la transición
let transitioning = false; // Bandera para indicar si hay transición
let portfolioScale = 0; // Escala para la palabra "portfolio"
let menuScale = 0; // Escala para el menú
let imageOpacity = {}; // Opacidad para transición de imágenes

// Imágenes para el fondo del menú
let images = {};
let imageRotations = {}; // Rotaciones para las imágenes
let imageLoaded = false; // Bandera para verificar que las imágenes estén cargadas

function preload() {
  images["about me"] = loadImage("movimiento 5.png", imageLoadedCallback);
  images["projects"] = loadImage("brandbook- sandra alemay..jpg", imageLoadedCallback);
  images["skills"] = loadImage("Captura de pantalla 2024-12-03 a las 17.01.28.png", imageLoadedCallback);
  images["contact"] = loadImage("Captura de pantalla 2024-11-21 a las 13.25.11.png", imageLoadedCallback);
}

function imageLoadedCallback() {
  imageLoaded = true;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  let cols = 5;
  let rows = 5;
  let spacingX = width / cols;
  let spacingY = height / rows;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = spacingX * (i + 0.6);
      let y = spacingY * (j + 0.6);
      let r = spacingX * 0.7; // Ajustamos el tamaño del círculo
      let circle = { x, y, r };
      circles.push(circle);
    }
  }

  circles[0].text = texts[0];
  circles[11].text = texts[1];
  circles[7].text = texts[2];
  circles[18].text = texts[3];
  circles[4].text = texts[4];

  let menuOptions = ["about me", "projects", "skills", "contact"];
  menuOptions.forEach(option => {
    imageRotations[option] = random(-15, 15); // Rotaciones iniciales aleatorias
    imageOpacity[option] = 1; // Inicializar opacidad
  });
}

function draw() {
  if (!imageLoaded) {
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("Loading images...", width / 2, height / 2);
    return;
  }

  if (transitioning) {
    drawTransition();
  } else if (showMenu) {
    drawMenu();
  } else {
    drawMainScreen();
  }
}

function drawMainScreen() {
  background(10, 5, 20);

  lightX = lerp(lightX, mouseX, 0.1);
  lightY = lerp(lightY, mouseY, 0.1);

  drawLight(lightX, lightY, 700); // Escalar el tamaño del halo

  for (let c of circles) {
    drawInteractiveCircle(c, lightX, lightY);
  }
}

function drawMenu() {
  background(30);

  let menuOptions = ["about me", "projects", "skills", "contact"];
  let hoveredOption = null;

  for (let i = 0; i < menuOptions.length; i++) {
    let y = height / 2 - 200 + i * 100; // Ajustar separaciones entre opciones
    if (mouseY > y - 20 && mouseY < y + 20) {
      hoveredOption = menuOptions[i];
    }
  }

  menuScale = lerp(menuScale, 1, 0.2); // Escalado gradual del menú
  push();
  scale(menuScale);
  translate(width * (1 - menuScale) / 2, height * (1 - menuScale) / 2);

  menuOptions.forEach(option => {
    if (hoveredOption === option) {
      imageOpacity[option] = lerp(imageOpacity[option], 255, 0.1);
    } else {
      imageOpacity[option] = lerp(imageOpacity[option], 0, 0.1);
    }
  });

  menuOptions.forEach((option, i) => {
    let y = height / 2 - 200 + i * 100;

    push();
    let size = hoveredOption === option ? 1.2 : 2; // Aumentar tamaño al pasar el mouse
    translate(width / 2, y);
    rotate(radians(imageRotations[option]));
    scale(size);
    tint(255, imageOpacity[option]);
    if (images[option]) {
      imageMode(CENTER);
      image(images[option], 0, 0, 300, 300); // Aumentar tamaño de las imágenes
    }
    pop();
  });

  textAlign(CENTER, CENTER);
  textSize(60); // Ajustar el tamaño del texto
  fill(255);

  for (let i = 0; i < menuOptions.length; i++) {
    let y = height / 2 - 200 + i * 100;
    text(menuOptions[i], width / 2, y);
  }
  pop();
}

function drawLight(x, y, maxSize) {
  for (let i = maxSize; i > 0; i -= 40) { // Ajustar degradado del halo
    let alpha = map(i, maxSize, 0, 0, 80);
    fill(255, 230, 200, alpha);
    ellipse(x, y, i);
  }
}

function drawInteractiveCircle(circle, lightX, lightY) {
  let d = dist(lightX, lightY, circle.x, circle.y);

  let maxBrightness = 200;
  let brightness = map(d, 0, 600, maxBrightness, 0); // Ajustar rango de iluminación
  brightness = constrain(brightness, 0, maxBrightness);

  for (let i = circle.r * 2; i > 0; i -= 20) { // Ajustar densidad de los círculos
    let alpha = map(i, circle.r * 2, 0, 0, brightness);
    fill(255, 220, 200, alpha);
    ellipse(circle.x, circle.y, i);
  }

  fill(0);
  ellipse(circle.x, circle.y, circle.r * 0.9);

  if (circle.text && d < 300) { // Ajustar rango de detección para mostrar texto
    fill(255, 200, 150, brightness);
    textAlign(CENTER, CENTER);
    textSize(18); // Aumentar tamaño del texto
    text(circle.text, circle.x, circle.y);
  }
}

function drawTransition() {
  let progress = transitionProgress / 300; // Hacemos la transición más gradual (300 frames)

  if (progress < 0.5) {
    background(lerpColor(color(10, 5, 20), color(30), progress * 4));

    portfolioScale = lerp(0, 3, progress * 2); // Escalar la palabra gradualmente
    fill(255, 200, 150);
    textAlign(CENTER, CENTER);
    textSize(100 * portfolioScale); // Ajustar tamaño inicial
    text("portfolio", width / 2, height / 2);
  } else {
    background(30);
    menuScale = lerp(0, 1, (progress - 0.3) * 2); // Coordinado con la transición de "portfolio"
  }

  transitionProgress++;
  if (transitionProgress >= 300) {
    transitioning = false;
    showMenu = true;
    menuScale = 1; // Asegurar escala completa del menú
  }
}

function mousePressed() {
  if (showMenu) {
    return;
  }

  for (let circle of circles) {
    if (circle.text === "portfolio") {
      let d = dist(mouseX, mouseY, circle.x, circle.y);
      if (d < circle.r / 2) {
        transitioning = true;
        transitionProgress = 0;
        portfolioScale = 0; // Reiniciar escala
      }
    }
  }
}
