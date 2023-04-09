import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './modules/auth/services/auth.service';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
	constructor(private $router: Router) {}

	ngOnInit() {
		this.$router.navigate(['dashboard']);
	}
}
