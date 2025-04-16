from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from database import appointment_collection, users_collection
from bson import ObjectId
from email_service import send_appointment_notification
from apimodels import Appointment

router = APIRouter()

@router.post("/appointments")
async def create_appointment(appointment: Appointment):
    try:
        # Convert string IDs to ObjectId
        appointment_dict = appointment.model_dump()
        appointment_dict["patient_id"] = ObjectId(appointment.patient_id)
        appointment_dict["therapist_id"] = ObjectId(appointment.therapist_id)
        appointment_dict["status"] = "pending"
        appointment_dict["created_at"] = datetime.utcnow()

        # Insert appointment into database
        result = appointment_collection.insert_one(appointment_dict)
        
        # Get patient and therapist details
        patient = users_collection.find_one({"_id": appointment_dict["patient_id"]})
        therapist = users_collection.find_one({"_id": appointment_dict["therapist_id"]})

        if not patient or not therapist:
            raise HTTPException(status_code=404, detail="User or therapist not found")

        # Send notifications
        await send_appointment_notification(
            patient_email=patient["email"],
            therapist_email=therapist["email"],
            appointment_date=appointment.date,
            appointment_time=appointment.time
        )

        return {"message": "Appointment created successfully", "appointment_id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/appointments/therapist/{therapist_id}")
async def get_therapist_appointments(therapist_id: str):
    try:
        therapist_oid = ObjectId(therapist_id)
        appointments = list(appointment_collection.find({"therapist_id": therapist_oid}))
        
        # Convert ObjectId to string and format dates
        for appointment in appointments:
            appointment["_id"] = str(appointment["_id"])
            appointment["patient_id"] = str(appointment["patient_id"])
            appointment["therapist_id"] = str(appointment["therapist_id"])
            appointment["created_at"] = appointment["created_at"].isoformat()
            
            # Get patient details
            patient = users_collection.find_one({"_id": appointment["patient_id"]})
            if patient:
                appointment["patient_name"] = f"{patient.get('firstName', '')} {patient.get('lastName', '')}"
                appointment["patient_email"] = patient.get("email", "")

        return {"appointments": appointments}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/appointments/{appointment_id}/status")
async def update_appointment_status(appointment_id: str, status: str):
    try:
        if status not in ["approved", "cancelled"]:
            raise HTTPException(status_code=400, detail="Invalid status")

        result = appointment_collection.update_one(
            {"_id": ObjectId(appointment_id)},
            {"$set": {"status": status}}
        )

        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Appointment not found")

        # Get appointment details for notification
        appointment = appointment_collection.find_one({"_id": ObjectId(appointment_id)})
        patient = users_collection.find_one({"_id": appointment["patient_id"]})
        therapist = users_collection.find_one({"_id": appointment["therapist_id"]})

        # Send status update notification
        await send_appointment_notification(
            patient_email=patient["email"],
            therapist_email=therapist["email"],
            appointment_date=appointment["date"],
            appointment_time=appointment["time"],
            status=status
        )

        return {"message": f"Appointment {status} successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/appointments/patient/{patient_id}")
async def get_patient_appointments(patient_id: str):
    try:
        patient_oid = ObjectId(patient_id)
        appointments = list(appointment_collection.find({"patient_id": patient_oid}))
        
        # Convert ObjectId to string and format dates
        for appointment in appointments:
            appointment["_id"] = str(appointment["_id"])
            appointment["patient_id"] = str(appointment["patient_id"])
            appointment["therapist_id"] = str(appointment["therapist_id"])
            appointment["created_at"] = appointment["created_at"].isoformat()
            
            # Get therapist details
            therapist = users_collection.find_one({"_id": appointment["therapist_id"]})
            if therapist:
                appointment["therapist_name"] = f"{therapist.get('firstName', '')} {therapist.get('lastName', '')}"

        return {"appointments": appointments}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 