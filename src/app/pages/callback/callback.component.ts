import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LoginService} from "../../services/login/login.service";

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {
  code: string;

  constructor(
    private route: ActivatedRoute,
    private loginService: LoginService,
  ) {
  }

  ngOnInit(): void {
    this.route
      .queryParams
      .subscribe(params => {
        this.code = params['code'];
      });
    this.loginService.getUserData(this.code)
      .subscribe(console.log);
  }

}
