document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("pantry-app JS imported successfully!");
  },
  false
);

let productQty = document.getElementById('product-qty')

function increaseProductQty() {
  productQty.value++
}

function decreaseProductQty() {
  if(productQty.value > 0) {
    productQty.value--
  }
}




