import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { distinctUntilChanged, switchMap, debounceTime, catchError } from 'rxjs/operators';
import { Subject, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

export interface AddressSuggestion {
  label: string;
  coordinates: [number, number];
  postcode: string;
  city: string;
  street: string;
}

@Component({
  selector: 'app-address-autocomplete',
  templateUrl: './address-autocomplete.component.html',
  standalone: true,
  styleUrls: ['./address-autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressAutocompleteComponent),
      multi: true
    }
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule
  ]
})
export class AddressAutocompleteComponent {
  @Input() placeholder = 'Saisissez votre adresse';
  @Output() addressSelected = new EventEmitter<AddressSuggestion>();

  value = '';
  suggestions: AddressSuggestion[] = [];
  showSuggestions = false;
  private searchSubject = new Subject<string>();
  private readonly API_URL = 'https://api-adresse.data.gouv.fr/search/';

  private onChange = (value: string) => {};
  private onTouched = () => {};

  constructor(private http: HttpClient) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => this.searchAddresses(query))
    ).subscribe(suggestions => {
      this.suggestions = suggestions;
      this.showSuggestions = suggestions.length > 0;
    });
  }

  /**
   * Recherche d'adresses via l'API adresse.data.gouv.fr
   * @param query Terme de recherche
   * @returns Observable avec les suggestions d'adresses
   */
  private searchAddresses(query: string): Observable<AddressSuggestion[]> {
    if (query.length < 3) {
      return of([]);
    }

    return this.http.get<any>(`${this.API_URL}?q=${encodeURIComponent(query)}&limit=5`)
      .pipe(
        catchError(() => of({ features: [] }))
      )
      .pipe(
        switchMap(response => of(
          response.features.map((feature: any) => ({
            label: feature.properties.label,
            coordinates: feature.geometry.coordinates,
            postcode: feature.properties.postcode || '',
            city: feature.properties.city || '',
            street: feature.properties.name || ''
          }))
        ))
      );
  }


  onInput(event: any) {
    this.value = event.target.value;
    this.onChange(this.value);
    this.searchSubject.next(this.value);
  }
  
  selectSuggestion(suggestion: AddressSuggestion) {
    this.value = suggestion.label;
    this.onChange(this.value);
    this.onTouched();
    this.showSuggestions = false;
    this.addressSelected.emit(suggestion); // Communication vers le parent 
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }



  onFocus() {
    if (this.suggestions.length > 0) {
      this.showSuggestions = true;
    }
  }

  onBlur() {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }
}