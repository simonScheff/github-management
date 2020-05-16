import {Injectable} from '@angular/core';
import {getEncodedRedirectUrl, GithubLoginProps} from "./login.inteface";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient
  ) {
  }

  redirectToGitHob(): void {
    const redirect_url = getEncodedRedirectUrl();
    const githubUrl = `${GithubLoginProps.AUTHORIZE_URL}?scope=user%3Aemail&client_id=${GithubLoginProps.CLIENT_ID}&redirect_uri=${redirect_url}`;
    console.log(githubUrl);
    window.location.href = githubUrl;

  }

  getUserData(access_token: string) {
    return this.http.post('http://localhost:3000/accounts', {access_token}, { responseType: 'json' });
  }
}
