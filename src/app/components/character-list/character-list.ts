import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  Signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, catchError, of } from 'rxjs';

import { Api } from '../../services/api';
import { Character } from '../../models/character';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './character-list.html',
  styleUrls: ['./character-list.scss']
})
export class CharacterListComponent implements OnInit {
  // 1️⃣ Inyectar el servicio
  private readonly api = inject(Api);

  // 2️⃣ Señal pública de personajes
  public readonly characters: Signal<readonly Character[]> =
    this.api.characters;

  // 3️⃣ Estado de UI
  public searchTerm = '';
  public loading = false;
  public errorMessage = '';

  // 4️⃣ Señal computada para saber si hay personajes
  public hasCharacters = computed(() => this.characters().length > 0);

  ngOnInit(): void {
    this.loadInitialCharacters();
  }

  // 5️⃣ Carga inicial
  loadInitialCharacters(): void {
    this.loading = true;
    this.errorMessage = '';

    this.api
      .getCharacters()
      .pipe(
        finalize(() => (this.loading = false)),
        catchError(err => {
          this.errorMessage = 'Error cargando personajes.';
          return of();  // devuelve un observable vacío para que finalize() se dispare
        })
      )
      .subscribe();
  }

  // 6️⃣ Búsqueda por nombre
  onSearch(): void {
    this.loading = true;
    this.errorMessage = '';

    this.api
      .searchCharacters(this.searchTerm)
      .pipe(
        finalize(() => (this.loading = false)),
        catchError(err => {
          this.errorMessage = 'Error en la búsqueda.';
          return of();
        })
      )
      .subscribe();
  }

  // 7️⃣ Enter para buscar
  onSearchKeyup(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }

  /** trackBy para evitar re-renderizados innecesarios */
  trackById(_index: number, character: Character): number {
    return character.id;
  }

}


