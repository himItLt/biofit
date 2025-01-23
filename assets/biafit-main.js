/**
 * Manager
 */
class Manager {
  getScreenMode() {
    let mode = 'desktop';

    if (window.matchMedia( "(max-width: 640px)" ).matches) {
      mode = 'mobile';
    } else if (window.matchMedia( "(min-width: 640px) and (max-width: 989px)" ).matches) {
      mode = 'tablet';
    }

    return mode;
  }

  hasScreenMode(screenMode) {
    return (this.getScreenMode() == screenMode);
  }

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

  trackSupportForm() {
    const formIFrame = document.getElementById('customForm');
    const formSection = document.querySelector('.support .support__main-content');
   
    if (!formIFrame) {
      return;
    }
    const heightDiff = !this.hasScreenMode('desktop') ? 405 : 295;
    const resizeObserver = new ResizeObserver((entries) => {
      formSection.style.height = (formIFrame.offsetHeight + heightDiff) + 'px';
    });

    resizeObserver.observe(formIFrame);
  }

  scrollToSmoothly(pos, time) {
    if (!this.hasScreenMode('desktop')) {
      document.querySelector('header-drawer .header__icon')?.click();
    }

    let currentPos = window.scrollY;
    let start = null;
    if(time == null) time = 500;
    pos = +pos, time = +time;
    window.requestAnimationFrame(function step(currentTime) {
        start = !start ? currentTime : start;
        let progress = currentTime - start;
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
      mobile: {
        // Mobile
        'HeaderDrawer-whats-included': 'whats-included-section',
        'HeaderDrawer-what-is-the-challenge': 'about-challenge-section',
        'HeaderDrawer-about-biafit': 'about-app-section',
        'HeaderDrawer-transformations': 'testimonials-section',
        'HeaderDrawer-about-holly': 'about-holly-section',
        'HeaderDrawer-grand-prize': 'grand-prize-section',
        'HeaderDrawer-support': 'contact-section',
      },
      desktop: {
        'HeaderMenu-about-biafit': 'about-app-section',
        'HeaderMenu-programs': 'programs-section',
        'HeaderMenu-testimonials': 'testimonials-section',
        'HeaderMenu-transformations': 'testimonials-section',
        'HeaderMenu-about-holly': 'about-holly-section',
        'HeaderMenu-recipe-library': 'recipe-library-section',
        'HeaderMenu-plans': 'membership-section',
        'HeaderMenu-contact-us': 'contact-section',
        'HeaderMenu-support': 'contact-section',
        'HeaderMenu-grand-prize': 'grand-prize-section',
        'HeaderMenu-what-is-the-challenge': 'about-challenge-section',
        'HeaderMenu-whats-included': 'whats-included-section',
      } 
    };

    const displayMode = !this.hasScreenMode('desktop') ? 'mobile' : 'desktop';

    for (let linkId in headerLinks[displayMode]) {
      let href = document.getElementById(linkId);
      let targetEl = document.getElementById(headerLinks[displayMode][linkId]);
      
      if (!href || !targetEl) {
        continue;
      }
      
      const offsetTop = !this.hasScreenMode('desktop') 
        ? targetEl.offsetTop
        : targetEl.getBoundingClientRect().top + window.scrollY;
      
      href.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        this.scrollToSmoothly(offsetTop, 600);
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

window.biafitManager = new Manager();

/**
 * Slider customization
 */
class BiafitSlider {
  isSliderButtonsLocked = false;

  sliderConfig = {
    'program-desktop': {
      original: {
        width: '1835px',
        left: '0px',
      },
      prev: {
        animation: 'program-desktop-prev',
        init: (slider) => {
          slider.style.width = '1890px';
          slider.style.left = '-410px';  
        },
        onStart: (slider) => {
          const oldCard = slider.querySelector('li.large-slide');
          const newCard = slider.querySelector('li:nth-child(2)');
          this.animateElement(
            oldCard.querySelector('.card-wrapper'), 
            'program-desktop.wrapper',
            true
          );
          this.animateElement(
            newCard.querySelector('.card-wrapper'), 
            'program-desktop.wrapper',
            false
          );
        },
        onFinish: (slider) => {
          this.programAnimationEnd(slider);
        }
      },
      next: {
        animation: 'program-desktop-next',
        init: (slider) => {
          slider.style.width = '1890px';
        },
        onStart: (slider) => {
          const oldCard = slider.querySelector('li.large-slide');
          const newCard = slider.querySelector('li:nth-child(3)');
          this.animateElement(
            oldCard.querySelector('.card-wrapper'), 
            'program-desktop.wrapper',
            true
          );
          this.animateElement(
            newCard.querySelector('.card-wrapper'), 
            'program-desktop.wrapper',
            false
          );
        },
        onFinish: (slider) => {
          this.programAnimationEnd(slider);  
        }
      },
    },
    'program-mobile': {
      original: {
        left: '0px',
      },
      prev: {
        animation: 'program-mobile-prev',
        init: (slider) => {
          slider.style.left = '-215px';  
        },
        onStart: (slider) => {
          const oldCard = slider.querySelector('li.large-slide');
          const newCard = slider.querySelector('li:nth-child(2)');
          this.animateElement(
            oldCard.querySelector('.card-wrapper'), 
            'program-mobile.wrapper',
            true
          );
          this.animateElement(
            newCard.querySelector('.card-wrapper'), 
            'program-mobile.wrapper',
            false
          );
        },
        onFinish: (slider) => {
          this.programAnimationEnd(slider);
        }
      },
      next: {
        animation: 'program-mobile-next',
        init: (slider) => {},
        onStart: (slider) => {
          const oldCard = slider.querySelector('li.large-slide');
          const newCard = slider.querySelector('li:nth-child(3)');
          this.animateElement(
            oldCard.querySelector('.card-wrapper'), 
            'program-mobile.wrapper',
            true
          );
          this.animateElement(
            newCard.querySelector('.card-wrapper'), 
            'program-mobile.wrapper',
            false
          );
        },
        onFinish: (slider) => {
          this.programAnimationEnd(slider);  
        }
      },
    },
    'program-tablet': {
      original: {
        left: '0px',
      },
      prev: {
        animation: 'program-mobile-prev',
        init: (slider) => {
          slider.style.left = '-215px';  
        },
        onStart: (slider) => {
          const oldCard = slider.querySelector('li.large-slide');
          const newCard = slider.querySelector('li:nth-child(2)');
          this.animateElement(
            oldCard.querySelector('.card-wrapper'), 
            'program-mobile.wrapper',
            true
          );
          this.animateElement(
            newCard.querySelector('.card-wrapper'), 
            'program-mobile.wrapper',
            false
          );
        },
        onFinish: (slider) => {
          this.programAnimationEnd(slider);
        }
      },
      next: {
        animation: 'program-mobile-next',
        init: (slider) => {},
        onStart: (slider) => {
          const oldCard = slider.querySelector('li.large-slide');
          const newCard = slider.querySelector('li:nth-child(3)');
          this.animateElement(
            oldCard.querySelector('.card-wrapper'), 
            'program-mobile.wrapper',
            true
          );
          this.animateElement(
            newCard.querySelector('.card-wrapper'), 
            'program-mobile.wrapper',
            false
          );
        },
        onFinish: (slider) => {
          this.programAnimationEnd(slider);  
        }
      },
    },
    'blog-desktop': {
      original: {
        left: '0px',
      },
      prev: {
        animation: 'blog-desktop-prev',
        init: (slider) => {
          slider.style.left = '-330px';
        }
      },
      next: {
        animation: 'blog-desktop-next',
        init: (slider) => {
          //slider.style.width = '1385px';
        }
      },
    },
    'blog-mobile': {
      original: {
        left: '0px',
      },
      prev: {
        animation: 'blog-mobile-prev',
        init: (slider) => {
          slider.style.left = '-180px';
        }
      },
      next: {
        animation: 'blog-mobile-next',
        init: (slider) => {
        }
      },
    },
    'blog-tablet': {
      original: {
        left: '0px',
      },
      prev: {
        animation: 'blog-mobile-prev',
        init: (slider) => {
          slider.style.left = '-180px';
        }
      },
      next: {
        animation: 'blog-mobile-next',
        init: (slider) => {
        }
      },
    }
  };

  getAnimation(name) {
    const animations = {
      // Testimonials and Transformations
      'blog-desktop-prev': [
        {
          left: '-335px'
        },
        {
          left: '0px'
        },
      ],
      'blog-desktop-next': [
        {
          left: '0px'
        },
        {
          left: "-335px"
        },
      ],
      'blog-mobile-prev': [
        {
          left: '-180px'
        },
        {
          left: '0px'
        },
      ],
      'blog-mobile-next': [
        {
          left: '0px'
        },
        {
          left: "-180px"
        },
      ],
      'blog-tablet-prev': [
        {
          left: '-180px'
        },
        {
          left: '0px'
        },
      ],
      'blog-tablet-next': [
        {
          left: '0px'
        },
        {
          left: "-180px"
        },
      ],
      // Programs
      'program-desktop-prev': [
        {
          left: '-410px'
        },
        {
          left: '0px'
        },
      ],
      'program-desktop-next': [
        {
          left: '0px'
        },
        {
          left: '-410px'
        },
      ],
      'program-desktop.wrapper': [
        {
          marginTop: '60px',
          width: '392px',
          height: '447px',  
        },
        {
          marginTop: '0px',
          width: '496px', 
          height: '565px',
        }
      ],
      'program-mobile-prev': [
        {
          left: '-215px'
        },
        {
          left: '0px'
        },
      ],
      'program-mobile-next': [
        {
          left: '0px'
        },
        {
          left: '-215px'
        },
      ],
      'program-mobile.wrapper': [
        {
          marginTop: '30px',
          width: '210px',
          height: '250px',
        },
        {
          marginTop: '0px',
          width: '260px',
          height: '310px',  
        }
      ],
      'program-tablet-prev': [
        {
          left: '-215px'
        },
        {
          left: '0px'
        },
      ],
      'program-tablet-next': [
        {
          left: '0px'
        },
        {
          left: '-215px'
        },
      ],
      'program-tablet.wrapper': [
        {
          marginTop: '30px',
          width: '210px',
          height: '250px',
        },
        {
          marginTop: '0px',
          width: '260px',
          height: '310px',  
        }
      ],
    };
    return animations[name];
  }

  programAnimationEnd(slider) {
    const oldCard = slider.querySelector('li.large-slide');
    const newCard = slider.querySelector('li:nth-child(2)');
    oldCard.classList.remove('large-slide');
    newCard.classList.add('large-slide');
  }

  animateElement(element, animationName, reverse = false, finishCallback = (e) => {}, startCallback = () => {}) {
    startCallback();
    const animation = element.animate(
      (reverse ? this.getAnimation(animationName).reverse() : this.getAnimation(animationName)),
      1000
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
      const commonFinish = () => {
        for (let originalStyle in config.original) {
          slider.style[originalStyle] = config.original[originalStyle];
        }
        this.isSliderButtonsLocked = false;
      };

      nextBtn.addEventListener('click', e => {
        if (this.isSliderButtonsLocked) {
          return;
        }
        this.isSliderButtonsLocked = true;

        let newSlide = firstSlide.cloneNode(true);
        config.next.init(slider);
        slider.append(newSlide);
        
        this.animateElement(
          slider, 
          config.next.animation,
          false,
          (e) => {
            firstSlide.remove();
            commonFinish();
            if (config.next.onFinish) {
              config.next.onFinish(slider);  
            }
            updateSlider();
          },
          () => {
            if (config.next.onStart) {
              config.next.onStart(slider);  
            }
          }
        );
      });
      
      prevBtn.addEventListener('click', e => {
        if (this.isSliderButtonsLocked) {
          return;
        }
        this.isSliderButtonsLocked = true;

        let newSlide = lastSlide.cloneNode(true);
        config.prev.init(slider);
        slider.prepend(newSlide);
        
        this.animateElement(
          slider, 
          config.prev.animation,
          false,
          (e) => {
            commonFinish();
            lastSlide.remove();
            if (config.prev.onFinish) {
              config.prev.onFinish(slider);  
            }
            updateSlider();
          },
          () => {
            if (config.prev.onStart) {
              config.prev.onStart(slider);  
            }
          }
        );
      });
    } else {
      /* Mobile slider without animation */
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

  toggleSliderButtons() {
    const buttonsClasses = [
      '.collection .slider-button--next'  
    ]
  }

  initProgramsCarusel() {
    const slider = document.querySelector('.collection .collection__cards');
    if (!slider) {
      return;
    }
    const nextBtn = document.querySelector('.collection .slider-button--next');
    const prevBtn = document.querySelector('.collection .slider-button--prev');
    slider.querySelector('li:nth-child(2)').classList.add('large-slide');
    this.processSliderAction(slider, prevBtn, nextBtn, 'program-' + window.biafitManager.getScreenMode());
  }

  initTestimonialsCarusel() {
    const nextBtn = document.querySelector('.blog .slider-button--next');
    const prevBtn = document.querySelector('.blog .slider-button--prev');
    const slider = document.querySelector('.blog .blog__posts');
    this.processSliderAction(slider, prevBtn, nextBtn, 'blog-' + window.biafitManager.getScreenMode());
  }
  
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

  processMainSlider(slider, interval) {
    const slide1 = slider.querySelector('.home-slide:first-child');
    const slide2 = slider.querySelector('.home-slide:last-child');
    
    slide1.animate([
      {opacity: 1},
      {opacity: 0},
    ], interval);
    slide2.animate([
      {opacity: 0},
      {opacity: 1},
    ], interval);
    
    slider.animate([
      {left: 0},
      {left: '-100vw'},
    ], interval).onfinish = (e) => {
      slider.append(slide1);
    } 
  }

  initMainSlider() {
    const slider = document.querySelector('.home-slider__grid');
    if (!slider) {
      return;
    }
    setInterval(() => {
      this.processMainSlider(slider, 2000);
    }, 5000);
    this.processMainSlider(slider, 2000);
  }
}

window.biafitSlider = new BiafitSlider();

/* Initialize */
window.addEventListener('load', (e) => {
  window.biafitManager.initHeaderLinks();
  window.biafitManager.trackMobileMenu();
  window.biafitManager.trackSupportForm();

  window.biafitSlider.lockClick();
  window.biafitSlider.initProgramsCarusel();
  window.biafitSlider.initTestimonialsCarusel();
  // TODO: uncomment before deploy to PROD
  window.biafitSlider.setupTimers();
  window.biafitSlider.initMainSlider();
  document.querySelector('.home__video video')?.play();
});
