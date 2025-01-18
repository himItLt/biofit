/**
 * Challenge
 */
class ChallengeTimer {
  mode = 'desktop';
  container = null;
  timeDiff = null;
  diffSeconds = null;
  slider = null;
  currentSecond = null;
  nextSecond = null;
  currentSecondAnimated = null;

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

    const alignAnimatedSeconds = (value) => {
      return (value < 0 ? (10 + value) : value);  
    }

    this.currentSecondAnimated = alignAnimatedSeconds(this.currentSecondAnimated - 1);
    this.currentSecond.innerText = this.currentSecondAnimated;
    
    if (this.currentSecondAnimated == 1) {
      doUpdate = true;
    }
  
    this.nextSecond.innerText = alignAnimatedSeconds(this.currentSecondAnimated - 1);

    const newSecond = this.currentSecond.cloneNode(true);
    newSecond.innerText = alignAnimatedSeconds(this.currentSecondAnimated - 2);
    this.slider.append(newSecond);
    
    this.slider
      .animate(this.animation['slider-' + this.mode], 1000)
      .onfinish = (e) => {
        this.currentSecond.remove();
        this.currentSecond = this.nextSecond;
        this.nextSecond = newSecond;
        
        this.currentSecond.innerText = alignAnimatedSeconds(this.currentSecondAnimated);
        this.nextSecond.innerText = alignAnimatedSeconds(this.currentSecondAnimated - 1);
        this.diffSeconds--;
        if (doUpdate) {
          this.updateCounterBlock();
        }
      }
  }

  updateCounterBlock() {
    this.initTimeDiff();
    const hoursDiv = this.container.querySelector('.hours .time-number');
    hoursDiv.innerText = this.alignTimeNumer(this.timeDiff.hours);
    const minutesDiv = this.container.querySelector('.minutes .time-number');
    minutesDiv.innerText = this.alignTimeNumer(this.timeDiff.minutes);
    const secondsTen = this.container.querySelector('.seconds .second-ten');
    secondsTen.innerText = this.timeDiff.seconds.ten;
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

    const hours = Math.floor(this.diffSeconds / 3600);
    const minutes = Math.floor((this.diffSeconds - hours * 3600) / 60);
    const seconds = (this.diffSeconds - hours * 3600 - minutes * 60);
    const secondTen = Math.floor(seconds / 10);
    const secondUnit = 9;

    if (this.currentSecondAnimated === null) {
      this.currentSecondAnimated = secondUnit;
    }

    this.timeDiff = {
      hours: hours,
      minutes: minutes,
      seconds: {
        ten: secondTen,
        unit: secondUnit
      }
    }
  }

  initCountdoun() {
    this.container = document.querySelector('.challenge-countdown .countdown-timer');
    if (!this.container) {
      console.log('Timer not found');
      return;
    }
    this.slider = this.container.querySelector('.second-unit-animated');
    this.currentSecond = this.slider.querySelector('.time-number:first-child');
    this.nextSecond = this.slider.querySelector('.time-number:nth-child(2)');
    this.updateCounterBlock();
    this.mode = (window.biafitManager.isMobile() ? 'mobile' : 'desktop');

    // TODO: uncomment before deploy to PROD
    //setInterval(() => {
      this.startAnimation();
    //}, 1000);
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
