import {Component, OnInit} from '@angular/core';
import {ApiService} from 'src/app/shared/services/api.service';
import {HttpEventType, HttpEvent} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeviceInfo} from 'src/app/shared/objects/global-objects';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  validFileTypes: Array<string> = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'application/vnd.ms-excel',
  ];

  progress = 0;
  showFileList = false;
  selectedFile: File;
  isLoading = false;
  deviceList = [];
  uploadForm: FormGroup;
  hideDragNDrop = true;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.uploadForm = fb.group({
      id: [null, [Validators.required]]
    });
    this.uploadForm.get('id').valueChanges.subscribe((value) => {
      if (!value) {
        this.hideDragNDrop = true;
      } else {
        this.hideDragNDrop = false;
      }
    });
  }

  ngOnInit(): void {
    this.loadDeviceList();
  }

  loadDeviceList(): void {
    this.isLoading = true;
    this.apiService.getDeviceList().subscribe((response) => {
        this.isLoading = false;
        if (!response.error) {
          this.deviceList = response.data;
        }
      },
      () => {
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
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
    } else {
      this.resetState();
      this.snackBar.open('Invalid file type', 'Close', { duration: 2000 });
    }
  }

  uploadFile(): void {

    const uploadData = new FormData();
    uploadData.append('id', this.uploadForm.controls.id.value);
    uploadData.append('file', this.selectedFile, this.selectedFile.name);
    this.apiService.uploadSensorDataFile(uploadData).subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progress = Math.round((event.loaded / event.total) * 100);
            break;
          case HttpEventType.Response:
            if (event.body) {
              if (event.body.error) {
                this.snackBar.open(event.body.message, 'Close', {
                  duration: 2000
                });
                setTimeout(() => {
                  this.resetState();
                }, 500);
              } else {
                this.snackBar.open(
                  event.body.message || 'File uploaded successfully!',
                  'Close',
                  { duration: 2000 }
                );
                setTimeout(() => {
                  this.resetState();
                }, 1500);
              }
            }
        }
      },
      () => {
        this.resetState();
        this.snackBar.open('Error while uploading file', 'Close', {
          duration: 2000,
        });
      }
    );
  }

  resetState(): void {
    this.progress = 0;
    this.showFileList = false;
    this.selectedFile = undefined;
  }
}


