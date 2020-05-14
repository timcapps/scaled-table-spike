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
import { ViewportRuler } from "@angular/cdk/scrolling";
import { divide, multiply } from "ramda";

import { DocumentOrientation } from "../models/document-orientation.enum";
import { DocumentType } from "../models/document-type.model";

interface ITableDimensions {
  height: number;
  width: number;
}

/** @todos:
 * 
 *
 */

@Component({
  selector: "app-scaled-table",
  templateUrl: "./scaled-table.component.html",
  styleUrls: ["./scaled-table.component.css"]
})
export class ScaledTableComponent implements OnInit {
  /** Constants */
  private readonly PIXELS_PER_INCH: number = 300;
  private readonly INCHES_PER_PIXEL: number = 0.0104166667;

  private _tableElement: HTMLElement;
  private _parentContainerElement: HTMLElement;
  private _tableDimensions: ITableDimensions = { height: 100, width: 100 };
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
    private readonly _ruler: ViewportRuler
  ) {}

  public ngOnInit() {
    this._tableElement = coerceElement(this._element);
    this._parentContainerElement = coerceElement(this._element).parentElement;

    this._reCalc();
    this._setSubscriptions();
  }

  private _reCalc(): void {
    
    this._documentRatio = this._getDocumentRatio(
      this.orientation,
      this.documentType
    );

    this._scaleFactor = this._getScaleFactor(
      this._parentContainerElement,
      this.documentType
    );

    const altScaleFactor = this._getScaleFactor_Alt(
      this._parentContainerElement,
      this.documentType,
      this.orientation
    );

    this._tableDimensions = {
      height: multiply(
        multiply(this.PIXELS_PER_INCH, this.documentType.height),
        this._scaleFactor
      ),
      width: multiply(
        multiply(this.PIXELS_PER_INCH, this.documentType.width),
        this._scaleFactor
      )
    };
  }

  /** @info Gets the ratio of the document based on its orientation */
  private _getDocumentRatio(
    orientation: DocumentOrientation,
    documentType: DocumentType
  ): number {
    if (orientation === DocumentOrientation.Portrait) {
      return divide(documentType.height, documentType.width);
    }
    return divide(documentType.width, documentType.height);
  }

  /**
   * Min(parentContainerWidth / documentType.width, parentContainerHeight / documentType.height)
   */
  private _getScaleFactor(
    parentContainer: HTMLElement,
    documentType: DocumentType
  ): number {
    if (!parentContainer || !documentType) return 0;

    /** I think this was backwards */
    // const widthRatio = divide(parentContainer.clientWidth, documentType.width);
    // const heightRatio = divide(parentContainer.clientHeight, documentType.height);

    const widthRatio = divide(documentType.width, parentContainer.clientWidth);
    const heightRatio = divide(
      documentType.height,
      parentContainer.clientHeight
    );

    const scaleFactor = Math.min(widthRatio, heightRatio);
    console.log('scaleFactor', scaleFactor);
    return scaleFactor;
  }

  /**
   * alternatively to the above, (for portrait.. for landscape the ratio is inverted)
   * For the height use (11/8.5)(parentContainerHeight in pixels)
   * For the width use (11/8.5)(parentContainerWidth in pixels)
   * @todo specify return type if we choose to go with this
   */
  private _getScaleFactor_Alt(
    parentContainer: HTMLElement,
    documentType: DocumentType,
    orientation: DocumentOrientation
  ): any {
    if (!parentContainer || !documentType) return 0;

    let ratio;

    if (orientation === DocumentOrientation.Portrait) {
      ratio = divide(documentType.height, documentType.width);
    } else {
      ratio = divide(documentType.width, documentType.height);
    }

    const scaleFactor = {
      heightFactor: multiply(ratio, parentContainer.clientHeight),
      widthFactor: multiply(ratio, parentContainer.clientWidth)
    };

    console.log('scaleFactor', scaleFactor);
    return scaleFactor;
  }

  private _setSubscriptions(): void {
    /** Subscribe to viewport changes so we know when to update this._tableDimensions */
    this._ruler.change(1).subscribe(change => {
      this._reCalc();
    });
  }
}
