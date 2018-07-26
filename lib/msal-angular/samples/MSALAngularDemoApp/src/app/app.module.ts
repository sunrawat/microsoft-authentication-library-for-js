import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component'
import {ProductComponent} from './product/product.component'
import {ErrorComponent} from './error.component'
import {ProductDetailComponent} from './product/product-detail.component'
import {ProductService} from './product/product.service';
import {appRoutes} from './app.routes';
import {MsGraphComponent} from "./calendar/msGraph.component";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {MsalModule, MsalInterceptor} from "ms-msal-angular";
import {LogLevel} from "msal";
import { TodoListComponent } from './todo-list/todo-list.component';
import {TodoListService} from "./todo-list/todo-list.service";
import {MsGraphService} from "./calendar/msGraph.service";
import {UserDataComponent} from "./user-data/user-data.component";
import { HttpServiceHelper } from './common/HttpServiceHelper';

export function loggerCallback(logLevel, message, piiEnabled) {
  console.log("client logging" + message);
}

export const protectedResourceMap: Map<string, Array<string>> = new Map<string, Array<string>>();
export const startDate = new Date();
export const endDate = new Date();
endDate.setDate(startDate.getDate()+7);
protectedResourceMap.set("https://graph.microsoft.com/beta/me/calendarview?startdatetime=" +startDate.toLocaleDateString("en-US") + "&enddatetime="+ endDate.toLocaleDateString("en-US")+ "&$select=subject,start,end&$orderBy=start/dateTime", [ "calendars.read"]);
protectedResourceMap.set("https://buildtodoservice.azurewebsites.net/api/todolist", ["api://a88bb933-319c-41b5-9f04-eff36d985612/access_as_user"]);
protectedResourceMap.set("https://graph.microsoft.com/v1.0/me", ["user.read", "mail.send"]);

@NgModule({
  declarations: [
    AppComponent, HomeComponent, ProductComponent, ErrorComponent, ProductDetailComponent, MsGraphComponent, TodoListComponent, UserDataComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    MsalModule.forRoot({
        clientID: '6226576d-37e9-49eb-b201-ec1eeb0029b6',
        authority: "https://login.microsoftonline.com/common/",
        validateAuthority: true,
        redirectUri: "http://localhost:4200/",
        cacheLocation : "localStorage",
        postLogoutRedirectUri: "http://localhost:4200/",
        navigateToLoginRequestUrl: true,
        popUp: true,
        consentScopes: [ "calendars.read", "api://a88bb933-319c-41b5-9f04-eff36d985612/access_as_user"],
        unprotectedResources: ["https:google.com"],
        protectedResourceMap: protectedResourceMap,
        logger: loggerCallback,
        correlationId: '1234',
        level: LogLevel.Info,
        piiLoggingEnabled: true
      }
    ),
  ],
  providers: [ProductService, TodoListService, MsGraphService, HttpServiceHelper,
     {provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
