import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "../../../_global/services/database.service";
import { TableColumns, TableData } from "@components/table/table";
import BillsService from "../_common/services/bills.service";
import Bill from "../_common/services/bill";
import PaymentService from "../../../_global/payment/services/payment/payment.service";
import {Rates} from "../../../_global/payment/services/rates/rate";

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent {
    data: Array<Bill> = [];
    loading = false;
    rates: Rates;

    constructor(
        private billsService: BillsService,
        public paymentService: PaymentService
    ) {
        this.loading = true;
        this.rates = this.paymentService.rates as Rates;
        this.fetchData().then(() => (this.loading = false));
    }

    get billsColumns(): TableColumns {
        return this.billsService.columns;
    }

    async fetchData() {
        this.data = await this.billsService.getAll();
    }
}
