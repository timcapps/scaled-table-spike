import { Component, Input, ElementRef, OnInit, ViewChild } from "@angular/core";
import { coerceElement } from "@angular/cdk/coercion";

import { DocumentOrientation } from "../models/document-orientation.enum";
import { DocumentType } from "../models/document-type.model";

/** @todo:
 * - Assume 300 ppi (highest quality available)
 * - Take the dimensions for the document scale provided
 * - Find the ratio (height to width) and set this as the "scale factor"
 * - Need to know the viewport of the parent container
 * - Scale the table to the correct factor and orientation
 */

@Component({
  selector: "app-scaled-table",
  templateUrl: "./scaled-table.component.html",
  styleUrls: ["./scaled-table.component.css"]
})
export class ScaledTableComponent implements OnInit {
  private static readonly PIXELS_PER_INCH: number = 300;
  private static readonly INCHES_PER_PIXEL: number = 0.0104166667;

  public _tableElement: ElementRef<HTMLElement>;
  public _parentContainer: ElementRef<HTMLElement>;

  @Input()
  public orientation: DocumentOrientation;

  @Input()
  public documentType: DocumentType;

  constructor(private _element: ElementRef) {}

  public ngOnInit() {
    this._tableElement = coerceElement(this._element);
    this._parentContainer = coerceElement(this._element).parentElement;
    this._tableElement.style.width = `100px`;

    console.log(this._tableElement.getBoundingClientRect());
  }
}
