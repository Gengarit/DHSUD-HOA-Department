# Generated migration to update NOV table from old schema to new schema

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hoa_registry', '0001_initial'),
    ]

    operations = [
        # Add new fields to NOV
        migrations.AddField(
            model_name='nov',
            name='violation_section_101',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='nov',
            name='violation_section_62',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='nov',
            name='evaluator_name',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
