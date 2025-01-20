
function getMetafields(productID) {
  const urlForMeta = this.shopURL + '/admin/products/' + productID + '/metafields.json';
  
  fetch(urlForMeta)
  .then(response => response.json())
  .then(function(data) {
    console.log("	--Product Metafields: " + data);
  })
  .catch(err => console.log(err))
};

const HomePageManager = {
  plans: {
      'plan1': {
        "id": 5725618367,
        "name": "1 month subscription"
      },
      'plan2': {
        "id": 5725651135,
        "name": "6 month subscription",
      },
      'plan3': {
        "id": 5725683903,
        "name": "12 month subscription",
      }
  },

  shopURL: '{{ shop.url }}',
  variantId: null,
  selectedPlanId: 'plan2',
  subscriptionToAdd: null,

  deleteProductItem: (keyId) => {
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
  },

  deleteFromCart: async (productType) => {
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
            const promise = HomePageManager.deleteProductItem(item.key);
            deletePromises.push(promise);
            await promise;

            return _deleteItem();
          }
        });
      }
      return deletePromises;
    }

    return _deleteItem();
  },

  addItemToCart: async () => {
    const _addItem = () => {
      const dataToAdd = {
        'id': HomePageManager.variantId,
        'quantity': 1,
        'selling_plan': HomePageManager.plans[HomePageManager.selectedPlanId]['id']
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
        HomePageManager.subscriptionToAdd = data.key;
        window.location.href = '/cart';
      });
    };

    let deletePromises = await HomePageManager.deleteFromCart('Subscription');

    if (deletePromises.length > 0) {
      Promise.all(deletePromises).then(response => {
        _addItem();
      })
    } else {
      _addItem();
    }
  },
  
  initPlansForm: (variantId) => {
    HomePageManager.variantId = variantId;
    
    const joinBtn = document.querySelector('#membership_join-us');
    joinBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      HomePageManager.addItemToCart();
      return false;
    });
    
    const planCheckers = document.querySelectorAll('.plan-item');
    planCheckers.forEach((el) => {
      el.addEventListener("click", (e) => {
        planCheckers.forEach(el1 => {
            el1.classList.remove('checked');
            el1.classList.add('unchecked');
        });
        el.classList.add('checked')
        el.classList.remove('unchecked');
        HomePageManager.selectedPlanId = el.getAttribute('id');
      });
    });
  }
}

const loadFrame = () => {
  const iframe = document.querySelector('.custom__form iframe');
  iframe.onload = (e) => {
    const style = document.createElement('style');
    style.textContent = 'body { background-color: some-color; }';
    let attempts = 0;
    const waitBody = () {
      if (!iframe.contentDocument.body && attempts < 5) {
        console.log('Wait... ', attempts);
        setTimeout(() => {
          waitBody()
        }, 500);
        attempts++;
        return;
      }
      console.log(iframe.contentDocument.body);
    }
    waitBody();
  }
}