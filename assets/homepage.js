
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
        "group_id": "6c46ec4d274ff8202ff2a6b1c41e7d79b7da2070",
        "id": 5725618367,
        "name": "1 month subscription",
        "description": null,
        "options": [
            {
                "name": "Recharge Plan ID",
                "position": 1,
                "value": "17862300"
            },
            {
                "name": "Order Frequency and Unit",
                "position": 2,
                "value": "1-month"
            }
        ],
        "recurring_deliveries": true,
        "price_adjustments": [],
        "checkout_charge": {
            "value_type": "percentage",
            "value": 100
        },
        "selected": true
      },
      'plan2': {
        "group_id": "6c59f943b4ba5e785f7cfae3b9f6657a3f1a54e8",
        "id": 5725651135,
        "name": "6 month subscription",
        "description": null,
        "options": [
            {
                "name": "Recharge Plan ID",
                "position": 1,
                "value": "17862301"
            },
            {
                "name": "Order Frequency and Unit",
                "position": 2,
                "value": "6-month"
            }
        ],
        "recurring_deliveries": true,
        "price_adjustments": [],
        "checkout_charge": {
            "value_type": "percentage",
            "value": 100
        },
        "selected": true
      },
      'plan3': {
        "group_id": "52585a56d32eedd94827265f8597e79c30f7f098",
        "id": 5725683903,
        "name": "12 month subscription",
        "description": null,
        "options": [
            {
                "name": "Recharge Plan ID",
                "position": 1,
                "value": "17862302"
            },
            {
                "name": "Order Frequency and Unit",
                "position": 2,
                "value": "12-month"
            }
        ],
        "recurring_deliveries": true,
        "price_adjustments": [],
        "checkout_charge": {
            "value_type": "percentage",
            "value": 100
        },
        "selected": true
      }
  },

  shopURL: '{{ shop.url }}',
  variantId: null,
  selectedPlanId: 'plan2',

  addItemToCart() {
      console.log(this.variantId, this.selectedPlanId);
      return;
      const data = {
        'id': this.variantId,
        'quantity': 1,
        'properties': {
          'selected_selling_plan': this.plans[this.selectedPlanId] 
        }
      }
  
      fetch( '/cart/add.js', {
          method: "POST",
          headers: {
          'Content-Type': 'application/json'
          },
          body:  JSON.stringify(data)
      })
      .then(function(response){ 
          return response.json(); 
      })
      .then(function(data){ 
          console.log(data);
      });
  },
  
  initPlansForm: (variantId) => {
    this.variantId = variantId;

    const joinBtn = document.querySelector('#membership_join-us');
    joinBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.addItemToCart();
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
        this.selectedPlan = el.getAttribute('id');
      });
    });
  }
}