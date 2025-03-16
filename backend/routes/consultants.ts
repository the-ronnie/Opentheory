import { Router, Request, Response } from "express";
import { 
  createConsultant, 
  getConsultantById, 
  getConsultantByEmail, 
  getAllConsultants, 
  updateConsultant,
  getActivitiesForConsultant
} from '../lib/db/queries';
import { ActivityType } from '../lib/db/schema';
import { logConsultantActivity } from '../lib/utils';
import { isAuthenticated } from '../lib/auth/middleware';

const router = Router();

// Public endpoints
// Get all consultants (with pagination) - public read
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 50;
    const offset = Number(req.query.offset) || 0;
    
    const consultants = await getAllConsultants(limit, offset);
    return res.status(200).json(consultants);
  } catch (error) {
    console.error('Get consultants error:', error);
    return res.status(500).json({ error: 'Failed to fetch consultants' });
  }
});

// Get consultant by ID - public read
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const consultant = await getConsultantById(req.params.id);
    
    if (!consultant) {
      return res.status(404).json({ error: 'Consultant not found' });
    }
    
    return res.status(200).json(consultant);
  } catch (error) {
    console.error('Get consultant error:', error);
    return res.status(500).json({ error: 'Failed to fetch consultant' });
  }
});

// Protected endpoints - require authentication
router.use(isAuthenticated);

// Create new consultant
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, avatar, bio, company, position, location } = req.body;
    
    // Check if email already exists
    const existingConsultant = await getConsultantByEmail(email);
    if (existingConsultant) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    
    // Create new consultant
    const consultant = await createConsultant({
      name,
      email,
      phone,
      avatar,
      bio,
      company,
      position,
      location
    });
    
    // Log activity
    await logConsultantActivity(
      req,
      consultant.id,
      ActivityType.CONSULTANT_CREATED,
      'Consultant profile created'
    );
    
    return res.status(201).json(consultant);
  } catch (error) {
    console.error('Create consultant error:', error);
    return res.status(500).json({ error: 'Failed to create consultant' });
  }
});

// Update consultant
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, phone, avatar, bio, company, position, location } = req.body;
    const consultantId = req.params.id;
    
    // Check if consultant exists
    const existingConsultant = await getConsultantById(consultantId);
    if (!existingConsultant) {
      return res.status(404).json({ error: 'Consultant not found' });
    }
    
    // Update consultant
    const updatedConsultant = await updateConsultant(consultantId, {
      name,
      phone,
      avatar,
      bio,
      company,
      position,
      location
    });
    
    // Log activity
    await logConsultantActivity(
      req,
      consultantId,
      ActivityType.CONSULTANT_UPDATED,
      'Consultant profile updated'
    );
    
    return res.status(200).json(updatedConsultant);
  } catch (error) {
    console.error('Update consultant error:', error);
    return res.status(500).json({ error: 'Failed to update consultant' });
  }
});

// Get consultant activities
router.get('/:id/activities', async (req: Request, res: Response) => {
  try {
    const consultantId = req.params.id;
    const limit = Number(req.query.limit) || 50;
    const offset = Number(req.query.offset) || 0;
    
    // Check if consultant exists
    const existingConsultant = await getConsultantById(consultantId);
    if (!existingConsultant) {
      return res.status(404).json({ error: 'Consultant not found' });
    }
    
    const activities = await getActivitiesForConsultant(consultantId, limit, offset);
    return res.status(200).json(activities);
  } catch (error) {
    console.error('Get consultant activities error:', error);
    return res.status(500).json({ error: 'Failed to fetch consultant activities' });
  }
});

export default router;
