import {
  Component,
  Input,
  ElementRef,
  OnInit,
  ViewChild,
  Renderer2,
  HostBinding
} from "@angular/core";
import { coerceElement, coerceCssPixelValue } from "@angular/cdk/coercion";
import { ViewportRuler } from '@angular/cdk/scrolling';

import { DocumentOrientation } from "../models/document-orientation.enum";
import { DocumentType } from "../models/document-type.model";

interface ITableDimensions {
  height: number;
  width: number;
}

/** @todo:
 * - Assume 300 ppi (highest quality available)
 * - Take the dimensions for the document scale provided
 * - Find the ratio (height to width) and set this as the "scale factor"
 * - Need to know the viewport of the parent container
 * - Scale the table to the correct factor and orientation
 * 
 * - subscribe to ViewportRuler.change to rerun the functions to fill the 
 */

@Component({
  selector: "app-scaled-table",
  templateUrl: "./scaled-table.component.html",
  styleUrls: ["./scaled-table.component.css"]
})
export class ScaledTableComponent implements OnInit {
  private static readonly PIXELS_PER_INCH: number = 300;
  private static readonly INCHES_PER_PIXEL: number = 0.0104166667;

  private tableDimensions: ITableDimensions = { height: 100, width: 100 };

  public _tableElement: HTMLElement;
  public _parentContainerElement: HTMLElement;

  @Input()
  public orientation: DocumentOrientation;

  @Input()
  public documentType: DocumentType;

  @HostBinding("style.maxHeight")
  public get cssHeight(): string {
    return coerceCssPixelValue(this.tableDimensions.height);
  }

  @HostBinding("style.maxWidth")
  public get cssWidth(): string {
    return coerceCssPixelValue(this.tableDimensions.width);
  }

  constructor(
    private _element: ElementRef<HTMLElement>,
    private _render: Renderer2
  ) {}

  public ngOnInit() {
    this._tableElement = coerceElement(this._element);
    this._parentContainerElement = coerceElement(this._element).parentElement;

    console.log(this._parentContainerElement.getBoundingClientRect());
  }

  private _getParentContainerScaleFactor() {
    /** Need to find out what scale the parent container is compared to a full page
     * (i.e. 1/5 scale, etc...)
     * 
     * Min(parentContainerWidth / documentType.width, parentContainerHeight / documentType.height) = scaleFactor 
     * 
     * alternatively to the above, (for portrait.. for landscape the ratio is inverted)
     * For the height use (11/8.5)(parentContainerHeight in pixels)
     * For the width use (11/8.5)(parentContainerWidth in pixels)
     * 
     * actual table height in inches would be 11(scaleFactor)
     * actual table width in inches would be 8.5(scaleFactor)
     * 
     * then translate inches to pixels 
     * 
     */
  }





}
