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
  prevMinute = null;
  currentMinuteAnimated = null;
  tickInterval = 60000;

  animation = {
    'slider-desktop': [
      {
        top: '0px',
      },
      {
        top: '-157px'
      },
    ],
    'slider-mobile': [
      {
        top: '0px',
      },
      {
        top: '-57px'
      },
    ],
  }
  alignTimeNumer(value) {
    return (value < 10 ? '0' + value : value);
  }
  startAnimation() {
    let doUpdate = false;

    const alignAnimatedMinutes = (value) => {
      return (value < 0 ? (10 + value) : value);  
    }

    this.currentMinuteAnimated = alignAnimatedMinutes(this.currentMinuteAnimated);
    console.log('Current minute:', this.currentMinuteAnimated);
    this.currentMinute.innerText = this.currentMinuteAnimated;
    
    if (this.currentMinuteAnimated == 0) {
      doUpdate = true;
    }
  
    this.nextMinute.innerText = alignAnimatedMinutes(this.currentMinuteAnimated - 1);
    this.prevMinute.innerText = alignAnimatedMinutes(this.currentMinuteAnimated + 1);
    
    const opacityDown = [
      {opacity: 1},
      {opacity: 0.5}
    ];
    const opacityUp = [
      {opacity: 0.5},
      {opacity: 1}
    ];
    
    this.nextMinute.animate(opacityUp, this.tickInterval);
    this.currentMinute.animate(opacityDown, this.tickInterval);
    this.slider
      .animate(this.animation['slider-' + this.mode], this.tickInterval)
      .onfinish = (e) => {
        // count down
        this.currentMinuteAnimated--;
        
        this.prevMinute.innerText = alignAnimatedMinutes(this.currentMinuteAnimated - 1);
        this.slider.append(this.prevMinute);
        this.initTimerSlots();

        /* this.currentMinute.innerText = alignAnimatedMinutes(this.currentMinuteAnimated);
        this.nextMinute.innerText = alignAnimatedMinutes(this.currentMinuteAnimated - 1); */

        this.diffSeconds -= 60;
        if (doUpdate) {
          this.updateCounterBlock();
        }
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
    this.prevMinute = this.slider.querySelector('.time-number:first-child');
    this.prevMinute.style.opacity = 0.5;
    this.currentMinute = this.slider.querySelector('.time-number:nth-child(2)');
    this.currentMinute.style.opacity = 1;
    this.nextMinute = this.slider.querySelector('.time-number:nth-child(3)');
    this.nextMinute.style.opacity = 0.5;
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
    this.mode = (window.biafitManager.isMobile() ? 'mobile' : 'desktop');

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
