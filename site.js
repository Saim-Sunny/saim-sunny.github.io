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


  // Client work: YouTube plays here, Instagram and Facebook open on their own site.
  function platformOf(url) {
    if (/youtu\.?be/.test(url)) return 'YouTube';
    if (/instagram\.com/.test(url)) return 'Instagram';
    if (/facebook\.com|fb\.watch/.test(url)) return 'Facebook';
    return 'Link';
  }
  function ytId(url) {
    var m = /(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/.exec(url);
    return m ? m[1] : null;
  }
  var PAL = ['#e0150c', '#1d2a4d', '#e8841f', '#1d4f9c'];
  function cover(i) {
    var a = PAL[i % 4], b = PAL[(i + 1) % 4], c = PAL[(i + 2) % 4];
    var x = 30 + (i * 37) % 40, y = 35 + (i * 23) % 30;
    var svg = '<svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="160" height="90" fill="#e9e6df"/>' +
      '<circle cx="' + (x + 70) + '" cy="' + (y - 10) + '" r="46" fill="' + a + '"/>' +
      '<circle cx="' + x + '" cy="' + (y + 30) + '" r="30" fill="' + b + '" opacity=".9"/>' +
      '<circle cx="' + (x + 40) + '" cy="' + (y + 18) + '" r="6" fill="' + c + '"/>' +
      '<path d="M-10 ' + (y + 70) + ' Q80 ' + (y - 40) + ' 170 ' + (y + 40) + '" stroke="#1d2a4d" fill="none" stroke-width=".8"/>' +
      '</svg>';
    var img = new Image();
    img.alt = '';
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    return img;
  }
  function clientTile(c, i) {
    var p = platformOf(c.link), id = p === 'YouTube' ? ytId(c.link) : null;
    if (id) {
      var f = tile({ id: id, title: c.title, length: c.client, group: 'Client work' }, false);
      f.querySelector('.cap-len').textContent = c.client || '';
      return f;
    }
    var fig = document.createElement('figure');
    fig.dataset.group = 'Client work';
    var a = document.createElement('a');
    a.className = 'tile has-img';
    a.href = c.link;
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', 'Watch ' + c.title + ' on ' + p);
    if (c.thumb) { var im = new Image(); im.alt = ''; im.src = c.thumb; a.appendChild(im); }
    else a.appendChild(cover(i));
    var tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = p + ' \u2197';
    a.appendChild(tag);
    fig.appendChild(a);
    var cap = document.createElement('figcaption');
    cap.innerHTML = '<span class="cap-title"></span><span class="cap-len"></span>';
    cap.firstChild.textContent = c.title;
    cap.lastChild.textContent = c.client || '';
    fig.appendChild(cap);
    return fig;
  }
  var clients = site.clients || [];
  document.querySelectorAll('[data-clients]').forEach(function (box) {
    if (!clients.length) return;
    var max = parseInt(box.getAttribute('data-clients'), 10) || clients.length;
    clients.slice(0, max).forEach(function (c, i) { box.appendChild(clientTile(c, i)); });
    var sec = box.closest('[hidden]');
    if (sec) sec.hidden = false;
  });

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

  // Stretch the big name to the full page width.
  var fit = document.querySelector('.giant.fit');
  if (fit) {
    var fitNow = function () {
      var span = fit.firstElementChild, cs = getComputedStyle(fit);
      var avail = fit.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      var w = span.getBoundingClientRect().width;
      if (w) fit.style.fontSize = (parseFloat(cs.fontSize) * avail / w) + 'px';
    };
    fitNow();
    if (document.fonts) document.fonts.ready.then(fitNow);
    window.addEventListener('resize', fitNow);
  }

  if (site.instagram) {
    var ig = document.getElementById('ig');
    if (ig) { ig.href = site.instagram; ig.hidden = false; }
  }
})();
