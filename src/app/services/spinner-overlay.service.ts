import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { SpinnerComponent } from "../spinner/spinner.component";
import { ComponentPortal } from "@angular/cdk/portal";
import { Injectable } from "@angular/core";
import { NEVER, defer, finalize, share } from "rxjs";

@Injectable({
    providedIn: 'root',
  })
  export class SpinnerOverlayService {
    private overlayRef: OverlayRef = undefined;
  
    constructor(private overlay: Overlay) {}

    public readonly spinner$ = defer(() => {
      this.show();
      return NEVER.pipe(
        finalize(() => {
          this.hide();
        })
      );
    }).pipe(share());
    
     
    public show(): void {
      // Hack avoiding `ExpressionChangedAfterItHasBeenCheckedError` error
      Promise.resolve(null).then(() => {
        this.overlayRef = this.overlay.create({
          positionStrategy: this.overlay
            .position()
            .global()
            .centerHorizontally()
            .centerVertically(),
          hasBackdrop: true,
        });
        this.overlayRef.attach(new ComponentPortal(SpinnerComponent));
      });
    }
  
    public hide(): void {
      this.overlayRef.detach();
      this.overlayRef = undefined;
    }
  }