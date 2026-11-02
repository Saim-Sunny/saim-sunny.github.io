(function () {
  var site = window.SITE || {};
  var canEmbed = /(^|\.)saimsunny\.net$|github\.io$/.test(location.hostname);
  var PAL = ['#e0150c', '#1d2a4d', '#e8841f', '#1d4f9c'];

  // Turn every entry into { title, note, kind, id, url, thumb, group }.
  function norm(v, group) {
    var link = v.link || (v.id ? 'https://www.youtube.com/watch?v=' + v.id : '');
    var kind = /instagram\.com/.test(link) ? 'Instagram' : /facebook\.com|fb\.watch/.test(link) ? 'Facebook' : 'YouTube';
    var id = v.id;
    if (!id && kind === 'YouTube') {
      var m = /(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/.exec(link);
      id = m ? m[1] : null;
    }
    return { title: v.title || '', note: v.client || v.length || '', kind: kind, id: id, url: link, thumb: v.thumb, group: group };
  }
  var all = [];
  (site.groups || []).forEach(function (g) {
    (g.videos || []).forEach(function (v) { all.push(norm(v, g.name)); });
  });

  function cover(i) {
    var a = PAL[i % 4], b = PAL[(i + 1) % 4], c = PAL[(i + 2) % 4];
    var x = 30 + (i * 37) % 40, y = 35 + (i * 23) % 30;
    var svg = '<svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="160" height="90" fill="#e9e6df"/>' +
      '<circle cx="' + (x + 70) + '" cy="' + (y - 10) + '" r="46" fill="' + a + '"/>' +
      '<circle cx="' + x + '" cy="' + (y + 30) + '" r="30" fill="' + b + '" opacity=".9"/>' +
      '<circle cx="' + (x + 40) + '" cy="' + (y + 18) + '" r="6" fill="' + c + '"/>' +
      '<path d="M-10 ' + (y + 70) + ' Q80 ' + (y - 40) + ' 170 ' + (y + 40) + '" stroke="#1d2a4d" fill="none" stroke-width=".8"/></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  function thumb(v, i, sharp) {
    var img = new Image();
    img.alt = '';
    img.loading = 'lazy';
    if (v.thumb) img.src = v.thumb;
    else if (v.id) {
      var base = 'https://i.ytimg.com/vi/' + encodeURIComponent(v.id) + '/';
      img.onload = function () {
        if (img.naturalWidth < 200 && img.src.indexOf('maxres') > -1) { img.src = base + 'hqdefault.jpg'; return; }
      };
      img.onerror = function () { if (img.src.indexOf('maxres') > -1) img.src = base + 'hqdefault.jpg'; };
      img.src = base + (sharp ? 'maxresdefault.jpg' : 'hqdefault.jpg');
    } else img.src = cover(i);
    img.addEventListener('load', function () { img.parentNode && img.parentNode.classList.add('has-img'); });
    return img;
  }

  // Instagram plays in a pop-up player; YouTube plays in place; Facebook opens on Facebook.
  var player = document.getElementById('player');
  function openPlayer(src, tall) {
    if (!player) return false;
    var f = document.createElement('iframe');
    f.src = src;
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    var box = player.querySelector('.frame');
    box.className = 'frame' + (tall ? ' tall' : '');
    box.innerHTML = '';
    box.appendChild(f);
    player.hidden = false;
    document.body.style.overflow = 'hidden';
    return true;
  }
  function closePlayer() {
    player.hidden = true;
    player.querySelector('.frame').innerHTML = '';
    document.body.style.overflow = '';
  }
  if (player) {
    player.addEventListener('click', function (e) { if (e.target === player || e.target.closest('.close')) closePlayer(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !player.hidden) closePlayer(); });
  }

  function tile(v, i, sharp) {
    var fig = document.createElement('figure');
    fig.dataset.group = v.group || '';
    var a = document.createElement('a');
    a.className = 'tile';
    a.href = v.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', 'Play ' + v.title + (v.kind !== 'YouTube' ? ' on ' + v.kind : ''));
    a.appendChild(thumb(v, i, sharp));
    if (v.kind !== 'YouTube') {
      var tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = v.kind;
      a.appendChild(tag);
    }
    if (canEmbed && v.kind === 'YouTube' && v.id) {
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
    if (canEmbed && v.kind === 'Instagram') {
      var m = /instagram\.com\/(?:[\w.]+\/)?(reel|reels|p|tv)\/([\w-]+)/.exec(v.url);
      if (m) a.addEventListener('click', function (e) {
        if (openPlayer('https://www.instagram.com/' + (m[1] === 'reels' ? 'reel' : m[1]) + '/' + m[2] + '/embed/', true)) e.preventDefault();
      });
    }
    fig.appendChild(a);
    var cap = document.createElement('figcaption');
    var t = document.createElement('span');
    t.className = 'cap-title';
    t.textContent = v.title;
    var l = document.createElement('span');
    l.className = 'cap-len';
    l.textContent = v.note;
    cap.appendChild(t);
    cap.appendChild(l);
    fig.appendChild(cap);
    return fig;
  }

  // Home page: three videos.
  var home = document.getElementById('home-videos');
  if (home) (site.home || []).forEach(function (key, i) {
    var v = all.filter(function (x) { return x.id === key || x.url === key; })[0] || norm(/^http/.test(key) ? { link: key } : { id: key }, '');
    home.appendChild(tile(v, i, i === 0));
  });

  // Video page: everything, with filters.
  var grid = document.getElementById('groups');
  if (grid) {
    all.forEach(function (v, i) { grid.appendChild(tile(v, i, i === 0)); });
    if (grid.firstElementChild) grid.firstElementChild.classList.add('wide');
    var box = document.getElementById('filters');
    var names = (site.groups || []).filter(function (g) { return (g.videos || []).length; }).map(function (g) { return g.name; });
    ['All'].concat(names).forEach(function (name) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = name;
      b.setAttribute('aria-pressed', name === 'All');
      b.addEventListener('click', function () {
        box.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        var first = true;
        grid.querySelectorAll('figure').forEach(function (f) {
          f.hidden = name !== 'All' && f.dataset.group !== name;
          f.classList.toggle('wide', !f.hidden && first);
          if (!f.hidden) first = false;
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
