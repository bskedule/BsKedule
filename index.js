// // Automatic Slideshow - change image every 4 seconds
// let myIndex = 0;
// carousel();

// function carousel() {
//   let i;
//   let x = document.getElementsByClassName("mySlides");
//   for (i = 0; i < x.length; i++) {
//     x[i].style.display = "none";
//   }
//   myIndex++;
//   if (myIndex > x.length) {
//     myIndex = 1;
//   }
//   x[myIndex - 1].style.display = "block";
//   setTimeout(carousel, 4000);
// }

// // Used to toggle the menu on small screens when clicking on the menu button
// function myFunction() {
//   let x = document.getElementById("navDemo");
//   if (x.className.indexOf("w3-show") == -1) {
//     x.className += " w3-show";
//   } else {
//     x.className = x.className.replace(" w3-show", "");
//   }
// }

// When the user clicks anywhere outside of the modal, close it
// let modal = document.getElementById("ticketModal");
// window.onclick = function (event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// };

// When the user clicks on help, alert the way how to use
document.getElementById("helpButton").addEventListener("click", function () {
  alert(
      'Vào trang lịch học hoặc lịch thi \n Trên máy tính: nhấn Ctrl + A, Ctrl + C. Rồi về trang này, click vào ô ở dưới và nhấn Ctrl + V \n Trên điện thoại: bấm và giữ 1 chữ nào đó trong trang, bấm "chọn tất cả", bấm "sao chép". Rồi về trang này, bấm vào ô ở dưới, nhấn và giữ ô, bấm "dán"'
  );
  console.log("good news");
});