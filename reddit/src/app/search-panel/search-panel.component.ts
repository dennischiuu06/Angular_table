import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';


export interface Fruit {
  name: string;
}

@Component({
  selector: 'app-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.css']
})


export class SearchPanelComponent implements OnInit {
  searchBusForm: FormGroup;
  @Input() searchType!: string;
  http: HttpClient;
  serverData!: Object | null;
  url!: string;
  serverDataArr: any;
  busRecord: BusRecord = {
    routeNumber: "",
    fare: "",
    startPoint: "",
    endPoint: ""
  };
  
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  fruits: Fruit[] = [{name: 'Lemon'}, {name: 'Lime'}, {name: 'Apple'}];

  constructor(fb: FormBuilder, http: HttpClient) { 
    this.http = http;
    this.searchBusForm = fb.group(
      {
        'searchKey': []
      }
    );
  }
  

  ngOnInit(): void {
  }

  onSubmit(formValue: any): void {
    console.log(formValue);
    this.serverData = null;


    if (this.searchType==="By Route") {
      this.url = "http://localhost/getBusByRoute.php?routeNumber=" + formValue['searchKey'];
    } else if (this.searchType==="By Fare") {
      this.url = "http://localhost/getBusByFare.php?fare=" + formValue['searchKey'];
    } else if (this.searchType==="By Start Point") {
      this.url = "http://localhost/getBusByStartPoint.php?startPoint=" + formValue['searchKey'];
    } else if (this.searchType==="By End Point") {
      this.url = "http://localhost/getBusByEndPoint.php?endPoint=" + formValue['searchKey'];
    } 
    
    this.http.get(this.url).subscribe(
      {
        next: (res) => {
          this.serverData = res; 
          this.serverDataArr = JSON.parse(JSON.stringify(res))
        },
        error: (err) => {
          this.serverData = "Failed to call server: " + err;
        }        
      }
    );
  }

  @Output() deleteEvent = new EventEmitter<BusRecord>();
  
  deleteButtonHandler(routeNumber: string) {
    console.log("SEARCH: deleteButtonHandler/" + routeNumber);
    for (let bus of this.serverDataArr) {
      if (bus.routeNumber === routeNumber) {
        this.busRecord.routeNumber = bus.routeNumber;
        this.busRecord.fare = bus.fare;
        this.busRecord.startPoint = bus.startPoint;
        this.busRecord.endPoint = bus.endPoint;
        break;
      }
    }

    this.deleteEvent.emit(this.busRecord);
  }

}

export interface BusRecord {
  routeNumber: string, 
  fare: string, 
  startPoint: string,
  endPoint: string
}