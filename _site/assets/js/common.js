setTimeout(function() {
    $(".loading").addClass("fadein");
}, 1000);

$(window).on("load", function() {
    $(".loader").hide();
});
