from fastapi import APIRouter, HTTPException
from database import appointment_collection, users_collection
from datetime import datetime
from apimodels import AppointmentRequest
from bson import ObjectId

router = APIRouter()

@router.post("/appointments")
async def create_appointment(appointment: AppointmentRequest):
    try:
        # Check if therapist exists
        therapist = users_collection.find_one({
            "_id": ObjectId(appointment.therapist_id),
            "role": "therapist"
        })
        if not therapist:
            raise HTTPException(status_code=404, detail="Therapist not found")

        # Check if patient exists
        patient = users_collection.find_one({
            "_id": ObjectId(appointment.patient_id)
        })
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")

        # Create appointment
        appointment_data = {
            "therapist_id": appointment.therapist_id,
            "patient_id": appointment.patient_id,
            "date": appointment.date,
            "time": appointment.time,
            "status": appointment.status,
            "created_at": datetime.utcnow()
        }
        
        result = appointment_collection.insert_one(appointment_data)
        appointment_data["_id"] = str(result.inserted_id)
        
        return appointment_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/appointments/therapist/{therapist_id}")
async def get_therapist_appointments(therapist_id: str):
    try:
        appointments = appointment_collection.find({"therapist_id": therapist_id})
        return [{
            "id": str(appointment["_id"]),
            "patient_id": appointment["patient_id"],
            "date": appointment["date"],
            "time": appointment["time"],
            "status": appointment["status"],
            "created_at": appointment["created_at"]
        } for appointment in appointments]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/appointments/{appointment_id}/status")
async def update_appointment_status(appointment_id: str, status: str):
    try:
        if status not in ["accepted", "rejected", "completed"]:
            raise HTTPException(status_code=400, detail="Invalid status")
        
        # Convert appointment_id to ObjectId
        try:
            appointment_id = ObjectId(appointment_id)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid appointment ID format: {e}")

        # Update the appointment status in the database
        try:
            result = appointment_collection.update_one(
                {"_id": appointment_id},
                {"$set": {"status": status}}
            )
            
            if result.modified_count == 0:
                raise HTTPException(status_code=404, detail="Appointment not found")
            
            # Fetch updated appointment data
            updated_appointment = appointment_collection.find_one({"_id": appointment_id})
            
            # Return the updated appointment details
            return {
                "id": str(updated_appointment["_id"]),
                "therapist_id": updated_appointment["therapist_id"],
                "patient_id": updated_appointment["patient_id"],
                "date": updated_appointment["date"],
                "time": updated_appointment["time"],
                "status": updated_appointment["status"],
                "created_at": updated_appointment["created_at"]
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error updating appointment: {e}")
    
    except HTTPException as e:
        # Handle HTTPException separately
        raise e
    except Exception as e:
        # Catch any other exceptions
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

@router.get("/appointments/patient/{patient_id}")
async def get_patient_appointments(patient_id: str):
    try:
        appointments = appointment_collection.find({"patient_id": patient_id})
        return [{
            "id": str(appointment["_id"]),
            "therapist_id": appointment["therapist_id"],
            "date": appointment["date"],
            "time": appointment["time"],
            "status": appointment["status"],
            "created_at": appointment["created_at"]
        } for appointment in appointments]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 