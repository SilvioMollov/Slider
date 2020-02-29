import "./style.css";
import './../node_modules/@fortawesome/fontawesome-free/css/all.css'
// import printMe from "./print.js";

const sliderContainer = document.querySelector(".carousel-slide");
const sliderImages = document.querySelectorAll(".carousel-slide img");

const prevButton = document.getElementById("arrow-left");
const nextButton = document.getElementById("arrow-right");

let numImg = sliderImages.length;
console.log(numImg)

let counter = 0;
const imgSize = sliderImages[0].clientWidth; //size of the im
// sliderContainer.style.transform = 'translateX(' + (-imgSize) + 'px'

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

console.log(nextButton);

nextButton.addEventListener("click", () => {
  console.log(" length " + sliderImages[counter]);

  slideRight();
  infinityToFirst();
});

prevButton.addEventListener("click", () => {
  slideLeft();
  infinityToLast();
});

// function infinityToFirst() {
//   if (typeof sliderImages[counter] === "undefined") {
//     console.log(" length " + sliderImages.length);

//     counter = sliderImages.length - numImg;
//     sliderContainer.style.transform = "translateX(" + -imgSize * counter + "px";
//   }
// }

function infinityToFirst() {
  if ( counter === numImg) {
    console.log('prev');

    counter = sliderImages.length - numImg;
    sliderContainer.style.transform = "translateX(" + -imgSize * counter + "px";
  }
}

function infinityToLast() {
  if ( counter === -1) {
    console.log('prev');

    counter = sliderImages.length - 1;
    sliderContainer.style.transform = "translateX(" + -imgSize * counter + "px";
  }
}