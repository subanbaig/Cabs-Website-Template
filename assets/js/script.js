$(document).ready(function () {
    $(".slider").slick({
      infinite: true,
      slidesToShow: 4, // Show more than two items at once
      slidesToScroll: 1, // Move one slide at a time
      centerMode: true, // Center the items
      focusOnSelect: true, // Allow selecting a slide
      autoplay: true, // Enable autoplay
      autoplaySpeed: 1500, // Set time interval to 1.5 seconds (1500 milliseconds)
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 576,
          settings: {
            slidesToShow: 1,
          },
        },
      ],
    });
  });
  