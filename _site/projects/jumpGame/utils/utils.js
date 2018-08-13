var utils = {};

utils.arrayMaxIndex = function(arr) {
    var curMax = -Infinity;
    var maxIdx = 0;
    for (var i = 0; i < arr.length; i += 1) {
        if (arr[i] > curMax) {
            curMax = arr[i];
            maxIdx = i;
        }
    }
    return maxIdx;
}

utils.bucket = function(value, low, high, n) {
    var bucketSize = (high - low) / n;
    var idx = 0;
    var tmp = low + bucketSize;
    while (tmp < value) {
        idx += 1;
        tmp += bucketSize;
        if (idx == n - 1) {
            return idx;
        }
    }
    return Math.min(idx);
}

utils.createNDimArray = function(dimensions, defaultVal) {
    var dim = dimensions[0];
    var newArray = new Array();
    
    if (dimensions.length > 1) {        
        var rest = dimensions.slice(1);
        for (var i = 0; i < dim; i++) {
            newArray.push(utils.createNDimArray(rest, defaultVal));
        }
        return newArray;
    } else {        
        for (var i = 0; i < dim; i += 1) {
            newArray.push(defaultVal());
        }
        return newArray;
    }
}

utils.getMulti = function(arr, idxs) {
    if (idxs.length == 0) {
        return arr;
    }
    if (idxs.length == 1) {
        return arr[idxs[0]];
    }
    var idx = idxs[0];
    var rest = idxs.slice(1);
    return utils.getMulti(arr[idx], rest);
}

utils.setMulti = function(arr, idxs, t) {
    if (idxs.length == 0) {
        return false;
    }
    else if (idxs.length == 1) {
        arr[idxs[0]] = t;
    }
    else {
        var idx = idxs[0];
        var rest = idxs.slice(1);
        utils.setMulti(arr[idx], rest, t);
    }
}

utils.plot = function() {
    Plotly.plot('rewards', [{
        y: [],
        mode: 'lines+markers',
        marker: {color: 'red', size: 8},
        line: {width: 4},
        name: 'scores'
    }], {
        title: 'Scores over Epochs',
        autosize: false,
        width: 500,
        height: 400,
        paper_bgcolor: '#fefefe',
        plot_bgcolor: '#fefefe',
        xaxis: {
            title: 'Epoch',
        },
        yaxis: {
            title: 'Score'
        }
    }, {displayModeBar: false});
}

utils.extendRewards = function(score) {
    Plotly.extendTraces('rewards', {y: [[score]]}, [0]);    
}

utils.makeTableHTML = function(myArray, cap, idx) {
    var stepSize = 500 / myArray.length;
    var result = '<table class="table table-bordered"><caption>' + cap + '</caption>';
    result += '<tr><th>Enemy Position</th><th>Sit</th><th>Jump</th></tr>';
    for(var i = 0; i < myArray.length; i += 1) {
        result += "<tr>";
        result += "<td>" + i * stepSize + '-' + (i+1) * stepSize + "</td>";
        for (var j = 0; j < myArray[i][idx].length; j+=1) {            
            var val = Math.round(myArray[i][idx][j] * 1000) / 1000;
            result += "<td>"+val+"</td>";
        }
        result += "</tr>";
    }
    result += "</table>";
    return result;
}

utils.updateQ = function(Q) {
    var table = utils.makeTableHTML(Q, 'Q Table: Grounded', 0);
    document.getElementById('q1').innerHTML = table;
    var table = utils.makeTableHTML(Q, 'Q Table: In Air', 1);
    document.getElementById('q2').innerHTML = table;
}

utils.recordParameters = function(epsilon, gamma, alpha) {
    $("#epsilon").html(Math.round(epsilon * 1000) / 1000);
    $("#gamma").html(Math.round(gamma * 1000) / 1000);
    $("#alpha").html(Math.round(alpha * 1000) / 1000);
}
