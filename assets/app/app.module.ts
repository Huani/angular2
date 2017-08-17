import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import{HttpModule} from "@angular/http"; //unlock the http service


import { AppComponent } from "./app.component";
import { AuthenticationComponent } from "./auth/authentication.component";
import { HeaderComponent } from "./header.component";
import { routing } from "./app.routing";
import {AuthService} from "./auth/auth.service";
import {ErrorComponent} from "./errors/error.components";
import {ErrorService} from "./errors/error.service";
import {MessageModule} from "./messages/message.module";


@NgModule({
    declarations: [
        AppComponent,
        //MessageComponent,
        //MessageListComponent,
        //MessageInputComponent,
        //MessagesComponent,
        AuthenticationComponent, //auth heb je constant nodig(log in en log out niet ) daarom blijft dit in app.module
        HeaderComponent,
        ErrorComponent
    ],
    imports: [BrowserModule,
        //FormsModule,
        routing,
        //ReactiveFormsModule,
        HttpModule,
        MessageModule
    ],
    providers:[AuthService,ErrorService],
    bootstrap: [AppComponent]
})
export class AppModule {

}