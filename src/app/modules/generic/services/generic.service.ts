import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { environment as Dev } from 'src/environments/environment';
import { environment as Prod } from 'src/environments/environment.prod';

@Injectable({
	providedIn: 'root',
})
export abstract class GenericService {
	protected endPoint: string = '';
	protected env: string = '';

	constructor(protected $http: HttpClient) {
		this.env += isDevMode() ? Dev.api_url : Prod.api_url;
		this.endPoint += this.env;
	}
}
