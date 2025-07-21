// src/app/services/api.ts

import { Injectable, inject, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiResponse, Character } from '../models/character';

@Injectable({ providedIn: 'root' })
export class Api {
  // 1) URL base de la API
  private readonly API_URL = 'https://rickandmortyapi.com/api/character';

  // 2) Inyectamos HttpClient con inject()
  private readonly http = inject(HttpClient);

  // 3) Señal privada que contendrá el arreglo de personajes
  private charactersSignal = signal<Character[]>([]);

  // 4) Versión pública sólo lectura de la señal
  public readonly characters: Signal<readonly Character[]> =
    this.charactersSignal.asReadonly();

  /** 5) Método para obtener todos los personajes */
  public getCharacters(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.API_URL).pipe(
      tap(resp => this.charactersSignal.set(resp.results))
    );
  }

  /** 6) Método para buscar personajes por nombre */
  public searchCharacters(name: string): Observable<ApiResponse> {
    const term = name.trim();
    if (!term) {
      // Sin término, devolvemos todos los personajes
      return this.getCharacters();
    }
    const url = `${this.API_URL}?name=${encodeURIComponent(term)}`;
    return this.http.get<ApiResponse>(url).pipe(
      tap(resp => this.charactersSignal.set(resp.results))
    );
  }
}
