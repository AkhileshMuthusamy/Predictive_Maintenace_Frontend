import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  acceptedFileTypes = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  private validFileTypes: Array<string> = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

  progress = 0;
  showFileList = false;
  selectedFile: File;
  submitted = false;

  constructor() { }

  ngOnInit(): void {
  }

  fileChangeEvent(event): void {
    if (event instanceof DragEvent) {
      this.selectedFile = event.dataTransfer.files[0];
    } else {
      if (event.target.files.length > 0) {
        this.selectedFile = event.target.files[0];
      }
    }
    console.log(this.selectedFile.type);

    if (this.validFileTypes.includes(this.selectedFile.type)) {
      this.showFileList = true;
    }
  }

  uploadFile(): void {
    this.submitted = true;
  }
}
