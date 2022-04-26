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

  selectedName!: string;
  selectedDistrict !: string;
  showError! : string;
  itemGIHS! : string;

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

  updateDialogDisplayStyle = "none";
  removeDialogDisplayStyle = "none";
  onSubmit(formValue: any): void {
    this.serverData = null;
    this.url = "http://localhost/php/index.php/football/" + formValue['searchDistrict'];

    this.http.get(this.url).subscribe({
        next: (res) => {
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
  
 closePopup() {
  this.updateDialogDisplayStyle = "none";
  this.removeDialogDisplayStyle = "none";
}

 openDeleteDialog(itemGIHS: string) {
    console.log("DELETE: itemGIHS/" + itemGIHS);
    this.itemGIHS = itemGIHS;
    this.removeDialogDisplayStyle = "block";
  }

  deleteButtonHandler() {
    console.log("SEARCH: deleteButtonHandler2121/" + this.itemGIHS);

    this.serverData = null;
    this.url = "http://localhost/php/index.php/football/" + this.itemGIHS;

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
    this.removeDialogDisplayStyle = "none"
  }

  openUpdateNamePopup(index:number) {
    this.selectedDistrict = this.serverDataArr[index]['district'];
    this.selectedName = this.serverDataArr[index]['name'];

    this.updateDialogDisplayStyle = "block";
  }

  updateNameAPICall(formValue :any): void {
    if (formValue['newName'] == null || formValue['newName'] == '' ){
      this.showError = 'The new name cannot be empty';
      this.updateDialogDisplayStyle = "none";
      return;
    }

    this.serverData = null;
    let name = this.selectedName;
    console.log("gggg,", formValue['newName']);
    
    this.url = "http://localhost/php/index.php/football/" + name +"/"+formValue['newName'];
    this.updateDialogDisplayStyle = "none";
    this.http.put(this.url,"").subscribe(
      {
        next: (res) => {
          this.serverDataArr.forEach(function (value: any) {
            if(value["name"] == name){
              value["name"] = formValue['newName']
            }
          });
        },
        error: (err) => {
          this.serverData = "http://localhost/php/index.php/football/" + formValue['newName'];
        }
      }
    );
  }
}

export interface PitchesRecord {
  district: string,
  address: string,
  courtNumber: string,
  opening_hours: string
}