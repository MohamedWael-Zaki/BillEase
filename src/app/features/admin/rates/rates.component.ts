import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import RatesService from "../../_global/payment/services/rates/rates.service";
import { Rates } from "../../_global/payment/services/rates/rate";

@Component({
    selector: "app-rates",
    templateUrl: "./rates.component.html",
    styleUrls: ["./rates.component.css"],
})
export class RatesComponent {
    isSuccessful = false;
    loading = false;
    ratesForm: FormGroup;
    configs = {
        electricity: {
            title: "Electricity",
            icon: "assets/icons/lamp.svg",
            unit: "kWh",
            name: "electricity",
            unitCost: 4,
            overdueFees: 10,
            backgroundColor: "#FFF7F0",
        },
        water: {
            title: "Water",
            icon: "assets/icons/water.svg",
            unit: "liter",
            name: "water",
            unitCost: 2,
            overdueFees: 30,
            backgroundColor: "#EDF8FF",
        },
    };

    constructor(
        private readonly ratesService: RatesService,
        private readonly router: Router,
        private fb: FormBuilder
    ) {
        this.ratesForm = this.fb.group({
            electricity_unit_cost: [
                "",
                [Validators.required, Validators.pattern("^[0-9]*$")],
            ],
            electricity_overdue_cost: [
                "",
                [Validators.required, Validators.pattern("^[0-9]*$")],
            ],
            water_unit_cost: [
                "",
                [Validators.required, Validators.pattern("^[0-9]*$")],
            ],
            water_overdue_cost: [
                "",
                [Validators.required, Validators.pattern("^[0-9]*$")],
            ],
        });
        this.loading = true;
        this.fetchRates().then(() => (this.loading = false));
    }

    async fetchRates() {
        const data = await this.ratesService.get();
        if (!data) return;
        this.configs.electricity.unitCost = data.electricity.unitCost;
        this.configs.electricity.overdueFees = data.electricity.overdueFees;
        this.configs.water.unitCost = data.water.unitCost;
        this.configs.water.overdueFees = data.water.overdueFees;
    }

    async onSave() {
        const rates: Rates = {
            electricity: {
                unitCost: this.configs.electricity.unitCost,
                overdueFees: this.configs.electricity.overdueFees,
            },
            water: {
                unitCost: this.configs.water.unitCost,
                overdueFees: this.configs.water.overdueFees,
            },
        };

        const res = await this.ratesService.save(rates);
        if (res === true) {
            this.isSuccessful = true;
            setTimeout(
                () => this.router.navigateByUrl("admin/dashboard"),
                1500
            );
        }
    }

    protected readonly Object = Object;
}
