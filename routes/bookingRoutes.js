import express from 'express';
import { bookingidSearch, bookingnameSearch,addDetails, editBookingDeatails, getDetails} from '../controllers/bookings.js';
import { scanImage } from '../controllers/scanImage.js';

const router = express.Router();


router.get("/search/id",bookingidSearch);
router.get("/search/name",bookingnameSearch);
router.post("/adhaarScan",scanImage);
router.post('/newDetails',addDetails);
router.get('/getDetails',getDetails);
router.patch('/editBookings',editBookingDeatails);


export default router;
