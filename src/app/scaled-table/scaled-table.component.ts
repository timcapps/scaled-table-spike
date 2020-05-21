import {
  Component,
  Input,
  ElementRef,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  Renderer2,
  HostBinding,
ChangeDetectorRef
} from "@angular/core";
import { coerceElement, coerceCssPixelValue } from "@angular/cdk/coercion";
import { ViewportRuler } from "@angular/cdk/scrolling";
import { divide, multiply, subtract } from "ramda";

import { DocumentOrientation } from "../models/document-orientation.enum";
import { DocumentType } from "../models/document-type.model";

interface Dimensions {
  height: number;
  width: number;
}

/** @todos:
 * - Figure out content projection
 * - Add content projection inside the scaled table to put the TsvDataTable
 */

@Component({
  selector: "app-scaled-table",
  templateUrl: "./scaled-table.component.html",
  styleUrls: ["./scaled-table.component.css"]
})
export class ScaledTableComponent implements OnInit {
  /** Constants */
  private readonly PIXELS_PER_INCH: number = 300;

  private _tableElement: HTMLElement;
  private _parentContainerElement: HTMLElement;
  private _tableDimensions: Dimensions = { height: 100, width: 100 };
  private _scaleFactor: number;
  private _documentRatio: number;

  @Input()
  public orientation: DocumentOrientation;

  @Input()
  public documentType: DocumentType;

  @HostBinding("style.height")
  public get cssHeight(): string {
    return coerceCssPixelValue(this._tableDimensions.height);
  }

  @HostBinding("style.width")
  public get cssWidth(): string {
    return coerceCssPixelValue(this._tableDimensions.width);
  }

  constructor(
    private _element: ElementRef<HTMLElement>,
    private readonly _ruler: ViewportRuler, 
    private readonly _cd: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this._tableElement = coerceElement(this._element);
    this._parentContainerElement = coerceElement(this._element).parentElement;

    this._reCalc();
    this._setSubscriptions();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this._reCalc();
  }

  private _reCalc(): void {
    if (!this.documentType || !this._parentContainerElement) return;

    console.log("recalculating");

    /** @todo we will need to tweak this constant depending on our modal size 
     * when we implement this in the app
     */
    const pixelMargin = 20;

    const maxPixelWidth = subtract(
      this._parentContainerElement.clientWidth,
      pixelMargin + 175
    );
    const maxPixelHeight = subtract(
      this._parentContainerElement.clientHeight,
      pixelMargin
    );
    console.log("maxPixelWidth", maxPixelWidth);
    console.log("maxPixelHeight", maxPixelHeight);

    const documentPixelWidth = multiply(
      this.documentType.width,
      this.PIXELS_PER_INCH
    );
    const documentPixelHeight = multiply(
      this.documentType.height,
      this.PIXELS_PER_INCH
    );
    console.log("documentPixelWidth", documentPixelWidth);
    console.log("documentPixelHeight", documentPixelHeight);

    const widthRatio = divide(maxPixelWidth, documentPixelWidth);
    const heightRatio = divide(maxPixelHeight, documentPixelHeight);
    console.log("widthRatio", widthRatio);
    console.log("heightRatio", heightRatio);

    const ratio = Math.min(widthRatio, heightRatio);
    console.log("ratio", ratio);

    const scaledWidth = multiply(documentPixelWidth, ratio);
    const scaledHeight = multiply(documentPixelHeight, ratio);
    console.log("scaledWidth", scaledWidth);
    console.log("scaledHeight", scaledHeight);

    if (this.orientation.valueOf() == DocumentOrientation.Portrait.valueOf()) {
      console.log('setting for portrait');
      this._tableDimensions = {
        width: scaledWidth,
        height: scaledHeight
      };
    }
    
    if (this.orientation.valueOf() == DocumentOrientation.Landscape.valueOf()) {
      console.log('setting for landscape');
      this._tableDimensions = {
        width: scaledHeight,
        height: scaledWidth
      };
    }

    this._cd.markForCheck();

    console.log(this._tableDimensions);
  }

  /** @todo we don't need every emmission from this */
  private _setSubscriptions(): void {
    /** Subscribe to viewport changes so we know when to update this._tableDimensions */
    this._ruler.change(3000).subscribe(change => {
      this._reCalc();
    });
  }
}
