# Generated by Django 5.1.6 on 2025-02-23 19:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('communities', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='community',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='community/'),
        ),
    ]
