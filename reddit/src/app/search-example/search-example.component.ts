import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';


export interface Fruit {
  name: string;
}
@Component({
  selector: 'app-search-example',
  templateUrl: './search-example.component.html',
  styleUrls: ['./search-example.component.css']
})
export class SearchExampleComponent implements OnInit {
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

createBusForm!: FormGroup;


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

  this.createBusForm = fb.group(
    {
      'addDistrictKey': ['', Validators.required],
      'addNameKey': [],
      'addAddressKey': [],
      'addHoursKey': []
    }
  );
}


ngOnInit(): void {
}

onSubmitAdd(formValue: any): void {
  var url: string;
  console.log(formValue);
  this.serverData = null;
  url = "http://localhost/php/index.php/football/" + 'mockGIHS' + '/' +
  formValue['addDistrictKey'] + '/' + formValue['addNameKey'] + '/' + formValue['addAddressKey']  + '/' 
  + formValue['addHoursKey']  + '/' + 'mockphone' + '/' + 'mockLatitude' + '/'  + 'mockAncillaryFacilities' + '/'  + 'mockRemarks';
  console.log( formValue['addDistrictKey']);
  console.log( formValue['addNameKey']);

  this.http.post(url, { 
    addGihsKey: 'mockGIHS',
    addDistrictKey: formValue['addDistrictKey'],
    addNameKey: formValue['addNameKey'],
    addAddressKey: formValue['addAddressKey'],
    addHoursKey: formValue['addHoursKey'],
    addPhoneKey: 'mockphone',
    addLatitude: 'mockLatitude',
    addAncillaryFacilities: 'mockAncillaryFacilities',
    addRemarks: 'mockRemarks'

  }).subscribe({
    next: (res) => {
      this.serverData = res; 
      //this.serverDataArr = JSON.parse(JSON.stringify(res))
    },
    error: (err) => {
      this.serverData = "Failed to call server: " + err;
    }   
  });
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