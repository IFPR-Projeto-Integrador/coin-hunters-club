type DateStringDDMMYYYY = `${number}/${number}/${number}`;

export function dateToString(date: Date): DateStringDDMMYYYY {
    // Add a zero at the beginning if the number is less than 10
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");

    return `${day}/${month}/${date.getFullYear()}` as DateStringDDMMYYYY;
}

export function stringToDate(date: DateStringDDMMYYYY): Date {
    const [day, month, year] = date.split("/");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

export function isDateStringDDMMYYYY(input: string): input is DateStringDDMMYYYY {
    const regex = /^\d+\/\d+\/\d+$/;
    return regex.test(input);
}

export function isOneHourInThePast(date1: Date, date2: Date): boolean {
    return date2.getTime() - date1.getTime() > 3600000;
}

export function isOneMinuteInThePast(date1: Date, date2: Date): boolean {
    return date2.getTime() - date1.getTime() > 60000;
}