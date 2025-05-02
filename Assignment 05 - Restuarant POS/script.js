document.addEventListener("DOMContentLoaded", function() {
   let shouldOrder = true;
   let totalBill = 0;
   let orderSummary = []; // Array to track ordered items

   // Delay the order prompt by 5 seconds
   setTimeout(function() {
       // Order taking logic
       while(shouldOrder){
           let order = prompt("Select the order number\n" +
             "1. Paneer Tikka\n" +
             "2. Masala Dosa\n" +
             "3. Chana Masala\n" +
             "4. Vegetable Biryani\n" + 
             "5. Palak Paneer\n" +
             "6. Aloo Gobi\n" +
             "7. Dal Makhani\n" + 
             "8. Vegetable Samosas\n" +
             "9. Malai Kofta\n" +
             "10. Gulab Jamun");

           console.log(typeof order);
           order = parseInt(order);
           console.log(typeof order);
           
           switch(order){
               case 1:
                   console.log("Paneer Tikka - ₹350");
                   totalBill = totalBill + 350;
                   orderSummary.push("Paneer Tikka - ₹350");
                   break;
               case 2:
                   console.log("Masala Dosa - ₹180");
                   totalBill = totalBill + 180;
                   orderSummary.push("Masala Dosa - ₹180");
                   break; 
               case 3:
                   console.log("Chana Masala - ₹220");
                   totalBill = totalBill + 220;
                   orderSummary.push("Chana Masala - ₹220");
                   break; 
               case 4:
                   console.log("Vegetable Biryani - ₹280");
                   totalBill = totalBill + 280;
                   orderSummary.push("Vegetable Biryani - ₹280");
                   break;
               case 5:
                   console.log("Palak Paneer - ₹250");
                   totalBill = totalBill + 250;
                   orderSummary.push("Palak Paneer - ₹250");
                   break; 
               case 6:
                   console.log("Aloo Gobi - ₹200");
                   totalBill = totalBill + 200;
                   orderSummary.push("Aloo Gobi - ₹200");
                   break; 
               case 7:
                   console.log("Dal Makhani - ₹180");
                   totalBill = totalBill + 180;
                   orderSummary.push("Dal Makhani - ₹180");
                   break; 
               case 8:
                   console.log("Vegetable Samosas - ₹120");
                   totalBill = totalBill + 120;
                   orderSummary.push("Vegetable Samosas - ₹120");
                   break;
               case 9:
                   console.log("Malai Kofta - ₹270");
                   totalBill = totalBill + 270;
                   orderSummary.push("Malai Kofta - ₹270");
                   break;
               case 10:
                   console.log("Gulab Jamun - ₹100");
                   totalBill = totalBill + 100;
                   orderSummary.push("Gulab Jamun - ₹100");
                   break;
               default:
                   alert("Invalid Input");
                   break;
           }
           
           let continueOrder = confirm("Do you want to add more items?");
           if(continueOrder === false){
               break;
           }
       }

       // Calculate GST (18%) only if 5 or more items ordered
       let gstAmount = 0;
       if (orderSummary.length >= 5) {
           gstAmount = totalBill * 0.18;
       }
       const finalBill = totalBill + gstAmount;
       
       // Create summary message
       let summaryMessage = "Order Summary:\n";
       summaryMessage += orderSummary.join("\n");
       summaryMessage += `\n\nSubtotal: ₹${totalBill.toFixed(2)}`;
       
       // Only show GST if applicable
       if (orderSummary.length >= 5) {
           summaryMessage += `\nGST (18%): ₹${gstAmount.toFixed(2)}`;
       } else {
           summaryMessage += `\nGST not Applied (less than 5 items)`;
       }
       
       summaryMessage += `\n\nTotal Bill: ₹${finalBill.toFixed(2)}`;
       
       // Show bill with order summary
       alert(summaryMessage);

       // Move console logs here so they show actual data after order completion
       console.log("Order taking process completed.");
       console.log("Order Summary: " + orderSummary.join(", "));
       console.log("Total Bill: " + totalBill);
       console.log("GST Amount: " + gstAmount.toFixed(2));
       console.log("Final Bill: " + finalBill.toFixed(2));
   }, 5000); // 5 seconds delay

   console.log("Order taking process will start after 5 seconds delay.");
});