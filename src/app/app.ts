// src/app/app.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

// 1️⃣ Importa tu componente de lista
import { CharacterListComponent } from './components/character-list/character-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    CharacterListComponent   // 2️⃣ Agrégalo aquí
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {
  title = 'rick-and-morty-angular-v20';
}
