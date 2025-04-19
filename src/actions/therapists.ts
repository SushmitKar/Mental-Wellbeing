export async function getTherapists() {
  try {
    const response = await fetch('http://localhost:8000/therapists');
    
    if (!response.ok) {
      throw new Error('Failed to fetch therapists');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching therapists:', error);
    throw error;
  }
}

export async function updateTherapistProfile(therapistId: string, profile: {
  name: string;
  specialization: string;
  bio: string;
  photoUrl: string;
  availableSlots: { date: string; time: string }[];
}) {
  try {
    const response = await fetch(`http://localhost:8000/therapists/${therapistId}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });

    if (!response.ok) {
      throw new Error('Failed to update therapist profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating therapist profile:', error);
    throw error;
  }
}

export async function getTherapistSlots(therapistId: string) {
  try {
    const response = await fetch(`http://localhost:8000/therapists/${therapistId}/slots`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch therapist slots');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching therapist slots:', error);
    throw error;
  }
}