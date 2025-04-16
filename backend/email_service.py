import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

async def send_appointment_notification(
    patient_email: str,
    therapist_email: str,
    appointment_date: str,
    appointment_time: str,
    status: str = "pending"
):
    try:
        # Create message container
        msg = MIMEMultipart('alternative')
        msg['Subject'] = 'Appointment Notification'
        msg['From'] = SMTP_USERNAME
        msg['To'] = f"{patient_email}, {therapist_email}"

        # Create the body of the message
        if status == "pending":
            text = f"""
            New Appointment Request
            
            Date: {appointment_date}
            Time: {appointment_time}
            
            The appointment is pending approval from the therapist.
            """
        elif status == "approved":
            text = f"""
            Appointment Approved
            
            Your appointment has been approved:
            Date: {appointment_date}
            Time: {appointment_time}
            
            Please make sure to join on time.
            """
        else:  # cancelled
            text = f"""
            Appointment Cancelled
            
            The following appointment has been cancelled:
            Date: {appointment_date}
            Time: {appointment_time}
            
            Please contact the therapist for rescheduling.
            """

        # Create HTML version
        html = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                    <h2 style="color: #4a90e2;">{'Appointment Notification' if status == 'pending' else 'Appointment ' + status.capitalize()}</h2>
                    <p><strong>Date:</strong> {appointment_date}</p>
                    <p><strong>Time:</strong> {appointment_time}</p>
                    <p style="margin-top: 20px;">
                        {text.split('\n\n')[2].strip()}
                    </p>
                    <p style="margin-top: 20px; font-size: 0.9em; color: #666;">
                        This is an automated message. Please do not reply to this email.
                    </p>
                </div>
            </body>
        </html>
        """

        # Attach parts into message container
        msg.attach(MIMEText(text, 'plain'))
        msg.attach(MIMEText(html, 'html'))

        # Send the message via SMTP server
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)

    except Exception as e:
        print(f"Error sending email notification: {str(e)}")
        raise 