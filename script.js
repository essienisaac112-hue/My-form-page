
const quantities = document.querySelectorAll(".quantity");
const orderItems = document.getElementById("orderItems");
const totalPrice = document.getElementById("totalPrice");
const orderForm = document.getElementById("orderForm");
const formMessage = document.getElementById("formMessage");

// Your WhatsApp number
const WHATSAPP_NUMBER = "2349026601873";

// Format prices in Nigerian Naira
function formatMoney(amount) {
    return "₦" + amount.toLocaleString("en-NG");
}

// Calculate and display the order summary
function updateOrderSummary() {
    orderItems.innerHTML = "";

    let total = 0;
    let selectedItems = [];

    quantities.forEach(function(input) {
        let quantity = Number(input.value);
        let name = input.dataset.name;
        let price = Number(input.dataset.price);

        if (quantity > 0) {
            let subtotal = quantity * price;
            total += subtotal;

            selectedItems.push({
                name: name,
                quantity: quantity,
                subtotal: subtotal
            });

            let item = document.createElement("p");

            item.textContent =
                name + " x " + quantity + " = " +
                formatMoney(subtotal);

            orderItems.appendChild(item);
        }
    });

    if (selectedItems.length === 0) {
        orderItems.textContent = "No meals selected yet.";
    }

    totalPrice.textContent = formatMoney(total);

    return {
        items: selectedItems,
        total: total
    };
}

// Update the summary when food quantities change
quantities.forEach(function(input) {
    input.addEventListener("input", function() {
        let quantity = Number(input.value);

        if (input.value !== "" && quantity < 0) {
            input.value = 0;
        }

        if (quantity > 20) {
            input.value = 20;
        }

        updateOrderSummary();
    });
});

// Prepare the order and open WhatsApp
orderForm.addEventListener("submit", function(event) {
    event.preventDefault();

    formMessage.textContent = "";

    let order = updateOrderSummary();

    if (order.items.length === 0) {
        formMessage.textContent =
            "Please select at least one food item.";
        return;
    }

    let name =
        document.getElementById("customerName").value.trim();

    let phone =
        document.getElementById("customerPhone").value.trim();

    let address =
        document.getElementById("customerAddress").value.trim();

    let delivery =
        document.getElementById("deliveryMethod").value;

    let notes =
        document.getElementById("orderNotes").value.trim();

    // Create the WhatsApp order message
    let message = "🍽️ NEW FOOD ORDER\n\n";

    message += "Customer: " + name + "\n";
    message += "Phone: " + phone + "\n";
    message += "Address: " + address + "\n";
    message += "Order type: " + delivery + "\n\n";

    message += "ORDER DETAILS:\n";

    order.items.forEach(function(item, index) {
        message +=
            (index + 1) + ". " +
            item.name + " x " +
            item.quantity + " = " +
            formatMoney(item.subtotal) + "\n";
    });

    message += "\nTOTAL: " + formatMoney(order.total);

    if (notes !== "") {
        message += "\nSpecial instructions: " + notes;
    }

    message +=
        "\n\nPlease confirm this order. Thank you!";

    // Open WhatsApp with the order details
    let whatsappURL =
        "https://wa.me/" + WHATSAPP_NUMBER +
        "?text=" + encodeURIComponent(message);

    window.open(whatsappURL, "_blank");
});
