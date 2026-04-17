// ─────────────────────────────────────────
// WHEEL PICKER — cilindro rotatorio infinito
//
// Modelo: N items montados sobre un cilindro virtual.
// La rueda gira verticalmente; el item en ángulo=0 (frente)
// es el "activo". Soporta drag, touch, wheel y snap con inercia.
// ─────────────────────────────────────────

'use strict';

class WheelPicker {
  constructor(container, data) {
    this.el   = container;
    this.data = data;          // [{id, icon, name, value, label, phrase}]
    this.n    = data.length;

    // Geometría del cilindro
    this.SLOTS  = 3;           // slots DOM renderizados (-1 · 0 · +1 del centro)
    this.HALF   = 1;
    this.ANGLE  = 52;          // grados entre items — más separación con 3 visibles
    this.ITEM_H = 64;          // px — debe coincidir con CSS .drum-slot height
    this.radius = 0;           // calculado en resize()

    // Física
    this.offset   = 0;         // float — round(offset) = índice del item activo
    this.velocity = 0;         // items/frame
    this.dragging = false;
    this.lastY    = 0;
    this.lastT    = 0;
    this.rafId    = null;
    this._snapTid = null;

    this._build();
    this._bind();
    requestAnimationFrame(() => this.resize());
  }

  // ─── Construcción DOM ──────────────────
  _build() {
    this.el.innerHTML = '';
    this.slots = Array.from({ length: this.SLOTS }, () => {
      const el = document.createElement('div');
      el.className = 'drum-slot';
      el.innerHTML =
        `<div class="drum-slot__icon"></div>
         <div class="drum-slot__body">
           <div class="drum-slot__main">
             <span class="drum-slot__name"></span>
             <span class="drum-slot__value"></span>
             <span class="drum-slot__label"></span>
           </div>
           <p class="drum-slot__phrase"></p>
         </div>`;
      this.el.appendChild(el);
      return el;
    });
  }

  // ─── Render ────────────────────────────
  // Mapeo matemático:
  //   offset float → cada slot tiene una "distancia visual" al centro
  //   distancia → ángulo en el cilindro → posición 3D proyectada
  _render() {
    if (!this.radius) return;

    const cy   = this.el.clientHeight / 2;
    const base = Math.floor(this.offset);          // item "base" (entero)
    const frac = this.offset - base;               // fracción 0…1

    for (let s = 0; s < this.SLOTS; s++) {
      const rel    = s - this.HALF;               // posición relativa al centro (-3…+3)
      const vDist  = rel - frac;                  // distancia visual continua al centro
      const angle  = vDist * this.ANGLE * (Math.PI / 180);

      // Proyección cilíndrica
      const y     = this.radius * Math.sin(angle);
      const depth = Math.cos(angle);              // 1=frente, -1=detrás

      // Propiedades visuales derivadas de la profundidad
      const dNorm  = (depth + 1) / 2;            // 0…1, normalizado
      const scale  = 0.55 + 0.45 * dNorm;
      const opacity = Math.max(0, (depth + 0.35) / 1.35);
      const isActive = Math.abs(vDist) < 0.42;

      // Qué dato muestra este slot
      const di   = ((base + rel) % this.n + this.n) % this.n;
      const item = this.data[di];

      // Aplicar transforms
      const el = this.slots[s];
      el.style.transform = `translateY(${cy + y - this.ITEM_H / 2}px) scale(${scale})`;
      el.style.opacity   = opacity;
      el.style.zIndex    = Math.round(dNorm * 20);
      el.classList.toggle('active', isActive);

      // Actualizar contenido (evitar repaint de icono si es el mismo item)
      const iconEl = el.querySelector('.drum-slot__icon');
      if (iconEl.dataset.id !== item.id) {
        iconEl.innerHTML  = item.icon;
        iconEl.dataset.id = item.id;
        el.querySelector('.drum-slot__name').textContent = item.name;
      }
      el.querySelector('.drum-slot__value').textContent  = item.value  || '—';
      el.querySelector('.drum-slot__label').textContent  = item.label  || '';
      el.querySelector('.drum-slot__phrase').textContent = item.phrase || '';
    }
  }

  // ─── Eventos ───────────────────────────
  _bind() {
    const el = this.el;

    // Touch
    el.addEventListener('touchstart',  e => { e.preventDefault(); this._start(e.touches[0].clientY); }, { passive: false });
    el.addEventListener('touchmove',   e => { e.preventDefault(); this._move(e.touches[0].clientY);  }, { passive: false });
    el.addEventListener('touchend',    () => this._end());
    el.addEventListener('touchcancel', () => this._end());

    // Mouse
    el.addEventListener('mousedown', e => { e.preventDefault(); this._start(e.clientY); });
    window.addEventListener('mousemove', e => { if (this.dragging) { e.preventDefault(); this._move(e.clientY); } });
    window.addEventListener('mouseup',   () => { if (this.dragging) this._end(); });

    // Rueda del ratón / trackpad
    el.addEventListener('wheel', e => {
      e.preventDefault();
      this._cancelAll();
      this.offset += e.deltaY / this._arc();
      this._render();
      this._snapTid = setTimeout(() => this._snap(), 180);
    }, { passive: false });
  }

  // Longitud de arco por item: radio × ángulo_rad
  _arc() {
    return this.radius * this.ANGLE * (Math.PI / 180);
  }

  _start(y) {
    this._cancelAll();
    this.dragging = true;
    this.lastY    = y;
    this.lastT    = performance.now();
    this.velocity = 0;
  }

  _move(y) {
    if (!this.dragging) return;
    const now = performance.now();
    const dy  = y - this.lastY;
    const dt  = Math.max(1, now - this.lastT);
    const arc = this._arc();

    // Convertir desplazamiento en píxeles a items
    this.offset   -= dy / arc;
    // Velocidad en items/frame (para inercia)
    this.velocity  = (-dy / dt) * (1000 / 60) / arc;

    this.lastY = y;
    this.lastT = now;
    this._render();
  }

  _end() {
    if (!this.dragging) return;
    this.dragging = false;
    this._inertia();
  }

  // ─── Física ────────────────────────────
  _inertia() {
    const decay = 0.93;
    const tick  = () => {
      if (Math.abs(this.velocity) < 0.004) {
        this.velocity = 0;
        this._snap();
        return;
      }
      this.offset   += this.velocity;
      this.velocity *= decay;
      this._render();
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  // Snap al item más cercano — animación ease-out cúbica
  _snap() {
    const target = Math.round(this.offset);
    const start  = this.offset;
    const dist   = target - start;

    if (Math.abs(dist) < 0.002) {
      this.offset = target;
      this._render();
      return;
    }

    const dur = Math.min(380, Math.abs(dist) * 220);
    const t0  = performance.now();

    const tick = now => {
      const t    = Math.min(1, (now - t0) / dur);
      const ease = 1 - Math.pow(1 - t, 3);      // ease-out cúbica
      this.offset = start + dist * ease;
      this._render();
      if (t < 1) {
        this.rafId = requestAnimationFrame(tick);
      } else {
        this.offset = target;
        this._render();
      }
    };
    this.rafId = requestAnimationFrame(tick);
  }

  _cancelAll() {
    if (this.rafId) { cancelAnimationFrame(this.rafId); this.rafId = null; }
    clearTimeout(this._snapTid);
    this._snapTid = null;
  }

  // ─── API pública ───────────────────────

  // Recalcular radio cuando el contenedor cambia de tamaño
  resize() {
    this.radius = this.el.clientHeight * 0.46;
    this._render();
  }

  // Refrescar contenido (los datos han sido mutados externamente)
  refresh() {
    this._render();
  }

  // Índice del item activo
  activeIndex() {
    return ((Math.round(this.offset)) % this.n + this.n) % this.n;
  }
}
