/**
 * Challenge
 */
class ChallengeTimer {
  mode = 'desktop';
  container = null;
  timeDiff = null;
  diffSeconds = null;
  slider = null;
  currentMinute = null;
  nextMinute = null;
  currentMinuteAnimated = null;
  tickInterval = 60000;
  currentFrame = {
    min: 0,
    max: null,
    opacity: 0,
  };

  animation = {
    'slider-desktop': {
      min: 0,
      max: 157
    },
    'slider-mobile': {
      min: 0,
      max: 57
    },
    'slider-tablet': {
      min: 0,
      max: 110
    }
  };

  alignTimeNumer(value) {
    return (value < 10 ? '0' + value : value);
  }
  startAnimation() {
    let doUpdate = false;
    const animation = this.animation['slider-' + this.mode];
    const stepTop = (animation.max - animation.min);
    const stepOpacity = 1;

    if (!this.currentFrame.max) {
      this.currentFrame.min = animation.min;
      this.currentFrame.max = animation.min + stepTop;
    }

    const topDown = [
      { top: (- this.currentFrame.min) + 'px' },
      { top: (- this.currentFrame.max) + 'px' }
    ];
    const opacityDown = [
      {opacity: 1 - this.currentFrame.opacity},
      {opacity: 1 - (this.currentFrame.opacity + stepOpacity) }
    ];
    const opacityUp = [
      {opacity: this.currentFrame.opacity},
      {opacity: this.currentFrame.opacity + stepOpacity},
    ];

    const alignAnimatedMinutes = (value) => {
      return (value < 0 ? (10 + value) : value);  
    }

    this.currentMinuteAnimated = alignAnimatedMinutes(this.currentMinuteAnimated);
    this.currentMinute.innerText = this.currentMinuteAnimated;
    
    if (this.currentMinuteAnimated == 0) {
      doUpdate = true;
    }
  
    this.nextMinute.innerText = alignAnimatedMinutes(this.currentMinuteAnimated - 1);
    
    this.nextMinute.animate(opacityUp, 2000);
    this.currentMinute.animate(opacityDown, 2000);
    this.slider
      .animate(topDown, 2000)
      .onfinish = (e) => {
        this.currentFrame.max += stepTop;
        this.currentFrame.min += stepTop;
        this.currentFrame.opacity += stepOpacity;

        // count down
        if (this.currentFrame.opacity >= 1) {
          this.currentFrame.opacity = 0;
          this.currentFrame.max = animation.min + stepTop;
          this.currentFrame.min = animation.min;

          this.currentMinuteAnimated--;
          this.currentMinute.innerText = alignAnimatedMinutes(this.currentMinuteAnimated - 1);
          this.slider.append(this.currentMinute);
          
          this.diffSeconds -= 58;
          if (doUpdate) {
            this.updateCounterBlock();
          }
        }
        this.initTimerSlots();
      }
  }

  updateCounterBlock() {
    this.initTimeDiff();
    const daysDiv = this.container.querySelector('.days .time-number');
    daysDiv.innerText = this.alignTimeNumer(this.timeDiff.days);
    const hoursDiv = this.container.querySelector('.hours .time-number');
    hoursDiv.innerText = this.alignTimeNumer(this.timeDiff.hours);
    const minutesTen = this.container.querySelector('.minutes .minute-ten');
    minutesTen.innerText = this.timeDiff.minutes.ten;
  }

  initTimeDiff() {
    const startTime = window.biafitStart;
    //const startTime = Math.floor(Date.parse('2025-01-12T12:07:00') / 1000);
    if (!startTime) {
      return;
    }
    if (!this.diffSeconds) {
      this.diffSeconds = parseInt(startTime) - Math.floor(Date.now() / 1000);
    } 

    const secondsInDay = 3600 * 24;
    const days = Math.floor(this.diffSeconds / secondsInDay);
    const hours = Math.floor((this.diffSeconds - days * secondsInDay) / 3600);
    const minutes = (this.diffSeconds - days * secondsInDay - hours * 3600) / 60;
    const minuteTen = Math.floor(minutes / 10);
    const minuteUnit = Math.ceil(minutes % 10);

    if (this.currentMinuteAnimated === null) {
      this.currentMinuteAnimated = minuteUnit;
    }

    this.timeDiff = {
      days: days,
      hours: hours,
      minutes: {
        ten: minuteTen,
        unit: minuteUnit
      }
    }
  }

  initTimerSlots() {
    this.currentMinute = this.slider.querySelector('.time-number:first-child');
    this.currentMinute.style.opacity = (1 - this.currentFrame.opacity);
    this.nextMinute = this.slider.querySelector('.time-number:last-child');
    this.nextMinute.style.opacity = this.currentFrame.opacity;
    this.slider.style.top = (- this.currentFrame.min) + 'px';
  }

  initCountdoun() {
    this.container = document.querySelector('.challenge-countdown .countdown-timer');
    if (!this.container) {
      console.log('Timer not found');
      return;
    }
    this.slider = this.container.querySelector('.minute-unit-animated');
    this.initTimerSlots();
    this.updateCounterBlock();
    this.mode = window.biafitManager.getScreenMode();

    // TODO: uncomment before deploy to PROD
    setInterval(() => {
      this.startAnimation();
    }, this.tickInterval);

    this.startAnimation();
  }
}

class ChallengeProduct {
  variantId = null;

  deleteProductItem(keyId) {
    let toDelete = {
      id: keyId,
      quantity: 0
    };
    
    return fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(toDelete)
      });
  }

  async deleteFromCart(productType) {
    let deletePromises = [];

    const _deleteItem = async () => {
      const response = await fetch( '/cart.js', {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response?.json();
      
      if (data?.items.length > 0) {
        const items = data.items;
        
        items.forEach(async item => {
          if (item.product_type == productType) {
            const promise = this.deleteProductItem(item.key);
            deletePromises.push(promise);
            await promise;

            return _deleteItem();
          }
        });
      }
      return deletePromises;
    }

    return _deleteItem();
  }

  async addItemToCart() {
    const _addItem = () => {
      const dataToAdd = {
        'id': this.variantId,
        'quantity': 1
      }

      fetch( '/cart/add.js', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body:  JSON.stringify(dataToAdd)
      })
      .then(response => {
        return response.json();
      })
      .then(data => {
        window.location.href = '/cart';
      });
    };

    let deletePromises = await this.deleteFromCart('Challenge');

    if (deletePromises.length > 0) {
      Promise.all(deletePromises).then(response => {
        _addItem();
      })
    } else {
      _addItem();
    }
  }
  
  initChallengePage(variantId) {
    this.variantId = variantId;
    
    const buyBtns = document.querySelectorAll('.biafit-buy-button');
    buyBtns?.forEach(buyBtn => {
      buyBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.addItemToCart();
        return false;
      });
    });
  }
}

const challengeTimer = new ChallengeTimer();
const challengeProduct = new ChallengeProduct();
challengeTimer.initCountdoun();
challengeProduct.initChallengePage(window.challengeId);
document.querySelector('.header__heading-link')?.setAttribute('href', '#');
