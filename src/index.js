import './style.css';
import './../node_modules/@fortawesome/fontawesome-free/css/all.css';

let container = document.querySelector('.s-slider'),
  track = document.createElement('div');

let slides;
let slidesCount;
let counter;
let slideSize, posInitial;

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
  slideSize = slides[0].clientWidth;
  //placing it here before intilization of how much slides there are

  // cloneFirstandLast()

  slidesCount = slides.length;
  let allowShift = true;
  counter = 0;
  let posInitial, posFinal;

  // cloning first and last element
  function cloneFirstandLast() {
    let firstImg = wrapper.firstElementChild.cloneNode();
    let lastImg = wrapper.lastElementChild.cloneNode();
    wrapper.appendChild(firstImg);
    wrapper.insertAdjacentElement('afterbegin', lastImg);
    firstImg.classList = 'slide firstSlide';
    lastImg.classList = 'slide lastSlide';
  }

  // wrapper.onmousedown = startDrag

  // wrapper.addEventListener('touchstart', (e) => {
  //   e = e || window.event
  //   e.preventDefault();
  //    posInitial = wrapper.offsetLeft

  // })

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
      console.log('click');
      slidingOn('right');
    });
  }
  function autoPlay(delay) {
    setInterval(() => {
      slidingOn('right');
    }, delay);
  }

  wrapper.addEventListener('transitionend', () => {
    indexCheck();
    
  });
  
  function indexCheck() {
    if (counter === slidesCount) {
      wrapper.classList.remove('shifting');
      counter = 0;
      wrapper.style.left = -(1 * counter) + 'px';

    } else if (counter === -1) {
      wrapper.classList.remove('shifting');
      counter = slides.length - 1 ;
      wrapper.style.left = -(slidesCount * slideSize - slideSize) + "px";
      console.log('loger',slidesCount, slideSize)
    }
  }

  function slidingOn(direction, action) {
    wrapper.classList.add('shifting');

    if (allowShift) {
      if (!action) {
        posInitial = wrapper.offsetLeft;
      }
      if (direction == 'right') {
        counter++;
        wrapper.style.left = posInitial - slideSize + 'px';
        console.log(posInitial, slideSize)
      } else if (direction == 'left') {
        counter--;
        wrapper.style.left = posInitial + slideSize + 'px';
        console.log("left",counter);
        console.log(slidesCount);
      }
    }
  }
}
