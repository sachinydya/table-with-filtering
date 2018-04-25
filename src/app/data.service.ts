import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {
    
    constructor(
        private httpClient: HttpClient
    ) { }
    
    // GET PEOPLE
    getPeople(pageNo): any {
        const params = new HttpParams()
            .set('page', pageNo)
        return this.httpClient.get('http://swapi.co/api/people', { params })
            .map(
                (response: any) => {
                    return response;
                }
            );
    }
    
    // GET FILM DETAILS
    getFilmDetails(url) {
        // console.log(url);
        return this.httpClient.get(url)
            .map(
                (response: any) => {
                    return response;
                }
            );
    }

}
