import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Rates } from "./rate";
import {environment} from "../../../../../../environments/environment";

@Injectable({
    providedIn: "root",
})
export default class RatesService {
    constructor(
        private readonly http: HttpClient,
    ) {}

    get(): Promise<Rates> {
        return new Promise((resolve, reject) => {
            this.http
                .get(`${environment.baseUrl}/env/rates.json`)
                .subscribe((res) => {
                    if (!res) return;
                    const data: Rates = res as Rates;
                    resolve(data);
                });
        });
    }

    save(rates: Rates): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.http
                .put(`${environment.baseUrl}/env/rates.json`, rates)
                .subscribe((res) => {
                    if (!res) return;
                    resolve(true);
                });
        });
    }
}
