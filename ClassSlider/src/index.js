import "./style.css";
import "./../node_modules/@fortawesome/fontawesome-free/css/all.css";

class MySlider {
  constructor(container) {
    this.container = container;
    const config = { attributes: true, childList: true, subtree: true };

    const callback = function(mutationsList, observer) {
      // Use traditional 'for loops' for IE 11
      for(let mutation of mutationsList) {
        console.log(mutation)
          if (mutation.type === 'childList') {
              
              console.log('A child node has been added or removed.');
          }
          else if (mutation.type === 'attributes') {
              console.log('The ' + mutation.attributeName + ' attribute was modified.');
          }
      }
  };

  const observer = new MutationObserver(callback)

  observer.observe(this.container, config)
    
    this.userConfig = { 
      autoplay: this.container.dataset.autoplay === undefined ? MySlider.defaultConfig.autoplay : this.stringToBoolean(this.container.autoplay),
      autoplayTrans: this.container.dataset.autoplaytrans === undefined ? MySlider.defaultConfig.autoplayTrans : parseInt(this.container.dataset.autoplaytrans),
      arrowsShow: this.container.dataset.arrowsshow === undefined ? MySlider.defaultConfig.arrowsShow : this.stringToBoolean(this.container.dataset.arrowsshow),
      // arrowsShow: this.container.dataset.arrowsshow === undefined ? delete this.config.arrowsShow : this.stringToBoolean(this.container.arrowsshow),
      arrowsChange: this.container.dataset.arrowschange === undefined ? MySlider.defaultConfig.arrowsChange : this.stringToBoolean(this.container.dataset.arrowschange),
      transition: this.container.dataset.transition === undefined ? MySlider.defaultConfig.transition : parseInt(this.container.dataset.transition),
      infinite: this.container.dataset.infinite === undefined ? MySlider.defaultConfig.infinite : this.stringToBoolean(this.container.dataset.infinite),
      slide: this.container.dataset.slide === undefined ? MySlider.defaultConfig.slide : this.stringToBoolean(this.container.dataset.slide)
    };
    // this.cheker(this.config)

    // this.config = { ...MySlider.defaultConfig, ...this.config };
    console.log(MySlider.defaultConfig, this.userConfig);
    
    this.load();


  }


  // cheker=( from) => {
  //   for (let el in from) {
  //     console.log("before",el)
  //     if ( el === undefined) {
  //       delete from.el
  //     }
  //     console.log("after", el)
  //   }
  // }

  stringToBoolean = (value) => value === 'true' 

  static defaultConfig = {
    autoplay: true,
    autoplayTrans: 2000,
    arrowsShow: true,
    arrowsChange: true,
    transition: 2000,
    infinite: true,
    slide: false,
  };

  wrapEachChild = () => {
    this.track = document.createElement("div");

    // this.widthCalc();
    this.container.childNodes.forEach((slide) => {
      if (slide.nodeType === 1) {
        this.wrappedSlide = document.createElement("div");
        this.wrappedSlide.classList.add("slide");
        this.wrappedSlide.appendChild(slide);
        this.track.appendChild(this.wrappedSlide);
      }
    });

    this.track.classList = "carousel-track";
    this.container.innerHTML = "";
    this.container.appendChild(this.track);
    this.cloneFirstAndLast();

    // this.container.onloadend = this.calcSlideWidth(this.track, this.container.clientWidth);
    // this.track.onloadend = this.calcTrackWidth(this.track.childNodes, this.track);
    
    // setTimeout(() => {
    //   // this.calcSlideWidth(this.track, this.container.clientWidth);    
    // },1)
    

    setTimeout(() => {
      this.updateWidth()
      // this.calcTrackWidth(this.track.childNodes, this.track);
    },1)
  };

  calcTrackWidth = (el, elWidth) => {
    let total = 0;
    el.forEach((slide) => {
      let p = slide.style.width;
      
      let pi = parseInt(p.replace("px", " "))
      

      total += pi;
    });

    elWidth.style.width = `${total}px`;
    
  };

  calcSlideWidth = (el, width) => {
    el.childNodes.forEach((slide) => {

      slide.setAttribute("style", `width:${width}px`);
    });
    
  };

  cloneFirstAndLast = () => {
    const firstSlide = this.track.firstElementChild.cloneNode(true);
    const lastSlide = this.track.lastElementChild.cloneNode(true);
    this.track.appendChild(firstSlide);
    this.track.insertAdjacentElement("afterbegin", lastSlide);
  };

  // wrapAll = (nodes, wrapper) => {
  //   const parent = nodes[0].parentNode;
  //   let prevSibling = nodes[0].previousSibling;

  //   for (let i = 0; nodes.length - i; wrapper.firstChild === nodes[0] && i++) {
  //     wrapper.appendChild(nodes[i]);
  //   }
  //   let nextSibling = prevSibling ? prevSibling.nextSibling : parent.firstChild;
  //   parent.insertBefore(wrapper, nextSibling);

  //   return wrapper;
  // };

  load = () => {
    this.wrapEachChild();

    this.allowSlide = true;
    this.slides = this.track.childNodes;

    this.slideSize = -this.slides[0].clientWidth;
    
    this.boundary = (this.slideSize / 100) * 40;
    this.slidesCount = this.slides.length - 2;
    this.counter = 1;
    this.allowSlide = true;
    this.allowDrag = true;
    this.configuration();

    // this.imgWrap = document.createElement('div')
    // this.wrapAll(this.slides, this.imgWrap)
    this.track.addEventListener("transitionend", this.indexCheck);
    window.addEventListener("resize", this.updateWidth);


    


    
  };


  

  configuration = () => {
    this.userConfig.autoplay &&  this.autoPlay(this.userConfig.autoplayTrans);
    this.userConfig.arrowsShow && this.toggleArrows();
    this.userConfig.arrowsChange && this.arrowKeySlide();
    this.userConfig.slide && this.dragSlide();

    !this.userConfig.infinite && this.userConfig.arrowsShow && this.leftArrow.classList.add("toggleLeftArrow");
  };

  updateWidth = () => {
    

    
    this.calcSlideWidth(this.track, this.container.clientWidth);
    this.calcTrackWidth(this.track.childNodes, this.track);

    this.slides = this.track.childNodes;
    this.slideSize = -this.slides[0].clientWidth;

    this.posInitialPre = this.track.offsetLeft;
    this.boundary = (this.slideSize / 100) * 40;
    
    this.track.style.left = this.slideSize * this.counter + "px";
  };

  

  // centerPos = (pos) => {

  // }

  autoPlay = (delay) => {
    setInterval(() => {
      this.slidingOn("right");
    }, delay);
  };

  slidingOn = (direction, action) => {
    this.changeTime(this.userConfig.transition / 1000);
    if (this.allowSlide) {
      if (!action) {
        this.posInitial = this.track.offsetLeft;
      }

      const lastSlide =
        this.counter === this.slidesCount && !this.userConfig.infinite;
      const firstSlide = this.counter <= 1 && !this.userConfig.infinite;

      if (direction === "right" && !lastSlide) {
        this.track.style.left = this.posInitial - -this.slideSize + "px";
        this.counter++;
        this.allowSlide = false;
      } else if (direction === "left" && !firstSlide) {
        this.track.style.left = this.posInitial - this.slideSize + "px";
        this.counter--;
        this.allowSlide = false;
      }
      // const p = this.track.style.left
      // const pi = p.replace('px'," ")
      // const pa = parseInt(pi)

      // this.posFinal = pa

      // this.posFinal = this.posInitial + this.slideSize
    }
  };

  toggleArrows = () => {
    this.leftArrow = document.createElement("i");
    this.leftArrow.className = "fas fa-chevron-left";
    this.leftArrow.id = "arrow-left";
    this.container.appendChild(this.leftArrow);

    this.prevButton = this.container.querySelector("#arrow-left");

    this.prevButton.addEventListener("click", () => {
      this.slidingOn("left");
    });

    this.rightArrow = document.createElement("i");
    this.rightArrow.className = "fas fa-chevron-right";
    this.rightArrow.id = "arrow-right";
    this.container.appendChild(this.rightArrow);

    this.nextButton = this.container.querySelector("#arrow-right");

    this.nextButton.addEventListener("click", () => {
      this.slidingOn("right");
    });
  };

  indexCheck = () => {
    this.track.style.transition = "";
    if (!this.userConfig.infinite && this.userConfig.arrowsShow) {
      this.rightArrow.classList.remove("toggleRightArrow");
      this.leftArrow.classList.remove("toggleLeftArrow");
    }


    if (this.counter > this.slidesCount) {
      this.track.style.left = this.slideSize + "px";
      this.counter = 1;
    } else if (this.counter < 1) {
      this.track.style.left = this.slidesCount * this.slideSize + "px";
      this.counter = this.slidesCount;
    }

    if (!this.userConfig.infinite && this.userConfig.arrowsShow) {
      if (this.counter === this.slidesCount) {
        this.rightArrow.classList.add("toggleRightArrow");
      } else if (this.counter <= 1) {
        this.leftArrow.classList.add("toggleLeftArrow");
      }
    }

    this.allowSlide = true;
    this.allowDrag = true;
  };

  changeTime = (time) => {
    this.track.style.transition = `left ${time}s ease-in-out`;
  };

  dragSlide = () => {
    this.track.addEventListener("mousedown", this.startDrag);
    this.track.addEventListener("touchstart", this.startDrag);
  };

  startDrag = (e) => {
    // mousedown / touchstart events are triggering this function which later on sets the POSINITIAL property,
    // does an If verification and continues to check the type of the event and sets the PREVMOUSEPOSITIONx property.
    // and redirects to the next functions, which are MOVEdrag ENDdrag after that it changes the ALLOWDRAG property to true.
    e.preventDefault();

    this.akoSumMrudnal = false;

    this.posInitial = this.track.offsetLeft;

    if (this.allowDrag) {
      if (e.type === "touchstart") {
        this.prevMousePositionX = e.touches[0].clientX;
        this.track.addEventListener("touchmove", this.moveDrag);
        this.track.addEventListener("touchend", this.endDrag);
      } else {
        this.prevMousePositionX = e.clientX;
        this.track.addEventListener("mousemove", this.moveDrag);
        this.track.addEventListener("mouseup", this.endDrag);
        this.track.addEventListener("mouseout", this.endDrag);
      }
    }
    this.allowDrag = false;
  };

  moveDrag = (e) => {
    this.akoSumMrudnal = true;

    const boundaryLeft = this.container.getBoundingClientRect().left;
    const boundaryRight =
      boundaryLeft + this.container.getBoundingClientRect().width;

    let mouseDirectionX = null;

    if (e.type === "touchmove") {
      mouseDirectionX = this.prevMousePositionX - e.touches[0].clientX;
      this.prevMousePositionX = e.touches[0].clientX;

      if (
        this.prevMousePositionX > boundaryRight ||
        this.prevMousePositionX < boundaryLeft
      ) {
        this.endDrag(e);
        return;
      }
    } else if (e.type === "mousemove") {
      mouseDirectionX = this.prevMousePositionX - e.clientX;
      this.prevMousePositionX = e.clientX;
    }

    const stopRight =
      this.counter === this.slidesCount &&
      !this.userConfig.infinite &&
      mouseDirectionX >= 0;

    const stopLeft =
      this.counter === 1 && !this.userConfig.infinite && mouseDirectionX < 0;

    if (stopRight || stopLeft) {
      this.allowDrag = true;
      this.track.removeEventListener("touchmove", this.moveDrag);
      this.track.removeEventListener("touchend", this.endDrag);

      this.track.removeEventListener("mousemove", this.moveDrag);
      this.track.removeEventListener("mouseup", this.endDrag);
      this.track.removeEventListener("mouseout", this.endDrag);
    } else {
      this.track.style.left = `${this.track.offsetLeft - mouseDirectionX}px`;
    }
  };

  endDrag = (e) => {
    let { posInitial, posFinal, track, mouseDirectionX } = this;

    posFinal = track.offsetLeft;

    if (posFinal === posInitial) {
      this.allowDrag = true;
    }

    if (e.type === "touchend" || e.type === "touchmove") {
      if (posFinal - posInitial < this.boundary) {
        this.slidingOn("right", "drag");
      } else if (posFinal - posInitial > -this.boundary) {
        this.slidingOn("left", "drag");
      } else {
        this.changeTime(this.userConfig.transition / 1000);
        track.style.left = posInitial + "px";
      }
    } else if (e.type === "mouseup" || e.type === "mouseout") {
      if (posFinal - posInitial < this.boundary) {
        this.slidingOn("right", "drag");
      } else if (posFinal - posInitial > -this.boundary) {
        this.slidingOn("left", "drag");
      } else {
        if (this.akoSumMrudnal) {
          this.changeTime(this.userConfig.transition / 1000);
        }
        track.style.left = posInitial + "px";
      }
    }

    track.removeEventListener("touchmove", this.moveDrag);
    track.removeEventListener("touchend", this.endDrag);

    track.removeEventListener("mousemove", this.moveDrag);
    track.removeEventListener("mouseup", this.endDrag);
    track.removeEventListener("mouseout", this.endDrag);
  };

  arrowKeySlide = () => {
    document.addEventListener(
      "keyup",
      (e) => {
        this.keyUp = e.key;
        if (this.keyUp === "ArrowLeft") {
          this.slidingOn("left");
        } else if (this.keyUp === "ArrowRight") {
          this.slidingOn("right");
        }
      },
      false
    );
  };
}

// Custom slider
// let s = new MySlider(".s-slider", {
//   slide: true,
//   infinite: false,
//   autoplay: false,
//   arrowsShow: true,
//   arrowsChange: true,
//   transition: 1000,
// });

// Automatic
function createSliders() {
  document.querySelectorAll(".s-slider").forEach((el) => {
     new MySlider(el);
  });
}

createSliders();
