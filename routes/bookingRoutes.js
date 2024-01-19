import express from 'express';
import { bookingidSearch, bookingnameSearch,addDetails, editBookingDeatails, getDetails} from '../controllers/bookings.js';
import { scanImage, scanTesseract } from '../controllers/scanImage.js';
import { createOrder, verifyPayment } from '../controllers/razorpay.js';

const router = express.Router();


router.get("/search/id",bookingidSearch);
router.get("/search/name",bookingnameSearch);
router.post("/adhaarScan",scanTesseract);
router.post('/newDetails',addDetails);
router.get('/getDetails',getDetails);
router.patch('/editBookings',editBookingDeatails);
router.post('/makePayment', createOrder);
router.get('/verifyPayment', verifyPayment);


export default router;
