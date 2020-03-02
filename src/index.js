import "./style.css";
import "./../node_modules/@fortawesome/fontawesome-free/css/all.css";
// import printMe from "./print.js";
// let theFirstChild = parentElement.firstChild;
let parentElement = document.querySelector(".carousel-container");
const sliderContainer = document.querySelector(".carousel-slide");
const sliderImages = document.querySelectorAll(".carousel-slide img");

let sliderImagesArr = Array.from(sliderImages)
console.log(sliderImagesArr)

let numImg = sliderImages.length;
console.log(numImg);

let counter = 0;
const imgSize = sliderImages[0].clientWidth;

function toggleArrows() {
  if (parentElement.dataset.arrows === "true") {
    function leftArrow() {
      let leftArrow = document.createElement("i");
      parentElement.appendChild(leftArrow);
      console.log(leftArrow);
      leftArrow.className = "fas fa-chevron-left";
      leftArrow.id = "arrow-left";

      const prevButton = document.getElementById("arrow-left");
      prevButton.addEventListener("click", () => {
        slideLeft();
        infinityToLast();
      });
    }

    leftArrow();

    function rightArrow() {
      console.log(parentElement);

      let rightArrow = document.createElement("i");
      parentElement.appendChild(rightArrow);
      console.log(rightArrow);
      rightArrow.className = "fas fa-chevron-right";
      rightArrow.id = "arrow-right";

      const nextButton = document.getElementById("arrow-right");
      nextButton.addEventListener("click", () => {
        console.log(" length " + sliderImages[counter]);

        slideRight();
        infinityToFirst();
      });
    }

    rightArrow();
  }
}

toggleArrows();

//size of the im
// sliderContainer.style.transform = 'translateX(' + (-imgSize) + 'px'

function autoPlay() {
    if (parentElement.dataset.autoplay === "true") {
      for (let i = 0; i < numImg - 1; i++) {
          setTimeout(() => {
            counter++;
            sliderContainer.style.transform = "translateX(" + -imgSize * counter + "px";
          }, 5000)
      }
       
    }
  
}

autoPlay();

function slideRight() {
  sliderContainer.style.transition = "transform 0.4s ease-in-out";
  counter++;
  sliderContainer.style.transform = "translateX(" + -imgSize * counter + "px";
  console.log(sliderContainer.style.transform);
  console.log(counter);
}

function slideLeft() {
  sliderContainer.style.transition = "transform 0.4s ease-in-out";
  counter--;
  sliderContainer.style.transform = "translateX(" + -imgSize * counter + "px";
  const transformStyle = sliderContainer.style.transform;
  const translateX = +transformStyle.replace(/[^\d.]/g, "");
  console.log(translateX);
  console.log(counter);
}

// function infinityToFirst() {
//   if (typeof sliderImages[counter] === "undefined") {
//     console.log(" length " + sliderImages.length);

//     counter = sliderImages.length - numImg;
//     sliderContainer.style.transform = "translateX(" + -imgSize * counter + "px";
//   }
// }

function infinityToFirst() {
  if (counter === numImg) {
    console.log("prev");

    counter = sliderImages.length - numImg;
    sliderContainer.style.transform = "translateX(" + -imgSize * counter + "px";
  }
}

function infinityToLast() {
  if (counter === -1) {
    console.log("prev");

    counter = sliderImages.length - 1;
    sliderContainer.style.transform = "translateX(" + -imgSize * counter + "px";
  }
}

// let theFirstChild = parentElement.firstChild;
