
$(document).ready(function () {
    // When document ready
    var $order_total_quantity = $(".order_total_quantity");
    var $order_total_cost = $(".order_total_cost");
    // Current state structure
    var $currentState = $(".formset_row").clone();

    $("input[type='number']").change(function () {
        var $price_object = $(this).parent().parent().find("[class^=orderitems]");
        var $quantity_total_current = parseInt($order_total_quantity.text());
        var $cost_total_current = parseFloat($order_total_cost.text());
        if (isNaN($quantity_total_current)) {
            $quantity_total_current = 0;
        }
        if (isNaN($cost_total_current)) {
            $cost_total_current = 0;
        }
        if (!$price_object.length) {
            var item_price = 0;
        } else {
            var item_price = parseFloat($price_object.text());
        };
        var quantity_delta = $(this).val() - $currentState.find("[name=" + $(this).attr("name") + "]").val();
        $order_total_quantity.text($quantity_total_current + quantity_delta);
        $order_total_cost.text(Number($cost_total_current + quantity_delta * item_price).toFixed(2));
        // Renew current state structure
        $currentState = $(".formset_row").clone();
    });

    $("select[name^=orderitems]").change(function () {
        var $currenElement = $(this);
        $.ajax({
            url: "/order/product/" + $currenElement.val() + "/price/",
            success: function (data) {
                var $formParent = $currenElement.parent().parent().find(".td3");
                var priceSpan = document.createElement("span");
                priceSpan.classList.add("orderitems");
                priceSpan.innerText = data.price
                $formParent.html(priceSpan).append(" руб");
                $currenElement.parent().parent().find("input[type='number']").prop('disabled', false);
            },
        });

    });

    function setDefaultValue() {
        // Set default value for new forms
        $("input[type='number']").each(function () {
            if (!$(this).val()) {
                $(this).val(0).prop('disabled', true);
            };
        });
        // Renew current state structure
        $currentState = $(".formset_row").clone();
    };

    function itemDelete(row) {
        var quantity_delta = parseInt($(row).find("[type='number']").val());
        $order_total_quantity.text(parseInt($order_total_quantity.text()) - quantity_delta);
        var $price_object = $(row).find("[class^=orderitems]");
        if (!$price_object.length) {
            var item_price = 0;
        } else {
            var item_price = parseFloat($price_object.text());
        };
        $order_total_cost.text(Number(parseFloat($order_total_cost.text()) - quantity_delta * item_price).toFixed(2));
        $currentState = $(".formset_row").clone();
    };

    // Be carefull with class of buttons
    $('.formset_row').formset({
        addText: 'добавить продукт',
        addCssClass: 'btn btn-outline-primary btn-block',
        deleteText: 'удалить',
        deleteCssClass: 'btn btn-outline-warning',
        prefix: 'orderitems',
        added: setDefaultValue,
        removed: itemDelete,
        hideLastAddForm: true
    });
});

window.onload = function () {
    var _quantity, _price, orderitem_num, delta_quantity, orderitem_quantity, delta_cost;
    var quantity_arr = [];
    var price_arr = [];

    var TOTAL_FORMS = parseInt($('input[name="orderitems-TOTAL_FORMS"]').val());
    var order_total_quantity = parseInt($('.order_total_quantity').text()) || 0;
    var order_total_cost = parseFloat($('.order_total_cost').text().replace(',', '.')) || 0;

    for (var i = 0; i < TOTAL_FORMS; i++) {
        _quantity = parseInt($('input[name="orderitems-' + i + '-quantity"]').val());
        _price = parseFloat($('.orderitems-' + i + '-price').text().replace(',', '.'));
        quantity_arr[i] = _quantity;
        if (_price) {
            price_arr[i] = _price;
        } else {
            price_arr[i] = 0;
        }
    }

    if (!order_total_quantity) {
        for (var i = 0; i < TOTAL_FORMS; i++) {
            order_total_quantity += quantity_arr[i];
            order_total_cost += quantity_arr[i] * price_arr[i];
        }
        $('.order_total_quantity').html(order_total_quantity.toString());
        $('.order_total_cost').html(Number(order_total_cost.toFixed(2)).toString());
    }

    $('.order_form').on('click', 'input[type="number"]', function () {
        var target = event.target;
        orderitem_num = parseInt(target.name.replace('orderitems-', '').replace('-quantity', ''));
        if (price_arr[orderitem_num]) {
            orderitem_quantity = parseInt(target.value);
            delta_quantity = orderitem_quantity - quantity_arr[orderitem_num];
            quantity_arr[orderitem_num] = orderitem_quantity;
            orderSummaryUpdate(price_arr[orderitem_num], delta_quantity);
        }
    });

    function deleteOrderItem(row) {
        var target_name = row[0].querySelector('input[type="number"]').name;
        orderitem_num = parseInt(target_name.replace('orderitems-', '').replace('-quantity', ''));
        delta_quantity = -quantity_arr[orderitem_num];
        orderSummaryUpdate(price_arr[orderitem_num], delta_quantity);
    }

    $('.order_form select').change(function () {
        var target = event.target;
        console.log(target);
    });

    function orderSummaryUpdate(orderitem_price, delta_quantity) {
        delta_cost = orderitem_price * delta_quantity;

        order_total_cost = Number((order_total_cost + delta_cost).toFixed(2));
        order_total_quantity = order_total_quantity + delta_quantity;

        $('.order_total_cost').html(order_total_cost.toString());
        $('.order_total_quantity').html(order_total_quantity.toString());
    }

    $('.formset_row').formset({
        addText: 'добавить продукт',
        deleteText: 'удалить',
        prefix: 'orderitems',
        removed: deleteOrderItem
    });
}
