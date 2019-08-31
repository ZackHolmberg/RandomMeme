$.ajaxSetup({
  async: false
});

var memes = [];

window.onload = function () {
  getMemes();
  console.log(memes)
  getMeme();
}



function getMeme() {
  var index = Math.floor(Math.random() * memes.length);
  console.log("Got the link at index "+index+": " + memes[index].link);
  console.log("Got the text at index "+index+": " + memes[index].text);
  $("#my_image").attr("src", memes[index].link);
  $("#caption").text(memes[index].text);
  memes.pop(memes[index]);
}

function getMemes() {
  $.getJSON("http://www.reddit.com/r/dankmemes/.json", function (data) {
    $.each(data.data.children, function (i, item, temp) {
      if (i != 0 && (item.data.url.includes(".jpg") || item.data.url.includes(".jpeg") || item.data.url.includes(".png"))) {
        var meme = { link: ""+item.data.url, text: ""+item.data.title };
        memes.push(meme);
      }
    });

  });

  $.getJSON("http://www.reddit.com/r/funny/.json", function (data) {
    $.each(data.data.children, function (i, item, temp) {
      if (i != 0 && (item.data.url.includes(".jpg") || item.data.url.includes(".jpeg") || item.data.url.includes(".png"))) {
        var meme = { link: ""+item.data.url, text: ""+item.data.title };
        memes.push(meme);
      }
    });
  });

  $.getJSON("http://www.reddit.com/r/memes/.json", function (data) {
    $.each(data.data.children, function (i, item, temp) {
      if (i != 0 && (item.data.url.includes(".jpg") || item.data.url.includes(".jpeg") || item.data.url.includes(".png"))) {
        var meme = { link: ""+item.data.url, text: ""+item.data.title };
        memes.push(meme);
      }
    });
  });

  $.getJSON("http://www.reddit.com/r/dank_meme/.json", function (data) {
    $.each(data.data.children, function (i, item, temp) {
      if (i != 0 && (item.data.url.includes(".jpg") || item.data.url.includes(".jpeg") || item.data.url.includes(".png"))) {
        var meme = { link: ""+item.data.url, text: ""+item.data.title };
        memes.push(meme);
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  var link = document.getElementById('myButton');
  // onClick's logic below:
  link.addEventListener('click', function () {
    getMeme();
  });
});

// Get the modal
var modal = document.getElementById("myModal");

// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementById("my_image");
var modalImg = document.getElementById("img01");
img.onclick = function () {
  modal.style.display = "block";
  modalImg.src = this.src;
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("myclose")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
}
