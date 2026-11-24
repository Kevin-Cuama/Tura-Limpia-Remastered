import { Component, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Pantalla de inicio de sesión (RF-01).
 * Envía correo y contraseña a POST /api/v1/login y, si son correctos,
 * guarda el token y entra al panel.
 */
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);

  // Parámetros de la URL (?motivo=expirada&volverA=/rutas), llegan solos por withComponentInputBinding
  readonly motivo = input<string>();
  readonly volverA = input<string>();

  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);
  readonly mostrarContrasena = signal(false);

  readonly formulario = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required]],
  });

  // Paradas del recorrido dibujado en el panel izquierdo
  readonly paradas = [
    { x: 190, y: 560 },
    { x: 300, y: 500 },
    { x: 410, y: 440 },
    { x: 520, y: 320 },
    { x: 630, y: 260 },
  ];

  // Cuadrícula de calles (cada 110 px en un sentido y 120 px en el otro)
  readonly calles = {
    verticales: Array.from({ length: 14 }, (_, i) => -360 + i * 110),
    horizontales: Array.from({ length: 13 }, (_, i) => -340 + i * 120),
  };

  campoInvalido(campo: 'correo' | 'contrasena'): boolean {
    const control = this.formulario.controls[campo];
    return control.invalid && control.touched;
  }

  iniciarSesion(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.error.set(null);

    const { correo, contrasena } = this.formulario.getRawValue();

    this.auth.iniciarSesion({ correo: correo.trim(), contrasena }).subscribe({
      next: () => {
        const destino = this.volverA()?.startsWith('/') ? this.volverA()! : '/dashboard';
        this.router.navigateByUrl(destino);
      },
      error: (err) => {
        this.error.set(AuthService.mensajeDeError(err));
        this.cargando.set(false);
      },
    });
  }
}
