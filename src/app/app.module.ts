import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { SignInComponent } from "./sign-in/sign-in.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NavbarComponent } from "./components/layout/navbar/navbar.component";
import { LayoutWrapperComponent } from "./components/layout/layout-wrapper/layout-wrapper.component";
import { NavItemComponent } from "./components/layout/navbar/nav-item/nav-item.component";
import { AngularSvgIconModule } from "angular-svg-icon";
import { NgOptimizedImage } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { environment } from "../environments/environment";
import { provideAuth, getAuth } from "@angular/fire/auth";
import { provideDatabase, getDatabase } from "@angular/fire/database";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFireModule } from "@angular/fire/compat";
import { AuthService } from "./auth.service";

@NgModule({
    declarations: [
        AppComponent,
        SignInComponent,
        SignUpComponent,
        DashboardComponent,
        NavbarComponent,
        LayoutWrapperComponent,
        NavItemComponent,
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot([
            { path: "", component: DashboardComponent },
            { path: "signin", component: SignInComponent },
            { path: "signup", component: SignUpComponent },
        ]),
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatInputModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        // provideFirebaseApp(() => initializeApp(environment.firebase)),
        // provideAuth(() => getAuth()),
        provideDatabase(() => getDatabase()),
        AngularSvgIconModule.forRoot(),
        NgOptimizedImage,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
