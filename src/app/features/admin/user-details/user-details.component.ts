import { Component } from "@angular/core";
import Bill from "../../user/bills/_common/services/bill";
import { TableActions, TableColumns, TableData } from "@components/table/table";
import Customer from "../_common/models/user";
import CustomersService from "../_common/services/customers.service";
import BillsService from "../../user/bills/_common/services/bills.service";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { dateValidator } from "../../_global/validators/DateValidator";
import PaymentService from "../../_global/payment/services/payment/payment.service";

@Component({
    selector: "app-user-details",
    templateUrl: "./user-details.component.html",
    styleUrls: ["./user-details.component.css"],
})
export class UserDetailsComponent {
    customer?: Customer;
    receivePaymentForm: FormGroup;
    addBillForm: FormGroup;
    bills: Array<Bill> = [];
    pendingBills: Array<Bill> = [];
    loading = false;
    id: string;
    isCreateDialogOpen = false;
    selectedBill$ = new BehaviorSubject<Bill | undefined>(undefined);
    selectedTotalFees = 0;
    actions: TableActions = [
        {
            disable: (row) => row["paid"],
            type: "button",
            text: "Receive Payment",
            onClick: (row) => {
                this.selectedBill$.next(row as Bill);
            },
        },
    ];

    customerFormGroup: FormGroup = new FormGroup({});

    constructor(
        private readonly customersService: CustomersService,
        private readonly billsService: BillsService,
        private readonly paymentService: PaymentService,
        private readonly route: ActivatedRoute,
        private fb: FormBuilder
    ) {
        this.addBillForm = this.fb.group({
            billType: ["", [Validators.required]],
            unitsConsumed: [
                "",
                [Validators.required, Validators.pattern("^[0-9]*$")],
            ],
            dueDate: ["", [Validators.required, dateValidator]],
        });
        this.receivePaymentForm = this.fb.group({
            totalFees: [
                "",
                [Validators.required, Validators.pattern("^[0-9]*$")],
            ],
        });

        this.id = (this.route.params as BehaviorSubject<any>).getValue().userId;
        this.loading = true;
        this.fetchData().then(() => (this.loading = false));

        this.selectedBill$.subscribe((bill) => {
            if (!bill) return;
            this.selectedTotalFees = this.paymentService.calculateFees(bill);
        });
    }

    get billsColumns(): TableColumns {
        return this.billsService.columns;
    }

    async fetchData() {
        this.customer = await this.customersService.getById(this.id);
        this.bills = this.customer?.bills ?? [];
        console.log({ c: this.customer });
        this.pendingBills = this.bills.filter((bill) => !bill.paid);
    }

    async addBill() {
        const newBill = {
            type: this.addBillForm.get("billType")?.value,
            consumedUnits: this.addBillForm.get("unitsConsumed")?.value,
            dueDate: this.addBillForm.get("dueDate")?.value,
        };
        const isCreated = await this.billsService.add(
            this.id,
            newBill,
            this.customer
        );
        if (!isCreated) return;

        await this.fetchData();
        this.onCreateDialogClose();
        this.addBillForm.reset();
    }

    async payBill() {
        const isPaid = await this.paymentService.pay(
            this.selectedBill$.getValue() as Bill,
            this.id,
            this.selectedTotalFees
        );
        if (!isPaid) return;
        // TODO Success Indicator
        await this.fetchData();
        this.selectedBill$.next(undefined);
    }

    onCreateDialogOpen() {
        this.isCreateDialogOpen = true;
    }

    onCreateDialogClose() {
        this.isCreateDialogOpen = false;
    }

    onPaymentDialogClose() {
        this.selectedBill$.next(undefined);
    }

    get disableConsumedUnits(): boolean {
        const disable =
            this.addBillForm.get("billType")?.value === "telephone" &&
            this.customer?.telephoneOffer?.["offerType"] === "prepaid";

        if (disable) {
            this.addBillForm.get("unitsConsumed")?.setValue(0);
        }
        return disable;
    }
}
