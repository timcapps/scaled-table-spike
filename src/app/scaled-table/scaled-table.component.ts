import { Component, Input, OnInit } from '@angular/core';

enum DocumentOrientation {
    Portrait = 1,
    Landscape = 2
}

interface IDocumentScale {
  /** The name of the scale (i.e. US Legal) */
  name: string;
  /** The height in inches */
  height: number;
  /** The width in inches */
  width: number;
}

/** @todo:
 * - Assume 300 ppi (highest quality available)
 * - Take the dimensions for the document scale provided
 * - Find the ratio (height to width) and set this as the "scale factor"
 * - Need to know the viewport of the parent container
 * - Scale the table to the correct factor and orientation
 */

@Component({
  selector: 'app-scaled-table',
  templateUrl: './scaled-table.component.html',
  styleUrls: ['./scaled-table.component.css']
})
export class ScaledTableComponent implements OnInit {

  private static readonly PIXELS_PER_INCH: number = 300;
  private static readonly INCHES_PER_PIXEL: number = 0.0104166667;

  private _scaleFactor;

  @Input()
  public orientation: DocumentOrientation;

  @Input()
  public scale: IDocumentScale;

  constructor() {}

  public ngOnInit() {
    
  }

}