import { Router } from 'express'
import { bookingControllers } from './booking.controller';
import auth from '../../middleware/auth';


const router = Router();


router.post('/', bookingControllers.createBooking)
router.get('/', auth("admin"), bookingControllers.getBookings);
router.put('/:bookingId', auth(), bookingControllers.updateBooking)




export const bookingRoutes = router;