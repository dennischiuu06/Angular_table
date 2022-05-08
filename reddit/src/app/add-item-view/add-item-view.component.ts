import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ServiceModel } from '../Model/ServiceModel.model';

@Component({
  selector: 'app-add-item-view',
  templateUrl: './add-item-view.component.html',
  styleUrls: ['./add-item-view.component.css']
})
export class AddItemViewComponent implements OnInit {
  http: HttpClient;
  serverData!: Object | null;
  url!: string;
  serverDataArr: any;
  serviceModel: ServiceModel = {
    code: '',
    desc: ''
  }
  createNewSoccerPitches: FormGroup;

  @Input() addDialogDisplayStyle!: string;

  constructor(fb: FormBuilder, http: HttpClient) {
    this.http = http;

    this.createNewSoccerPitches = fb.group(
      {
        'newDistrict': [],
        'newName': [],
        'newAddress': [],
        'newHours': [],
        'newPhone': [],
        'newAncillary': [],
        'newRemarks': [],
      }
    );
  }

  ngOnInit(): void { }

  @Output() dismissAddViewEvent = new EventEmitter<ServiceModel>();

  closePopup() {
    this.addDialogDisplayStyle = "none"
    this.dismissAddViewEvent.emit();
  }

  addNewItemAPICall(formValue: any): void {
    let genGIHS = btoa(Math.random().toString()).substr(10, 10) || '';

    this.serverData = null;
    this.url = "http://localhost/server/index.php/football/" + genGIHS + "/" + formValue['newDistrict'] + "/" + formValue['newName'] + "/" + formValue['newAddress'] + "/" + formValue['newHours'] + "/" + formValue['newPhone'] + "/" + formValue['newAncillary'] + "/" + formValue['newRemarks'];
    this.addDialogDisplayStyle = "none";

    this.http.post(this.url, "").subscribe(
      {
        next: (res) => {
          console.log(res);
          this.serverData = res;
          this.serverDataArr = JSON.parse(JSON.stringify(res));
          this.serviceModel.code = this.serverDataArr['code'];
          this.serviceModel.desc = this.serverDataArr['description'];

          this.dismissAddViewEvent.emit(this.serviceModel);
        },
        error: (err) => {
          this.serviceModel.code = '500';
          this.serviceModel.desc = 'Techincal error, please can try it again';

          this.dismissAddViewEvent.emit(this.serviceModel);
          this.serverData = "http://localhost/server/index.php/football/" + genGIHS + "/" + formValue['newDistrict'] + "/" + formValue['newName'] + "/" + formValue['newAddress'] + "/" + formValue['newHours'] + "/" + formValue['newPhone'] + "/" + formValue['newAncillary'] + "/" + formValue['newRemarks'];
        }
      }
    );
  }
}
