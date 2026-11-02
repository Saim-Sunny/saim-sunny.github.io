(function () {
  var site = window.SITE || {};
  // Players only work on the real site. Anywhere else, videos open on YouTube.
  var canEmbed = /(^|\.)saimsunny\.net$|github\.io$/.test(location.hostname);
  var groups = site.groups || [];
  var all = [];
  if (site.featured) all.push(Object.assign({ group: 'Films and vlogs' }, site.featured));
  groups.forEach(function (g) {
    g.videos.forEach(function (v) { all.push(Object.assign({ group: g.name }, v)); });
  });
  function byId(id) { return all.filter(function (v) { return v.id === id; })[0]; }

  function thumb(v, sharp) {
    var img = new Image();
    img.alt = '';
    var base = 'https://i.ytimg.com/vi/' + encodeURIComponent(v.id) + '/';
    img.onload = function () {
      // YouTube serves a tiny placeholder when the large thumbnail does not exist.
      if (img.naturalWidth < 200 && img.src.indexOf('maxres') > -1) { img.src = base + 'hqdefault.jpg'; return; }
      img.parentNode.classList.add('has-img');
    };
    img.onerror = function () { if (img.src.indexOf('maxres') > -1) img.src = base + 'hqdefault.jpg'; };
    img.src = base + (sharp ? 'maxresdefault.jpg' : 'hqdefault.jpg');
    return img;
  }

  function tile(v, sharp) {
    var fig = document.createElement('figure');
    fig.dataset.group = v.group || '';
    var a = document.createElement('a');
    a.className = 'tile';
    a.href = 'https://www.youtube.com/watch?v=' + encodeURIComponent(v.id);
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', 'Play ' + v.title);
    a.appendChild(thumb(v, sharp));
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
    var t = document.createElement('span');
    t.className = 'cap-title';
    t.textContent = v.title;
    var l = document.createElement('span');
    l.className = 'cap-len';
    l.textContent = v.length;
    cap.appendChild(t);
    cap.appendChild(l);
    fig.appendChild(cap);
    return fig;
  }

  var strip = document.getElementById('strip');
  if (strip) {
    var photo = strip.firstElementChild;
    (site.strip || []).forEach(function (id, i) {
      var v = byId(id);
      if (!v) return;
      var a = document.createElement('a');
      a.className = 'strip-item';
      a.href = 'video.html';
      a.setAttribute('aria-label', v.title);
      a.appendChild(thumb(v));
      strip.insertBefore(a, i === 2 ? photo : null);
    });
  }

  var feat = document.getElementById('featured');
  if (feat && site.featured) feat.appendChild(tile(site.featured, true));

  var picks = document.getElementById('picks');
  if (picks) (site.picks || []).forEach(function (id) {
    var v = byId(id);
    if (v) picks.appendChild(tile(v));
  });

  var grid = document.getElementById('groups');
  if (grid) {
    all.forEach(function (v) { grid.appendChild(tile(v, v === all[0])); });
    grid.firstElementChild.classList.add('wide');
    var box = document.getElementById('filters');
    ['All'].concat(groups.filter(function (g) { return g.videos.length; }).map(function (g) { return g.name; }))
      .forEach(function (name) {
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = name;
        b.setAttribute('aria-pressed', name === 'All');
        b.addEventListener('click', function () {
          box.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
          grid.querySelectorAll('figure').forEach(function (f) {
            f.hidden = name !== 'All' && f.dataset.group !== name;
          });
        });
        box.appendChild(b);
      });
  }

  if (site.instagram) {
    var ig = document.getElementById('ig');
    if (ig) { ig.href = site.instagram; ig.hidden = false; }
  }
})();
