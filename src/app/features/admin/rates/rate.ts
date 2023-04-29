export interface Rate {
    unitCost: number;
    overdueFees: number;
}

export type Rates = {
    water: Rate;
    electricity: Rate;
    telephone: Rate;
};
