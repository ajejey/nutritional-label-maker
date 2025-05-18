declare module 'bwip-js' {
  export interface BwipOptions {
    bcid: string;
    text: string;
    scale?: number;
    height?: number;
    includetext?: boolean;
    textxalign?: string;
    textsize?: number;
    textfont?: string;
    paddingwidth?: number;
    paddingheight?: number;
    backgroundcolor?: string;
    barcolor?: string;
    [key: string]: any;
  }

  /**
   * Renders a barcode as SVG and returns the SVG as a string.
   */
  export function toSVG(options: BwipOptions): string;

  /**
   * Renders a barcode to a canvas element.
   */
  export function toCanvas(canvas: HTMLCanvasElement, options: BwipOptions): void;

  /**
   * Renders a barcode and returns the PNG image as a Node.js Buffer.
   */
  export function toBuffer(options: BwipOptions): Promise<Buffer>;
}
