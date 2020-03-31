import './style.css';
import './../node_modules/@fortawesome/fontawesome-free/css/all.css';

let container = document.querySelector('.s-slider'),
  track = document.createElement('div');

let slides;
let slidesCount;
let counter;
let slideSize, posInitial, posFinal, posX1, posX2;

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
  
  //placing it here before intilization of how much slides there are
  slidesCount = slides.length;

  counter = 0;
  posInitial, posFinal;

  // cloneFirstandLast();
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
      console.log('click');
      slidingOn('right');
    });
  }

  function autoPlay(delay) {
    setInterval(() => {
      slidingOn('right');
    }, delay);
  }

  wrapper.addEventListener('transitionend', indexCheck);

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
      console.log('touchstart', posX1, posInitial);
    }

    function moveDrag(e) {
      e = window.event;

      posX2 = posX1 - e.clientX;
      posX1 = e.clientX;

      // console.log('position move', posX2, posX1);

      // wrapper.style.transform = 'translateX(' + posX1 + 'px';

      wrapper.style.left = wrapper.offsetLeft - posX2 + 'px';
      // console.log('position move',posX1, e.clientX, posX2);
      console.log('position move', wrapper.offsetLeft, posX2, posX1);
    }

    function endDrag(e) {
      posFinal = wrapper.offsetLeft;

      if (posX2 >= 1) {
        slidingOn('right', 'drag');
        console.log('right', posFinal, posInitial, posX1);
      } else if (posX2 < 1) {
        slidingOn('left', 'drag');
        console.log('left', posFinal, posInitial, posX1);
      } else {
        wrapper.style.left = posInitial + 'px';
      }
      console.log('end', posFinal, posInitial);
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  function slidingOn(direction, action) {
    wrapper.classList.add('shifting');
    // wrapper.style.transition = 'left 0.4s ease-in-out'
    // wrapper.style.transition = 'left 0.4s ease-in-out';
    
      if (!action) {
        posInitial = wrapper.offsetLeft;
      }
      if (direction == 'right') {
        wrapper.style.left = posInitial - -slideSize + 'px';
        counter++;
        // wrapper.style.transform = 'translateX(' + slideSize * counter + 'px';
        // console.log(posInitial, slideSize);
      } else if (direction == 'left') {
        // wrapper.style.transform = 'translateX(' + slideSize * counter + 'px';
        wrapper.style.left = posInitial - slideSize + 'px';
        counter--;
        console.log('left', counter);
        console.log(slidesCount);
      }
    

    
  }

  function indexCheck() {
    wrapper.classList.remove('shifting');
    if (counter === slidesCount) {
      // counter = slides.length - slidesCount;
      // wrapper.style.transform = 'translateX(' + slideSize * counter + 'px';
      counter = 0;
      wrapper.style.left = -(1 * counter) + 'px';
    } else if (counter === -1) {
      // counter = slides.length - 1;
      // wrapper.style.transform = 'translateX(' + slideSize * counter + 'px';

      counter = slides.length - 1;
      wrapper.style.left = slidesCount * slideSize - slideSize + 'px';
      console.log('loger', slidesCount, slideSize);
    }
    
  }
}
