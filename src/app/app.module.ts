import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TableModule } from 'primeng/table';
// import { PaginatorModule } from 'primeng/paginator';

import { DataService } from './data.service';

import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        TableModule,
        // PaginatorModule,
    ],
    providers: [DataService],
    bootstrap: [AppComponent]
})

export class AppModule { }
