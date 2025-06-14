import Shurjopay, { PaymentResponse, VerificationResponse } from "shurjopay";
import config from "../../config";

const shurjopay = new Shurjopay();

shurjopay.config(config.sp.sp_endpoint!, config.sp.sp_username!, config.sp.sp_password!, config.sp.sp_prefix!, config.sp.sp_return_url!);

const makePaymentAsync = async (paymentPayload: any): Promise<PaymentResponse> => {
    return new Promise((resolve, reject) => {
        shurjopay.makePayment(
            paymentPayload,
            (response) => resolve(response),
            (error) => reject(error)
        );
    });
};

const verifyPaymentAsync = (paymentId: string): Promise<VerificationResponse[]> => {
    return new Promise((resolve, reject) => {
        shurjopay.verifyPayment(
            paymentId,
            (response) => resolve(response),
            (error) => reject(error)
        );
    });
};

export const paymentUtils = {
    makePaymentAsync,
    verifyPaymentAsync,
};
