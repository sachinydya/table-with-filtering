import {
    Component,
    OnInit,
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

// import { LazyLoadEvent } from 'primeng/primeng';

import * as _ from 'lodash';

import { DataService } from './data.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
    
    people: any[];
    cols: any[];
    filmDetailsArray: any[] = [];
    filmTitleArray: string[] = [];
    totalPages: number;
    loader: boolean;
    
    constructor (
        private dataService: DataService
    ) {}
    
    ngOnInit () {
        this.getPeople(1); // BY DEFAULT GET 0th PAGE
        this.initializeColumns();
    }
    
    // INITAILIZE COLUMNS
    initializeColumns() {
        // console.log('inside initializeColumns()');
        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'gender', header: 'Gender' },
            { field: 'birth_year', header: 'Birth Year (BBY)' },
            { field: 'filmTitles', header: 'Films' }
        ];
    }
    
    // GET PEOPLE
    getPeople (pageNo) {
        this.loader = true;
        // console.log('inside getPeople()');
        this.dataService.getPeople(pageNo).subscribe(
            (res) => {
                this.people = res.results;
                this.totalPages = res.count;
                this.getUniqueFilmIds();
            }
        );
    }
    
    // GET FILM DETAILS
    getFilmDetails(url) {
        // console.log('inside getFilmDetails()');
        return this.dataService.getFilmDetails(url);
    }
    
    // GET FILM ID
    // COLLECT UNIQUE FILM IDs AND CALL API ONLY FOR THESE FILMS
    getUniqueFilmIds() {
        // console.log('inside getUniqueFilmIds()');
        const numberPattern = /\d+/g;
        let filmIdArray: number[] = [];
        for(let i = 0, len = this.people.length; i < len; i++) {
            for(let j = 0, len1 = this.people[i].films.length; j < len1; j++) {
                const temp = this.people[i].films[j];
                const id = temp.match(numberPattern)[0];
                filmIdArray.push(+id); // PUSH ALL THE FILM IDs AND CONVERT THEM TO A NUMBER
            }
        }
        filmIdArray = _.uniq(filmIdArray); // EXTRACT ONLY UNIQUE VALUES
        this.getFilmData(filmIdArray);
    }
    
    // FORKJOIN ALL THE APIs
    getFilmData(arrayId) {
        // console.log('inside getFilmData()');
        let count = 0; // ASYNCHRONOUS DATA CALLS SO CAN'T USE i
        for(let i = 0, len = arrayId.length; i < len; i++) {
            const url = 'https://swapi.co/api/films/' + arrayId[i] + '/';
            Observable.forkJoin(
                this.getFilmDetails(url)
            ).subscribe(
                data => {
                    count++;
                    this.filmDetailsArray.push({id: arrayId[i], name: data[0].title, url: url}); // MAP FILM ID WITH NAME AND FILM URL
                    if(count === len) {
                        this.mapEachPersonToMovies();
                    }
                },
            );
        }
    }

    // ATTACH EACH PERSON WITH FILM NAMES
    mapEachPersonToMovies() {
        // console.log('inside mapEachPersonToMovies()');
        for (let i = 0, len = this.people.length; i < len; i++) {
            this.people[i].filmTitles = []; // SINCE SEARCHING HAS TO BE IMPLEMENTED, ADDING NEW PROPERTIES TO THE API DATA
            for (let j = 0, len1 = this.people[i].films.length; j < len1; j++) {
                for (let k = 0, len2 = this.filmDetailsArray.length; k < len2; k++) {
                    if (this.filmDetailsArray[k].url === this.people[i].films[j]) {
                        this.people[i].filmTitles.push(this.filmDetailsArray[k].name);
                    }
                }
            }
        }
        this.loader = false;
        // console.log(this.people);
    }

    // PAGINATION FUNCTIONS ----------------------

    // // ON EVERY PAGE CHANGE SEND PAGE NUMBER TO FETCH PEOPLE DATA
    // paginate(event) {
    //     const pageNo = (event.first / 10) + 1;
    //     this.getPeople(pageNo);
    // }

}
