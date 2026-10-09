/* ================================================================
   EcoRuteando v2.0 — js/app.js
   Lógica de navegación: RAPs, sidebar, paneles, copy code
   ================================================================ */

'use strict';

/* ── Datos de los RAPs y sus ítems de menú ── */
const RAPS = {
  ra1: {
    label: 'RA1',
    title: 'Informe de Diseño de Software',
    shortTitle: 'Informe de Diseño',
    items: [
      'Introducción',
      'Descripción General del Sistema',
      'Arquitectura del Software',
      'Diseño de Componentes o Módulos',
      'Diagramas UML',
      'Diseño de Base de Datos',
      'Diseño de Interfaces',
      'Reglas de Negocio',
      'Seguridad del Sistema',
      'Especificaciones Técnicas',
      'Consideraciones de Implementación',
    ]
  },
  ra2: {
    label: 'RA2',
    title: 'Selección de Herramientas de Desarrollo',
    shortTitle: 'Herramientas de Desarrollo',
    items: [
      'Analizar el Diseño del Sistema',
      'Identificar Herramientas Necesarias',
      'Herramientas Tecnológicas del Proyecto',
      'Justificación de la Selección',
      'Herramientas por Actividad',
    ]
  },
  ra3: {
    label: 'RA3',
    title: 'Construcción de la Base de Datos',
    shortTitle: 'Base de Datos',
    items: ['Contenido por agregar']
  },
  ra4: {
    label: 'RA4',
    title: 'Componentes Front-end',
    shortTitle: 'Front-end',
    items: ['Contenido por agregar']
  },
  ra5: {
    label: 'RA5',
    title: 'Pruebas al Software',
    shortTitle: 'Pruebas',
    items: ['Contenido por agregar']
  },
};

let currentRap  = 'ra1';
let currentItem = 1;

/* ── Inicialización ── */
document.addEventListener('DOMContentLoaded', () => {
  buildSidebar('ra1');
  showPanel('ra1', 1);
  setupSidebarOverlay();
});

/* ── Seleccionar un RAP ── */
function selectRap(rap, btn) {
  document.querySelectorAll('.rap-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  currentRap  = rap;
  currentItem = 1;
  buildSidebar(rap);
  showPanel(rap, 1);
  closeSidebar();
}

/* ── Construir sidebar según el RAP activo ── */
function buildSidebar(rap) {
  const data = RAPS[rap];
  document.getElementById('sb-label').textContent = data.label + ' — Resultado de Aprendizaje';
  document.getElementById('sb-title').textContent = data.shortTitle;

  const nav = document.getElementById('sb-nav');
  nav.innerHTML = '';

  data.items.forEach((label, i) => {
    const btn = document.createElement('button');
    btn.className = 'sb-item' + (i === 0 ? ' active' : '');
    btn.innerHTML = `
      <span class="snum">${String(i + 1).padStart(2, '0')}</span>
      <span>${label}</span>
    `;
    btn.addEventListener('click', () => selectItem(rap, i + 1, btn));
    nav.appendChild(btn);
  });
}

/* ── Seleccionar un ítem del sidebar ── */
function selectItem(rap, num, btn) {
  document.querySelectorAll('.sb-item').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentItem = num;
  showPanel(rap, num);
  closeSidebar();
}

/* ── Mostrar panel correspondiente ── */
function showPanel(rap, num) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById(`panel-${rap}-${num}`);
  if (panel) {
    panel.classList.add('active');
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Sidebar móvil ── */
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  const overlay = document.getElementById('sb-overlay');
  if (overlay) overlay.classList.toggle('show');
}

function closeSidebar() {
  if (window.innerWidth <= 960) {
    document.getElementById('sidebar').classList.remove('open');
    const overlay = document.getElementById('sb-overlay');
    if (overlay) overlay.classList.remove('show');
  }
}

function setupSidebarOverlay() {
  const overlay = document.getElementById('sb-overlay');
  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }
}

/* ── Copiar código SQL ── */
function copyCode(id) {
  const pre = document.getElementById(id);
  if (!pre) return;
  const text = pre.innerText || pre.textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector(`[data-copy="${id}"]`);
    if (!btn) return;
    const orig = btn.innerHTML;
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg> Copiado
    `;
    btn.style.background = '#40916c';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.background = '';
    }, 2200);
  }).catch(() => {
    // fallback para navegadores sin clipboard API
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
}
