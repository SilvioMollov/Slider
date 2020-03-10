import "./style.css";
import "./../node_modules/@fortawesome/fontawesome-free/css/all.css";

let container;
let slides;
let slidesCount;
let counter;
let slideSize;
let track;

const stringToBoolean = dataValue => dataValue === "true";

function wrap() {
  container = document.querySelector(".s-slider");
  track = document.createElement("div");

  container.childNodes.forEach(slide => {
    if (slide.nodeType === 1) {
      slide.classList.add("slide");
      track.appendChild(slide);
    }
  });

  track.classList = "carousel-track";
  container.innerHTML = "";
  container.appendChild(track);
}

wrap();

function MySlider() {
 
  slides = track.childNodes;
  slideSize = -slides[0].clientWidth;
  slidesCount = slides.length;
  counter = 0;

  if (stringToBoolean(container.dataset.arrows)) {
    toggleArrows();
  }
  if (container.dataset.autoplay) {
    autoPlay(container.dataset.autoplay);
  }
}

MySlider();

// creating a function that creates the arrow accepting an argument, based on which arrow we are setting
function toggleArrows() {
  let leftArrow = document.createElement("i");
  container.appendChild(leftArrow);
  leftArrow.className = "fas fa-chevron-left";
  leftArrow.id = "arrow-left";

  const prevButton = document.getElementById("arrow-left");
  prevButton.addEventListener("click", () => {
    slidingOn("left");
  });

  let rightArrow = document.createElement("i");
  container.appendChild(rightArrow);
  rightArrow.className = "fas fa-chevron-right";
  rightArrow.id = "arrow-right";

  const nextButton = document.getElementById("arrow-right");
  nextButton.addEventListener("click", () => {
    slidingOn("right");
  });
}

function autoPlay(delay) {
  setInterval(() => {
    slidingOn("right");
  }, delay);
}

function slidingOn(direction) {
  track.style.transition = "transform 0.4s ease-in-out";
  if (direction == "right") {
    counter++;
    track.style.transform = "translateX(" + slideSize * counter + "px";
    

    if (counter === slidesCount) {
      counter = slides.length - slidesCount;
      track.style.transform = "translateX(" + -slideSize * counter + "px";
    }
  } else if (direction == "left") {
    counter--;
    track.style.transform = "translateX(" + slideSize * counter + "px";

    if (counter === -1) {
      counter = slides.length - 1;
      track.style.transform = "translateX(" + slideSize * counter + "px";
    }
  }
}
