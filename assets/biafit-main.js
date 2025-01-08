/**
 * Manager
 */
class Manager {
  trackMobileMenu() {
    const menuBtn = document.getElementById('Details-menu-drawer-container');
    const header = document.querySelector('.header-wrapper header');
    const drawer = document.getElementById('menu-drawer'); 

    if (!menuBtn) {
      return;
    }
    
    const mutationObserver = new MutationObserver((mutationList) => {
      let isOpened = false;
      for (const item of mutationList) {
        if (item.attributeName === "class") {
          if (menuBtn.classList.contains('menu-opening')) {
            isOpened = true;
            break;
          } 
        }
      }

      header.style.backgroundColor = (isOpened ? '#fff' : '#ffe8ee');
      drawer.style.marginTop = (isOpened ? '-1px' : '0px');
    });
    mutationObserver.observe(menuBtn, { attributes: true });
  }

  scrollToSmoothly(pos, time) {
    var currentPos = window.scrollY;
    var start = null;
    if(time == null) time = 500;
    pos = +pos, time = +time;
    window.requestAnimationFrame(function step(currentTime) {
        start = !start ? currentTime : start;
        var progress = currentTime - start;
        if (currentPos < pos) {
            window.scrollTo(0, ((pos - currentPos) * progress / time) + currentPos);
        } else {
            window.scrollTo(0, currentPos - ((currentPos - pos) * progress / time));
        }
        if (progress < time) {
            window.requestAnimationFrame(step);
        } else {
            window.scrollTo(0, pos);
        }
    });
  }

  initHeaderLinks() {
    let headerLinks = {
      'HeaderMenu-about-biafit': 'about-app-section',
      'HeaderMenu-programs': 'programs-section',
      'HeaderMenu-testimonials': 'testimonials-section',
      'HeaderMenu-about-holly': 'about-holly-section',
      'HeaderMenu-recipe-library': 'recipe-library-section',
      'HeaderMenu-plans': 'membership-section',
      'HeaderMenu-contact-us': 'contact-section'
    };

    for (let linkId in headerLinks) {
      let href = document.getElementById(linkId);
      let targetEl = document.getElementById(headerLinks[linkId]);

      if (!href || !targetEl) {
        continue;
      }

      href.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        this.scrollToSmoothly(targetEl.offsetTop, 600);
        return false;
      });
    }
    
    const targetElement = document.getElementById('membership-section');
    if (!targetElement) {
      return;
    }
    let buttons = [
      document.getElementById('main-block-button'),
      document.querySelector('.header-button'),
      document.getElementById('about-app-button')
    ];

    buttons.forEach(el => {
      if (!el) {
        return;
      }
      el.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        this.scrollToSmoothly(targetElement.offsetTop, 600);
        return false;  
      });
    })
  }
}
const manager = new Manager();
manager.initHeaderLinks();
manager.trackMobileMenu();

/**
 * Slider customization
 */
class BiafitSlider {
  sliderConfig = {
    program: {
      offset: 415,
      originalWidth: '1842px',
      originalLeft: '0px',
      prev: {
        width: '1915px',
      },
      next: {
        width: '1915px',
        left: '-425px'
      },
    },
    blog: {
      offset: 330,
      originalWidth: '1328px',
      originalLeft: '0px',
      prev: {
        width: '1370px',
      },
      next: {
        width: '1370px',
        left: '-330px'
      },
    }
  };
  setupTimers() {
    const programsBtn = document.querySelector('.collection .slider-button--next');
    const blogBtn = document.querySelector('.blog .slider-button--next');

    if (programsBtn || blogBtn) {
      setInterval(() => {
        if (programsBtn) {
          programsBtn.dispatchEvent(new Event('click'));
        }
        if (blogBtn) {
          blogBtn.dispatchEvent(new Event('click'));
        }
      }, 15000);
    }
  }

  toggleProgramInfo(action) {
    const parentEl = action.parentElement;
    const openLink = parentEl.querySelector('.open');
    const closeLink = parentEl.querySelector('.close');
    const caption = parentEl.parentElement.parentElement.querySelector('.card-information .caption');
    
    if (action.classList.contains('open')) {
      openLink.style.display = 'none';
      closeLink.style.display = '';
      caption.style.height = 'auto';
    } else {
      openLink.style.display = '';
      closeLink.style.display = 'none';
      caption.style.height = '77px';
    }
  }

  lockClick() {
    let cards = document.querySelectorAll('.collection__cards > li');
    
    cards?.forEach(card => {
      let hrefs = card.querySelectorAll('a');
      
      hrefs.forEach(el => {
        if (el.classList.contains('open') || el.classList.contains('close')) {
          el.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleProgramInfo(e.target);
          })
        } else {
          el.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            return false;  
          });
        }
      });
    });

    let blogCards = document.querySelectorAll('.blog__posts > li');
    
    blogCards?.forEach(card => {
      let hrefs = card.querySelectorAll('a');
      
      hrefs.forEach(el => {
        el.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          return false;  
        });
      });
    });
  }

  animateSlider(slider, direction, config, finishCallback) {
    const offset = config.offset * direction;

    const animation = slider.animate(
      [
        // keyframes
        { transform: "translateX(0px)" },
        { transform: "translateX(" + offset + "px)" },
      ],
      {
        // timing options
        duration: 1000,
        iterations: 1,
      },
    );
    animation.onfinish = finishCallback;
  }

  processSliderAction(slider, prevBtn, nextBtn, configName) {
    if (!slider) {
      return;
    }
    let firstSlide = null;
    let lastSlide = null;

    const updateSlider = () => {
      firstSlide = slider.querySelector('li:first-child');
      lastSlide = slider.querySelector('li:last-child');
      this.lockClick();
    }
    updateSlider();

    nextBtn.removeAttribute('disabled');
    prevBtn.removeAttribute('disabled');

    const config = this.sliderConfig[configName];
    if (config) {
      prevBtn.addEventListener('click', e => {
        let newSlide = firstSlide.cloneNode(true);
        slider.append(newSlide);
        slider.style.width = config.prev.width; 
        this.animateSlider(slider, -1, config, (e) => {
          firstSlide.remove();
          slider.style.width = config.originalWidth;
          updateSlider();
        });
      });
  
      nextBtn.addEventListener('click', e => {
        let newSlide = lastSlide.cloneNode(true);
        slider.prepend(newSlide);
        slider.style.width = config.next.width; 
        slider.style.left = config.next.left;
  
        this.animateSlider(slider, 1, config, (e) => {
          lastSlide.remove();
          slider.style.width = config.originalWidth;
          slider.style.left = config.originalLeft;
          updateSlider();
        });
      });
    } else {
      prevBtn.addEventListener('click', e => {
        let newSlide = firstSlide.cloneNode(true);
        slider.append(newSlide);
        firstSlide.remove();
        updateSlider();
      });
  
      nextBtn.addEventListener('click', e => {
        let newSlide = lastSlide.cloneNode(true);
        slider.prepend(newSlide);
        lastSlide.remove();
        updateSlider();
      });
    }
  }

  initProgramsCarusel() {
    const nextBtn = document.querySelector('.collection .slider-button--next');
    const prevBtn = document.querySelector('.collection .slider-button--prev');
    const slider = document.querySelector('.collection .collection__cards');
    this.processSliderAction(slider, prevBtn, nextBtn, !this.isMobile() ? 'program' : 'mobile');
  }

  initTestimonialsCarusel() {
    const nextBtn = document.querySelector('.blog .slider-button--next');
    const prevBtn = document.querySelector('.blog .slider-button--prev');
    const slider = document.querySelector('.blog .blog__posts');
    this.processSliderAction(slider, prevBtn, nextBtn, !this.isMobile() ? 'blog' : 'mobile');
  }

  isMobile() {
    const mq = window.matchMedia( "(max-width: 430px)" );
    return mq.matches;
  }
}

const biafitSlider = new BiafitSlider();
biafitSlider.lockClick();
biafitSlider.initProgramsCarusel();
biafitSlider.initTestimonialsCarusel();
//biafitSlider.setupTimers();