/**
 * Scroller
 */
class Scroller {
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
      'HeaderMenu-programs': 'programs-section',
      'HeaderMenu-about-holly': 'about-holly-section',
      'HeaderMenu-recipe-library': 'recipe-library-section',
      'HeaderMenu-plans': 'membership-section',
      'HeaderMenu-contact-us': 'contact-section'
    };

    for (let linkId in headerLinks) {
      let href = document.getElementById(linkId);
      let targetEl = document.getElementById(headerLinks[linkId]);

      href.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        this.scrollToSmoothly(targetEl.offsetTop, 600);
        return false;
      });
    }
    
    const targetElement = document.getElementById('membership-section');
    let buttons = [
      document.getElementById('main-block-button'),
      document.querySelector('.header-button'),
      document.getElementById('about-app-button')
    ];

    buttons.forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        this.scrollToSmoothly(targetElement.offsetTop, 600);
        return false;  
      });
    })
  }
}

(new Scroller()).initHeaderLinks();
/**
 * Slider customization
 */
class BiafitSlider {
  lockClick() {
    let cards = document.querySelectorAll('.grid.product-grid > li');
    
    cards.forEach(card => {
      let hrefs = card.querySelectorAll('a');
      
      hrefs.forEach(el => {
        el.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          return false;  
        });
      });
    });

    let blogCards = document.querySelectorAll('blog__posts > li');
    
    blogCards.forEach(card => {
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

  processSliderAction(slider, prevBtn, nextBtn) {
    let firstSlide = null;
    let lastSlide = null;

    const updateSlider = () => {
      firstSlide = slider.querySelector('li:first-child');
      lastSlide = slider.querySelector('li:last-child');
    }
    updateSlider();

    nextBtn.removeAttribute('disabled');
    prevBtn.removeAttribute('disabled');
    
    prevBtn.addEventListener('click', e => {
      let newSlide = firstSlide.cloneNode(true);
      firstSlide.remove();
      slider.append(newSlide);
      updateSlider();
    });

    nextBtn.addEventListener('click', e => {
      let newSlide = lastSlide.cloneNode(true);
      lastSlide.remove();
      slider.prepend(newSlide);
      updateSlider();
    });
  }

  initProgramsCarusel() {
    const nextBtn = document.querySelector('.collection .slider-button--next');
    const prevBtn = document.querySelector('.collection .slider-button--prev');
    const slider = document.querySelector('.collection .grid.product-grid');
    this.processSliderAction(slider, prevBtn, nextBtn);
  }

  initTestimonialsCarusel() {
    const nextBtn = document.querySelector('.blog .slider-button--next');
    const prevBtn = document.querySelector('.blog .slider-button--prev');
    const slider = document.querySelector('.blog .blog__posts');
    this.processSliderAction(slider, prevBtn, nextBtn);
  }
}

var biafitSlider = new BiafitSlider();
biafitSlider.lockClick();
biafitSlider.initProgramsCarusel();
biafitSlider.initTestimonialsCarusel();

