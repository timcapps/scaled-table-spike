import { Component } from '@angular/core';

import { DocumentOrientation } from "./models/document-orientation.enum";
import { DocumentType } from "./models/document-type.model";

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
    
    public selectedOrientation: DocumentOrientation = DocumentOrientation.Portrait;
    public selectedDocumentType: DocumentType = { name: "US Legal (8.5x14)", height: 14, width: 8.5 };

    public onSettingsChange(event): void {
      if (!event) return;

      this.selectedOrientation = event.orientation;
      this.selectedDocumentType = event.documentType;
    }
}
