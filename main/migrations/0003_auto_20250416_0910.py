from django.db import migrations

def create_default_mechanics(apps, schema_editor):
    Mechanic = apps.get_model('main', 'Mechanic')
    mechanic_names = [
        "Mohammad Hasan", 
        "Sajedul Islam", 
        "Rahim Uddin", 
        "Mizanur Rahman", 
        "Zahid Hasan"
    ]

    for name in mechanic_names:
        Mechanic.objects.get_or_create(name=name, defaults={"max_daily_appointments": 4})

class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_appointment_delete_appointments'),  # Reference the previous migration
    ]

    operations = [
        migrations.RunPython(create_default_mechanics),
    ]
