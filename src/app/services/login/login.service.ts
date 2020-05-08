import { Injectable } from '@angular/core';
import {getEncodedRedirectUrl, GithubLoginProps} from "./login.inteface";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor() { }

  redirectToGitHob(): void {
    const redirect_url  = getEncodedRedirectUrl();
    const githubUrl = `${GithubLoginProps.AUTHORIZE_URL}?scope=user%3Aemail&client_id=${GithubLoginProps.CLIENT_ID}&redirect_uri=${redirect_url}`;
    console.log(githubUrl);
    window.location.href = githubUrl;

  }
}
