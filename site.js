(function () {
  var site = window.SITE || {};
  // Players only work on the real site. Anywhere else, videos open on YouTube.
  var canEmbed = /(^|\.)saimsunny\.net$|github\.io$/.test(location.hostname);

  function tile(v, big) {
    var fig = document.createElement('figure');
    if (big) fig.className = 'big';
    var a = document.createElement('a');
    a.className = 'tile';
    a.href = 'https://www.youtube.com/watch?v=' + encodeURIComponent(v.id);
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', 'Play ' + v.title);

    var word = document.createElement('span');
    word.className = 'tile-title';
    word.textContent = v.title;
    a.appendChild(word);

    var img = new Image();
    img.alt = '';
    img.loading = 'lazy';
    img.onload = function () { a.classList.add('has-img'); };
    img.src = 'https://i.ytimg.com/vi/' + encodeURIComponent(v.id) + '/hqdefault.jpg';
    a.appendChild(img);

    var play = document.createElement('span');
    play.className = 'play';
    play.setAttribute('aria-hidden', 'true');
    a.appendChild(play);

    var len = document.createElement('span');
    len.className = 'len';
    len.textContent = v.length;
    a.appendChild(len);

    if (canEmbed) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var f = document.createElement('iframe');
        f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(v.id) + '?autoplay=1';
        f.title = v.title;
        f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
        f.allowFullscreen = true;
        a.replaceWith(f);
      });
    }

    fig.appendChild(a);
    var cap = document.createElement('figcaption');
    cap.textContent = v.title;
    fig.appendChild(cap);
    return fig;
  }

  var feat = document.getElementById('featured');
  if (feat && site.featured) feat.appendChild(tile(site.featured, true));

  var picks = document.getElementById('picks');
  if (picks) {
    var all = [];
    (site.groups || []).forEach(function (g) { all = all.concat(g.videos); });
    (site.picks || []).forEach(function (id) {
      var v = all.filter(function (x) { return x.id === id; })[0];
      if (v) picks.appendChild(tile(v));
    });
  }

  var groups = document.getElementById('groups');
  if (groups) (site.groups || []).forEach(function (g) {
    if (!g.videos.length) return;
    var h = document.createElement('h3');
    h.className = 'group';
    h.textContent = g.name;
    groups.appendChild(h);
    var grid = document.createElement('div');
    grid.className = 'grid';
    g.videos.forEach(function (v) { grid.appendChild(tile(v)); });
    groups.appendChild(grid);
  });

  if (site.instagram) {
    var ig = document.getElementById('ig');
    if (ig) ig.href = site.instagram;
    if (ig) ig.hidden = false;
  }
})();
