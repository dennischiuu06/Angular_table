import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.css']
})


export class SearchPanelComponent implements OnInit {

  searchSoccerPitches: FormGroup;
  @Input() searchType!: string;
  http: HttpClient;
  serverData!: Object | null;
  url!: string;
  serverDataArr: any;
  // SoccerPitchesRecord: PitchesRecord = {
  //   district: "",
  //   address: "",
  //   courtNumber: "",
  //   opening_hours: ""
  // };

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(fb: FormBuilder, http: HttpClient) {
    this.http = http;
    this.searchSoccerPitches = fb.group(
      {
        'searchDistrict': []
      }
    );
  }


  ngOnInit(): void {
  }

  onSubmit(formValue: any): void {
    console.log(formValue);
    this.serverData = null;

    this.url = "http://localhost/php/index.php/football/" + formValue['searchDistrict'];


    this.http.get(this.url).subscribe({
        next: (res) => {
          console.log(res);
          console.log(formValue['searchDistrict']);
          this.serverData = res;
          this.serverDataArr = JSON.parse(JSON.stringify(res))
        },
        error: (err) => {
          this.serverData = "http://localhost/php/index.php/football/" + formValue['searchDistrict'];
        }
      }
    );
  }
  
  retrieveButtonHandler(): void {
    this.serverData = null;

    this.url = "http://localhost/php/index.php/football/selectAll";

    this.http.get(this.url).subscribe({
        next: (res) => {
          console.log(res);
          this.serverData = res;
          this.serverDataArr = JSON.parse(JSON.stringify(res))
        },
        error: (err) => {
          this.serverData = "http://localhost/php/index.php/football/selectAll";
        }
      });
    }

 // @Output() deleteEvent = new EventEmitter<PitchesRecord>();

  deleteButtonHandler(routeNumber: string) {
    console.log("SEARCH: deleteButtonHandler/" + routeNumber);

    this.serverData = null;
    this.url = "http://localhost/php/index.php/football/" + routeNumber;

    this.http.delete(this.url).subscribe(
      {
        next: (res) => {
          this.serverData = res;
          this.serverDataArr = JSON.parse(JSON.stringify(res))
          this.retrieveButtonHandler();
        },
        error: (err) => {
          this.serverData = "Failed to call server: " + err;
        }
      }
    );

    // this.deleteEvent.emit(this.SoccerPitchesRecord);
  }
}

export interface PitchesRecord {
  district: string,
  address: string,
  courtNumber: string,
  opening_hours: string
}