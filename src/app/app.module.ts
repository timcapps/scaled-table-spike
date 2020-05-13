import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { ExampleFormComponent } from './example-form/example-form.component';
import { ScaledTableComponent } from './scaled-table/scaled-table.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule, ReactiveFormsModule ],
  declarations: [ AppComponent, ExampleFormComponent, ScaledTableComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
