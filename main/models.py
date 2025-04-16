from django.db import models
from django.core.exceptions import ValidationError
from phonenumber_field.modelfields import PhoneNumberField
import logging

logger = logging.getLogger(__name__)

class Mechanic(models.Model):
    name = models.CharField(max_length=50)
    max_daily_appointments = models.PositiveBigIntegerField(default=4)

    def __str__(self):
        return self.name

class Appointment(models.Model):
    mechanic = models.ForeignKey(Mechanic, on_delete=models.CASCADE)
    customer_name = models.CharField(max_length=50)
    phone_number = PhoneNumberField(null=False, region="BD")
    appointment_date = models.DateTimeField()
    registration = models.PositiveBigIntegerField(max_length=100)

    def clean(self):
        # Filter appointments for the same mechanic and date
        daily_count = Appointment.objects.filter(
            mechanic=self.mechanic,
            appointment_date__date=self.appointment_date.date()
        ).exclude(pk=self.pk).count()

        if daily_count >= self.mechanic.max_daily_appointments:
            raise ValidationError("Mechanic already at max capacity for the day.")

        # Prevent same customer from booking twice on the same day
        already_booked = Appointment.objects.filter(
            phone_number=self.phone_number,
            appointment_date__date=self.appointment_date.date()
        ).exclude(pk=self.pk).exists()

        if already_booked:
            raise ValidationError("You already have an appointment on this date.")

    def save(self, *args, **kwargs):
        self.full_clean()  # Run clean method
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.customer_name} - {self.registration} on {self.appointment_date.strftime('%Y-%m-%d %H:%M')}"
