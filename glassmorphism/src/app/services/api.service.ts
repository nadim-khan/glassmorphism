import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, tap } from 'rxjs';

@Injectable({
  providedIn: 'root', // still needed for DI, but service is used independently
})
export class ApiService {
  productBaseUrl = 'https://fakestoreapi.com/';
  locationApi: any = 'https://countriesnow.space/api/v0.1/countries'
  constructor(private http: HttpClient) {

  }

  //sprivate http = inject(HttpClient); // using inject() instead of constructor injection

  getQuranApi(): Observable<any[]> {
    const translations = ['quran-uthmani', 'en.asad', 'ar.alafasy'];

    const requests = translations.map(translation =>
      this.http.get(`https://api.alquran.cloud/v1/quran/${translation}`)
    );

    return forkJoin(requests);
  }

  login(email: string, password: string): Observable<{ access_token: string }> {
    let url = 'https://api.escuelajs.co/api/v1';
    return this.http.post<{ access_token: string }>(
      `${url}/auth/login`,
      { email, password }
    ).pipe(
      tap((response) => {
        localStorage.setItem('token', response.access_token);
      })
    );
  }

  getToken() {
    return localStorage.getItem('token')
  }

  isAuthenticated(): boolean {
    return true
    !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getUserDetails() {
    const url = 'https://api.escuelajs.co/api/v1/auth/profile';
    const token = this.getToken(); // Replace with your actual token

    const headers = {
      Authorization: `Bearer ${token}`
    };

    return this.http.get(url, { headers });
  }

  getAllUsers() {
    const url = 'https://api.escuelajs.co/api/v1/users';
    return this.http.get(`${url}`)
  }

  updateUser(body: any) {
    const url = 'https://api.escuelajs.co/api/v1/users/1';
    return this.http.put(`${url}`, body)
  }

  createUser(body: any) {
    const url = 'https://api.escuelajs.co/api/v1/users/';
    return this.http.post(`${url}`, body)
  }

  getAllProducts() {
    return this.http.get(this.productBaseUrl + 'products')
  }

  getCountries() {
    return this.http.get(this.locationApi)
  }

  getStateByCountryName(countryName: string) {
    let payload = {
      "country": countryName
    }
    return this.http.post(`${this.locationApi}/states`, payload);
  }

  getCityByCountryStateName(countryName: string, stateName: string) {
    let payload = {
      "country": countryName,
      "state": stateName
    }
    return this.http.post(`${this.locationApi}/state/cities`, payload);
  }

}
