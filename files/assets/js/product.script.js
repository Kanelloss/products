$(document).ready(function () {
    $.ajax({
        url: 'http://localhost:3000/api/products',
        type: 'get',
        dataType: 'JSON'
    })
    .done(function (response) {
        let data = response.data;
        let status = response.status;

        if (status) {
            createTbody(data);
        } else {
            alert(false, 'Πρόβλημα στην αναζήτηση των προϊόντων (' + data.message + ')');
        }
    });

    // Deletion handler
    $('body').on('click', '.btnDelete', function () {
        let productId = $(this).val();
        if (confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το προϊόν;")) {
            $.ajax({
                url: 'http://localhost:3000/api/products/' + productId,
                type: 'delete',
                dataType: 'JSON',
            })
            .done(function (response) {
                if (response.status) {
                    alert(true, 'Επιτυχής διαγραφή προϊόντος');
                    location.reload(); // Reload page
                } else {
                    alert(false, 'Πρόβλημα στη διαγραφή προϊόντος (' + response.data.message + ')');
                }
            });
        }
    });

    // Update handler
    $('body').on('click', '.btnUpdate', function () {
        let $row = $(this).closest('tr');
        let productId = $(this).val();

        $row.find('.editable').each(function () {
            let currentValue = $(this).text();
            $(this).html('<input class="form-control" type="text" value="' + currentValue + '">');
        });

        // Change update to save button
        $(this).replaceWith('<button class="btnSave btn btn-success" value="' + productId + '">Αποθήκευση</button>');
    });

    // Save handler
    $('body').on('click', '.btnSave', function () {
        let $row = $(this).closest('tr');
        let productId = $(this).val();

        let updatedProduct = {
            product: $row.find('td:eq(0) input').val(),
            cost: $row.find('td:eq(1) input').val(),
            description: $row.find('td:eq(2) input').val(),
            quantity: $row.find('td:eq(3) input').val()
        };

        $.ajax({
            url: 'http://localhost:3000/api/products/' + productId,
            type: 'patch',
            data: updatedProduct,
            dataType: 'JSON',
        })
        .done(function (response) {
            if (response.status) {
                alert(true, 'Επιτυχής τροποποίηση προϊόντος');
                location.reload();
            } else {
                alert(false, 'Πρόβλημα στην τροποποίηση του προϊόντος (' + response.data.message + ')');
            }
        });
    });

    // Handle Create Product Form
    $('.btnSubmit').click(function (e) {
        e.preventDefault(); 
        
        var productData = {
            product: $('#productName').val(),
            description: $('#productDescription').val(),
            cost: $('#productPrice').val(),
            quantity: $('#productStock').val(),
        };

        // Validate form
        if (!productData.product || !productData.cost || !productData.quantity) {
            alert(false, "Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία.");
            return;
        }

        // Create a new product
        $.ajax({
            url: 'http://localhost:3000/api/products',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify(productData),
            success: function (response) {
                alert(true, 'Το προϊόν δημιουργήθηκε επιτυχώς!');
                $('#frmProduct')[0].reset(); // Reset form

                // Reload products to update table
                loadProducts();
            },
            error: function (xhr) {
                alert(false, 'Σφάλμα κατά τη δημιουργία του προϊόντος: ' + xhr.responseText);
            }
        });
    });

    // Handle reset button click
    $('.btnReset').click(function () {
        $('#frmProduct')[0].reset(); // Reset form
        $('.alert').hide(); // Hide alert messages
    });

    // Load products
    function loadProducts() {
        $.ajax({
            url: 'http://localhost:3000/api/products',
            type: 'get',
            dataType: 'JSON'
        })
        .done(function (response) {
            let data = response.data;
            let status = response.status;
            if (status) {
                createTbody(data);
            } else {
                alert(false, 'Πρόβλημα στην αναζήτηση των προϊόντων (' + data.message + ')');
            }
        });
    }
});

function createTbody(data) {
    $("#userTable > tbody").empty();

    const len = data.length;
    for (let i = 0; i < len; i++) {
        let productId = data[i]._id;
        let product = data[i].product;
        let cost = data[i].cost;
        let description = data[i].description;
        let quantity = data[i].quantity;

        let tr_str = "<tr>" +
            "<td class='editable'>" + product + "</td>" +
            "<td class='editable'>" + cost + "</td>" +
            "<td class='editable'>" + description + "</td>" +
            "<td class='editable'>" + quantity + "</td>" +
            "<td>" +
            "<button class='btnUpdate btn btn-primary' value='" + productId + "'>Τροποποίηση</button> " +
            "<button class='btnDelete btn btn-danger' value='" + productId + "'>Διαγραφή</button>" +
            "</td>" +
            "</tr>";

        $("#userTable tbody").append(tr_str);
    }
}

// Alert functions
function alert(status, message) {
    let alertBox = $('.alert');

    if (status) {
        alertBox.addClass('alert-success').removeClass('alert-danger');
    } else {
        alertBox.addClass('alert-danger').removeClass('alert-success');
    }

    alertBox.html(message).show(); 
}
