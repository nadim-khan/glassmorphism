import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { shareReplay, tap } from 'rxjs/operators';
import { MakeRequestService } from './make-request.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private webService: MakeRequestService, private router: Router, private http: HttpClient) { }

  login(email: string, password: string) {
    return this.webService.login(email, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        const accessToken = res.headers.get('x-access-token') ?? '';
        const refreshToken = res.headers.get('x-refresh-token') ?? '';
        this.setSession(res.body._id, accessToken, refreshToken);
        console.log("LOGGED IN!");
      })
    );
  }

  signup(data: any) {
    const {
      name,
      email,
      password,
      country,
      state,
      city,
      address,
      profilePic // assumed file input (e.g. from `<input type="file" />`)
    } = data.value;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('country', country);
    formData.append('state', state);
    formData.append('city', city);
    formData.append('address', address);

    if (profilePic) {
      formData.append('profilePic', profilePic); // key must match backend
    }

    return this.webService.signup(formData).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        const accessToken = res.headers.get('x-access-token') ?? '';
        const refreshToken = res.headers.get('x-refresh-token') ?? '';
        this.setSession(res.body._id, accessToken, refreshToken);
        console.log("Successfully signed up and now logged in!");
      })
    );
  }





  logout() {
    this.removeSession();

    this.router.navigate(['/login']);
  }

  getAccessToken() {
    return localStorage.getItem('x-access-token');
  }

  getRefreshToken() {
    return localStorage.getItem('x-refresh-token');
  }

  getUserId() {
    return localStorage.getItem('user-id');
  }

  setAccessToken(accessToken: string) {
    localStorage.setItem('x-access-token', accessToken)
  }

  private setSession(userId: string, accessToken: string, refreshToken: string) {
    localStorage.setItem('user-id', userId);
    localStorage.setItem('x-access-token', accessToken);
    localStorage.setItem('x-refresh-token', refreshToken);
  }

  private removeSession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
  }

  getNewAccessToken() {
    return this.http.get<any>(`${this.webService.ROOT_URL}/users/me/access-token`, {
      headers: {
        'x-refresh-token': this.getRefreshToken() ?? '',
        '_id': this.getUserId() ?? ''
      },
      observe: 'response' as const
    }).pipe(
      tap((res: HttpResponse<any>) => {
        const token = res.headers.get('x-access-token');
        if (token) {
          this.setAccessToken(token);
        } else {
          console.error("No access token found in response headers.");
        }
      })
    );
  }

}