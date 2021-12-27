
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

window.whatIsStargatePlayer = undefined;

function nFormatter(num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num;
}

function updateNavStyles() {
  var nav = document.getElementById('stargate-main-navigation');
  if (nav) {
    if (window.pageYOffset > 0) {
      nav.classList.add('fixed');
    } else {
      if (!nav.classList.contains('open')) {
        nav.classList.remove('fixed');
      }
    }
  }
}

function onYouTubeIframeAPIReady() {
  window.whatIsStargatePlayer = new YT.Player('whatis-stargate-video', {
  });
}

$(document).ready(function () {
  var stats = document.getElementById('github-stats');
  var releases = document.getElementById('github-releases');

  if (stats) {
    var repository = stats.dataset.repository;

    if (repository) {
      $.ajax({
        url: 'https://api.github.com/repos/' + repository
      })
        .done(function (repo) {
          stats.classList.remove('hidden');
          document.getElementById('git-watchers').innerHTML = nFormatter(repo.subscribers_count || 0);
          document.getElementById('git-stars').innerHTML = nFormatter(repo.stargazers_count || 0);
          document.getElementById('git-forks').innerHTML = nFormatter(repo.forks_count || 0);
        });
    }
  }

  if (releases) {
    var repository = releases.dataset.repository;

    if (repository) {
      $.ajax({
        url: 'https://api.github.com/repos/' + repository + '/releases'
      })
        .done(function (releasesArray) {
          const release = releasesArray[0];
          const name = release.name.replace(/((R|r)elease( v)?)/, '');
          releases.classList.remove('hidden');
          releases.innerHTML = `Latest Stargate Release: <span>${name}</span> [<a href="${release.html_url}">Release Notes</a>]`;
        });
    }
  }

  updateNavStyles();
  window.addEventListener('scroll', updateNavStyles);

  $('#stargate-navigation').on('show.bs.collapse', function () {
    $('#stargate-main-navigation').addClass('open');
  })
  $('#stargate-navigation').on('hidden.bs.collapse', function () {
    $('#stargate-main-navigation').removeClass('open');
  })

  $('#what-is-stargate-video-modal').on('show.bs.modal', function () {
    if (window.whatIsStargatePlayer) {
      window.whatIsStargatePlayer.playVideo();
    }
  });

  $('#what-is-stargate-video-modal').on('hide.bs.modal', function () {
    if (window.whatIsStargatePlayer) {
      window.whatIsStargatePlayer.stopVideo();
    }
  });

  $('form[newsletter-form]').on('submit', function(event) {
    event.preventDefault();

    // TODO: add functionality to the newsletter form
  });
});

if (typeof jQuery === "undefined") { throw new Error("jQuery required"); }

(function ($) {
  'use strict';

  // SEARCHBAR CLASS DEFINITION
  // =========================

  var backdrop = '.searchbar-backdrop';
  var toggle = '[data-toggle="searchbar"]';
  var Searchbar = function (element) {
    $(element).on('click.mr.searchbar', this.toggle);
  };

  Searchbar.VERSION = '1.0.0';

  Searchbar.prototype.toggle = function (e) {
    var $this = $(this);

    if ($this.is('.disabled, :disabled')) return;

    var $parent = getParent($this);
    var isActive = $parent.hasClass('open') || (typeof isXS == 'function' && isXS());

    if (!isActive) {

      clearMenus();
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="searchbar-backdrop"/>').insertAfter($(this)).on('click', clearMenus);
      }

      var relatedTarget = { relatedTarget: this };
      $parent.trigger(e = $.Event('show.mr.searchbar', relatedTarget));

      if (e.isDefaultPrevented()) return;
      e.preventDefault();

      $parent.find('input').trigger('focus');

      $parent
        .toggleClass('open')
        .trigger('shown.mr.searchbar', relatedTarget);

      return false;
    }
  };

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove();
    $(toggle).each(function () {
      var $parent = getParent($(this));
      var relatedTarget = { relatedTarget: this };
      if (!$parent.hasClass('open')) return;
      $parent.trigger(e = $.Event('hide.mr.searchbar', relatedTarget));
      if (e.isDefaultPrevented()) return;
      $parent.removeClass('open').trigger('hidden.mr.searchbar', relatedTarget);
    });
  }

  function getParent($this) {
    var selector = $this.attr('data-target');

    if (!selector) {
      return $this.parents('form');
    }

    var $parent = selector && $(selector);

    return $parent && $parent.length ? $parent : $this.parent();
  }


  // SEARCHBAR PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('mr.searchbar');

      if (!data) $this.data('mr.searchbar', (data = new Searchbar(this)));
      if (typeof option == 'string') data[option].call($this);
    });
  }

  var old = $.fn.searchbar;

  $.fn.searchbar = Plugin;
  $.fn.searchbar.Constructor = Searchbar;


  // SEARCHBAR NO CONFLICT
  // ====================

  $.fn.searchbar.noConflict = function () {
    $.fn.searchbar = old;
    return this;
  };


  // APPLY TO STANDARD SEARCHBAR ELEMENTS
  // ===================================

  $(document)
    .on('click.mr.searchbar.data-api', clearMenus)
    .on('click.mr.searchbar.data-api', '.searchbar', function (e) { e.stopPropagation(); })
    //.on('focus.mr.searchbar.data-api', toggle, Searchbar.prototype.toggle) // this causes the focus event to trigger twice
    .on('click.mr.searchbar.data-api', toggle, Searchbar.prototype.toggle);


})(jQuery);