import './style.css';
import './../node_modules/@fortawesome/fontawesome-free/css/all.css';

let container = document.querySelector('.s-slider'),
  track = document.createElement('div');

let slides;
let slidesCount;
let counter;
let slideSize, posInitial, posFinal, posX1, posX2, style;

let allowSlide = true;
let allowSlideRight = true;
let allowSlideLeft = true;

const stringToBoolean = (dataValue) => dataValue === 'true';

window.onload = MySlider(track, container);

function MySlider(wrapper, container) {
  container.childNodes.forEach((slide) => {
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
  let infinite = stringToBoolean(container.dataset.infinite);

  //placing it here before intilization of how much slides there are
  slidesCount = slides.length;

  counter = 0;
  posInitial, posFinal;

  cloneFirstandLast();
  creatingStyle();
  // cloning first and last element
  function cloneFirstandLast() {
    let firstImg = wrapper.firstElementChild.cloneNode();
    let lastImg = wrapper.lastElementChild.cloneNode();
    wrapper.appendChild(firstImg);
    wrapper.insertAdjacentElement('afterbegin', lastImg);
  }

  if (stringToBoolean(container.dataset.arrows)) {
    toggleArrows();
  }
  if (container.dataset.autoplay) {
    autoPlay(container.dataset.autoplay);
  }
  if (stringToBoolean(container.dataset.drag)) {
    dragSlide();
  }
  if (stringToBoolean(container.dataset.keychange)) {
    arrowKeySlide();
  }
  if (container.dataset.transition) {
    let timer = container.dataset.transition / 10000

    changeTime(timer)
  }

  function toggleArrows() {
    let leftArrow = document.createElement('i');
    leftArrow.className = 'fas fa-chevron-left';
    leftArrow.id = 'arrow-left';
    container.appendChild(leftArrow);

    const prevButton = document.getElementById('arrow-left');
    prevButton.addEventListener('click', () => {
      slidingOn('left');
    });

    let rightArrow = document.createElement('i');
    rightArrow.className = 'fas fa-chevron-right';
    rightArrow.id = 'arrow-right';
    container.appendChild(rightArrow);

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

  function dragSlide() {
    wrapper.onmousedown = startDrag;

    wrapper.addEventListener('touchstart', startDrag);
    wrapper.addEventListener('touchmove', moveDrag);
    wrapper.addEventListener('touchend', endDrag);

    function startDrag(e) {
      e = window.event;
      e.preventDefault();
      posInitial = wrapper.offsetLeft;

      posX1 = e.clientX;
      document.onmouseup = endDrag;
      document.onmousemove = moveDrag;
    }

    function moveDrag(e) {
      e = window.event;

      posX2 = posX1 - e.clientX;
      posX1 = e.clientX;

      wrapper.style.left = wrapper.offsetLeft - posX2 + 'px';
    }

    function endDrag(e) {
      posFinal = wrapper.offsetLeft;

      if (posX2 >= 1) {
        slidingOn('right', 'drag');
      } else if (posX2 < 1) {
        slidingOn('left', 'drag');
      } else {
        wrapper.style.left = posInitial + 'px';
      }

      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  function arrowKeySlide() {
    document.addEventListener(
      'keyup',
      (e) => {
        let keyUp = e.key;
        if (keyUp === 'ArrowLeft') {
          slidingOn('left');
        } else if (keyUp === 'ArrowRight') {
          slidingOn('right');
        }
      },
      false
    );
  }
  // creating the stylesheet for the class shifting
  
  
  function creatingStyle() {
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `.shifting {transition: left 0.4s ease-in-out; }`;
    document.getElementsByTagName('head')[0].appendChild(style);
  }

  function changeTime(time) {
    style.innerHTML = `.shifting {transition: left ${time}s ease-in-out; }`;
  }

  function slidingOn(direction, action) {
    
    wrapper.classList.add('shifting');

    if (allowSlide) {
      if (!action) {
        posInitial = wrapper.offsetLeft;
      }
      console.log(posInitial);
      if (direction === 'right' && allowSlideRight === true) {
        wrapper.style.left = posInitial - -slideSize + 'px';
        counter++;
      } else if (direction === 'left' && allowSlideLeft === true) {
        wrapper.style.left = posInitial - slideSize + 'px';
        counter--;
      }
    }
    allowSlideRight = true;
    allowSlideLeft = true;
    // allowSlide = false
    console.log(counter, slidesCount);
  }

  wrapper.addEventListener('transitionend', indexCheck);

  function indexCheck() {
    wrapper.classList.remove('shifting');
    if (infinite === true) {
      if (counter >= slidesCount) {
        wrapper.style.left = slideSize + 'px';
        counter = 0;
      } else if (counter < 0) {
        wrapper.style.left = slidesCount * slideSize + 'px';
        counter = slidesCount - 1;
      }
    } else {
      // Needs workkkkkkkkkkkk

      if (counter >= slidesCount - 1) {
        wrapper.style.left = slidesCount * slideSize + 'px';
        changeTime()
        allowSlideRight = false;
      } else if (counter <= 0) {
        allowSlideLeft = false;
      }
    }
    allowSlide = true;
  }
}
