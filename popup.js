$.ajaxSetup({
  async: false
});

var array = [];

window.onload = function () {
  getMemes();
  getMeme();
}



function getMeme() {
  var index = Math.floor(Math.random() * array.length);
  $("#my_image").attr("src", array[index]);
  array.pop(array[index]);
}

function getMemes() {
  $.getJSON("http://www.reddit.com/r/dankmemes/.json", function (data) {
    $.each(data.data.children, function (i, item, temp) {
      if (i != 0 && (item.data.url.includes(".jpg") || item.data.url.includes(".jpeg") || item.data.url.includes(".png")))
        array.push(item.data.url);
    });

  });

  $.getJSON("http://www.reddit.com/r/funny/.json", function (data) {
    $.each(data.data.children, function (i, item, temp) {
      if (i != 0 && (item.data.url.includes(".jpg") || item.data.url.includes(".jpeg") || item.data.url.includes(".png")))
        array.push(item.data.url);
    });
  });

  $.getJSON("http://www.reddit.com/r/memes/.json", function (data) {
    $.each(data.data.children, function (i, item, temp) {
      if (i != 0 && (item.data.url.includes(".jpg") || item.data.url.includes(".jpeg") || item.data.url.includes(".png")))
        array.push(item.data.url);
    });
  });

  $.getJSON("http://www.reddit.com/r/dank_meme/.json", function (data) {
    $.each(data.data.children, function (i, item, temp) {
      if (i != 0 && (item.data.url.includes(".jpg") || item.data.url.includes(".jpeg") || item.data.url.includes(".png")))
        array.push(item.data.url);
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  var link = document.getElementById('myButton');
  // onClick's logic below:
  link.addEventListener('click', function() {
      getMeme();
  });
});