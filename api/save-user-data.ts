import { Request, Response } from 'express';
import { connectToDatabase, saveUserData, UserData } from '../src/services/mongodb';

export default async function handler(req: Request, res: Response) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Connect to the database
    await connectToDatabase();

    // Get the user data from the request body
    const userData: UserData = req.body;

    // Validate the user data - only name and email are required
    if (!userData.name || !userData.email) {
      return res.status(400).json({ error: 'Missing required fields: name and email are required' });
    }

    // Save the user data to the database
    const savedUser = await saveUserData(userData);

    // Return the saved user data
    return res.status(200).json({ success: true, user: savedUser });
  } catch (error) {
    console.error('Error saving user data:', error);
    return res.status(500).json({ error: 'Failed to save user data' });
  }
} 