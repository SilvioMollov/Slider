import "./style.css";
import "./../node_modules/@fortawesome/fontawesome-free/css/all.css";

class MySlider {
  constructor(selector = ".s-slider", config = defaultConfig) {
    this.container = document.querySelector(selector);

    this.config = config;
    this.mergeConf = { ...MySlider.defaultConfig, ...this.config };
    console.log(this.mergeConf);
    this.load();
  }

  load = () => {
    this.track = document.createElement("div");
    this.container.childNodes.forEach((slide) => {
      if (slide.nodeType === 1) {
        slide.classList.add("slide");
        this.track.appendChild(slide);
      }
    });

    this.track.classList = "carousel-track";
    this.container.innerHTML = "";
    this.container.appendChild(this.track);
    this.allowSlide = true;
    this.slides = this.track.childNodes;

    this.slideSize = -this.slides[0].clientWidth;
    this.boundary = (this.slideSize / 100) * 40;
    this.slidesCount = this.slides.length;
    this.counter = 0;
    this.allowSlide = true;
    this.allowDrag = true;
    this.configuration();

    this.cloneFirstAndLast();
    this.track.addEventListener("transitionend", this.indexCheck);
    window.addEventListener("resize", this.resizing);
    this.widthCalc(this.slides)
  };

  static defaultConfig = {
    autoplay: true,
    autoplayTrans: 2000,
    arrowsShow: true,
    arrowsChange: true,
    transition: 2000,
    infinite: true,
    slide: false,
  };

  configuration = () => {
    this.config.autoplay && this.autoPlay(this.config.autoplayTrans);
    this.config.arrowsShow && this.toggleArrows();
    this.config.arrowsChange && this.arrowKeySlide();
    this.config.slide && this.dragSlide();
    !this.config.infinite && this.leftArrow.classList.add("toggleLeftArrow");
    
  };

  resizing = () => {
    this.slides = this.track.childNodes
    this.slideSize = -this.slides[0].clientWidth;
    
    this.posInitialPre = this.track.offsetLeft
    this.boundary = (this.slideSize / 100) * 40;
    console.log(this.boundary)

    // this.track.style.left = this.slideSize * this.counter + "px";
    console.log()
    console.log("resizing", this.slideSize, this.track.clientWidth, this.counter);
  }; 

  sumFun = (a , b) =>{
    return a + b
  }

  widthCalc = (arg) => {
    let total = 0;
    arg.forEach(slide => {
      total += slide.clientWidth
    })
    console.log(total)
    this.track.style.width = `${total}px`
  }

  // centerPos = (pos) => {
    
  // }

  autoPlay = (delay) => {
    setInterval(() => {
      this.slidingOn("right");
    }, delay);
  };

  slidingOn = (direction, action) => {
    this.changeTime(this.config.transition / 1000);
    if (this.allowSlide) {
      if (!action) {
    
        this.posInitial = this.track.offsetLeft;
    
      }

      const lastSlide =
        this.counter === this.slidesCount - 1 && !this.config.infinite;
      const firstSlide = this.counter <= 0 && !this.config.infinite;

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
      
      console.log( "slidnig ", this.posInitial)
    }
  };

  toggleArrows = () => {
    console.log("im in");
    this.leftArrow = document.createElement("i");
    this.leftArrow.className = "fas fa-chevron-left";
    this.leftArrow.id = "arrow-left";
    this.container.appendChild(this.leftArrow);

    this.prevButton = document.getElementById("arrow-left");
    this.prevButton.addEventListener("click", () => {
      this.slidingOn("left");
    });

    this.rightArrow = document.createElement("i");
    this.rightArrow.className = "fas fa-chevron-right";
    this.rightArrow.id = "arrow-right";
    this.container.appendChild(this.rightArrow);

    this.nextButton = document.getElementById("arrow-right");
    this.nextButton.addEventListener("click", () => {
      this.slidingOn("right");
    });
  };

  indexCheck = () => {
    console.log("end trans");
    this.track.style.transition = "";
    if (!this.config.infinite && this.config.arrowsShow) {
      this.rightArrow.classList.remove("toggleRightArrow");
      this.leftArrow.classList.remove("toggleLeftArrow");
    }

    // console.log(rightArrow);
    if (this.counter >= this.slidesCount) {
      this.track.style.left = this.slideSize + "px";
      this.counter = 0;
    } else if (this.counter < 0) {
      this.track.style.left = this.slidesCount * this.slideSize + "px";
      this.counter = this.slidesCount - 1;
    }

    if (!this.config.infinite && this.config.arrowsShow) {
      if (this.counter === this.slidesCount - 1) {
        this.rightArrow.classList.add("toggleRightArrow");
      } else if (this.counter <= 0) {
        this.leftArrow.classList.add("toggleLeftArrow");
      }
    }
    this.allowSlide = true;
    this.allowDrag = true;
  };

  cloneFirstAndLast = () => {
    const firstImg = this.track.firstElementChild.cloneNode();
    const lastImg = this.track.lastElementChild.cloneNode();
    this.track.appendChild(firstImg);
    this.track.insertAdjacentElement("afterbegin", lastImg);
  };

  changeTime = (time) => {
    this.track.style.transition = `left ${time}s ease-in-out`;
  };

  dragSlide = () => {
    this.track.addEventListener("mousedown", this.startDrag);
    this.track.addEventListener("touchstart", this.startDrag);
  };

  startDrag = (e) => {
    e.preventDefault();
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
    const boundaryLeft = this.container.getBoundingClientRect().left;
    const boundaryRight =
      boundaryLeft + this.container.getBoundingClientRect().width;

    if (e.type === "touchmove") {
      this.mouseDirectionX = this.prevMousePositionX - e.touches[0].clientX;
      this.prevMousePositionX = e.touches[0].clientX;

      if (
        this.prevMousePositionX > boundaryRight ||
        this.prevMousePositionX < boundaryLeft
      ) {
        this.endDrag(e);
        return;
      }
    } else if (e.type === "mousemove") {
      this.mouseDirectionX = this.prevMousePositionX - e.clientX;
      this.prevMousePositionX = e.clientX;
    }

    const stopRight =
      this.counter === this.slidesCount - 1 &&
      !this.config.infinite &&
      this.mouseDirectionX >= 0;

    const stopLeft =
      this.counter === 0 && !this.config.infinite && this.mouseDirectionX < 0;

    if (stopRight || stopLeft) {
      this.allowDrag = true;
      this.track.removeEventListener("touchmove", this.moveDrag);
      this.track.removeEventListener("touchend", this.endDrag);

      this.track.removeEventListener("mousemove", this.moveDrag);
      this.track.removeEventListener("mouseup", this.endDrag);
      this.track.removeEventListener("mouseout", this.endDrag);
    } else {
      this.track.style.left =
        this.track.offsetLeft - this.mouseDirectionX + "px";
    }
  };

  endDrag = (e) => {
    let { posInitial, posFinal, track, mouseDirectionX } = this;

    posFinal = track.offsetLeft;

    if (posFinal === posInitial) {
      this.allowDrag = true;
    }

    console.log(posFinal - posInitial, this.boundary);

    if (e.type === "touchend" || e.type === "touchmove") {
      if (posFinal - posInitial < this.boundary) {
        this.slidingOn("right", "drag");
      } else if (posFinal - posInitial > -this.boundary) {
        this.slidingOn("left", "drag");
      } else {
        this.changeTime(this.config.transition / 1000);
        track.style.left = posInitial + "px";
      }
    } else if (e.type === "mouseup" || e.type === "mouseout") {
      if (posFinal - posInitial < this.boundary) {
        this.slidingOn("right", "drag");
      } else if (posFinal - posInitial > -this.boundary) {
        this.slidingOn("left", "drag");
      } else {
        this.changeTime(this.config.transition / 1000);
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

let s = new MySlider(".s-slider", {
  slide: false,
  infinite: true,
  autoplay: false,
  arrowsShow: true,
  arrowsChange: true,
  transition: 1000,
});
