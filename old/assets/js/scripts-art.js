$(function() {
    expand();
});

function expand() {
    $(".pic").click(function() {
        darken();
        var u = getImgURL(this);
        $("#sp").css({visibility:"visible", opacity:0.0}).attr("src", u).animate({opacity:1.0}, 400);
    });
    
    $(".v").click(function() {
        darken();
        var u = $(this).attr("alt")+"?autoplay=1";
        $("#sv").css({visibility:"visible", opacity:0.0}).attr("src", u).load(u).animate({opacity:1.0}, 400);
    });
    
    $("#darken, #sp").click(function() {
        clear();
    });
}

function clear() {
    lighten();
    $(".spotlight").animate({opacity:0.0}, 300, function() {
        $(".spotlight").attr("src", "");
        $(".spotlight").css("visibility", "hidden");
        $("#loader").css("visibility", "hidden");
    });
}

function darken() {
    $("#darken").css({opacity:0.0, visibility:"visible"}).animate({opacity:0.7}, 300);
}

function lighten() {
    $("#darken").css({opacity:0.7, visibility:"visible"}).animate({opacity:0.0}, 300, function() {
        $("#darken").css("visibility", "hidden");
    });
}

function getImgURL(x) {
    return $(x).attr("src")
        .replace('_t.png', '.png')
        .replace('t.png', '.png')
        .replace('_t.jpg', '.jpg')
        .replace('t.jpg', '.jpg')
        .replace('_t.jpeg', '.jpeg')
        .replace('t.jpeg', '.jpeg');
}

function loadGIF() {
    $("#loader").css("visibility", "visible");
}
