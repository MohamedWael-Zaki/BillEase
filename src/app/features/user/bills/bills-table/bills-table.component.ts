import { Component, Input } from "@angular/core";
import { TableActions, TableColumns, TableData } from "@components/table/table";

@Component({
    selector: "app-bills-table",
    template: `
        <app-table
            [data]="data"
            [columns]="columns"
            [loading]="loading"
            [actions]="actions"
        ></app-table>
    `,
})
export class BillsTableComponent {
    @Input() data: TableData = [];
    @Input() columns: TableColumns = [];
    @Input() loading = false;
    actions: TableActions = [
        {
            type: "link",
            text: "Pay",
            link: (row) => `/bill/${row["id"]}`,
        },
    ];
}
