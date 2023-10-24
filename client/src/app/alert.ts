const SUCCES_ALERT_TYPE: string = "alert-success";
const FAILURE_ALERT_TYPE: string = "alert-danger";

export class Alert {
    private type: string;
    private content: string;

    public constructor() {
        this.type = "";
        this.content = "";
    }

    public successAlert(content: string): void {
        this.type = SUCCES_ALERT_TYPE;
        this.content = content;
    }

    public failureAlert(content: string): void {
        this.type = FAILURE_ALERT_TYPE;
        this.content = content;
    }

    public getType(): string {
        return this.type;
    }

    public getContent(): string {
        return this.content;
    }
}
