$.ajaxSetup({ async: false });

//Google Analytics Stuff
(function() {
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

(function() {
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

//Link of pic being displated
var memeURL;

var noMemes;

const setStorageData = data =>
  new Promise((resolve, reject) =>
    chrome.storage.sync.set(data, () =>
      chrome.runtime.lastError
        ? reject(Error(chrome.runtime.lastError.message))
        : resolve()
    )
  );

window.onload = function() {
  chrome.storage.sync.get("subreddits", function(result) {
    if (result.length) {
      console.log("subreddits object: ");
      console.log(result);
      subreddits = result;
    } else {
      console.log("Result empty, initializing subreddits...");
      subreddits = [];
    }
  });

  chrome.storage.sync.get("memes", function(result) {
    if (result.length) {
      console.log("memes object: ");
      console.log(result);
      console.log(result.length);
      memes = result;
    } else {
      console.log("Result empty, initializing memes...");
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
  });
};

function getMeme() {
  if (!!memes.length) {
    $("#my_image").attr("src", memes[0]);
    memeURL = memes[0];
    memes.splice(0, 1);
    $("#memesLeft").text(memes.length + " memes left.");
    setStorageData({ memes: memes });
  } else {
    noMemes = true;
    $("#my_image").attr("src", "images/noneAvailable.webp");
    $("#caption").text(
      "No memes avaiable. Either you have browsed all the top memes of your selected subreddits, you have no selected subreddits in the menu, or you are not connected to the internet."
    );
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
    $.getJSON("https://www.reddit.com/r/" + subreddits[i] + ".json", function(
      data
    ) {
      $.each(data.data.children, function(i, item) {
        if (
          i != 0 &&
          (item.data.url.includes(".jpg") ||
            item.data.url.includes(".jpeg") ||
            item.data.url.includes(".png"))
        ) {
          var meme = item.data.url;
          if (!memes.indexOf(meme) > -1) {
            console.log(meme);
            memes.push(meme);
            setStorageData({ memes: memes });
          }
        }
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", function() {
  var link = document.getElementById("myButton");
  // onClick's logic below:
  link.addEventListener("click", function() {
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
      console.log("fading back to full");
      $("#myButton").fadeTo(25, 1, function() {
        //not fading back properly
        // Animation complete.
      });
    } else {
      console.log("fading back to half");
      $("#myButton").fadeTo(25, 0.5, function() {
        // Animation complete.
      });
    }

    $("#memesLeft").fadeTo(25, 1, function() {
      // Animation complete.
    });

    $("#shareButton").fadeTo(25, 1, function() {
      // Animation complete.
    });

    $("#menuInfo").empty();
    menuOpen = false;

    if(noMemes && !!memes.length) { getMeme(); noMemes = false; }
  }

  //Else the menu is not open so open the menu and hide some UI aspects
  else {
    $("#my_image").css("display", "none");
    $("#menu").css("height", "auto");

    $("#myButton").fadeTo(25, 0, function() {
      // Animation complete.
    });

    $("#memesLeft").fadeTo(25, 0, function() {
      // Animation complete.
    });

    $("#shareButton").fadeTo(25, 0, function() {
      // Animation complete.
    });

    setTimeout(function() {
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
          .click(function() {
            deleteSubreddit(this.id);
          })
          .appendTo("#subreddit" + i);
      }
    } else {
      $("<div>", {
        class: "subredditEntry",
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
      .click(function() {
        console.log("clicking button");
        addSubreddit();
      })
      .append("Submit")
      .appendTo("#list2");

    menuOpen = true;
  }
}

function addSubreddit() {
  var input = $("#input").val();
  console.log("got input: " + input);

  $.getJSON("https://www.reddit.com/r/" + input + ".json", function() {
    console.log("checking if valid...");
    $("#noSubreddits").remove(); //add this back if all subreddits are deleted

    subreddits.push(input);
    getMemes();
    setStorageData({ subreddits: subreddits });
    setStorageData({ memes: memes });

    $("#memesLeft").text(memes.length + " memes left.");

    $("<div>", {
      class: "subredditEntry",
      attr: {
        id: "subreddit" + (subreddits.length - 1)
      }
    }).appendTo("#list");

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
      .click(function() {
        deleteSubreddit(this.id);
      })
      .appendTo("#subreddit" + (subreddits.length - 1));

    $("#input").text("");
    /* Alert the copied text */
    $("#note2").css("line-height", "2.5");

    setTimeout(function() {
      $("#note2").css("line-height", "0");
    }, 2000);
  }).error(function() {
    $("#input").text("");
    /* Alert the copied text */
    $("#note3").css("line-height", "2.5");

    setTimeout(function() {
      $("#note3").css("line-height", "0");
    }, 2000);
  });
}

function deleteSubreddit(id) {
  var index = id.replace("delete", "");
  subreddits.splice(index, 1);
  $("#subreddit" + index).remove();
  setStorageData({ subreddits: subreddits });
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

  setTimeout(function() {
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
close.addEventListener(
  "click",
  function() {
    note = document.getElementById("note");
    note.style.display = "none";
  },
  false
);
