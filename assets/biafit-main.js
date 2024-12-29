function addItemToCart(variant_id, qty, frequency, unit_type) {
    const data = {
      "id": variant_id,
      "quantity": qty,
      "properties": {
        "shipping_interval_frequency": frequency,
        "shipping_interval_unit_type": unit_type
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
}

function getMetafields(productID) {
    const shopURL = '{{ shop.url }}';
    const urlForMeta = shopURL + '/admin/products/' + productID + '/metafields.json';
    
    fetch(urlForMeta)
    .then(response => response.json())
    .then(function(data) {
        console.log("	--Product Metafields: " + data);
    })
    .catch(err => console.log(err))
}
