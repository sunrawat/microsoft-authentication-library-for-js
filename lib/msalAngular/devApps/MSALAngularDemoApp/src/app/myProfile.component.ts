import {Component} from "@angular/core";
import {ProductService} from "./product.service";
import {BroadcastService, MsalService} from "../../../../dist";

@Component({
  templateUrl: './myProfile.component.html',
})

export class MyProfileComponent {
  public userInfo: any = null;

  constructor(private authService: MsalService, private productService: ProductService, private broadcastService: BroadcastService) {

  }


  private getAcquireToken = function (self, scopes) {
    //acquire access token for scopes
    return new Promise(function (resolve, reject) {
      self.acquire_token_silent(scopes).then(function (token) {
        resolve(token);
      }, function (error) {
        //This will fail, if scopes were not consented. call acquire token interactive only for these 2 errors
        if (error.indexOf("consent_required") != -1 || error.indexOf("interaction_required") != -1) {
          self.acquire_token_popup(scopes).then(function (token) {
            resolve(token);
          }, function (error) {
            reject(error);
          })
        }
        else {
          reject(error);
        }
      })
    });
  }


  //make sense only for loginPopup
  ngOnInit() {
    //will work for acquireTokenSilent and acquireTokenPopup
    this.broadcastService.subscribe("msal:acquireTokenSuccess", (payload) => {
      console.log("acquire token success " + JSON.stringify(payload))
    });

    //will work for acquireTokenSilent and acquireTokenPopup
    this.broadcastService.subscribe("msal:acquireTokenFailure", (payload) => {
      console.log("acquire token failure " + JSON.stringify(payload))
    });

  }

  private TestAcquireToken()
  {
    this.getAcquireToken( this.authService,["user.read", "mail.send"]).then(() =>{
      this.productService.getUserInfo()
        .subscribe(data => {
          this.userInfo = data;
        }, error => {
          console.error(" access token silent failed " + JSON.stringify(error));
        });

    })
  }

  private callGraph() {
    this.productService.getUserInfo()
      .subscribe(data => {
        this.userInfo = data;
      }, error => {
        console.error(" access token silent failed " + JSON.stringify(error));
      });
  }
}