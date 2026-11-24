import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Página temporal para los módulos que se construyen en los siguientes sprints.
 * Recibe el título y los requisitos desde la definición de la ruta (data).
 */
@Component({
  selector: 'app-modulo-pendiente',
  imports: [RouterLink],
  template: `
    <h1>{{ titulo() }}</h1>
    <div class="pendiente">
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M8 38 V24 H24 V10 H40" stroke="currentColor" stroke-width="3"
          stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2 7" />
        <circle cx="8" cy="38" r="5" fill="#f2c12e" />
        <circle cx="40" cy="10" r="5" fill="none" stroke="currentColor" stroke-width="3" />
      </svg>
      <div>
        <p class="pendiente__titulo">Este módulo se construye en un próximo sprint</p>
        <p>Cubrirá los requisitos {{ requisitos() }}. Mientras tanto, puedes volver al panel.</p>
      </div>
      <a class="boton boton--principal" routerLink="/dashboard">Volver al panel</a>
    </div>
  `,
  styles: `
    :host {
      display: grid;
      gap: 1.5rem;
    }
    h1 {
      font-size: var(--t-2xl);
    }
    .pendiente {
      display: grid;
      justify-items: start;
      gap: 1.25rem;
      max-width: 34rem;
      padding: 2rem;
      background: var(--superficie);
      border: 1px dashed var(--linea);
      border-radius: var(--radio-panel);
      color: var(--tinta-2);
    }
    svg {
      width: 56px;
      height: 56px;
      color: var(--mangle-600);
    }
    .pendiente__titulo {
      font: 600 var(--t-md) / 1.25 var(--fuente-titulos);
      color: var(--tinta);
      margin-bottom: 0.375rem;
    }
  `,
})
export class ModuloPendiente {
  readonly titulo = input<string>('Módulo');
  readonly requisitos = input<string>('');
}
