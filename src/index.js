import './style.css';
import './../node_modules/@fortawesome/fontawesome-free/css/all.css';

let container = document.querySelector('.s-slider'),
  track = document.createElement('div');

let slides;
let slidesCount;
let counter;
let slideSize;

const stringToBoolean = dataValue => dataValue === 'true';

window.onload = MySlider(track, container);

function MySlider(wrapper, container) {


  container.childNodes.forEach(slide => {
    if (slide.nodeType === 1) {
      slide.classList.add('slide');
      wrapper.appendChild(slide);
    }
  });

  wrapper.classList = 'carousel-track';
  container.innerHTML = '';
  container.appendChild(wrapper);

  slides = wrapper.childNodes;
  slideSize = -slides[0].clientWidth;
  slidesCount = slides.length;
  counter = 0;

  if (stringToBoolean(container.dataset.arrows)) {
    toggleArrows();
  }
  if (container.dataset.autoplay) {
    autoPlay(container.dataset.autoplay);
  }

  function toggleArrows() {
    let leftArrow = document.createElement('i');
    container.appendChild(leftArrow);
    leftArrow.className = 'fas fa-chevron-left';
    leftArrow.id = 'arrow-left';

    const prevButton = document.getElementById('arrow-left');
    prevButton.addEventListener('click', () => {
      slidingOn('left');
    });

    let rightArrow = document.createElement('i');
    container.appendChild(rightArrow);
    rightArrow.className = 'fas fa-chevron-right';
    rightArrow.id = 'arrow-right';

    const nextButton = document.getElementById('arrow-right');
    nextButton.addEventListener('click', () => {
      slidingOn('right');
    });
  }
  function autoPlay(delay) {
    setInterval(() => {
      slidingOn('right');
    }, delay);
  }

  function slidingOn(direction) {
    wrapper.style.transition = 'transform 0.4s ease-in-out';
    if (direction == 'right') {
      counter++;
      wrapper.style.transform = 'translateX(' + slideSize * counter + 'px';

      if (counter === slidesCount) {
        counter = slides.length - slidesCount;
        wrapper.style.transform = 'translateX(' + -slideSize * counter + 'px';
      }
    } else if (direction == 'left') {
      counter--;
      wrapper.style.transform = 'translateX(' + slideSize * counter + 'px';

      if (counter === -1) {
        counter = slides.length - 1;
        wrapper.style.transform = 'translateX(' + slideSize * counter + 'px';
      }
    }
  }
}

// creating a function that creates the arrow accepting an argument, based on which arrow we are setting
