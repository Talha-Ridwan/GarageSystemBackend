import datetime
from rest_framework import serializers
from .models import Mechanic, Appointment

class MechanicSerializer(serializers.ModelSerializer):
    appointments_count = serializers.SerializerMethodField()

    class Meta:
        model = Mechanic
        fields = ['id', 'name', 'max_daily_appointments', 'appointments_count']
    
    def get_appointments_count(self, obj):
        # Count the number of appointments for this mechanic today
        today_appointments = Appointment.objects.filter(
            mechanic=obj,
            appointment_date__date=datetime.date.today()
        ).count()
        return today_appointments


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['id', 'mechanic', 'customer_name', 'phone_number', 'appointment_date', 'registration']