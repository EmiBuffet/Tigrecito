"use strict";

/*var containerCarousel = document.querySelector('#carousel-container')
function watchSize(x) {
    if (x.matches) { // If media query matches
      containerCarousel.classList.remove('container')
    } else {
      containerCarousel.classList.add('container')
    }
}

var x = window.matchMedia("(max-width: 768px)")
watchSize(x) // Call listener function at run time
x.addListener(watchSize) // Attach listener function on state changes*/

$(document).ready(function(){
  $('.slider').slick({
    autoplay: true,
    autoplaySpeed: 9000,
		arrows: false,
		pauseOnHover: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          autoplay: true
        }
      }
    ]
  });
});

$('.sponsor-slider').slick({
  slidesToShow: 3,
  slidesToScroll: 1,
  dots: true,
  centerMode: true,
  focusOnSelect: true,
  autoplay: true,
  autoplaySpeed: 2000,
  responsive: [
  {
  breakpoint: 576,
    settings: {
      slidesToShow: 1
    }
  }]
});
