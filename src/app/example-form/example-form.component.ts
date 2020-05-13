import { Component, Input, Output, OnInit, EventEmitter } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";

import { DocumentOrientation } from "../models/document-orientation.enum";
import { DocumentType } from "../models/document-type.model";

@Component({
  selector: "app-example-form",
  templateUrl: "./example-form.component.html",
  styleUrls: ["./example-form.component.css"]
})
export class ExampleFormComponent implements OnInit {
  public settingsForm: FormGroup;

  @Output()
  public readonly changes = new EventEmitter<any>();

  public orientations: any[] = [
    { type: "Portrait", value: 1 },
    { type: "Landscape", value: 2 }
  ];

  public documentTypes: DocumentType[] = [
    { name: "US Legal", height: 14, width: 8.5 },
    { name: "US Letter", height: 11, width: 8.5 }
  ];

  constructor() {}

  public ngOnInit() {
    this.settingsForm = new FormGroup({
      orientation: new FormControl(this.orientations[0].value),
      documentType: new FormControl(this.documentTypes[0])
    });
  }
}
