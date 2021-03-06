import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { ServiceModel } from '../Model/ServiceModel.model';

@Component({
  selector: 'app-delete-view',
  templateUrl: './delete-view.component.html',
  styleUrls: ['./delete-view.component.css']
})
export class DeleteViewComponent implements OnInit {
  http: HttpClient;
  serverData!: Object | null;
  url!: string;
  serverDataArr: any;
  serviceModel: ServiceModel = {
    code: '',
    desc: ''
  }

  @Input() removeDialogDisplayStyle!: string;
  @Input() itemGIHS!: string;
  @Input() selectedDistrict!: string;

  constructor(http: HttpClient) {
    this.http = http;
  }

  ngOnInit(): void { }

  @Output() dismissEvent = new EventEmitter<ServiceModel>();

  closePopup() {
    this.removeDialogDisplayStyle = "none"
    this.dismissEvent.emit();
  }

  deleteButtonHandler() {
    this.serverData = null;

    this.url = "http://localhost/server/index.php/football/" + this.itemGIHS;

    this.http.delete(this.url).subscribe(
      {
        next: (res) => {
          this.serverData = res;
          this.serverDataArr = JSON.parse(JSON.stringify(res));

          this.serviceModel.code = this.serverDataArr['code'];
          this.serviceModel.desc = this.serverDataArr['description'];

          this.dismissEvent.emit(this.serviceModel);

        },
        error: (err) => {
          this.serverData = "Failed to call server: " + err;

          this.serviceModel.code = '500';
          this.serviceModel.desc = 'Techincal error, please can try it again';

          this.dismissEvent.emit(this.serviceModel);
        }
      }
    );
  }
}
