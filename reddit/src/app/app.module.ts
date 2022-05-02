import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SearchPanelComponent } from './search-panel/search-panel.component';

import {OverlayModule} from '@angular/cdk/overlay';
import { DeleteViewComponent } from './delete-view/delete-view.component';
import { AddItemViewComponent } from './add-item-view/add-item-view.component';
import { UpdateViewComponent } from './update-view/update-view.component';


@NgModule({
  declarations: [
    AppComponent,
    SearchPanelComponent,
    DeleteViewComponent,
    AddItemViewComponent,
    UpdateViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    OverlayModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
