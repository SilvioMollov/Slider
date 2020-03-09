import "./style.css";
import "./../node_modules/@fortawesome/fontawesome-free/css/all.css";
// import printMe from "./print.js";
// let theFirstChild = parentElement.firstChild;
let sliderContainer;
let parentElement;
let sliderImages;
let numImg;
let counter;

// parentElement.id = "destination";
// sliderContainer.insertAdjacentElement("beforebegin", parentElement);
// parentElement.appendChild(sliderContainer);

// console.log(parentElement);
// parentElement.className = "carousel-container";
const stringToBoolean = dataValue => dataValue === "true";

function MySlider() {
  sliderContainer = document.querySelector(".carousel-slide");
  parentElement = document.createElement("div");
  sliderImages = document.querySelectorAll(".carousel-slide img");
  numImg = sliderImages.length;
  counter = 0;
  

  parentElement.id = "destination";
  sliderContainer.insertAdjacentElement("beforebegin", parentElement);
  parentElement.appendChild(sliderContainer);

  console.log(parentElement);

  parentElement.className = "carousel-container";
  if (stringToBoolean(sliderContainer.dataset.arrows)) {
    toggleArrows();
  }
  if (sliderContainer.dataset.autoplay) {
    autoPlay(sliderContainer.dataset.autoplay);
  }
}

MySlider();




const imgSize = -sliderImages[0].clientWidth;

function toggleArrows() {
  let leftArrow = document.createElement("i");
  parentElement.appendChild(leftArrow);
  leftArrow.className = "fas fa-chevron-left";
  leftArrow.id = "arrow-left";

  const prevButton = document.getElementById("arrow-left");
  prevButton.addEventListener("click", () => {
    slidingOn("left");
  });

  let rightArrow = document.createElement("i");
  parentElement.appendChild(rightArrow);
  rightArrow.className = "fas fa-chevron-right";
  rightArrow.id = "arrow-right";

  const nextButton = document.getElementById("arrow-right");
  nextButton.addEventListener("click", () => {
    slidingOn("right");
  });
}

// function slide(i) {
//   setTimeout(function() {
//     slidingOn("right");
//     infinityToFirst();

//     console.log("sliding..");
//   }, 2000 * i);
// }

function autoPlay(delay) {
  setInterval(() => {
    slidingOn("right");
  }, delay);
}

function slidingOn(count) {
  sliderContainer.style.transition = "transform 0.4s ease-in-out";
  if (count == "right") {
    counter++;
    sliderContainer.style.transform = "translateX(" + imgSize * counter + "px";
    console.log(counter);
    if (counter === numImg) {
      counter = sliderImages.length - numImg;
      sliderContainer.style.transform =
        "translateX(" + -imgSize * counter + "px";
    }
  } else if (count == "left") {
    counter--;
    sliderContainer.style.transform = "translateX(" + imgSize * counter + "px";
    if (counter === -1) {
      counter = sliderImages.length - 1;
      sliderContainer.style.transform =
        "translateX(" + imgSize * counter + "px";
    }
  }
}
