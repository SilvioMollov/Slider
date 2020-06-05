import "./style.css";
import "./../node_modules/@fortawesome/fontawesome-free/css/all.css";

class MySlider {
  constructor(container) {
    this.container = container;

    this.configurationData();

    this.mutationObserverMethod(this.container);

    console.log(MySlider.defaultConfig, this.userConfig);

    this.wrapEachChild();
    this.allowSlide = true;

    this.allowDrag = true;
    this.permissionsAndListeners();
    // this.updateOffset()
  }

  mutationObserverMethod = (target) => {
    const callback = (mutationsList, observer) => {
      // Use traditional 'for loops' for IE 11
      for (let mutation of mutationsList) {
        if (mutation.addedNodes[0] === this.track) {
          this.calcSlideWidth(this.track, this.container.clientWidth);
        }

        if (mutation.addedNodes[0]) {
          if (mutation.addedNodes[0].className === "slide firstClone") {
            // this.updateOffset();
          }
        }

        if (
          mutation.type === "attributes" &&
          mutation.target.className === "slide lastClone"
        ) {
          this.permissionsAndListeners();
          this.calcTrackWidth(this.track.childNodes, this.track);
          // this.slideSize = -mutation.target.clientWidt;
        }
      }
    };

    this.observer = new MutationObserver(callback);

    this.observer.observe(target, this.config);

    this.observer.takeRecords();
  };

  configurationData = () => {
    this.config = {
      attributes: true,
      childList: true,
      subtree: true,
      attributeOldValue: true,
      characterDataOldValue: true,
    };

    this.userConfig = {
      autoplay:
        this.container.dataset.autoplay === undefined
          ? MySlider.defaultConfig.autoplay
          : this.stringToBoolean(this.container.autoplay),
      autoplayTrans:
        this.container.dataset.autoplaytrans === undefined
          ? MySlider.defaultConfig.autoplayTrans
          : parseInt(this.container.dataset.autoplaytrans),
      arrowsShow:
        this.container.dataset.arrowsshow === undefined
          ? MySlider.defaultConfig.arrowsShow
          : this.stringToBoolean(this.container.dataset.arrowsshow),
      arrowsChange:
        this.container.dataset.arrowschange === undefined
          ? MySlider.defaultConfig.arrowsChange
          : this.stringToBoolean(this.container.dataset.arrowschange),
      transition:
        this.container.dataset.transition === undefined
          ? MySlider.defaultConfig.transition
          : parseInt(this.container.dataset.transition),
      infinite:
        this.container.dataset.infinite === undefined
          ? MySlider.defaultConfig.infinite
          : this.stringToBoolean(this.container.dataset.infinite),
      slide:
        this.container.dataset.slide === undefined
          ? MySlider.defaultConfig.slide
          : this.stringToBoolean(this.container.dataset.slide),
    };
  };

  stringToBoolean = (value) => value === "true";

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

    this.slides = this.track.childNodes;
    this.slidesCount = this.slides.length - 2;
    this.counter = 1;

    this.configurationSetter();
  };

  calcTrackWidth = (el, elWidth) => {
    let total = 0;
    el.forEach((slide) => {
      let p = slide.style.width;

      let pi = parseInt(p.replace("px", " "));

      total += pi;
    });

    elWidth.style.width = `${total}px`;
  };

  // updateOffset = () => {
  //   console.log(this.slideSize);
  // };

  calcSlideWidth = (el, width) => {
    el.childNodes.forEach((slide) => {
      slide.setAttribute("style", `width:${width}px`);
    });

    this.slideSize = -width;
    this.boundary = (this.slideSize / 100) * 40;
    this.track.style.left = this.slideSize * this.counter + "px";
  };

  cloneFirstAndLast = () => {
    const lastClone = this.track.firstElementChild.cloneNode(true);
    const firstClone = this.track.lastElementChild.cloneNode(true);
    this.track.appendChild(lastClone);
    lastClone.classList.add("lastClone");
    this.track.insertAdjacentElement("afterbegin", firstClone);
    firstClone.classList.add("firstClone");
  };

  permissionsAndListeners = () => {
    // this.slides = this.track.childNodes; //goes into WrapEach

    // this.slideSize = -this.slides[0].clientWidth; // goes in calcSlideWidth

    // this.boundary = (this.slideSize / 100) * 40; // goes in calcSlideWidth
    // this.slidesCount = this.slides.length - 2; // goes in WrapEach
    

    this.track.addEventListener("transitionend", this.indexCheck);
    window.addEventListener("resize",() => {
      setTimeout(this.updateWidth, 1)
    })

    // this.calcTrackWidth(this.track.childNodes, this.track);
  };

  configurationSetter = () => {
    this.userConfig.autoplay && this.autoPlay(this.userConfig.autoplayTrans);
    this.userConfig.arrowsShow && this.toggleArrows();
    this.userConfig.arrowsChange && this.arrowKeySlide();
    this.userConfig.slide && this.dragSlide();

    !this.userConfig.infinite &&
      this.userConfig.arrowsShow &&
      this.leftArrow.classList.add("toggleLeftArrow");
  };

  updateWidth = () => {
    this.calcSlideWidth(this.track, this.container.clientWidth);

    this.calcTrackWidth(this.track.childNodes, this.track);
    // this.updateOffset();
  };

  autoPlay = (delay) => {
    setInterval(() => {
      this.slidingOn("right");
    }, delay);
  };

  slidingOn = (direction, action) => {
    this.changeTime(this.userConfig.transition / 1000);
    console.log(this.allowSlide, "before Sliding");
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
      console.log(this.allowSlide, "SLIDING ON");
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
    console.log(this.allowSlide, "Before indexCheck");
    this.allowSlide = true;
    this.allowDrag = true;
    console.log(this.allowSlide, "After IndexCheck");
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

document.onload = createSliders();
