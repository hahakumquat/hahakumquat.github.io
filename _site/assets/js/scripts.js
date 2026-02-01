/* Michael Ge, 2015
 * Personal Portfolio */

$(function() {
    cssSlidy({
        timeOnSlide: 3,
        timeBetweenSlides: 2
    });
});

window.addEventListener('keydown', function(e) {
  if(e.keyCode == 32 && e.target == document.body) {
    e.preventDefault();
  }
});
