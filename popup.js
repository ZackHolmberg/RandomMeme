$.ajaxSetup({
  async: false
});

//Google Analytics Stuff
(function () {
  var ga = document.createElement("script");
  ga.type = "text/javascript";
  ga.async = true;
  ga.src = "https://ssl.google-analytics.com/ga.js";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(ga, s);
})();

var _gaq = _gaq || [];
_gaq.push(["_setAccount", "UA-148351255-1"]);
_gaq.push(["_trackPageview"]);

(function () {
  var ga = document.createElement("script");
  ga.type = "text/javascript";
  ga.async = true;
  ga.src = "https://ssl.google-analytics.com/ga.js";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(ga, s);
})();

//Array that holds the user's subreddits.
var subreddits;

//Array the holds all of the memes.
var memes;

var alreadyViewedMemes;

//Link of pic being displated
var memeURL;

var noMemes;

const setStorageData = data =>
  new Promise((resolve, reject) =>
    chrome.storage.sync.set(data, () =>
      chrome.runtime.lastError ?
      reject(Error(chrome.runtime.lastError.message)) :
      resolve()
    )
  );

window.onload = function () {
  chrome.storage.sync.get("subreddits", function (result) {
    if (result.subreddits) {
      subreddits = result.subreddits;
    } else {
      subreddits = [];
      noSubsOrMemes = true;
    }
  });

  chrome.storage.sync.get("alreadyViewedMemes", function (result) {
    if (result.alreadyViewedMemes) {
      alreadyViewedMemes = result.alreadyViewedMemes;
    } else {
      alreadyViewedMemes = [];

    }
  });

  chrome.storage.sync.get("memes", function (result) {
    if (result.memes) {

      memes = result.memes;
    } else {
      memes = [];
    }

    getMemes();
    getMeme();


    //Disable the next meme button if there are no memes.
    if (!!memes.length) {
      $("#myButton").removeClass("button_disabled");
      $("#myButton").addClass("button");
    } else {
      $("#myButton").removeClass("button");
      $("#myButton").addClass("button_disabled");
    }
    checkIfShouldDisplayBubbleTip();
  });


};

function checkIfShouldDisplayBubbleTip() {
  if(!memes.length && !subreddits.length) { $("#noMemesBubble").show(); }
}

function getMeme() {
  if (!!memes.length) {
    $("#noMemesBubble").hide();
    $("#my_image").attr("src", memes[0]);
    memeURL = memes[0];
    alreadyViewedMemes.push(memeURL);
    memes.splice(0, 1);
    $("#memesLeft").text(memes.length + " memes left.");
    setStorageData({
      memes: memes
    });
    setStorageData({
      alreadyViewedMemes: alreadyViewedMemes
    });
  } else {
    noMemes = true;
    $("#my_image").attr("src", "images/noMemes.jpeg");
  }
  if (!!memes.length) {
    $("#myButton").removeClass("button_disabled");
    $("#myButton").addClass("button");
  } else {
    $("#myButton").removeClass("button");
    $("#myButton").addClass("button_disabled");
  }
}

function getMemes() {
  for (var i = 0; i < subreddits.length; i++) {
    $.getJSON("https://www.reddit.com/r/" + subreddits[i] + ".json", function (
      data
    ) {
      $.each(data.data.children, function (i, item) {
        if (
          i != 0 &&
          (item.data.url.includes(".jpg") ||
            item.data.url.includes(".jpeg") ||
            item.data.url.includes(".png"))
        ) {
          var meme = "" + item.data.url;
          if (!memes.includes(meme) && !alreadyViewedMemes.includes(meme)) {
            memes.push(meme);
          }
        }
      });
    });
  }

  setStorageData({
    memes: memes
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var link = document.getElementById("myButton");
  // onClick's logic below:
  link.addEventListener("click", function () {
    _gaq.push(["_trackEvent", "Memes Viewed", "clicked"]);
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

    if (!!memes.length) {
      $("#myButton").fadeTo(25, 1);
    } else {
      $("#myButton").fadeTo(25, 0.5);
    }

    $("#memesLeft").fadeTo(25, 1);

    $("#shareButton").fadeTo(25, 1);

    $("#menuInfo").empty();

    menuOpen = false;

    if (noMemes && !!memes.length) {
      getMeme();
      noMemes = false;
    }

    checkIfShouldDisplayBubbleTip();

  }

  //Else the menu is not open so open the menu and hide some UI aspects
  else {
    $("#noMemesBubble").hide();
    $("#my_image").css("display", "none");
    $("#menu").css("height", "auto");

    $("#myButton").fadeTo(25, 0);

    $("#memesLeft").fadeTo(25, 0);

    $("#shareButton").fadeTo(25, 0);

    setTimeout(function () {
      $("#menuInfo").css("display", "inline-block");
    }, 250);

    $("<h1>", {
        class: "menuInfoText"
      })
      .append("Your Subreddits:")
      .appendTo("#menuInfo");

    $("<div>", {
      class: "subredditContainer",
      attr: {
        id: "list"
      }
    }).appendTo("#menuInfo");

    if (!!subreddits.length) {
      for (var i = 0; i < subreddits.length; i++) {
        $("<div>", {
          class: "subredditEntry",
          attr: {
            id: "subreddit" + i
          }
        }).appendTo("#list");

        $("<h1>", {
            class: "menuInfoText"
          })
          .append("r/" + subreddits[i])
          .appendTo("#subreddit" + i);

        $("<div>", {
            class: "deleteBtn",
            attr: {
              id: "delete" + i
            }
          })
          .append("x")
          .click(function () {
            deleteSubreddit(this.id);
          })
          .appendTo("#subreddit" + i);
      }
    } else {
      $("<div>", {
        class: "subredditEntry noSubreddits",
        attr: {
          id: "noSubreddits"
        }
      }).appendTo("#list");

      $("<h1>", {
          class: "menuInfoText"
        })
        .append("No Subreddits")
        .appendTo("#noSubreddits");
    }

    $("<h1>", {
        class: "menuInfoText"
      })
      .append("Add a Subreddit (excluding the r/)")
      .appendTo("#menuInfo");

    $("<div>", {
      class: "custContainer",
      attr: {
        id: "list2"
      }
    }).appendTo("#menuInfo");

    $("<input>")
      .attr({
        type: "text",
        id: "input",
        name: "Subreddit Name"
      })
      .appendTo("#list2");

    $("<div>", {
        class: "submitBtn"
      })
      .click(function () {
        addSubreddit();
      })
      .append("Submit")
      .appendTo("#list2");

    menuOpen = true;
  }
}

function addSubreddit() {
  var input = $("#input").val();
  $.getJSON("https://www.reddit.com/r/" + input + ".json", function () {
    $("#noSubreddits").remove();
    $("#noMemesBubble").hide();
    subreddits.push(input);
    setStorageData({
      subreddits: subreddits
    });
    getMemes();
    setStorageData({
      memes: memes
    });

    $("#memesLeft").text(memes.length + " memes left.");

    $("<div>", {
      attr: {
        id: "subreddit" + (subreddits.length - 1)
      }
    }).addClass('subredditEntry').appendTo("#list");

    $("<h1>", {
        class: "menuInfoText"
      })
      .append("r/" + input)
      .appendTo("#subreddit" + (subreddits.length - 1));

    $("<div>", {
        class: "deleteBtn",
        attr: {
          id: "delete" + (subreddits.length - 1)
        }
      })
      .append("x")
      .click(function () {
        deleteSubreddit(this.id);
      })
      .appendTo("#subreddit" + (subreddits.length - 1));

    $("#input").text("");
    /* Alert the copied text */
    $("#note2").css("line-height", "2.5");

    setTimeout(function () {
      $("#note2").css("line-height", "0");
    }, 2000);
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
  setStorageData({
    subreddits: subreddits
  });
  checkNoMoreSubreddits();
}

function copyToClipboard() {
  var text = document.createElement("textarea");
  document.body.appendChild(text);
  text.value = memeURL;
  text.select();
  document.execCommand("copy");
  document.body.removeChild(text);

  /* Alert the copied text */
  $("#note1").css("line-height", "2.5");

  setTimeout(function () {
    $("#note1").css("line-height", "0");
  }, 2000);
}

$("#menuButton").click(function () {
  menuClick();
});

$("#shareButton").click(function () {
  copyToClipboard();
});

close = document.getElementById("close");
close.addEventListener(
  "click",
  function () {
    note = document.getElementById("note");
    note.style.display = "none";
  },
  false
);

// checks if one day has passed.
function hasOneDayPassed() {
  // get today's date. eg: "7/37/2007"
  var date = new Date().toLocaleDateString();

  chrome.storage.sync.get("dateOfLastCacheClear", function (result) {
    if (!!result.dateOfLastCacheClear && result.dateOfLastCacheClear != date) {
      setStorageData({
        dateOfLastCacheClear: date
      });
      return true;
    }
  });

  return false;
}

//clear the already viewed meme cache once per day.
function clearViewedMemesCacheOnceADay() {
  if (!hasOneDayPassed()) return false;

  // your code below
  setStorageData({
    alreadyViewedMemes: []
  });
}

function checkNoMoreSubreddits() {
  if (subreddits.length == 0) {
    $("<div>", {
      attr: {
        id: "noSubreddits"
      }
    }).addClass('subredditEntry noSubreddits').appendTo("#list");

    $("<h1>", {
        class: "menuInfoText"
      })
      .append("No Subreddits")
      .appendTo("#noSubreddits");
  }
}

clearViewedMemesCacheOnceADay();