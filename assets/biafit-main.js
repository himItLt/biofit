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
      original: {
        marginLeft: '0px',
        width: '1328px'
      },
      prev: {
        animation: 'program-desktop-prev',
        init: (slider) => {
          slider.style.width = '1390px';
        },
        onStart: (slider) => {
          console.log('Start Prev:', slider.querySelector('li:nth-child(2)'));
        },
        onFinish: (slider) => {
          console.log('Finish Prev:', slider.querySelector('li.large-slide'));
        }
      },
      next: {
        animation: 'program-desktop-next',
        init: (slider) => {
          slider.style.width = '1390px';
        },
        onStart: (slider) => {
          console.log('Start Next', slider.querySelector('li:nth-child(2)'));
        },
        onFinish: (slider) => {
          console.log('Finish Next', slider.querySelector('li.large-slide'));    
        }
      },
    },
    blog: {
      original: {
        marginLeft: '0px',
        width: '1328px'  
      },
      prev: {
        animation: 'blog-desktop-prev',
        init: (slider) => {
          slider.style.width = '1385px';
          slider.style.marginLeft = '-330px';
        }
      },
      next: {
        animation: 'blog-desktop-next',
        init: (slider) => {
          slider.style.width = '1385px';
        }
      },
    }
  };

  getAnimation(name) {
    const animations = {
      'blog-desktop-prev': [
        {
          left: '0px'
        },
        {
          left: '335px'
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
      'program-desktop-prev': [
        {
          left: '0px'
        },
        {
          left: '385px'
        },
      ],
      'program-desktop-next': [
        {
          marginLeft: '-25px'
        },
        {
          marginLeft: '-425px'
        },
      ],
    };
    return animations[name];
  }
  
  animateElement(element, animationName, finishCallback = (e) => {}, startCallback = (e) => {}) {
    const animation = element.animate(
      this.getAnimation(animationName),
      1000
    );
    animation.onfinish = finishCallback;
    animation.onanimationstart = startCallback;
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
      };

      nextBtn.addEventListener('click', e => {
        let newSlide = firstSlide.cloneNode(true);
        slider.append(newSlide);
        config.next.init(slider);

        this.animateElement(
          slider, 
          config.next.animation, 
          (e) => {
            firstSlide.remove();
            commonFinish();
            if (config.next.onFinish) {
              config.next.onFinish(slider);  
            }
            updateSlider();
          },
          (e) => {
            if (config.next.onStart) {
              config.next.onStart(slider);  
            }
          }
        );
      });
      
      prevBtn.addEventListener('click', e => {
        let newSlide = lastSlide.cloneNode(true);
        slider.prepend(newSlide);
        config.prev.init(slider);
        
        this.animateElement(
          slider, 
          config.prev.animation, 
          (e) => {
            commonFinish();
            lastSlide.remove();
            if (config.prev.onFinish) {
              config.prev.onFinish(slider);  
            }
            updateSlider();
          },
          (e) => {
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

  initProgramsCarusel() {
    const nextBtn = document.querySelector('.collection .slider-button--next');
    const prevBtn = document.querySelector('.collection .slider-button--prev');
    const slider = document.querySelector('.collection .collection__cards');
    slider.querySelector('li:nth-child(2)').classList.add('large-slide');
    this.processSliderAction(slider, prevBtn, nextBtn, !this.isMobile() ? 'program' : 'mobile');
  }

  initTestimonialsCarusel() {
    const nextBtn = document.querySelector('.blog .slider-button--next');
    const prevBtn = document.querySelector('.blog .slider-button--prev');
    const slider = document.querySelector('.blog .blog__posts');
    this.processSliderAction(slider, prevBtn, nextBtn, !this.isMobile() ? 'blog' : 'mobile');
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