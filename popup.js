$.ajaxSetup({
  async: false
});

//Google Analytics Stuff

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-148351255-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();


//Array the holds all of the possible memes.
var memes = [];

//Array that holds the default meme subreddits.
var subreddits = ["dankmemes", "funny", "memes", "dank_meme"];

//Link of pic being displated
var memeURL;

window.onload = function () {
  getMemes();
  getMeme();
  chrome.storage.sync.set({ 'subreddits': subreddits }, function () {
  });
  
  chrome.storage.sync.set({ 'memes': memes });
  
}



function getMeme() {

  if (subreddits.length > 0 && memes[0] != undefined) {

    $("#my_image").attr("src", memes[0].link);
    memeURL = memes[0].link;
    $("#caption").text(memes[0].text);
    memes.splice(0, 1);
    $("#memesLeft").text(memes.length + " memes left.");
    chrome.storage.sync.set({ 'memes': memes });
  }
  else {
    $("#my_image").attr("src", "images/noneAvailable.webp");
    $("#caption").text("No memes avaiable. Either you have browsed all the top memes of your selected subreddits, you have no selected subreddits in the menu, or you are not connected to the internet.");
  }
}

function getMemes() {
  for (var i = 0; i < subreddits.length; i++) {
    $.getJSON("http://www.reddit.com/r/" + subreddits[i] + "/.json", function (data) {
      $.each(data.data.children, function (i, item) {
        if (i != 0 && (item.data.url.includes(".jpg") || item.data.url.includes(".jpeg") || item.data.url.includes(".png"))) {
          var meme = { link: "" + item.data.url, text: "" + item.data.title };
          if (!memes.indexOf(meme) >= 0)
            memes.push(meme);
        }
      });

    });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  var link = document.getElementById('myButton');
  // onClick's logic below:
  link.addEventListener('click', function () {
    _gaq.push(['_trackEvent', 'Memes Viewed', 'clicked']);
    getMeme();
  });
});

var menuOpen = false;

function menuClick() {

  //If the menu is already open, close the menu and unhide some UI aspects
  if (menuOpen) {
    $("#menu").css("height", "0px");
    $("#my_image").css("display", "inline-block");
    $("#menuInfo").css("display", "none");

    $("#myButton").fadeTo(25, 1, function () {
      // Animation complete.
    });

    $("#memesLeft").fadeTo(25, 1, function () {
      // Animation complete.
    });

    $("#shareButton").fadeTo(25, 1, function () {
      // Animation complete.
    });

    $("#menuInfo").empty();
    menuOpen = false;
  }

  //Else the menu is not open so open the menu and hide some UI aspects
  else {
    $("#my_image").css("display", "none");
    $("#menu").css("height", "500px");

    $("#myButton").fadeTo(25, 0, function () {
      // Animation complete.
    });

    $("#memesLeft").fadeTo(25, 0, function () {
      // Animation complete.
    });

    $("#shareButton").fadeTo(25, 0, function () {
      // Animation complete.
    });

    setTimeout(function () {
      $("#menuInfo").css("display", "inline-block");
    }, 250);

    $("<h1>", {
      'class': 'menuInfoText'
    }).append("Your Subreddits:").appendTo("#menuInfo");

    $("<div>", {
      'class': 'subredditContainer',
      attr: {
        id: "list"
      }
    }).appendTo("#menuInfo");

    for (var i = 0; i < subreddits.length; i++) {
      $("<div>", {
        'class': 'subredditEntry',
        attr: {
          id: "subreddit" + i
        }
      }).appendTo("#list");


      $("<h1>", {
        'class': 'menuInfoText'
      }).append("r/" + subreddits[i]).appendTo("#subreddit" + i);


      $("<div>", {
        'class': 'deleteBtn',
        attr: {
          id: "delete" + i
        }
      }).append("x").click(function () {
        deleteSubreddit(this.id);

      }).appendTo("#subreddit" + i);
    }

    $("<h1>", {
      'class': 'menuInfoText'
    }).append("Add a Subreddit (excluding the r/)").appendTo("#menuInfo");

    $("<div>", {
      'class': 'subredditContainer',
      attr: {
        id: "list2",
      }
    }).appendTo("#menuInfo");

    $("<input>").attr({
      type: 'text',
      id: 'input',
      name: 'Subreddit Name'
    }).appendTo('#list2');

    $("<div>", {
      'class': 'submitBtn'
    }).click(function () {
      addSubreddit();

    }).append("Submit").appendTo("#list2");





    menuOpen = true;
  }


}

function addSubreddit() {
  var input = $("#input").val();

  $.getJSON("http://www.reddit.com/r/" + input + "/.json", function (data) {

    var valid = (data.data.dist != 0);

    if (valid) {
      subreddits.push(input);
      getMemes();
      chrome.storage.sync.set({ 'subreddits': subreddits }, function () {
      });
      chrome.storage.sync.set({ 'memes': memes });
      $("#memesLeft").text(memes.length + " memes left.");

      $("<div>", {
        'class': 'subredditEntry',
        attr: {
          id: "subreddit" + (subreddits.length - 1)
        }
      }).appendTo("#list");


      $("<h1>", {
        'class': 'menuInfoText'
      }).append("r/" + input).appendTo("#subreddit" + (subreddits.length - 1));


      $("<div>", {
        'class': 'deleteBtn',
        attr: {
          id: "delete" + (subreddits.length - 1)
        }
      }).append("x").click(function () {

        deleteSubreddit(this.id)
      }).appendTo("#subreddit" + (subreddits.length - 1));

      $("#input").text("");
      /* Alert the copied text */
      $("#note2").css("line-height", "2.5");

      setTimeout(function () {
        $("#note2").css("line-height", "0");
      }, 2000);
    }

  }).error(function () {

    $("#input").text("");
    /* Alert the copied text */
    $("#note3").css("line-height", "2.5");

    setTimeout(function () {
      $("#note3").css("line-height", "0");
    }, 2000);
  });



}




function deleteSubreddit(id) {

  var index = id.replace("delete", "");
  subreddits.splice(index, 1);
  $("#subreddit" + index).remove();

}


function copyToClipboard() {
  var dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = memeURL;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);

  /* Alert the copied text */
  $("#note1").css("line-height", "2.5");

  setTimeout(function () {
    $("#note1").css("line-height", "0");
  }, 2000);



}

$("#menuButton").click(function() {
    menuClick();
});

$("#shareButton").click(function() {
  copyToClipboard();
});

close = document.getElementById("close");
close.addEventListener('click', function () {
  note = document.getElementById("note");
  note.style.display = 'none';
}, false);





