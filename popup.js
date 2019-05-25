$.ajaxSetup({
  async: false
});

var array = [];

window.onload = function () {
  document.getElementById("text").innerHTML = "This should change"
  getMemes();
  function getMemes() {
    $.getJSON("http://www.reddit.com/r/dankmemes/.json", function (data) {
      $.each(data.data.children, function (i, item, temp) {
        if (i != 0 && (item.data.url.includes(".jpg") || item.data.url.includes(".jpeg") || item.data.url.includes(".png") || item.data.url.includes(".gif")))
          array.push(item.data.url);
      });

    });

    $.getJSON("http://www.reddit.com/r/funny/.json", function (data) {
      $.each(data.data.children, function (i, item, temp) {
        if (i != 0 && (item.data.url.includes(".jpg") || item.data.url.includes(".jpeg") || item.data.url.includes(".png") || item.data.url.includes(".gif")))
          array.push(item.data.url);
      });
    });

    $.getJSON("http://www.reddit.com/r/memes/.json", function (data) {
      $.each(data.data.children, function (i, item, temp) {
        if (i != 0 && (item.data.url.includes(".jpg") || item.data.url.includes(".jpeg") || item.data.url.includes(".png") || item.data.url.includes(".gif")))
          array.push(item.data.url);
      });
    });

    $.getJSON("http://www.reddit.com/r/dank_meme/.json", function (data) {
      $.each(data.data.children, function (i, item, temp) {
        if (i != 0 && (item.data.url.includes(".jpg") || item.data.url.includes(".jpeg") || item.data.url.includes(".png") || item.data.url.includes(".gif")))
          array.push(item.data.url);
      });
    });

    getMeme();
  }
}



function getMeme() {
  var index = Math.floor(Math.random() * array.length);
  $("<img/>").attr("src", array[index]).appendTo("#images");
  array.pop(array[index]);
  document.getElementById("text").innerHTML = "Image URL: " + array[index] + "<br>" +
    "Number of memes left in array: " + array.length;
}