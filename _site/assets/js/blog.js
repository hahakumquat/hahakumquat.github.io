// ids = [];

// $(".strip").each(function(i, a) {
//     ids.push(a.id);
// });

// console.log(ids);

$(".strip").each(function(i, a) {
    $(a).hover(function() {
        $(a).find("img")
            .css({
                "filter" : 'grayscale(0%)',
                "webkitFilter" : 'grayscale(0%)'
            });
    }, function() {
        $(a).find("img")
            .css({
                "filter" : 'grayscale(100%)',
                "webkitFilter" : 'grayscale(100%)'
            });
    });
    // $(id).children().hover(function() {
    //     console.log("hovering child");        
    //     $(id).css("filter", 'grayscale("0%")');
    // }, function() {
    //     console.log("unhovering child");        
    //     $(id).css("filter", 'grayscale("100%")');
    // });
});
