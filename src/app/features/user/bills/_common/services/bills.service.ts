import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../../environments/environment";
import { AuthService } from "../../../../_global/auth/_common/services/auth.service";
import Bill from "./bill";
import { formatDate } from "@angular/common";
import { TableColumns } from "@components/table/table";
import formatCurrency from "../../../../../../utils/currency-formatter";
import Customer from "../../../../admin/_common/models/user";
import PaymentService from "../../../../_global/payment/services/payment/payment.service";

@Injectable({
    providedIn: "root",
})
export default class BillsService {
    constructor(
        private readonly http: HttpClient,
        private readonly authService: AuthService,
        private readonly paymentService: PaymentService
    ) {}

    columns: TableColumns = [
        { field: "id", title: "ID" },
        { field: "type", title: "Type" },
        {
            field: (row) =>
                row["consumedUnits"] > 0
                    ? row["consumedUnitsFormatted"]
                    : "-",
            title: "Consumed Units",
        },
        {
            field: (row) =>
                formatCurrency(this.paymentService.calculateFees(row as Bill)),
            title: "Total Fees",
        },
        { field: "dueDateFormatted", title: "Due Date" },
        {
            field: "paymentDateFormatted",
            title: "Payment Status",
        },
    ];

    getAll(filter?: string): Promise<Array<Bill>> {
        return new Promise((resolve) => {
            this.authService.currentUser.subscribe((user) => {
                if (!user) return;
                const userId = user.profile?.id;
                this.http
                    .get(
                        `${
                            environment.baseUrl
                        }/bills/${userId}.json?print=pretty&orderBy="type"${
                            filter ? `&equalTo="${filter}"` : ""
                        }`
                    )
                    .subscribe((res) => {
                        if (!res) resolve([]);
                        const data = Object.entries(res ?? {}).map(
                            ([id, value]) => Bill.fromDTO({ ...value, id })
                        );
                        resolve(data);
                    });
            });
        });
    }

    async getById(id: string): Promise<Bill> {
        return new Promise((resolve) => {
            this.authService.currentUser.subscribe((user) => {
                if (!user) return;
                const userId = user.profile?.id;
                this.http
                    .get(
                        `${environment.baseUrl}/bills/${userId}/${id}.json?print=pretty`
                    )
                    .subscribe((res) => {
                        if (!res) return;
                        const data = Bill.fromDTO({ ...res, id });
                        resolve(data);
                    });
            });
        });
    }

    async pay(id: string, bill: Bill): Promise<boolean> {
        return new Promise((resolve) => {
            this.authService.currentUser.subscribe((user) => {
                if (!user) return;
                const userId = user.profile?.id;
                this.http
                    .patch(
                        `${environment.baseUrl}/bills/${userId}/${id}.json?print=pretty`,
                        {
                            paymentDate: new Date().toISOString(),
                            paid: true,
                            paidAmount: this.paymentService.calculateFees(bill),
                        }
                    )
                    .subscribe((res) => {
                        if (!res) return;
                        resolve(true);
                    });
            });
        });
    }

    private idPrefixes: {
        [key: string]: string;
    } = {
        water: "wr",
        electricity: "el",
        telephone: "tl",
    };

    async add(
        userId: string,
        data: any,
        customer?: Customer
    ): Promise<boolean> {
        const idNumber = Math.floor(100000 + Math.random() * 900000).toString();
        const id = `${this.idPrefixes[data["type"]]}-${idNumber}`;
        const newBill = new Bill(
            id,
            data["type"],
            false,
            data["consumedUnits"],
            this.paymentService.calculateNewBillFees(
                data["type"],
                data["consumedUnits"],
                customer
            ),
            new Date(),
            new Date(data["dueDate"])
        );

        return new Promise((resolve) => {
            this.http
                .put(`${environment.baseUrl}/bills/${userId}/${id}.json`, {
                    ...newBill.toDTO(),
                })
                .subscribe((res) => {
                    if (!res) return;
                    resolve(true);
                });
        });
    }
}
