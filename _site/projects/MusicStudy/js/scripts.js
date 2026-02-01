var shown = false;
var random = false;
var ctr = 0;
var numSongs;

$(function() {
    d3.csv("data.csv", function(data) {
        var info = data;
        numSongs = info.length;
        shuffle(info);
        var song = getRandomSong(info);
        updateSource(song);
        $("#sub").click(function() {
            if (!shown) {
                checkAnswers(song);
            }
            else {
                clearSources(song);
                song = getRandomSong(info);
                updateSource(song);
            }
            shown = !shown;
        });
        $("#rand").click(function() {
            random = !random;
            $("#rand").html(function() {
                return random ? "Start from Beginning" : "Random Start";
            });
        });
    });

    function getRandomSong(info) {
        if (ctr >= numSongs - 1) {
            shuffle(info);
            ctr = 0;
        }
        else {
            ctr++;
        }
        return info[ctr];
    }

    function updateSource(song) {
        switch (song.file.substring(song.file.lastIndexOf("."))) {
        case ".mp3":
            $("#mp3_source").attr("src", "music/mp3/" + song.file);
            break;
        case ".m4a":
            $("#mp3_source").attr("src", "music/m4a/" + song.file);
            break;
        }
        aud = document.getElementById('player');
        aud.load();
        aud.addEventListener("loadeddata", function() {
            aud.currentTime = seek(aud);
            aud.play();
        });
    }

    function seek(aud) {
        return random ? Math.floor(Math.random() * (aud.duration - 45)) : 0;
    }
    
    function checkAnswers(song) {
        if ($("#title").val().length > 0 &&
            song.title.toLowerCase() === $("#title").val().toLowerCase()) {
            $("#title_correct").html("Correct!");
        }
        else {
            $("#title_correct").html(song.title);
        }

        if ($("#date").val().length > 0 &&
            song.date.toLowerCase() === $("#date").val().toLowerCase()) {
            $("#date_correct").html("Correct!");
        }
        else {
            $("#date_correct").html(song.date);
        }

        if ($("#composer").val().length > 0 &&
            song.composer.toLowerCase() === $("#composer").val().toLowerCase()) {
            $("#composer_correct").html("Correct!");
        }
        else {
            $("#composer_correct").html(song.composer);
        }

        if ($("#genre").val().length > 0 &&
            song.genre.toLowerCase() === $("#genre").val().toLowerCase()) {
            $("#genre_correct").html("Correct!");
        }
        else {
            $("#genre_correct").html(song.genre);
        }

        if ($("#performing_forces").val().length > 0 &&
            song.performing_forces.toLowerCase() === $("#performing_forces").val().toLowerCase()) {
            $("#performing_forces_correct").html("Correct!");
        }
        else {
            $("#performing_forces_correct").html(song.performing_forces);
        }
        
        $("#sub").html("Change song!");
    }

    function clearSources() {
        $("#ogg_source, #mp3_source, #mp4_source").attr("src", "");
        $("#title_correct, #date_correct, #composer_correct, #genre_correct, #performing_forces_correct").html("&nbsp;");
        $('#title, #date, #genre, #composer, #performing_forces').val(function() {
            return this.defaultValue;
        });
    }
});

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
    console.log(a);
}
