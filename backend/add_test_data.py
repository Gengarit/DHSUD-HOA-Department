#!/usr/bin/env python
import os
import django
from datetime import date

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hoa_project.settings')
django.setup()

from hoa_registry.models import HOAProfile

# Clear existing data (optional)
# HOAProfile.objects.all().delete()

# Add test HOAs
hoas = [
    {
        'hoa_name': 'Riverside Subdivision HOA',
        'cert_of_inc_no': '2024-00001',
        'reg_type': 'Residential HOA',
        'issuance_date': date(2024, 1, 15),
        'classification': 'Mid-rise',
        'barangay': 'Barangay Riverside',
        'city_municipality': 'Quezon City',
        'province': 'Metro Manila',
        'contact_person': 'Maria Santos',
        'contact_details': '09177551234',
        'total_members': 150,
        'date_of_election': date(2024, 3, 1),
        'term_of_office': '2024-2027',
        'evaluator_name': 'John Reyes',
        'status': 'active'
    },
    {
        'hoa_name': 'Hillside Residences HOA',
        'cert_of_inc_no': '2024-00002',
        'reg_type': 'Residential HOA',
        'issuance_date': date(2024, 2, 20),
        'classification': 'Hi-rise',
        'barangay': 'Barangay Mahirap',
        'city_municipality': 'Manila',
        'province': 'Metro Manila',
        'contact_person': 'Juan Dela Cruz',
        'contact_details': '09123456789',
        'total_members': 250,
        'date_of_election': date(2024, 4, 10),
        'term_of_office': '2024-2027',
        'evaluator_name': 'Jane Doe',
        'status': 'active'
    },
    {
        'hoa_name': 'Sunrise Village HOA',
        'cert_of_inc_no': '2024-00003',
        'reg_type': 'Residential HOA',
        'issuance_date': date(2024, 3, 5),
        'classification': 'Low-rise',
        'barangay': 'Barangay Mahabang Parang',
        'city_municipality': 'Pasig',
        'province': 'Metro Manila',
        'contact_person': 'Anna Rodriguez',
        'contact_details': '09223334444',
        'total_members': 100,
        'date_of_election': date(2024, 5, 15),
        'term_of_office': '2024-2027',
        'evaluator_name': 'Mark Johnson',
        'status': 'pending',
        'violation_section_101': True
    }
]

for hoa_data in hoas:
    hoa, created = HOAProfile.objects.get_or_create(
        cert_of_inc_no=hoa_data['cert_of_inc_no'],
        defaults=hoa_data
    )
    if created:
        print(f"✅ Created: {hoa.hoa_name}")
    else:
        print(f"⏭️  Already exists: {hoa.hoa_name}")

print("\n✅ Test data addition complete!")
