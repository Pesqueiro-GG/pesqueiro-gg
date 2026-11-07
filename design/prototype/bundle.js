/* @ds-bundle: {"format":4,"namespace":"PesqueiroGG","components":[{"name":"Logo"},{"name":"Icon"},{"name":"Button"},{"name":"Chip"},{"name":"RarityBadge"},{"name":"Avatar"},{"name":"Sticker"},{"name":"FishLine"},{"name":"LeaderboardRow"},{"name":"CatchCard"},{"name":"ChallengeCard"},{"name":"PromotionBanner"},{"name":"BottomNav"}]} */
(function () {
  var React = window.React;
  var h = React.createElement;

  /* Lucide 1.60.0 (ISC), copied from lucide-static: the inner markup of each 24x24 icon. */
  var ICONS = {"bell":"<path d=\"M10.268 21a2 2 0 0 0 3.464 0\" /><path d=\"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326\" />","book-open":"<path d=\"M12 5v16\" /><path d=\"M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z\" />","camera":"<path d=\"M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z\" /><circle cx=\"12\" cy=\"13\" r=\"3\" />","check":"<path d=\"M20 6 9 17l-5-5\" />","fish":"<path d=\"M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z\" /><path d=\"M18 12v.5\" /><path d=\"M16 17.93a9.77 9.77 0 0 1 0-11.86\" /><path d=\"M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33\" /><path d=\"M10.46 7.26C10.2 5.88 9.17 4.24 8 3h5.8a2 2 0 0 1 1.98 1.67l.23 1.4\" /><path d=\"m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98\" />","fishing-hook":"<path d=\"m17.586 11.414-5.93 5.93a1 1 0 0 1-8-8l3.137-3.137a.707.707 0 0 1 1.207.5V10\" /><path d=\"M20.414 8.586 22 7\" /><circle cx=\"19\" cy=\"10\" r=\"2\" />","flag":"<path d=\"M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528\" />","globe":"<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20\" /><path d=\"M2 12h20\" />","house":"<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\" /><path d=\"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\" />","lock":"<rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\" /><path d=\"M7 11V7a5 5 0 0 1 10 0v4\" />","map-pin":"<path d=\"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0\" /><circle cx=\"12\" cy=\"10\" r=\"3\" />","medal":"<path d=\"M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15\" /><path d=\"M11 12 5.12 2.2\" /><path d=\"m13 12 5.88-9.8\" /><path d=\"M8 7h8\" /><circle cx=\"12\" cy=\"17\" r=\"5\" /><path d=\"M12 18v-2h-.5\" />","message-circle":"<path d=\"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719\" />","plus":"<path d=\"M5 12h14\" /><path d=\"M12 5v14\" />","ruler":"<path d=\"M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z\" /><path d=\"m14.5 12.5 2-2\" /><path d=\"m11.5 9.5 2-2\" /><path d=\"m8.5 6.5 2-2\" /><path d=\"m17.5 15.5 2-2\" />","scale":"<path d=\"M12 3v18\" /><path d=\"m19 8 3 8a5 5 0 0 1-6 0zV7\" /><path d=\"M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1\" /><path d=\"m5 8 3 8a5 5 0 0 1-6 0zV7\" /><path d=\"M7 21h10\" />","search":"<path d=\"m21 21-4.34-4.34\" /><circle cx=\"11\" cy=\"11\" r=\"8\" />","settings":"<path d=\"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915\" /><circle cx=\"12\" cy=\"12\" r=\"3\" />","share-2":"<circle cx=\"18\" cy=\"5\" r=\"3\" /><circle cx=\"6\" cy=\"12\" r=\"3\" /><circle cx=\"18\" cy=\"19\" r=\"3\" /><line x1=\"8.59\" x2=\"15.42\" y1=\"13.51\" y2=\"17.49\" /><line x1=\"15.41\" x2=\"8.59\" y1=\"6.51\" y2=\"10.49\" />","shield-check":"<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\" /><path d=\"m9 12 2 2 4-4\" />","sparkles":"<path d=\"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z\" /><path d=\"M20 2v4\" /><path d=\"M22 4h-4\" /><circle cx=\"4\" cy=\"20\" r=\"2\" />","trophy":"<path d=\"M10 14.66V17a1 1 0 0 1-1 1 2 2 0 0 0-2 2v2\" /><path d=\"M14 14.66V17a1 1 0 0 0 1 1 2 2 0 0 1 2 2v2\" /><path d=\"M17.916 10H19.5A2.5 2.5 0 0 0 22 7.5V5a1 1 0 0 0-1-1h-3\" /><path d=\"M4 22h16\" /><path d=\"M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z\" /><path d=\"M6.084 10H4.5A2.5 2.5 0 0 1 2 7.5V5a1 1 0 0 1 1-1h3\" />","user":"<path d=\"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\" /><circle cx=\"12\" cy=\"7\" r=\"4\" />","users":"<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\" /><path d=\"M16 3.128a4 4 0 0 1 0 7.744\" /><path d=\"M22 21v-2a4 4 0 0 0-3-3.87\" /><circle cx=\"9\" cy=\"7\" r=\"4\" />","waves":"<path d=\"M2 12q2.5 2 5 0t5 0 5 0 5 0\" /><path d=\"M2 19q2.5 2 5 0t5 0 5 0 5 0\" /><path d=\"M2 5q2.5 2 5 0t5 0 5 0 5 0\" />"};

  function cx() {
    return Array.prototype.filter.call(arguments, Boolean).join(' ');
  }
  function omit(obj, keys) {
    var out = {};
    for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && keys.indexOf(k) < 0) out[k] = obj[k];
    return out;
  }

  function Icon(p) {
    var size = p.size || 20;
    return h('svg', {
      className: cx('pq-ico', p.className),
      width: size, height: size, viewBox: '0 0 24 24',
      fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round',
      role: p.label ? 'img' : undefined,
      'aria-label': p.label || undefined,
      'aria-hidden': p.label ? undefined : true,
      focusable: 'false',
      dangerouslySetInnerHTML: { __html: ICONS[p.name] || '' }
    });
  }

  /* The bobber, drawn for the interface (the app icon in assets/Logos adds the water square). */
  function Mark(size) {
    return h('svg', { className: 'pq-mark', width: size, height: size, viewBox: '0 0 64 64', 'aria-hidden': true, focusable: 'false' },
      h('ellipse', { className: 'pq-mark-ripple', cx: 32, cy: 47, rx: 25, ry: 6 }),
      h('g', { transform: 'rotate(-12 32 37)' },
        h('rect', { className: 'pq-mark-cream', x: 30.5, y: 9, width: 3, height: 16, rx: 1.5 }),
        h('path', { className: 'pq-mark-top', d: 'M19 37a13 13 0 0 1 26 0Z' }),
        h('path', { className: 'pq-mark-cream', d: 'M19 37a13 13 0 0 0 26 0Z' }),
        h('rect', { className: 'pq-mark-band', x: 18.2, y: 35.9, width: 27.6, height: 2.4, rx: 1.2 }),
        h('path', { className: 'pq-mark-shine', d: 'M24.5 32a8.5 8.5 0 0 1 5-5.5' })));
  }

  function Logo(p) {
    var size = p.size || 40;
    if (p.variant === 'mark') {
      return h('span', { className: cx('pq-logo', p.className), role: 'img', 'aria-label': 'Pesqueiro.GG' }, Mark(size));
    }
    return h('span', { className: cx('pq-logo', p.className), role: 'img', 'aria-label': 'Pesqueiro.GG', style: { fontSize: Math.round(size * 0.78) + 'px' } },
      Mark(size),
      h('span', { className: 'pq-logo-word', 'aria-hidden': true }, 'Pesqueiro', h('span', { className: 'pq-logo-tld' }, '.GG')));
  }

  function Button(p) {
    var v = p.variant || 'primary';
    var rest = omit(p, ['variant', 'icon', 'size', 'full', 'children', 'className']);
    return h('button', Object.assign({ type: 'button' }, rest, {
      className: cx('pq-btn', 'pq-btn-' + v, p.size === 'sm' && 'pq-btn-sm', p.full && 'pq-btn-full', p.className)
    }), p.icon ? h(Icon, { name: p.icon, size: p.size === 'sm' ? 16 : 18 }) : null, p.children);
  }

  function Chip(p) {
    var tone = p.tone || 'neutral';
    var clickable = typeof p.onClick === 'function' || p.selected !== undefined;
    var rest = omit(p, ['tone', 'icon', 'selected', 'children', 'className']);
    return h(clickable ? 'button' : 'span', Object.assign(clickable ? { type: 'button', 'aria-pressed': !!p.selected } : {}, rest, {
      className: cx('pq-chip', 'pq-chip-' + tone, p.selected && 'pq-chip-on', p.className)
    }), p.icon ? h(Icon, { name: p.icon, size: 16 }) : null, p.children);
  }

  var TIERS = {
    pt: { comum: 'Comum', incomum: 'Incomum', raro: 'Raro', epico: 'Épico', protegida: 'Protegida' },
    en: { comum: 'Common', incomum: 'Uncommon', raro: 'Rare', epico: 'Epic', protegida: 'Protected' }
  };

  function RarityBadge(p) {
    var t = p.tier || 'comum';
    var labels = p.lang === 'en' ? TIERS.en : TIERS.pt;
    return h('span', { className: cx('pq-rarity', 'pq-rarity-' + t, p.className) },
      t === 'protegida' ? h(Icon, { name: 'shield-check', size: 14 }) : h('span', { className: 'pq-rarity-dot', 'aria-hidden': true }),
      labels[t] || t);
  }

  function initials(name) {
    return String(name || '?').trim().split(/\s+/).map(function (w) { return w.charAt(0); }).slice(0, 2).join('').toUpperCase();
  }

  function Avatar(p) {
    var s = p.size || 'md';
    return h('span', { className: cx('pq-avatar', 'pq-avatar-' + s, p.className), title: p.name },
      p.src ? h('img', { src: p.src, alt: '' }) : h('span', { 'aria-hidden': true }, initials(p.name)));
  }

  function FishShape(cls) {
    return h('svg', { className: cls, viewBox: '0 0 120 60', 'aria-hidden': true, focusable: 'false' },
      h('path', { d: 'M6 30C24 9 60 6 84 21L110 7l-8 23 8 23-26-14C60 54 24 51 6 30Z' }),
      h('circle', { className: 'pq-fish-eye', cx: 22, cy: 27, r: 3.2 }));
  }

  function stickerNo(n) {
    var s = String(n == null ? 0 : n);
    while (s.length < 3) s = '0' + s;
    return '#' + s;
  }

  function Sticker(p) {
    var en = p.lang === 'en';
    var tier = p.tier || 'comum';
    if (!p.filled) {
      return h('div', { className: cx('pq-sticker', 'pq-sticker-empty', p.className), role: 'img', 'aria-label': p.name + (en ? ', not caught yet' : ', ainda não pescado') },
        h('span', { className: 'pq-sticker-no' }, stickerNo(p.number)),
        h('span', { className: 'pq-sticker-q', 'aria-hidden': true }, '?'),
        h('span', { className: 'pq-sticker-name' }, p.name));
    }
    return h('div', { className: cx('pq-sticker', 'pq-tier-' + tier, (tier === 'raro' || tier === 'epico') && 'pq-sticker-shine', p.isNew && 'pq-sticker-new', p.className) },
      h('span', { className: 'pq-sticker-no' }, stickerNo(p.number)),
      h('div', { className: 'pq-sticker-art' }, p.photo ? h('img', { src: p.photo, alt: '' }) : FishShape('pq-sticker-fish')),
      h('span', { className: 'pq-sticker-name' }, p.name),
      p.scientific ? h('span', { className: 'pq-sticker-sci' }, p.scientific) : null,
      h(RarityBadge, { tier: tier, lang: p.lang }),
      p.isNew ? h('span', { className: 'pq-sticker-flag' }, en ? 'New' : 'Nova') : null);
  }

  function FishLine(p) {
    var max = p.max > 0 ? p.max : 1;
    var pct = Math.max(0, Math.min(100, ((p.value || 0) / max) * 100));
    return h('div', { className: cx('pq-fishline', p.className) },
      h('div', { className: 'pq-fishline-track', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': max, 'aria-valuenow': p.value || 0, 'aria-label': p.label },
        h('span', { className: 'pq-fishline-line', style: { width: pct + '%' } }),
        h('span', { className: 'pq-fishline-bobber', style: { left: pct + '%' } },
          h('svg', { viewBox: '0 0 20 30', 'aria-hidden': true, focusable: 'false' },
            h('rect', { className: 'pq-mark-cream', x: 9, y: 0, width: 2, height: 9, rx: 1 }),
            h('path', { className: 'pq-mark-top', d: 'M2 17a8 8 0 0 1 16 0Z' }),
            h('path', { className: 'pq-mark-cream', d: 'M2 17a8 8 0 0 0 16 0Z' }),
            h('rect', { className: 'pq-mark-band', x: 1.4, y: 16.2, width: 17.2, height: 1.6, rx: 0.8 })))),
      p.label ? h('p', { className: 'pq-fishline-label' }, p.label) : null);
  }

  function LeaderboardRow(p) {
    var en = p.lang === 'en';
    var pos = p.position || 0;
    var delta = p.delta || 0;
    return h('div', { className: cx('pq-lb-row', p.isMe && 'pq-lb-me', p.className) },
      h('span', { className: cx('pq-lb-pos', pos >= 1 && pos <= 3 && 'pq-pos-' + pos) }, pos),
      h(Avatar, { name: p.name, src: p.avatar, size: 'md' }),
      h('span', { className: 'pq-lb-who' },
        h('span', { className: 'pq-lb-name' }, p.name, p.isMe ? h('small', null, en ? 'you' : 'você') : null),
        p.rankTitle ? h('span', { className: 'pq-lb-rank' }, p.rankTitle) : null),
      delta ? h('span', { className: cx('pq-lb-delta', delta > 0 ? 'up' : 'down'), title: delta > 0 ? (en ? 'Moved up ' : 'Subiu ') + delta : (en ? 'Moved down ' : 'Caiu ') + Math.abs(delta) }, (delta > 0 ? '▲ ' : '▼ ') + Math.abs(delta)) : null,
      h('span', { className: 'pq-lb-xp' }, h('b', null, (p.xp || 0).toLocaleString(en ? 'en-US' : 'pt-BR')), h('span', null, 'XP')));
  }

  function CatchCard(p) {
    var en = p.lang === 'en';
    var stats = [p.weight, p.length, p.water, p.released ? (en ? 'Released' : 'Solto') : null].filter(Boolean);
    return h('article', { className: cx('pq-card', 'pq-catch', p.className) },
      h('header', { className: 'pq-catch-head' },
        h(Avatar, { name: p.author, src: p.avatar, size: 'sm' }),
        h('div', { className: 'pq-catch-who' }, h('b', null, p.author), h('span', null, [p.group, p.time].filter(Boolean).join(' · '))),
        p.verified ? h('span', { className: 'pq-verified' }, h(Icon, { name: 'camera', size: 14 }), en ? 'Photo checked' : 'Foto conferida') : null),
      h('div', { className: 'pq-catch-photo' },
        p.photo ? h('img', { src: p.photo, alt: p.species }) : FishShape('pq-catch-fish'),
        p.newSticker ? h('span', { className: 'pq-catch-sticker' }, h(Icon, { name: 'sparkles', size: 14 }), en ? 'New sticker' : 'Figurinha nova') : null),
      h('div', { className: 'pq-catch-body' },
        h('div', { className: 'pq-catch-title' }, h('h3', null, p.species), p.tier ? h(RarityBadge, { tier: p.tier, lang: p.lang }) : null),
        stats.length ? h('p', { className: 'pq-catch-stats' }, stats.join(' · ')) : null,
        p.place ? h('p', { className: 'pq-catch-place' }, h(Icon, { name: 'map-pin', size: 14 }), p.place) : null,
        p.story ? h('p', { className: 'pq-catch-story' }, p.story) : null),
      h('footer', { className: 'pq-catch-actions' },
        h('button', { type: 'button', className: cx('pq-react', p.reacted && 'on'), 'aria-pressed': !!p.reacted },
          h(Icon, { name: 'fishing-hook', size: 18 }), h('span', null, en ? 'Hooked' : 'Fisgou'), h('b', null, p.reactions || 0)),
        h('button', { type: 'button', className: 'pq-react', 'aria-label': (en ? 'Comments: ' : 'Comentários: ') + (p.comments || 0) },
          h(Icon, { name: 'message-circle', size: 18 }), h('b', null, p.comments || 0)),
        h('button', { type: 'button', className: 'pq-react pq-react-end', 'aria-label': en ? 'Share' : 'Compartilhar' },
          h(Icon, { name: 'share-2', size: 18 }))));
  }

  function ChallengeCard(p) {
    var en = p.lang === 'en';
    var official = p.scope === 'official';
    return h('article', { className: cx('pq-card', 'pq-challenge', official && 'pq-challenge-official', p.className) },
      h('div', { className: 'pq-challenge-top' },
        h('span', { className: 'pq-challenge-scope' }, h(Icon, { name: official ? 'globe' : 'users', size: 14 }), p.scopeLabel || (official ? (en ? 'Official challenge' : 'Desafio oficial') : (en ? 'Group challenge' : 'Desafio do grupo'))),
        p.proof ? h('span', { className: 'pq-chip pq-chip-water' }, h(Icon, { name: 'camera', size: 14 }), en ? 'Photo + AI' : 'Foto + IA') : null),
      h('h3', null, p.title),
      p.rule ? h('p', { className: 'pq-challenge-rule' }, p.rule) : null,
      h('div', { className: 'pq-challenge-meta' },
        p.ends ? h('span', null, h(Icon, { name: 'flag', size: 14 }), p.ends) : null,
        p.participants ? h('span', null, h(Icon, { name: 'users', size: 14 }), p.participants) : null,
        p.myPosition ? h('span', { className: 'pq-challenge-me' }, h(Icon, { name: 'trophy', size: 14 }), p.myPosition) : null));
  }

  function PromotionBanner(p) {
    var en = p.lang === 'en';
    return h('section', { className: cx('pq-promo', p.className), role: 'status' },
      h(Icon, { name: 'medal', size: 32 }),
      h('p', null, en ? 'Promotion! Your new position is' : 'Promoção! Seu novo cargo é'),
      h('strong', null, p.rank),
      p.level ? h('span', { className: 'pq-promo-level' }, (en ? 'Level ' : 'Nível ') + p.level) : null,
      h(Button, { variant: 'primary', onClick: p.onAccept }, en ? 'Accept the position' : 'Aceitar o cargo'));
  }

  var NAV = [
    ['feed', 'house', 'Feed', 'Feed'],
    ['album', 'book-open', 'Álbum', 'Album'],
    ['log', 'plus', 'Registrar', 'Log'],
    ['challenges', 'trophy', 'Desafios', 'Challenges'],
    ['profile', 'user', 'Perfil', 'Profile']
  ];

  function BottomNav(p) {
    var en = p.lang === 'en';
    var hrefs = p.hrefs || {};
    return h('nav', { className: cx('pq-nav', p.className), 'aria-label': en ? 'Main' : 'Principal' },
      NAV.map(function (n) {
        var label = en ? n[3] : n[2];
        var on = p.active === n[0];
        if (n[0] === 'log') {
          return h('a', { key: n[0], href: hrefs.log || '#', className: 'pq-nav-log' },
            h('span', { className: 'pq-nav-log-btn' }, h(Icon, { name: 'plus', size: 26 })), h('span', null, label));
        }
        return h('a', { key: n[0], href: hrefs[n[0]] || '#', className: cx('pq-nav-item', on && 'on'), 'aria-current': on ? 'page' : undefined },
          h(Icon, { name: n[1], size: 22 }), h('span', null, label));
      }));
  }

  var api = {
    Logo: Logo, Icon: Icon, Button: Button, Chip: Chip, RarityBadge: RarityBadge, Avatar: Avatar,
    Sticker: Sticker, FishLine: FishLine, LeaderboardRow: LeaderboardRow, CatchCard: CatchCard,
    ChallengeCard: ChallengeCard, PromotionBanner: PromotionBanner, BottomNav: BottomNav,
    iconNames: Object.keys(ICONS)
  };
  window.PesqueiroGG = Object.assign(window.PesqueiroGG || {}, api);
})();
