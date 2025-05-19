
import { orderDetails_db } from "../db/db.js";
import { loadOrderHistory } from "./OrderDetailsController.js";



    $(document).ready(function () {

        console.log("Order Details DB:", orderDetails_db);

        // Show Customer section by default
        $("#customer-section").addClass("active");

        // Handle navigation clicks
        $(".nav-button").on("click", function () {
            const sectionId = $(this).data("section");
            $(".section").removeClass("active");
            $(`#${sectionId}`).addClass("active"); 


            if( orderDetails_db.length > 0) {
                loadOrderHistory();
            }          
        });
    });

  



    