//Hock que se va a utilizar unicamente para notificar el faltante :
import { useState } from "react";
import { reportOrderMissing } from "../services/GetMissingOrdersService";
//import type { DepotOrderMissingDto } from "../types/Missing";
import type { ReportOrderMissingRequest } from "../types/Missing";

export function useReportOrderMissing() {
    const [looading,setLoading] = useState(false);
    const [erroor,setError] = useState<null | Error>(null);
    const [success,setSuccess] = useState(false);

    const reportMissing = async (data: ReportOrderMissingRequest) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await reportOrderMissing(data);
            setSuccess(true);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }; 

    return {reportMissing , looading, erroor, success};
};

