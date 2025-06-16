import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MakeRequestService {

  readonly ROOT_URL;

  constructor(private http: HttpClient) {
    this.ROOT_URL = 'http://localhost:8088';
  }

  get(uri: string) {
    return this.http.get(`${this.ROOT_URL}/${uri}`);
  }

  post(uri: string, payload: Object) {
    return this.http.post(`${this.ROOT_URL}/${uri}`, payload);
  }

  patch(uri: string, payload: Object) {
    return this.http.patch(`${this.ROOT_URL}/${uri}`, payload);
  }

  delete(uri: string) {
    return this.http.delete(`${this.ROOT_URL}/${uri}`);
  }

  login(email: string, password: string) {
    return this.http.post(`${this.ROOT_URL}/users/login`, {
      email,
      password
    }, {
      observe: 'response'
    });
  }


  signup(formData: FormData) {
    return this.http.post<any>(`${this.ROOT_URL}/users`, formData, {
      observe: 'response'
    });
  }

  getAllUsers() {
    return this.http.get(`${this.ROOT_URL}/users`, {
      observe: 'response'
    });
  }

  getUserDetailById() {
    return this.http.get(`${this.ROOT_URL}/users/userId`, {
      observe: 'response'
    });
  }
}
