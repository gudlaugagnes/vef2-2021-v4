/* eslint-disable import/no-unresolved */
/* eslint-disable default-case */
import { fetchEarthquakes } from './lib/earthquakes';
import { el, element, formatDate } from './lib/utils';
import { init, createPopup, clearMarkers } from './lib/map';

document.addEventListener('DOMContentLoaded', async () => {
  // TODO
  // Bæta við virkni til að sækja úr lista
  // Nota proxy
  // Hreinsa header og upplýsingar þegar ný gögn eru sótt
  // Sterkur leikur að refactora úr virkni fyrir event handler í sér fall

  const ul = document.querySelector('.earthquakes');
  const map = document.querySelector('.map');
  const earthquakeInfo = document.querySelector('h1');
  const loading = document.querySelector('.loading');
  const parent = loading.parentNode;

  document.querySelectorAll('li a').forEach((button) => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      ul.textContent = '';
      earthquakeInfo.textContent = '';
      const cacheInfo = document.querySelector('.cache');
      cacheInfo.textContent = '';
      const urlParams = new URLSearchParams(button.search);
      document.querySelector('.loading').classList.remove('hidden');
      const data = await fetchEarthquakes(urlParams.get('type'), urlParams.get('period'));
      document.querySelector('.loading').classList.add('hidden');
      const earthquakes = data.data.features;

      let earthquakeInfoText = '';
      switch (urlParams.get('type')) {
        case 'significant':
          earthquakeInfoText += 'Verulegir jarðskjálftar, ';
          break;
        case '4.5':
          earthquakeInfoText += '4,5+ á richter jarðskjálftar, ';
          break;
        case '2.5':
          earthquakeInfoText += '2,5+ á richter jarðskjálftar, ';
          break;
        case '1.0':
          earthquakeInfoText += '1,0+ á richter jarðskjálftar, ';
          break;
        case 'all':
          earthquakeInfoText += 'Allir jarðskjálftar, ';
          break;
      }

      switch (urlParams.get('period')) {
        case 'hour':
          earthquakeInfoText += 'seinustu klukkustund';
          break;
        case 'day':
          earthquakeInfoText += 'seinasta dag';
          break;
        case 'week':
          earthquakeInfoText += 'seinustu viku';
          break;
        case 'month':
          earthquakeInfoText += 'seinasta mánuð';
          break;
      }

      earthquakeInfo.innerHTML = earthquakeInfoText;

      let cacheInfoText = '';
      if (data.info.cached) {
        cacheInfoText += 'Gögn eru í cache. ';
      } else {
        cacheInfoText += 'Gögn eru ekki í cache. ';
      }
      cacheInfoText += `Fyrirspurn tók ${data.info.elapsed}  sek.`;
      cacheInfo.innerHTML = cacheInfoText;

      if (!earthquakes) {
        parent.appendChild(
          el('p', 'Villa við að sækja gögn'),
        );
      }

      clearMarkers();

      earthquakes.forEach((quake) => {
        const {
          title,
          mag,
          time,
          url,
        } = quake.properties;

        const link = element('a', {
          href: url,
          target: '_blank',
        }, null, 'Skoða nánar');
        const markerContent = el('div',
          el('h3', title),
          el('p', formatDate(time)),
          el('p', link));
        const marker = createPopup(quake.geometry, markerContent.outerHTML);

        const onClick = () => {
          marker.openPopup();
        };

        const li = el('li');

        li.appendChild(
          el('div',
            el('h2', title),
            el('dl',
              el('dt', 'Tími'),
              el('dd', formatDate(time)),
              el('dt', 'Styrkur'),
              el('dd', `${mag} á richter`),
              el('dt', 'Nánar'),
              el('dd', url.toString())),
            element('div', { class: 'buttons' }, null,
              element('button', null, { click: onClick }, 'Sjá á korti'),
              link)),
        );

        ul.appendChild(li);
      });
    });
  });

  init(map);
});
