from datetime import timezone
from django.core.exceptions import ValidationError 
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Mechanic, Appointment
from .serializers import MechanicSerializer, AppointmentSerializer

# Get all mechanics
@api_view(['GET'])
def mechanic_list(request):
    if request.method == 'GET':
        mechanics = Mechanic.objects.all()
        serializer = MechanicSerializer(mechanics, many=True)
        return Response(serializer.data)

# Create a new mechanic
@api_view(['POST'])
def mechanic_create(request):
    if request.method == 'POST':
        serializer = MechanicSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Get all appointments
@api_view(['GET'])
def appointment_list(request):
    if request.method == 'GET':
        appointments = Appointment.objects.all()
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)

# Create a new appointment
@api_view(['POST'])
def appointment_create(request):
    if request.method == 'POST':
        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            
            try:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except ValidationError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def mechanic_update(request, pk):
    try:
        mechanic = Mechanic.objects.get(pk=pk)
    except Mechanic.DoesNotExist:
        return Response({'error': 'Mechanic not found.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = MechanicSerializer(mechanic, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


import logging

logger = logging.getLogger(__name__)

@api_view(['PUT'])
def appointment_update(request, pk):
    try:
        appointment = Appointment.objects.get(pk=pk)
    except Appointment.DoesNotExist:
        return Response({'error': 'Appointment not found.'}, status=status.HTTP_404_NOT_FOUND)

    
    logger.info(f"Received data for update: {request.data}")

    mechanic_id = request.data.get('mechanic')
    if mechanic_id and not Mechanic.objects.filter(id=mechanic_id).exists():
        return Response({'error': 'Invalid mechanic.'}, status=status.HTTP_400_BAD_REQUEST)

    serializer = AppointmentSerializer(appointment, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from django.shortcuts import render

def index(request):
    return render(request, 'index.html')
